/**
 * WaterGauge.tsx
 * D3 requirement: A circular pipe cross-section that fills to its simulated
 * capacity utilization, featuring a gentle wave ripple, overflow status indicator,
 * and clear numerical utilization percentage.
 */
import type { FC } from 'react';
import { Droplets } from 'lucide-react';

interface WaterGaugeProps {
  utilizationPct: number; // e.g. 164 for 164%
  nominalCapacityM3s: number;
  currentFlowM3s: number;
}

export const WaterGauge: FC<WaterGaugeProps> = ({
  utilizationPct,
  nominalCapacityM3s,
  currentFlowM3s,
}) => {
  const isOverflow = utilizationPct >= 100;
  const isWarning = utilizationPct >= 75 && utilizationPct < 100;
  // Fill height clamped between 5% and 95% inside circle
  const clampedFill = Math.min(Math.max(utilizationPct, 0), 100);
  const fillY = 90 - (clampedFill / 100) * 80;

  const waterColor = isOverflow ? '#B3261E' : isWarning ? '#C98A1B' : '#3A7F8F';

  return (
    <div className="flex flex-col items-center p-3 rounded-xl border border-border bg-background text-xs select-none shadow-sm">
      <div className="flex items-center justify-between w-full pb-1.5 border-b border-border/60">
        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted font-semibold flex items-center gap-1">
          <Droplets className="w-3 h-3 text-water" /> Conduit Cross-Section
        </span>
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
            isOverflow
              ? 'bg-critical/15 text-critical'
              : isWarning
              ? 'bg-amber/15 text-amber'
              : 'bg-sage-300/40 text-sage-900 dark:text-cream'
          }`}
        >
          {isOverflow ? 'OVERFLOW' : isWarning ? 'SURCHARGE RISK' : 'NORMAL'}
        </span>
      </div>

      <div className="relative my-3 flex items-center justify-center">
        {/* Pipe Cross-Section SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-24 h-24 overflow-visible"
          aria-label={`Pipe cross section showing ${utilizationPct}% utilization`}
        >
          <defs>
            {/* Circular Clip Path for Pipe Interior */}
            <clipPath id="pipe-clip">
              <circle cx="50" cy="50" r="42" />
            </clipPath>
          </defs>

          {/* Outer Pipe Wall */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth="5"
          />

          {/* Inner Pipe Interior */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            className="fill-surface"
          />

          {/* Water Fill with Wave Animation */}
          <g clipPath="url(#pipe-clip)">
            <rect
              x="0"
              y={fillY}
              width="100"
              height="100"
              fill={waterColor}
              className="opacity-80 transition-all duration-500"
            />
            {/* Gentle Wave Crest */}
            <path
              d={`M 0 ${fillY} Q 25 ${fillY - 3} 50 ${fillY} T 100 ${fillY} L 100 100 L 0 100 Z`}
              fill={waterColor}
              className="opacity-95"
            />
          </g>

          {/* Pipe Rim Accent */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            className="text-ink/20"
            strokeWidth="1.5"
          />

          {/* Surcharge / Overflow Indicator Drips */}
          {isOverflow && (
            <g className="animate-pulse">
              <circle cx="50" cy="4" r="2.5" fill="#B3261E" />
              <circle cx="68" cy="8" r="2" fill="#B3261E" />
              <circle cx="32" cy="8" r="2" fill="#B3261E" />
            </g>
          )}
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono font-bold text-sm text-ink drop-shadow-sm">
            {utilizationPct}%
          </span>
          <span className="text-[9px] font-mono text-ink-muted">utilization</span>
        </div>
      </div>

      {/* Hydraulic Details */}
      <div className="w-full flex justify-between text-[11px] font-mono pt-1 text-ink-muted">
        <span>Flow: <strong className="text-ink">{currentFlowM3s.toFixed(1)}</strong> m³/s</span>
        <span>Cap: <strong className="text-ink">{nominalCapacityM3s.toFixed(1)}</strong> m³/s</span>
      </div>
    </div>
  );
};
