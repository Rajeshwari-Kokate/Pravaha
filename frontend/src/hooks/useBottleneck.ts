/**
 * useBottleneck: loads conduits, runs simulation, ranks bottlenecks,
 * and manages intervention scenario state.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { runSimulation, RAINFALL_PRESETS } from '../lib/simulation';
import type { ConduitInput, SimulationOutput, SimulationParams } from '../lib/simulation';
import {
  rankBottlenecks,
  applyIntervention,
  computeDeltas,
  DEFAULT_WEIGHTS,
  type FactorWeights,
  type BottleneckRecord,
  type InterventionId,
  type ConduitDelta,
} from '../lib/bottleneck';

export type { FactorWeights, BottleneckRecord, InterventionId, ConduitDelta };

const BASE_PARAMS: SimulationParams = {
  scenarioName:          'Baseline (10yr)',
  rainfallIntensityMmHr: RAINFALL_PRESETS['10yr'],
  returnPeriodLabel:     '10yr',
  globalAreaHa:          50,
  globalRunoffCoeff:     0.70,
  durationSteps:         12,
  stepMinutes:           5,
};

interface UseBottleneckReturn {
  conduits:        ConduitInput[];
  baselineResult:  SimulationOutput | null;
  rankings:        BottleneckRecord[];
  weights:         FactorWeights;
  setWeight:       (key: keyof FactorWeights, value: number) => void;
  selectedIntervention: InterventionId;
  setIntervention: (id: InterventionId) => void;
  interventionResult:  SimulationOutput | null;
  deltas:          ConduitDelta[];
  isLoading:       boolean;
  rainfallIntensity: number;
  setRainfallIntensity: (v: number) => void;
}

export function useBottleneck(): UseBottleneckReturn {
  const [conduits, setConduits]               = useState<ConduitInput[]>([]);
  const [baselineResult, setBaselineResult]   = useState<SimulationOutput | null>(null);
  const [weights, setWeights]                 = useState<FactorWeights>(DEFAULT_WEIGHTS);
  const [selectedIntervention, setIntervention] = useState<InterventionId>('desilting');
  const [isLoading, setIsLoading]             = useState(true);
  const [rainfallIntensity, setRainfallIntensity] = useState(RAINFALL_PRESETS['10yr']);

  // Load GeoJSON conduits, preserving extra fields (slope_pct etc.)
  useEffect(() => {
    fetch('/data/drainage_network.geojson')
      .then(r => r.json())
      .then((fc: { features: Array<{ properties: Record<string, unknown>; geometry: { coordinates: number[][] } }> }) => {
        const inputs = fc.features.map(f => ({
          id:                   String(f.properties['id']),
          fromNode:             String(f.properties['from_node']),
          toNode:               String(f.properties['to_node']),
          channelType:          String(f.properties['channel_type'] ?? 'secondary'),
          lengthM:              Number(f.properties['length_m'] ?? 0),
          nominalCapacityM3s:   Number(f.properties['nominal_capacity_m3s'] ?? 1),
          effectiveCapacityM3s: Number(f.properties['effective_capacity_m3s'] ?? 0.5),
          blockageFactor:       Number(f.properties['blockage_factor'] ?? 0),
          coordinates:          f.geometry.coordinates,
          // Extra fields for bottleneck scoring
          slopePct:             Number(f.properties['slope_pct'] ?? 0.5),
          widthM:               Number(f.properties['width_m'] ?? 1),
          depthM:               Number(f.properties['depth_m'] ?? 1),
        })) as ConduitInput[];
        setConduits(inputs);
      })
      .catch(e => console.warn('GeoJSON load failed:', e))
      .finally(() => setIsLoading(false));
  }, []);

  // Re-run baseline when conduits or intensity changes
  useEffect(() => {
    if (conduits.length === 0) return;
    const params = { ...BASE_PARAMS, rainfallIntensityMmHr: rainfallIntensity };
    const result = runSimulation(conduits, params);
    setBaselineResult(result);
  }, [conduits, rainfallIntensity]);

  // Rankings re-computed when baseline or weights change
  const rankings = useMemo<BottleneckRecord[]>(() => {
    if (!baselineResult || conduits.length === 0) return [];
    return rankBottlenecks(conduits, baselineResult, weights);
  }, [conduits, baselineResult, weights]);

  // Worst conduit id for bypass scenario
  const worstConduitId = rankings[0]?.conduitId ?? '';

  // Intervention result
  const interventionResult = useMemo<SimulationOutput | null>(() => {
    if (!baselineResult || conduits.length === 0 || selectedIntervention === 'baseline') {
      return baselineResult;
    }
    const params = { ...BASE_PARAMS, rainfallIntensityMmHr: rainfallIntensity };
    return applyIntervention(conduits, selectedIntervention, worstConduitId, params);
  }, [conduits, baselineResult, selectedIntervention, worstConduitId, rainfallIntensity]);

  // Deltas
  const deltas = useMemo<ConduitDelta[]>(() => {
    if (!baselineResult || !interventionResult) return [];
    return computeDeltas(baselineResult, interventionResult);
  }, [baselineResult, interventionResult]);

  const setWeight = useCallback((key: keyof FactorWeights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    conduits,
    baselineResult,
    rankings,
    weights,
    setWeight,
    selectedIntervention,
    setIntervention,
    interventionResult,
    deltas,
    isLoading,
    rainfallIntensity,
    setRainfallIntensity,
  };
}
