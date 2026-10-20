/**
 * ComparisonMetricsCard.tsx
 * Card listing before-and-after comparison metrics with percentage deltas,
 * D8 honest celebration stamp, and methodology disclaimer footnote.
 */
import type { FC } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface MetricItem {
  label: string;
  before: number;
  after: number;
  unit?: string;
}

interface ComparisonMetricsCardProps {
  hotspotsBefore?: number;
  hotspotsAfter?: number;
  overloadedBefore?: number;
  overloadedAfter?: number;
  roadsBefore?: number;
  roadsAfter?: number;
}

export const ComparisonMetricsCard: FC<ComparisonMetricsCardProps> = ({
  hotspotsBefore = 12,
  hotspotsAfter = 5,
  overloadedBefore = 8,
  overloadedAfter = 3,
  roadsBefore = 5,
  roadsAfter = 2,
}) => {
  const metrics: MetricItem[] = [
    { label: 'Hotspots', before: hotspotsBefore, after: hotspotsAfter },
    { label: 'Over capacity segments', before: overloadedBefore, after: overloadedAfter },
    { label: 'Affected road segments', before: roadsBefore, after: roadsAfter },
  ];

  const totalReduction = hotspotsBefore - hotspotsAfter;
  const isReduced = totalReduction > 0;

  return (
    <div className="flex flex-col justify-between p-4 rounded-xl border border-border bg-surface shadow-offset text-xs select-none">
      <div className="flex flex-col gap-4">
        <div className="pb-2 border-b border-border">
          <h3 className="font-display font-bold text-sm text-ink">Comparison Metrics</h3>
          <p className="text-[11px] text-ink-muted mt-0.5">Hydraulic impact of intervention</p>
        </div>

        {/* Metric Rows */}
        <div className="flex flex-col gap-3">
          {metrics.map((m, idx) => {
            const diff = m.after - m.before;
            const pctChange = m.before > 0 ? Math.round((diff / m.before) * 100) : 0;
            const noChange = diff === 0;

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-background"
              >
                <span className="font-medium text-ink">{m.label}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-ink">
                    <span>{m.before}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
                    <span className="text-sage-700">{m.after}</span>
                  </div>

                  {noChange ? (
                    <span className="text-[10px] font-mono text-ink-muted">
                      no measurable change
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        pctChange < 0
                          ? 'bg-sage-300/40 text-sage-900 dark:text-cream border border-sage-500/40'
                          : 'bg-critical/15 text-critical border border-critical/40'
                      }`}
                    >
                      {pctChange > 0 ? `+${pctChange}%` : `${pctChange}%`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* D8: Honest Celebration Stamp */}
        {isReduced ? (
          <div className="p-2.5 rounded-lg border border-sage-500/40 bg-sage-300/30 flex items-center gap-2 text-ink">
            <CheckCircle2 className="w-4 h-4 text-sage-700 shrink-0" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-[11px]">Fewer hotspots than baseline</span>
              <span className="font-mono text-[10px] text-ink-muted">
                {totalReduction} hotspots mitigated through conduit desilting
              </span>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-lg border border-border bg-background text-[11px] text-ink-muted">
            no measurable change detected under current intervention parameters.
          </div>
        )}
      </div>

      {/* Footnote */}
      <p className="text-[10px] text-ink-muted italic pt-3 border-t border-border/60 mt-3">
        Values are based on the current simulation and are relative indicators, not real-time measurements.
      </p>
    </div>
  );
};
