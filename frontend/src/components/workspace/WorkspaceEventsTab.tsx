/**
 * WorkspaceEventsTab.tsx
 * Chronological timeline event summary generated from simulation parameters and results.
 */
import type { FC } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import type { SimulationOutput } from '../../hooks/useSimulation';

interface Props {
  result: SimulationOutput | null;
}

export const WorkspaceEventsTab: FC<Props> = ({ result }) => {
  if (!result) {
    return (
      <div className="p-4 text-center text-xs text-ink-muted">
        No simulation data available. Run a simulation to generate timeline events.
      </div>
    );
  }

  const overloaded = result.summaryOverloaded;
  const intensity = result.rainfallIntensityMmHr;

  const events = [
    {
      time: 'T+00m',
      title: 'Rainfall Event Inception',
      desc: `Precipitation begins across Koramangala catchment at baseline intensity (${intensity} mm/hr peak).`,
      severity: 'normal',
    },
    {
      time: 'T+15m',
      title: 'Catchment Surface Runoff Response',
      desc: 'Infiltration threshold exceeded on impervious surfaces. Flow enters tertiary road side-drains.',
      severity: 'normal',
    },
    {
      time: 'T+30m',
      title: overloaded > 0 ? 'Conduit Capacity Surcharging' : 'Conduits Conveying Inflow',
      desc: overloaded > 0
        ? `${overloaded} synthetic conduit segments exceed 100% capacity threshold.`
        : 'All synthetic conduits remain within hydraulic conveyance limits.',
      severity: overloaded > 0 ? 'warning' : 'success',
    },
    {
      time: 'T+45m',
      title: 'Peak Hyetograph Window',
      desc: `Maximum simulated inflow of ${result.summaryTotalInflowM3s.toFixed(1)} m³/s recorded at valley outfall axis.`,
      severity: overloaded > 0 ? 'critical' : 'normal',
    },
    {
      time: 'T+60m',
      title: 'Hydrograph Recession Phase',
      desc: 'Rainfall intensity tapers. Main trunk lines continue draining accumulated surface water.',
      severity: 'normal',
    },
  ];

  return (
    <div className="flex flex-col gap-2 p-2 max-h-56 overflow-y-auto">
      {events.map((ev, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 p-2.5 rounded-lg border border-border bg-background text-xs font-mono"
        >
          <span className="px-2 py-0.5 rounded bg-sage-300/40 text-sage-900 dark:text-cream font-bold text-[11px] shrink-0">
            {ev.time}
          </span>
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="font-semibold text-ink flex items-center gap-1.5 font-sans text-xs">
              {ev.severity === 'critical' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-critical shrink-0" />
              ) : ev.severity === 'warning' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber shrink-0" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-sage-700 shrink-0" />
              )}
              {ev.title}
            </span>
            <p className="text-ink-muted text-[11px] font-sans">{ev.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
