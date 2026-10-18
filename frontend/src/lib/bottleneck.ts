/**
 * Bottleneck ranking engine (client-side)
 * ========================================
 * Computes a composite risk score per conduit from five independent factors.
 * Each factor is normalised to [0, 1] before weighting so sliders are fair.
 *
 * Score = w_flow      * norm(flow_ratio)
 *       + w_blockage  * norm(blockage_factor)
 *       + w_downstream* norm(downstream_count)
 *       + w_channel   * channel_type_weight
 *       + w_slope     * norm(1 / slope_pct)   <- low slope = poor drainage
 *
 * Weights are user-controlled and do NOT need to sum to 1.
 * Final score is divided by sum(weights) to keep output in [0, 1].
 *
 * Intervention scenarios
 * -----------------------
 *  "desilting"  : blockage_factor reduced by 60% on trunk/primary conduits
 *  "widening"   : effective_capacity increased by 30% on all conduits
 *  "new_bypass" : worst-scoring conduit gets a 25% capacity boost (simulates
 *                 a parallel relief channel alongside the existing pipe)
 */

import { runSimulation } from './simulation';
import type { ConduitInput, SimulationOutput, SimulationParams } from './simulation';

// ---------------------------------------------------------------------------
// Factor weights interface
// ---------------------------------------------------------------------------
export interface FactorWeights {
  flow:       number;   // 0..10
  blockage:   number;
  downstream: number;
  channel:    number;
  slope:      number;
}

export const DEFAULT_WEIGHTS: FactorWeights = {
  flow:       8,
  blockage:   6,
  downstream: 5,
  channel:    4,
  slope:      3,
};

// ---------------------------------------------------------------------------
// Bottleneck record
// ---------------------------------------------------------------------------
export interface BottleneckRecord {
  conduitId:       string;
  fromNode:        string;
  toNode:          string;
  channelType:     string;
  score:           number;        // composite [0,1]
  rank:            number;        // 1 = worst
  flowScore:       number;        // individual normalised factor
  blockageScore:   number;
  downstreamScore: number;
  channelScore:    number;
  slopeScore:      number;
  // Raw values
  flowRatio:       number;
  blockageFactor:  number;
  downstreamCount: number;
  slopePct:        number;
  effectiveCapacityM3s: number;
  inflowM3s:       number;
  severity:        string;
}

// ---------------------------------------------------------------------------
// Intervention scenario definition
// ---------------------------------------------------------------------------
export type InterventionId = 'baseline' | 'desilting' | 'widening' | 'new_bypass';

export interface InterventionScenario {
  id:          InterventionId;
  label:       string;
  description: string;
  color:       string;
}

export const INTERVENTION_SCENARIOS: InterventionScenario[] = [
  {
    id:          'baseline',
    label:       'Baseline',
    description: 'No interventions applied. Current blockage and capacity.',
    color:       '#64748b',
  },
  {
    id:          'desilting',
    label:       'Desilting (trunk + primary)',
    description: 'Reduces blockage factor by 60% on trunk and primary conduits, restoring effective capacity toward nominal.',
    color:       '#0d9488',
  },
  {
    id:          'widening',
    label:       'Widening (all conduits +30%)',
    description: 'Increases effective capacity by 30% on every conduit, simulating channel widening or deepening works.',
    color:       '#2563eb',
  },
  {
    id:          'new_bypass',
    label:       'Relief Bypass (critical conduit)',
    description: 'Adds a 25% parallel capacity boost to the single worst-ranked conduit, simulating a relief channel.',
    color:       '#7c3aed',
  },
];

// ---------------------------------------------------------------------------
// Helper: build downstream count map from conduit list
// ---------------------------------------------------------------------------
function buildDownstreamCounts(conduits: ConduitInput[]): Map<string, number> {
  // Simple BFS: count reachable edges downstream of each conduit's toNode
  const adj = new Map<string, string[]>();
  for (const c of conduits) {
    if (!adj.has(c.fromNode)) adj.set(c.fromNode, []);
    adj.get(c.fromNode)!.push(c.toNode);
  }

  const counts = new Map<string, number>();
  for (const c of conduits) {
    // BFS from toNode
    let count = 0;
    const visited = new Set<string>();
    const queue = [c.toNode];
    while (queue.length > 0) {
      const node = queue.shift()!;
      if (visited.has(node)) continue;
      visited.add(node);
      const neighbours = adj.get(node) ?? [];
      count += neighbours.length;
      queue.push(...neighbours);
    }
    counts.set(c.id, count);
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Channel type weights (higher = more critical)
// ---------------------------------------------------------------------------
const CHANNEL_WEIGHTS: Record<string, number> = {
  trunk:     1.0,
  primary:   0.75,
  secondary: 0.5,
  tertiary:  0.25,
};

// ---------------------------------------------------------------------------
// normalise an array of values to [0, 1]
// ---------------------------------------------------------------------------
function normalise(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  if (range === 0) return values.map(() => 0.5);
  return values.map(v => (v - min) / range);
}

// ---------------------------------------------------------------------------
// Core ranking function
// ---------------------------------------------------------------------------
export function rankBottlenecks(
  conduits: ConduitInput[],
  simResult: SimulationOutput,
  weights: FactorWeights,
): BottleneckRecord[] {
  if (conduits.length === 0) return [];

  const downstreamCounts = buildDownstreamCounts(conduits);
  const resultMap = new Map(simResult.conduitResults.map(r => [r.conduitId, r]));

  // Gather raw values per conduit
  const rawFlow       = conduits.map(c => resultMap.get(c.id)?.flowRatio ?? 0);
  const rawBlockage   = conduits.map(c => c.blockageFactor);
  const rawDownstream = conduits.map(c => downstreamCounts.get(c.id) ?? 0);
  const rawChannelW   = conduits.map(c => CHANNEL_WEIGHTS[c.channelType] ?? 0.3);
  // Low slope = poor gravity drainage = higher risk
  const rawSlopeRisk  = conduits.map(c => {
    const sp = (c as unknown as { slopePct?: number }).slopePct ?? 0.5;
    return sp > 0 ? 1 / sp : 2;
  });

  const normFlow       = normalise(rawFlow);
  const normBlockage   = normalise(rawBlockage);
  const normDownstream = normalise(rawDownstream);
  const normChannel    = normalise(rawChannelW);
  const normSlope      = normalise(rawSlopeRisk);

  const totalWeight = weights.flow + weights.blockage + weights.downstream + weights.channel + weights.slope;
  const tw = totalWeight === 0 ? 1 : totalWeight;

  const records: BottleneckRecord[] = conduits.map((c, i) => {
    const cr = resultMap.get(c.id);
    const fs  = (weights.flow       * normFlow[i]
               + weights.blockage   * normBlockage[i]
               + weights.downstream * normDownstream[i]
               + weights.channel    * normChannel[i]
               + weights.slope      * normSlope[i]) / tw;

    return {
      conduitId:            c.id,
      fromNode:             c.fromNode,
      toNode:               c.toNode,
      channelType:          c.channelType,
      score:                Math.round(fs * 1000) / 1000,
      rank:                 0, // filled below
      flowScore:            Math.round(normFlow[i] * 1000) / 1000,
      blockageScore:        Math.round(normBlockage[i] * 1000) / 1000,
      downstreamScore:      Math.round(normDownstream[i] * 1000) / 1000,
      channelScore:         Math.round(normChannel[i] * 1000) / 1000,
      slopeScore:           Math.round(normSlope[i] * 1000) / 1000,
      flowRatio:            cr?.flowRatio ?? 0,
      blockageFactor:       c.blockageFactor,
      downstreamCount:      downstreamCounts.get(c.id) ?? 0,
      slopePct:             (c as unknown as { slopePct?: number }).slopePct ?? 0,
      effectiveCapacityM3s: c.effectiveCapacityM3s,
      inflowM3s:            cr?.inflowM3s ?? 0,
      severity:             cr?.severity ?? 'low',
    };
  });

  // Sort descending by score, assign rank
  records.sort((a, b) => b.score - a.score);
  records.forEach((r, i) => { r.rank = i + 1; });
  return records;
}

// ---------------------------------------------------------------------------
// Apply an intervention to conduits and re-simulate
// ---------------------------------------------------------------------------
export function applyIntervention(
  conduits: ConduitInput[],
  intervention: InterventionId,
  worstConduitId: string,
  params: SimulationParams,
): SimulationOutput {
  let modified = conduits.map(c => ({ ...c }));

  if (intervention === 'desilting') {
    modified = modified.map(c =>
      (c.channelType === 'trunk' || c.channelType === 'primary')
        ? {
            ...c,
            blockageFactor:       Math.max(0, c.blockageFactor * 0.4),
            effectiveCapacityM3s: c.nominalCapacityM3s * (1 - Math.max(0, c.blockageFactor * 0.4)),
          }
        : c
    );
  }

  if (intervention === 'widening') {
    modified = modified.map(c => ({
      ...c,
      effectiveCapacityM3s: c.effectiveCapacityM3s * 1.30,
    }));
  }

  if (intervention === 'new_bypass') {
    modified = modified.map(c =>
      c.id === worstConduitId
        ? { ...c, effectiveCapacityM3s: c.effectiveCapacityM3s * 1.25 }
        : c
    );
  }

  return runSimulation(modified, {
    ...params,
    scenarioName: INTERVENTION_SCENARIOS.find(s => s.id === intervention)?.label ?? intervention,
  });
}

// ---------------------------------------------------------------------------
// Compute per-conduit delta between two simulation results
// ---------------------------------------------------------------------------
export interface ConduitDelta {
  conduitId:    string;
  channelType:  string;
  baselineFlow: number;
  afterFlow:    number;
  deltaFlow:    number;        // afterFlow - baselineFlow (negative = improvement)
  deltaRatio:   number;        // percent change
  improved:     boolean;
}

export function computeDeltas(
  baseline: SimulationOutput,
  after:    SimulationOutput,
): ConduitDelta[] {
  const afterMap = new Map(after.conduitResults.map(r => [r.conduitId, r]));
  return baseline.conduitResults.map(b => {
    const a     = afterMap.get(b.conduitId);
    const aFr   = a?.flowRatio ?? b.flowRatio;
    const delta = aFr - b.flowRatio;
    return {
      conduitId:    b.conduitId,
      channelType:  b.channelType,
      baselineFlow: b.flowRatio,
      afterFlow:    aFr,
      deltaFlow:    Math.round(delta * 10000) / 10000,
      deltaRatio:   b.flowRatio > 0
        ? Math.round((delta / b.flowRatio) * 10000) / 100
        : 0,
      improved: delta < -0.001,
    };
  }).sort((a, b) => a.deltaFlow - b.deltaFlow); // most improved first
}
