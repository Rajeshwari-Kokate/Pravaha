/**
 * BottleneckRankingPanel: ranked list of conduits with composite score bars
 * and adjustable factor weight sliders.
 */
import { type FC } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import type { BottleneckRecord, FactorWeights } from '../../hooks/useBottleneck';

interface Props {
  rankings:       BottleneckRecord[];
  weights:        FactorWeights;
  onSetWeight:    (key: keyof FactorWeights, value: number) => void;
  isLoading:      boolean;
  onSelectConduit?: (id: string) => void;
  selectedId?:    string;
}

const FACTOR_META: { key: keyof FactorWeights; label: string; hint: string; color: string }[] = [
  { key: 'flow',       label: 'Flow Overload',        hint: 'How much inflow exceeds effective capacity',     color: '#ef4444' },
  { key: 'blockage',   label: 'Blockage Factor',       hint: 'Debris / siltation reducing carrying capacity', color: '#f97316' },
  { key: 'downstream', label: 'Downstream Impact',     hint: 'Conduits affected if this one fails',           color: '#a855f7' },
  { key: 'channel',    label: 'Channel Class',         hint: 'Trunk >> primary >> secondary >> tertiary',     color: '#3b82f6' },
  { key: 'slope',      label: 'Low-Slope Penalty',     hint: 'Flatter gradients drain more slowly',           color: '#14b8a6' },
];

const SEV_COLORS: Record<string, string> = {
  critical: 'text-red-600 dark:text-red-400',
  high:     'text-orange-500 dark:text-orange-400',
  moderate: 'text-amber-500 dark:text-amber-400',
  low:      'text-emerald-600 dark:text-emerald-400',
};

export const BottleneckRankingPanel: FC<Props> = ({
  rankings, weights, onSetWeight, isLoading, onSelectConduit, selectedId,
}) => {
  return (
    <div className="flex flex-col gap-6">

      {/* Factor Weight Sliders */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Info className="w-4 h-4 text-teal-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Factor Weights
          </h3>
          <span className="ml-auto text-[10px] font-mono text-slate-400">drag to adjust priority</span>
        </div>

        {FACTOR_META.map(({ key, label, hint, color }) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <label htmlFor={`w-${key}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {label}
                </label>
              </div>
              <span className="text-xs font-black font-mono tabular-nums" style={{ color }}>
                {weights[key]}
              </span>
            </div>
            <input
              id={`w-${key}`}
              type="range"
              min="0"
              max="10"
              step="1"
              value={weights[key]}
              onChange={e => onSetWeight(key, Number(e.target.value))}
              className="w-full h-1.5 rounded-full cursor-pointer"
              style={{ accentColor: color }}
            />
            <p className="text-[10px] text-slate-400 font-mono">{hint}</p>
          </div>
        ))}
      </div>

      {/* Rankings list */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          Bottleneck Rankings
          {!isLoading && (
            <span className="ml-auto text-[10px] font-mono text-slate-400">
              {rankings.length} conduits scored
            </span>
          )}
        </h3>

        {isLoading && (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && rankings.map(r => {
          const isSelected = r.conduitId === selectedId;
          const pct = Math.round(r.score * 100);

          return (
            <button
              key={r.conduitId}
              type="button"
              id={`bottleneck-${r.conduitId}`}
              onClick={() => onSelectConduit?.(r.conduitId)}
              aria-pressed={isSelected}
              className={`w-full text-left p-3 rounded-xl border transition-all group
                ${isSelected
                  ? 'border-teal-400 dark:border-teal-600 bg-teal-50 dark:bg-teal-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
            >
              {/* Rank + ID row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black font-mono w-5 text-center rounded
                    ${r.rank <= 3 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                    #{r.rank}
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                    {r.conduitId}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">({r.channelType})</span>
                </div>
                <span className={`text-xs font-bold ${SEV_COLORS[r.severity] ?? ''}`}>
                  {r.severity}
                </span>
              </div>

              {/* Composite score bar */}
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-1.5">
                {/* Stacked factor contribution bars */}
                <div className="h-full flex">
                  {FACTOR_META.map(({ key, color }) => {
                    const factorScore = r[`${key}Score` as keyof BottleneckRecord] as number;
                    const w = weights[key];
                    const totalW = Object.values(weights).reduce((s, v) => s + v, 0) || 1;
                    const barWidth = (factorScore * w / totalW) * 100;
                    return (
                      <div
                        key={key}
                        className="h-full transition-all duration-500"
                        style={{ width: `${barWidth}%`, backgroundColor: color, opacity: 0.85 }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Score + raw values */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Score: <strong className="text-slate-700 dark:text-slate-300">{pct}%</strong></span>
                <span>Flow: <strong className="text-slate-700 dark:text-slate-300">{r.flowRatio.toFixed(2)}x</strong></span>
                <span>Blockage: <strong className="text-slate-700 dark:text-slate-300">{(r.blockageFactor * 100).toFixed(0)}%</strong></span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
