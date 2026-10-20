/**
 * BottleneckRankingCard.tsx
 * Displays the composite bottleneck risk scoring factors, dynamic weights,
 * and ranked candidate bottlenecks.
 */
import type { FC } from 'react';
import { Sliders } from 'lucide-react';
import type { BottleneckRecord, FactorWeights } from '../../lib/bottleneck';

interface BottleneckRankingCardProps {
  weights: FactorWeights;
  onWeightChange: (key: keyof FactorWeights, val: number) => void;
  rankedBottlenecks: BottleneckRecord[];
  selectedId?: string;
  onSelectId: (id: string) => void;
}

export const BottleneckRankingCard: FC<BottleneckRankingCardProps> = ({
  weights,
  onWeightChange,
  rankedBottlenecks,
  selectedId,
  onSelectId,
}) => {
  const factors: { key: keyof FactorWeights; label: string; desc: string }[] = [
    { key: 'flow', label: 'Flow Exceedance', desc: 'Ratio of simulated inflow to effective capacity' },
    { key: 'blockage', label: 'Blockage Surcharge', desc: 'Physical siltation and inlet debris factor' },
    { key: 'downstream', label: 'Downstream Risk', desc: 'Number of connected downstream beneficiaries' },
    { key: 'channel', label: 'Hierarchy Weight', desc: 'Trunk main collectors vs tertiary collectors' },
    { key: 'slope', label: 'Hydraulic Incline', desc: 'Gravity conveyance slope penalty' },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-surface shadow-offset text-xs select-none">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sage-700" />
          <h3 className="font-display font-bold text-ink text-sm">Bottleneck Scoring Model</h3>
        </div>
        <span className="text-[10px] font-mono text-ink-muted">Linear Multi-Criteria Weights</span>
      </div>

      {/* Weight sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg border border-border bg-background">
        {factors.map(f => (
          <div key={f.key} className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-ink">{f.label}</span>
              <span className="font-mono text-sage-700 font-bold">{weights[f.key]}x</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={weights[f.key]}
              onChange={e => onWeightChange(f.key, Number(e.target.value))}
              className="accent-sage-500 cursor-pointer w-full"
            />
          </div>
        ))}
      </div>

      {/* Ranked Bottlenecks Table */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
          Candidate Bottleneck Rankings
        </span>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-background text-ink-muted font-mono text-[10px] uppercase border-b border-border">
              <tr>
                <th className="p-2">Rank</th>
                <th className="p-2">Conduit</th>
                <th className="p-2">Channel</th>
                <th className="p-2">Score</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rankedBottlenecks.slice(0, 5).map(b => (
                <tr
                  key={b.conduitId}
                  onClick={() => onSelectId(b.conduitId)}
                  className={`cursor-pointer transition-colors ${
                    selectedId === b.conduitId ? 'bg-pink/50' : 'hover:bg-cream dark:hover:bg-background/80'
                  }`}
                >
                  <td className="p-2 font-mono font-bold text-ink">#{b.rank}</td>
                  <td className="p-2 font-mono font-bold text-sage-700">{b.conduitId}</td>
                  <td className="p-2 text-ink-muted capitalize">{b.channelType}</td>
                  <td className="p-2 font-mono font-bold text-ink">{b.score.toFixed(1)}</td>
                  <td className="p-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber/15 text-amber border border-amber/40">
                      Bottleneck
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
