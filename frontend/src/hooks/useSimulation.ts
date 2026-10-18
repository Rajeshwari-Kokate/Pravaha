/**
 * useSimulation: React hook that loads GeoJSON conduit data,
 * runs the client-side simulation engine on parameter changes,
 * and exposes results + timeline playback state.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  runSimulation,
  type ConduitInput,
  type SimulationOutput,
  type SimulationParams,
  type ReturnPeriod,
  RAINFALL_PRESETS,
} from '../lib/simulation';

export type { SimulationOutput, ReturnPeriod };

// Default params
const DEFAULT_PARAMS: SimulationParams = {
  scenarioName:          'Baseline',
  rainfallIntensityMmHr: 50,
  returnPeriodLabel:     '10yr',
  globalAreaHa:          50,
  globalRunoffCoeff:     0.70,
  durationSteps:         12,
  stepMinutes:           5,
};

interface UseSimulationReturn {
  params:           SimulationParams;
  setReturnPeriod:  (rp: ReturnPeriod) => void;
  setCustomIntensity: (v: number) => void;
  setRunoffCoeff:   (v: number) => void;
  setAreaHa:        (v: number) => void;
  setScenarioName:  (v: string) => void;
  result:           SimulationOutput | null;
  isLoading:        boolean;
  // Timeline playback
  activeStep:       number;
  isPlaying:        boolean;
  play:             () => void;
  pause:            () => void;
  reset:            () => void;
  seekStep:         (s: number) => void;
}

export function useSimulation(): UseSimulationReturn {
  const [conduits, setConduits] = useState<ConduitInput[]>([]);
  const [params, setParams]     = useState<SimulationParams>(DEFAULT_PARAMS);
  const [result, setResult]     = useState<SimulationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Timeline playback
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying]   = useState(false);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load GeoJSON conduits once
  useEffect(() => {
    fetch('/data/drainage_network.geojson')
      .then(r => r.json())
      .then((fc: { features: Array<{ properties: Record<string, unknown>; geometry: { coordinates: number[][] } }> }) => {
        const inputs: ConduitInput[] = fc.features.map(f => ({
          id:                   String(f.properties['id']),
          fromNode:             String(f.properties['from_node']),
          toNode:               String(f.properties['to_node']),
          channelType:          String(f.properties['channel_type'] ?? 'secondary'),
          lengthM:              Number(f.properties['length_m'] ?? 0),
          nominalCapacityM3s:   Number(f.properties['nominal_capacity_m3s'] ?? 1),
          effectiveCapacityM3s: Number(f.properties['effective_capacity_m3s'] ?? 0.5),
          blockageFactor:       Number(f.properties['blockage_factor'] ?? 0),
          coordinates:          f.geometry.coordinates,
        }));
        setConduits(inputs);
      })
      .catch(err => console.warn('Could not load drainage GeoJSON:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Re-run simulation whenever conduits or params change
  useEffect(() => {
    if (conduits.length === 0) return;
    setIsLoading(true);
    // Use requestIdleCallback with setTimeout fallback for cross-browser support (e.g. Safari)
    const scheduleIdle = typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function'
      ? window.requestIdleCallback.bind(window)
      : (cb: () => void) => window.setTimeout(cb, 1);

    const cancelIdle = typeof window !== 'undefined' && typeof window.cancelIdleCallback === 'function'
      ? window.cancelIdleCallback.bind(window)
      : (id: number) => window.clearTimeout(id);

    const id = scheduleIdle(() => {
      const out = runSimulation(conduits, params);
      setResult(out);
      setActiveStep(0);
      setIsPlaying(false);
      setIsLoading(false);
    });
    return () => cancelIdle(id);
  }, [conduits, params]);

  // Playback interval
  useEffect(() => {
    if (isPlaying && result) {
      playRef.current = setInterval(() => {
        setActiveStep(s => {
          const next = s + 1;
          if (next >= result.timeline.length) {
            setIsPlaying(false);
            clearInterval(playRef.current!);
            return s;
          }
          return next;
        });
      }, 600);
    } else {
      if (playRef.current) clearInterval(playRef.current);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isPlaying, result]);

  // Param setters
  const setReturnPeriod = useCallback((rp: ReturnPeriod) => {
    setParams(p => ({
      ...p,
      returnPeriodLabel:     rp,
      rainfallIntensityMmHr: RAINFALL_PRESETS[rp],
      scenarioName:          `Baseline (${rp})`,
    }));
  }, []);

  const setCustomIntensity = useCallback((v: number) => {
    setParams(p => ({
      ...p,
      returnPeriodLabel:     'custom',
      rainfallIntensityMmHr: v,
      scenarioName:          `Custom (${v} mm/hr)`,
    }));
  }, []);

  const setRunoffCoeff = useCallback((v: number) => {
    setParams(p => ({ ...p, globalRunoffCoeff: v }));
  }, []);

  const setAreaHa = useCallback((v: number) => {
    setParams(p => ({ ...p, globalAreaHa: v }));
  }, []);

  const setScenarioName = useCallback((v: string) => {
    setParams(p => ({ ...p, scenarioName: v }));
  }, []);

  const play  = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const reset = useCallback(() => { setIsPlaying(false); setActiveStep(0); }, []);
  const seekStep = useCallback((s: number) => {
    setIsPlaying(false);
    setActiveStep(s);
  }, []);

  return {
    params,
    setReturnPeriod,
    setCustomIntensity,
    setRunoffCoeff,
    setAreaHa,
    setScenarioName,
    result,
    isLoading,
    activeStep,
    isPlaying,
    play,
    pause,
    reset,
    seekStep,
  };
}
