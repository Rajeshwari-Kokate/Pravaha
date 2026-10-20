/**
 * SegmentOverviewTable.tsx
 * Label-and-value attribute table for selected segment with provenance tag.
 */
import type { FC } from 'react';
import { Tag } from 'lucide-react';

interface SegmentOverviewTableProps {
  segmentId: string;
  channelType: string;
  lengthM: number;
  nominalCapacityM3s: number;
  currentFlowM3s: number;
  capacityUtilizationPct: number;
  fromNode: string;
  toNode: string;
  isOverloaded: boolean;
}

export const SegmentOverviewTable: FC<SegmentOverviewTableProps> = ({
  segmentId = 'D-104',
  channelType = 'Stormwater Drain',
  lengthM = 328,
  nominalCapacityM3s = 2.5,
  currentFlowM3s = 4.1,
  capacityUtilizationPct = 164,
  fromNode = 'N-23',
  toNode = 'N-24',
  isOverloaded = true,
}) => {
  const rows = [
    { label: 'Segment ID', value: segmentId, isMono: true, bold: true },
    { label: 'Type', value: channelType, capitalize: true },
    { label: 'Length', value: `${lengthM} m`, isMono: true },
    { label: 'Nominal Capacity', value: `${nominalCapacityM3s.toFixed(1)} m³/s`, isMono: true },
    { label: 'Current Flow (Simulated)', value: `${currentFlowM3s.toFixed(1)} m³/s`, isMono: true },
    {
      label: 'Capacity Utilization',
      value: `${capacityUtilizationPct}%`,
      isMono: true,
      highlight: capacityUtilizationPct >= 100 ? 'text-critical font-bold' : 'text-sage-700 font-bold',
    },
    { label: 'Connected Nodes', value: `${fromNode} → ${toNode}`, isMono: true },
    {
      label: 'Status',
      value: isOverloaded ? 'Over capacity' : 'Conveying within limits',
      badge: isOverloaded
        ? 'bg-critical/15 text-critical border border-critical/40'
        : 'bg-sage-300/40 text-sage-900 dark:text-cream border border-sage-500/40',
    },
    {
      label: 'Provenance',
      value: 'Synthetic',
      badge: 'bg-amber/15 text-amber border border-amber/40',
      note: 'Road centerline alignment, seed 42',
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface shadow-offset overflow-hidden text-xs select-none">
      <div className="px-4 py-2.5 border-b border-border bg-background flex items-center justify-between">
        <span className="font-display font-bold text-ink">Segment Attributes</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-ink-muted">
          <Tag className="w-3 h-3 text-sage-700" /> Hydraulic Specification
        </span>
      </div>

      <div className="divide-y divide-border/60">
        {rows.map((row, i) => (
          <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-4 hover:bg-pink/20 transition-colors">
            <span className="text-ink-muted font-medium shrink-0">{row.label}</span>
            <div className="flex items-center gap-2 text-right">
              {row.badge ? (
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${row.badge}`}>
                  {row.value}
                </span>
              ) : (
                <span
                  className={`${row.isMono ? 'font-mono' : ''} ${row.bold ? 'font-bold' : ''} ${
                    row.highlight || 'text-ink'
                  }`}
                >
                  {row.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
