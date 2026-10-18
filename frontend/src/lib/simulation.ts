/**
 * TypeScript mirror of the Python FloodSimulationEngine.
 *
 * This client-side implementation runs entirely in the browser so users
 * get instant feedback without network latency. It mirrors the exact
 * Rational Method formula and capacity exceedance logic from the backend.
 *
 * Formula:  Q = C * i * A / 360   [m3/s]
 *   C = runoff coefficient (dimensionless)
 *   i = rainfall intensity (mm/hr)
 *   A = catchment area (ha)
 *
 * Severity thresholds (flow_ratio = inflow / effective_capacity):
 *   < 0.75  -> low
 *   < 1.00  -> moderate
 *   < 1.50  -> high
 *   >= 1.50 -> critical
 */

export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';
export type ReturnPeriod = '5yr' | '10yr' | '25yr' | '50yr' | '100yr' | 'custom';

export interface ConduitInput {
  id: string;
  fromNode: string;
  toNode: string;
  channelType: string;
  lengthM: number;
  nominalCapacityM3s: number;
  effectiveCapacityM3s: number;
  blockageFactor: number;
  coordinates: number[][];
}

export interface ConduitResult {
  conduitId: string;
  fromNode: string;
  toNode: string;
  channelType: string;
  lengthM: number;
  nominalCapacityM3s: number;
  effectiveCapacityM3s: number;
  blockageFactor: number;
  inflowM3s: number;
  flowRatio: number;
  isOverloaded: boolean;
  severity: SeverityLevel;
  coordinates: number[][];
}

export interface TimelineStep {
  step: number;
  elapsedMinutes: number;
  rainfallMmHr: number;
  overloadedCount: number;
  maxFlowRatio: number;
  totalInflowM3s: number;
}

export interface SimulationParams {
  scenarioName: string;
  rainfallIntensityMmHr: number;
  returnPeriodLabel: ReturnPeriod | 'custom';
  globalAreaHa: number;
  globalRunoffCoeff: number;
  durationSteps: number;
  stepMinutes: number;
}

export interface SimulationOutput {
  runId: string;
  scenarioName: string;
  returnPeriodLabel: string;
  rainfallIntensityMmHr: number;
  conduitResults: ConduitResult[];
  timeline: TimelineStep[];
  summaryOverloaded: number;
  summaryMaxFlowRatio: number;
  summaryTotalInflowM3s: number;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Rainfall presets (mm/hr)
// ---------------------------------------------------------------------------
export const RAINFALL_PRESETS: Record<ReturnPeriod, number> = {
  '5yr':   30,
  '10yr':  50,
  '25yr':  75,
  '50yr': 100,
  '100yr':135,
  'custom': 0, // placeholder
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function rationalQ(coeff: number, intensityMmHr: number, areaHa: number): number {
  return (coeff * intensityMmHr * areaHa) / 360.0;
}

export function severity(flowRatio: number): SeverityLevel {
  if (flowRatio < 0.75) return 'low';
  if (flowRatio < 1.0)  return 'moderate';
  if (flowRatio < 1.5)  return 'high';
  return 'critical';
}

// Triangular hyetograph: peak at step n//2
function hyetograph(peakMmHr: number, nSteps: number): number[] {
  const peakIdx = Math.floor(nSteps / 2);
  return Array.from({ length: nSteps }, (_, i) => {
    let frac: number;
    if (i <= peakIdx) {
      frac = peakIdx > 0 ? i / peakIdx : 1;
    } else {
      const tail = nSteps - 1 - peakIdx;
      frac = tail > 0 ? (nSteps - 1 - i) / tail : 0;
    }
    return Math.round(peakMmHr * frac * 100) / 100;
  });
}

// ---------------------------------------------------------------------------
// Client simulation engine
// ---------------------------------------------------------------------------
export function runSimulation(
  conduits: ConduitInput[],
  params: SimulationParams,
): SimulationOutput {
  const {
    scenarioName,
    rainfallIntensityMmHr,
    returnPeriodLabel,
    globalAreaHa,
    globalRunoffCoeff,
    durationSteps,
    stepMinutes,
  } = params;

  // Build topological order from conduit list
  // (For client-side, process in declaration order - upstream conduits
  //  appear first in the synthetic GeoJSON)
  function routeStep(intensity: number): Map<string, number> {
    const nodeExcess = new Map<string, number>();
    const inflowMap  = new Map<string, number>();

    for (const c of conduits) {
      const q_runoff = rationalQ(globalRunoffCoeff, intensity, globalAreaHa);
      const upstream = nodeExcess.get(c.fromNode) ?? 0;
      const q_total  = q_runoff + upstream;
      inflowMap.set(c.id, q_total);
      if (q_total > c.effectiveCapacityM3s) {
        const excess = q_total - c.effectiveCapacityM3s;
        nodeExcess.set(c.toNode, (nodeExcess.get(c.toNode) ?? 0) + excess);
      }
    }
    return inflowMap;
  }

  // Peak step
  const peakInflow = routeStep(rainfallIntensityMmHr);

  const conduitResults: ConduitResult[] = conduits.map(c => {
    const qIn = peakInflow.get(c.id) ?? 0;
    const fr  = c.effectiveCapacityM3s > 0 ? qIn / c.effectiveCapacityM3s : 0;
    return {
      conduitId:            c.id,
      fromNode:             c.fromNode,
      toNode:               c.toNode,
      channelType:          c.channelType,
      lengthM:              c.lengthM,
      nominalCapacityM3s:   c.nominalCapacityM3s,
      effectiveCapacityM3s: c.effectiveCapacityM3s,
      blockageFactor:       c.blockageFactor,
      inflowM3s:            Math.round(qIn * 10000) / 10000,
      flowRatio:            Math.round(fr * 10000) / 10000,
      isOverloaded:         fr >= 1.0,
      severity:             severity(fr),
      coordinates:          c.coordinates,
    };
  });

  // Timeline
  const hyeto = hyetograph(rainfallIntensityMmHr, durationSteps);
  const timeline: TimelineStep[] = hyeto.map((intensity, step) => {
    const inflow = routeStep(intensity);
    let overloaded = 0;
    let maxFr = 0;
    let totalQ = 0;
    for (const c of conduits) {
      const q = inflow.get(c.id) ?? 0;
      const fr = c.effectiveCapacityM3s > 0 ? q / c.effectiveCapacityM3s : 0;
      totalQ += q;
      if (fr > maxFr) maxFr = fr;
      if (fr >= 1.0) overloaded++;
    }
    return {
      step,
      elapsedMinutes:  step * stepMinutes,
      rainfallMmHr:    intensity,
      overloadedCount: overloaded,
      maxFlowRatio:    Math.round(maxFr * 10000) / 10000,
      totalInflowM3s:  Math.round(totalQ * 10000) / 10000,
    };
  });

  const summaryOverloaded    = conduitResults.filter(c => c.isOverloaded).length;
  const summaryMaxFlowRatio  = Math.max(...conduitResults.map(c => c.flowRatio), 0);
  const summaryTotalInflowM3s = conduitResults.reduce((s, c) => s + c.inflowM3s, 0);

  return {
    runId:                   crypto.randomUUID(),
    scenarioName,
    returnPeriodLabel,
    rainfallIntensityMmHr,
    conduitResults,
    timeline,
    summaryOverloaded,
    summaryMaxFlowRatio:    Math.round(summaryMaxFlowRatio * 10000) / 10000,
    summaryTotalInflowM3s:  Math.round(summaryTotalInflowM3s * 10000) / 10000,
    createdAt:               new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------
export function exportConduitsCsv(results: ConduitResult[], scenarioName: string): void {
  const header = [
    'conduit_id', 'from_node', 'to_node', 'channel_type',
    'length_m', 'nominal_cap_m3s', 'effective_cap_m3s',
    'blockage_factor', 'inflow_m3s', 'flow_ratio', 'is_overloaded', 'severity',
  ].join(',');

  const rows = results.map(r =>
    [
      r.conduitId, r.fromNode, r.toNode, r.channelType,
      r.lengthM, r.nominalCapacityM3s, r.effectiveCapacityM3s,
      r.blockageFactor, r.inflowM3s, r.flowRatio,
      r.isOverloaded ? 'true' : 'false', r.severity,
    ].join(',')
  );

  const csv  = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `pravaha_${scenarioName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
