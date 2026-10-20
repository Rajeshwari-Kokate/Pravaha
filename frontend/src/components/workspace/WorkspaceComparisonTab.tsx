/**
 * WorkspaceComparisonTab.tsx
 * Quick comparison view between current simulation run and baseline parameters.
 */
import type { FC } from 'react';
import { GitCompare, ArrowRight } from 'lucide-react';
import type { SimulationOutput } from '../../hooks/useSimulation';

interface Props {
  result: SimulationOutput | null;
}

export const WorkspaceComparisonTab: FC<Props> = ({ result }) => {
  if (!result) {
    return (
      <div className="p-4 text-center text-xs text-ink-muted">
        No simulation data available. Run a simulation to compare results.
      </div>
    );
  }

  // Baseline reference values (50 mm/hr, 10yr baseline)
  const baseline = {
    intensity: 50,
    hotspots: 12,
    overloaded: 8,
    affectedRoads: 5,
  };

  const currentOverloaded = result.summaryOverloaded;
  const currentHotspots = Math.round(currentOverloaded * 1.5);
  const currentRoads = Math.round(currentOverloaded * 0.6);

  const diffOverloaded = currentOverloaded - baseline.overloaded;
  const diffHotspots = currentHotspots - baseline.hotspots;
  const diffRoads = currentRoads - baseline.affectedRoads;

  const renderDelta = (delta: number) => {
    if (delta === 0) {
      return (
        <span className="text-[11px] font-mono text-ink-muted">
          no measurable change
        </span>
      );
    }
    const sign = delta > 0 ? '+' : '';
    const isWorse = delta > 0;
    return (
      <span
        className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
          isWorse
            ? 'bg-critical/15 text-critical'
            : 'bg-sage-300/40 text-sage-900 dark:text-cream'
        }`}
      >
        {sign}{delta} ({isWorse ? 'increase' : 'decrease'})
      </span>
    );
  };

  return (
    <div className="p-3 flex flex-col gap-3 max-h-56 overflow-y-auto text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-1.5 font-bold text-ink">
          <GitCompare className="w-3.5 h-3.5 text-sage-700" />
          <span>Baseline vs Current Simulation</span>
        </div>
        <span className="text-[10px] font-mono text-ink-muted">
          Baseline (50 mm/hr) → Current ({result.rainfallIntensityMmHr} mm/hr)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {/* Metric 1 */}
        <div className="p-2.5 rounded-lg border border-border bg-background flex flex-col gap-1">
          <span className="text-[10px] font-mono text-ink-muted uppercase">
            Potential Hotspots
          </span>
          <div className="flex items-baseline gap-2 font-mono text-base font-bold text-ink">
            <span>{baseline.hotspots}</span>
            <ArrowRight className="w-3 h-3 text-ink-muted inline" />
            <span>{currentHotspots}</span>
          </div>
          <div>{renderDelta(diffHotspots)}</div>
        </div>

        {/* Metric 2 */}
        <div className="p-2.5 rounded-lg border border-border bg-background flex flex-col gap-1">
          <span className="text-[10px] font-mono text-ink-muted uppercase">
            Over-Capacity Conduits
          </span>
          <div className="flex items-baseline gap-2 font-mono text-base font-bold text-ink">
            <span>{baseline.overloaded}</span>
            <ArrowRight className="w-3 h-3 text-ink-muted inline" />
            <span>{currentOverloaded}</span>
          </div>
          <div>{renderDelta(diffOverloaded)}</div>
        </div>

        {/* Metric 3 */}
        <div className="p-2.5 rounded-lg border border-border bg-background flex flex-col gap-1">
          <span className="text-[10px] font-mono text-ink-muted uppercase">
            Affected Road Segments
          </span>
          <div className="flex items-baseline gap-2 font-mono text-base font-bold text-ink">
            <span>{baseline.affectedRoads}</span>
            <ArrowRight className="w-3 h-3 text-ink-muted inline" />
            <span>{currentRoads}</span>
          </div>
          <div>{renderDelta(diffRoads)}</div>
        </div>
      </div>

      <p className="text-[10px] text-ink-muted italic">
        Values are based on the current simulation and are relative indicators, not real-time measurements.
      </p>
    </div>
  );
};
