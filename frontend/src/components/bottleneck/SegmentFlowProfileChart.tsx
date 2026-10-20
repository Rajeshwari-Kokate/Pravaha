/**
 * SegmentFlowProfileChart.tsx
 * Hydraulic profile chart comparing simulated flow vs nominal capacity along segment distance.
 */
import { useState, type FC } from 'react';
import { AlertTriangle } from 'lucide-react';

interface SegmentFlowProfileChartProps {
  lengthM: number;
  nominalCapacityM3s: number;
  currentFlowM3s: number;
}

export const SegmentFlowProfileChart: FC<SegmentFlowProfileChartProps> = ({
  lengthM = 328,
  nominalCapacityM3s = 2.5,
  currentFlowM3s = 4.1,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'elevation'>('flow');

  const maxFlow = Math.max(currentFlowM3s * 1.25, nominalCapacityM3s * 1.5, 5.0);
  const capY = 140 - (nominalCapacityM3s / maxFlow) * 120;
  const flowPeakY = 140 - (currentFlowM3s / maxFlow) * 120;
  const flowStartY = 140 - ((currentFlowM3s * 0.45) / maxFlow) * 120;
  const flowEndY = 140 - ((currentFlowM3s * 0.5) / maxFlow) * 120;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface shadow-offset text-xs select-none">
      {/* Chart Tab Switcher & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'flow'
                ? 'bg-sage-300 text-ink font-bold shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-pink/40'
            }`}
          >
            Flow Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('elevation')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'elevation'
                ? 'bg-sage-300 text-ink font-bold shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-pink/40'
            }`}
          >
            Elevation Profile
          </button>
        </div>

        {activeTab === 'flow' && (
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-ink">
              <span className="w-3 h-0.5 bg-[#E0803A]" /> Simulated Flow
            </span>
            <span className="flex items-center gap-1.5 text-ink-muted">
              <span className="w-3 h-0.5 border-t border-dashed border-water" /> Nominal Capacity
            </span>
          </div>
        )}
      </div>

      {activeTab === 'flow' ? (
        <div className="relative w-full h-44">
          <svg
            viewBox="0 0 500 160"
            className="w-full h-full overflow-visible font-mono text-[10px]"
          >
            {/* Grid Lines */}
            <line x1="50" y1="20" x2="480" y2="20" stroke="currentColor" className="text-border/40" />
            <line x1="50" y1="80" x2="480" y2="80" stroke="currentColor" className="text-border/40" />
            <line x1="50" y1="140" x2="480" y2="140" stroke="currentColor" className="text-border" strokeWidth="1.5" />

            {/* Y Axis Labels */}
            <text x="40" y="24" textAnchor="end" className="fill-ink-muted">
              {maxFlow.toFixed(1)}
            </text>
            <text x="40" y="84" textAnchor="end" className="fill-ink-muted">
              {(maxFlow / 2).toFixed(1)}
            </text>
            <text x="40" y="144" textAnchor="end" className="fill-ink-muted">
              0.0
            </text>

            {/* Y Axis Title */}
            <text
              x="-80"
              y="14"
              transform="rotate(-90)"
              textAnchor="middle"
              className="fill-ink-muted text-[9px]"
            >
              Flow (m³/s)
            </text>

            {/* Nominal Capacity Horizontal Line (Dashed) */}
            <line
              x1="50"
              y1={capY}
              x2="480"
              y2={capY}
              stroke="#3A7F8F"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Flow Curve Shaded Area */}
            <path
              d={`M 50 140 L 50 ${flowStartY} C 180 ${flowPeakY * 0.9}, 240 ${flowPeakY}, 320 ${flowPeakY} C 380 ${flowPeakY * 1.1}, 440 ${flowEndY}, 480 ${flowEndY} L 480 140 Z`}
              fill="#E0803A"
              className="opacity-25"
            />

            {/* Simulated Flow Line */}
            <path
              d={`M 50 ${flowStartY} C 180 ${flowPeakY * 0.9}, 240 ${flowPeakY}, 320 ${flowPeakY} C 380 ${flowPeakY * 1.1}, 440 ${flowEndY}, 480 ${flowEndY}`}
              fill="none"
              stroke="#E0803A"
              strokeWidth="2.5"
            />

            {/* X Axis Ticks and Labels */}
            <line x1="50" y1="140" x2="50" y2="144" stroke="currentColor" className="text-border" />
            <line x1="190" y1="140" x2="190" y2="144" stroke="currentColor" className="text-border" />
            <line x1="330" y1="140" x2="330" y2="144" stroke="currentColor" className="text-border" />
            <line x1="480" y1="140" x2="480" y2="144" stroke="currentColor" className="text-border" />

            <text x="50" y="155" textAnchor="middle" className="fill-ink-muted">0</text>
            <text x="190" y="155" textAnchor="middle" className="fill-ink-muted">{Math.round(lengthM * 0.33)}</text>
            <text x="330" y="155" textAnchor="middle" className="fill-ink-muted">{Math.round(lengthM * 0.66)}</text>
            <text x="480" y="155" textAnchor="middle" className="fill-ink-muted">{Math.round(lengthM)}m</text>
          </svg>
        </div>
      ) : (
        /* Elevation Profile (Honest notice of lack of DEM) */
        <div className="h-44 flex flex-col items-center justify-center p-4 text-center text-xs text-ink-muted bg-background rounded-lg border border-border">
          <AlertTriangle className="w-5 h-5 text-amber mb-2" />
          <span className="font-bold text-ink mb-1">Digital Elevation Model Unavailable</span>
          <p className="max-w-md text-[11px] leading-relaxed">
            High-resolution DEM tiles are unverified for this catchment. A synthetic downward hydraulic slope of 0.8% is modeled along the road centerline right-of-way.
          </p>
        </div>
      )}
    </div>
  );
};
