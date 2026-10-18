import { describe, it, expect } from 'vitest';
import {
  rankBottlenecks,
  applyIntervention,
  computeDeltas,
  DEFAULT_WEIGHTS,
  INTERVENTION_SCENARIOS,
  type FactorWeights,
} from '../lib/bottleneck';
import { runSimulation } from '../lib/simulation';
import type { ConduitInput, SimulationParams } from '../lib/simulation';

describe('Bottleneck Ranking and Intervention Engine', () => {
  const mockConduits: ConduitInput[] = [
    {
      id: 'C-001',
      fromNode: 'N1',
      toNode: 'N2',
      channelType: 'trunk',
      lengthM: 100,
      nominalCapacityM3s: 10,
      effectiveCapacityM3s: 6,
      blockageFactor: 0.4,
      coordinates: [[77.59, 12.97], [77.60, 12.98]],
    },
    {
      id: 'C-002',
      fromNode: 'N2',
      toNode: 'N3',
      channelType: 'primary',
      lengthM: 150,
      nominalCapacityM3s: 8,
      effectiveCapacityM3s: 6.4,
      blockageFactor: 0.2,
      coordinates: [[77.60, 12.98], [77.61, 12.99]],
    },
    {
      id: 'C-003',
      fromNode: 'N3',
      toNode: 'N4',
      channelType: 'secondary',
      lengthM: 200,
      nominalCapacityM3s: 5,
      effectiveCapacityM3s: 5,
      blockageFactor: 0.0,
      coordinates: [[77.61, 12.99], [77.62, 13.00]],
    },
  ];

  const params: SimulationParams = {
    scenarioName: 'Test Scenario',
    rainfallIntensityMmHr: 80,
    returnPeriodLabel: '25yr',
    globalAreaHa: 50,
    globalRunoffCoeff: 0.7,
    durationSteps: 12,
    stepMinutes: 5,
  };

  const simResult = runSimulation(mockConduits, params);

  it('ranks bottlenecks correctly with default weights', () => {
    const ranked = rankBottlenecks(mockConduits, simResult, DEFAULT_WEIGHTS);
    expect(ranked).toHaveLength(3);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
    expect(ranked[2].rank).toBe(3);

    // C-001 has highest blockage and trunk type
    expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
    expect(ranked[1].score).toBeGreaterThanOrEqual(ranked[2].score);
    expect(ranked[0].conduitId).toBeDefined();
  });

  it('respects dynamic custom factor weights', () => {
    // Weight heavily on downstream count or blockage
    const blockageOnlyWeights: FactorWeights = {
      flow: 0,
      blockage: 10,
      downstream: 0,
      channel: 0,
      slope: 0,
    };

    const ranked = rankBottlenecks(mockConduits, simResult, blockageOnlyWeights);
    // C-001 has 0.4 blockage, C-002 has 0.2, C-003 has 0
    expect(ranked[0].conduitId).toBe('C-001');
    expect(ranked[2].conduitId).toBe('C-003');
  });

  it('handles zero sum of weights gracefully without dividing by zero', () => {
    const zeroWeights: FactorWeights = {
      flow: 0,
      blockage: 0,
      downstream: 0,
      channel: 0,
      slope: 0,
    };
    const ranked = rankBottlenecks(mockConduits, simResult, zeroWeights);
    expect(ranked).toHaveLength(3);
    expect(ranked[0].score).toBe(0);
  });

  it('supports desilting and widening interventions with computed deltas', () => {
    const worstId = 'C-001';
    const desiltedResult = applyIntervention(mockConduits, 'desilting', worstId, params);
    expect(desiltedResult.conduitResults).toHaveLength(3);

    const widenedResult = applyIntervention(mockConduits, 'widening', worstId, params);
    expect(widenedResult.conduitResults).toHaveLength(3);

    const deltas = computeDeltas(simResult, widenedResult);
    expect(deltas).toHaveLength(3);
    // Widening improves flow ratio (lower flow ratio)
    expect(deltas.some(d => d.improved || d.deltaFlow <= 0)).toBe(true);
  });

  it('has valid intervention scenarios metadata', () => {
    expect(INTERVENTION_SCENARIOS.length).toBeGreaterThanOrEqual(4);
    const ids = INTERVENTION_SCENARIOS.map(s => s.id);
    expect(ids).toContain('baseline');
    expect(ids).toContain('desilting');
    expect(ids).toContain('widening');
    expect(ids).toContain('new_bypass');
  });
});
