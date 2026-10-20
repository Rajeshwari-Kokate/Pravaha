/**
 * ScenarioMapCard.tsx
 * Card representing a scenario map state (Baseline or Intervention)
 * with parameters subtitle, vector schematic, and accumulation legend.
 */
import type { FC } from 'react';

interface ScenarioMapCardProps {
  title: string;
  subtitle: string;
  isIntervention?: boolean;
}

export const ScenarioMapCard: FC<ScenarioMapCardProps> = ({
  title,
  subtitle,
  isIntervention = false,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface shadow-offset text-xs select-none">
      <div>
        <h3 className="font-display font-bold text-sm text-ink">{title}</h3>
        <p className="text-[11px] font-mono text-ink-muted mt-0.5">{subtitle}</p>
      </div>

      {/* Map visualization area */}
      <div className="relative w-full h-56 bg-background rounded-lg border border-border overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 400 220" className="w-full h-full">
          {/* Subtle grid */}
          <pattern id={`sc-grid-${isIntervention ? 'int' : 'base'}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" className="text-border/20" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#sc-grid-${isIntervention ? 'int' : 'base'})`} />

          {/* Road Network Lines (Muted) */}
          <path d="M 40 40 L 360 180 M 340 40 L 60 190 M 180 20 L 220 200" stroke="#CBD5E1" strokeWidth="1.5" className="opacity-40" />

          {/* Drainage Lines (Dashed Synthetic) */}
          <path d="M 60 50 L 150 90 L 250 130 L 340 160" stroke="#3A7F8F" strokeWidth="2.5" strokeDasharray="3 2" />
          <path d="M 120 30 L 150 90 M 200 60 L 250 130" stroke="#3A7F8F" strokeWidth="2" strokeDasharray="3 2" />

          {/* Modeled Accumulation Hotspots Heat Blobs */}
          {isIntervention ? (
            // Reduced accumulation after intervention
            <g className="opacity-80">
              <ellipse cx="250" cy="130" rx="35" ry="22" fill="#E8C468" />
              <ellipse cx="250" cy="130" rx="16" ry="10" fill="#E0803A" />
              <ellipse cx="150" cy="90" rx="22" ry="14" fill="#B8CFB3" />
            </g>
          ) : (
            // High accumulation at baseline
            <g className="opacity-85">
              <ellipse cx="250" cy="130" rx="55" ry="32" fill="#E8C468" />
              <ellipse cx="250" cy="130" rx="38" ry="20" fill="#E0803A" />
              <ellipse cx="250" cy="130" rx="18" ry="10" fill="#B3261E" className="hatch-pattern" />
              <ellipse cx="150" cy="90" rx="40" ry="24" fill="#E8C468" />
              <ellipse cx="150" cy="90" rx="20" ry="12" fill="#E0803A" />
            </g>
          )}

          {/* Drainage Nodes */}
          <circle cx="150" cy="90" r="4.5" fill="#3A7F8F" stroke="#FEFAF3" strokeWidth="1.5" />
          <circle cx="250" cy="130" r="4.5" fill="#3A7F8F" stroke="#FEFAF3" strokeWidth="1.5" />
        </svg>

        {/* Catchment label */}
        <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-surface/90 border border-border text-ink-muted">
          Koramangala Valley
        </span>
      </div>

      {/* Relative Accumulation Scale Legend */}
      <div className="flex flex-col gap-1 pt-1 border-t border-border/60">
        <div className="flex justify-between items-center text-[10px] font-mono text-ink-muted">
          <span className="font-semibold text-ink">Accumulation (relative)</span>
          <div className="flex items-center gap-1">
            <span>Low</span>
            <div className="flex items-center gap-0.5 px-1">
              <span className="w-3 h-2 rounded-xs bg-[#B8CFB3]" />
              <span className="w-3 h-2 rounded-xs bg-[#E8C468]" />
              <span className="w-3 h-2 rounded-xs bg-[#E0803A]" />
              <span className="w-3 h-2 rounded-xs bg-[#B3261E] hatch-pattern" />
            </div>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};
