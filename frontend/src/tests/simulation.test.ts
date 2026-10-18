/**
 * Phase 5 frontend simulation library tests.
 * Validates the TypeScript Rational Method mirror against the same
 * golden fixtures used in the Python pytest suite.
 */
import { describe, it, expect } from 'vitest';
import {
  rationalQ,
  severity,
  runSimulation,
  RAINFALL_PRESETS,
  type ConduitInput,
  type SimulationParams,
} from '../lib/simulation';

// ---------------------------------------------------------------------------
// Synthetic conduit dataset (mirrors backend synthetic network)
// ---------------------------------------------------------------------------
const MOCK_CONDUITS: ConduitInput[] = [
  {
    id: 'DRN-TRUNK-01', fromNode: 'J-100FT-80FT', toNode: 'J-BLK4-E',
    channelType: 'trunk', lengthM: 868,
    nominalCapacityM3s: 16, effectiveCapacityM3s: 10.4, blockageFactor: 0.35,
    coordinates: [[77.624, 12.934], [77.632, 12.934]],
  },
  {
    id: 'DRN-TRUNK-02', fromNode: 'J-BLK4-E', toNode: 'J-OUTLET-NE',
    channelType: 'trunk', lengthM: 759.5,
    nominalCapacityM3s: 18, effectiveCapacityM3s: 14.4, blockageFactor: 0.2,
    coordinates: [[77.632, 12.934], [77.639, 12.934]],
  },
  {
    id: 'DRN-80FT-N1', fromNode: 'J-80FT-N', toNode: 'J-80FT-MID',
    channelType: 'primary', lengthM: 775.9,
    nominalCapacityM3s: 7, effectiveCapacityM3s: 4.2, blockageFactor: 0.4,
    coordinates: [[77.623, 12.948], [77.6235, 12.941]],
  },
];

const BASE_PARAMS: SimulationParams = {
  scenarioName:          'test',
  rainfallIntensityMmHr: 50,
  returnPeriodLabel:     '10yr',
  globalAreaHa:          50,
  globalRunoffCoeff:     0.70,
  durationSteps:         12,
  stepMinutes:           5,
};

// ---------------------------------------------------------------------------
// Rational Method
// ---------------------------------------------------------------------------
describe('rationalQ', () => {
  it('matches Python formula: 0.70 * 50 * 50 / 360 = 4.861', () => {
    expect(rationalQ(0.70, 50, 50)).toBeCloseTo(4.861, 2);
  });
  it('returns 0 for zero intensity', () => {
    expect(rationalQ(0.9, 0, 50)).toBe(0);
  });
  it('returns 0 for zero runoff coeff', () => {
    expect(rationalQ(0, 100, 100)).toBe(0);
  });
  it('is proportional to area', () => {
    expect(rationalQ(0.7, 50, 100)).toBeCloseTo(2 * rationalQ(0.7, 50, 50), 5);
  });
});

// ---------------------------------------------------------------------------
// Severity
// ---------------------------------------------------------------------------
describe('severity', () => {
  it('low below 0.75', () => expect(severity(0.5)).toBe('low'));
  it('moderate 0.75 to 1.0', () => expect(severity(0.9)).toBe('moderate'));
  it('high 1.0 to 1.5', () => expect(severity(1.2)).toBe('high'));
  it('critical >= 1.5', () => expect(severity(1.5)).toBe('critical'));
  it('boundary at 0.75', () => expect(severity(0.75)).toBe('moderate'));
  it('boundary at 1.0', () => expect(severity(1.0)).toBe('high'));
  it('boundary at 1.5', () => expect(severity(1.5)).toBe('critical'));
});

// ---------------------------------------------------------------------------
// Rainfall presets
// ---------------------------------------------------------------------------
describe('RAINFALL_PRESETS', () => {
  it('5yr is 30 mm/hr',  () => expect(RAINFALL_PRESETS['5yr']).toBe(30));
  it('10yr is 50 mm/hr', () => expect(RAINFALL_PRESETS['10yr']).toBe(50));
  it('100yr is 135 mm/hr', () => expect(RAINFALL_PRESETS['100yr']).toBe(135));
});

// ---------------------------------------------------------------------------
// runSimulation
// ---------------------------------------------------------------------------
describe('runSimulation', () => {
  it('returns a result with run_id', () => {
    const r = runSimulation(MOCK_CONDUITS, BASE_PARAMS);
    expect(r.runId).toBeTruthy();
    expect(r.runId.length).toBeGreaterThan(10);
  });

  it('conduit results count matches input count', () => {
    const r = runSimulation(MOCK_CONDUITS, BASE_PARAMS);
    expect(r.conduitResults.length).toBe(MOCK_CONDUITS.length);
  });

  it('timeline step count matches durationSteps', () => {
    const r = runSimulation(MOCK_CONDUITS, BASE_PARAMS);
    expect(r.timeline.length).toBe(BASE_PARAMS.durationSteps);
  });

  it('flow ratio >= 0 for all conduits', () => {
    const r = runSimulation(MOCK_CONDUITS, BASE_PARAMS);
    r.conduitResults.forEach(cr => {
      expect(cr.flowRatio).toBeGreaterThanOrEqual(0);
    });
  });

  it('isOverloaded consistent with flow ratio', () => {
    const r = runSimulation(MOCK_CONDUITS, BASE_PARAMS);
    r.conduitResults.forEach(cr => {
      expect(cr.isOverloaded).toBe(cr.flowRatio >= 1.0);
    });
  });

  it('severity consistent with flow ratio', () => {
    const r = runSimulation(MOCK_CONDUITS, BASE_PARAMS);
    r.conduitResults.forEach(cr => {
      expect(cr.severity).toBe(severity(cr.flowRatio));
    });
  });

  it('at least one conduit overloaded at 10yr / 50ha catchment', () => {
    const r = runSimulation(MOCK_CONDUITS, BASE_PARAMS);
    expect(r.summaryOverloaded).toBeGreaterThanOrEqual(1);
  });

  it('near-zero rainfall -> no conduits overloaded', () => {
    const r = runSimulation(MOCK_CONDUITS, {
      ...BASE_PARAMS, rainfallIntensityMmHr: 0.1, returnPeriodLabel: 'custom',
    });
    expect(r.summaryOverloaded).toBe(0);
  });

  it('100yr extreme: max flow ratio >> 1', () => {
    const r = runSimulation(MOCK_CONDUITS, {
      ...BASE_PARAMS, rainfallIntensityMmHr: 135, returnPeriodLabel: '100yr',
    });
    expect(r.summaryMaxFlowRatio).toBeGreaterThan(3);
  });

  it('timeline peak is at midpoint step', () => {
    const r = runSimulation(MOCK_CONDUITS, BASE_PARAMS);
    const peakStep = r.timeline.reduce((best, s) =>
      s.rainfallMmHr > best.rainfallMmHr ? s : best
    );
    const mid = Math.floor(BASE_PARAMS.durationSteps / 2);
    expect(Math.abs(peakStep.step - mid)).toBeLessThanOrEqual(1);
  });

  it('elapsed minutes = step * stepMinutes', () => {
    const r = runSimulation(MOCK_CONDUITS, BASE_PARAMS);
    r.timeline.forEach(s => {
      expect(s.elapsedMinutes).toBe(s.step * BASE_PARAMS.stepMinutes);
    });
  });

  it('summary total inflow matches sum of conduit inflows', () => {
    const r = runSimulation(MOCK_CONDUITS, BASE_PARAMS);
    const total = r.conduitResults.reduce((s, c) => s + c.inflowM3s, 0);
    expect(r.summaryTotalInflowM3s).toBeCloseTo(total, 2);
  });

  it('TS parity: rationalQ(0.7, 50, 50) matches Python 4.861', () => {
    // This is the golden fixture from Python tests/fixtures/golden_simulation.py
    expect(rationalQ(0.70, 50.0, 50.0)).toBeCloseTo(4.861, 1);
  });
});
