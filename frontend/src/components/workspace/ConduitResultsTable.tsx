/**
 * ConduitResultsTable: sortable table of per-conduit simulation results
 * with severity badges and CSV export button.
 */
import { type FC, useState, useMemo, useCallback } from 'react';
import { Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { exportConduitsCsv } from '../../lib/simulation';
import type { SimulationOutput } from '../../hooks/useSimulation';
import { EmptyState } from '../common/EmptyState';

interface Props {
  result: SimulationOutput | null;
  onSelectId?: (id: string) => void;
  selectedId?: string;
}

type SortKey = 'conduitId' | 'channelType' | 'flowRatio' | 'inflowM3s' | 'effectiveCapacityM3s';
type SortDir = 'asc' | 'desc';

const SEVERITY_STYLES: Record<string, string> = {
  low: 'bg-sage-300/40 text-sage-900 dark:text-cream border border-sage-500/40',
  moderate: 'bg-[#E8C468]/30 text-ink border border-[#E8C468]/60',
  high: 'bg-[#E0803A]/30 text-ink border border-[#E0803A]/60',
  critical: 'bg-critical/20 text-critical border border-critical/50 font-bold',
};

export const ConduitResultsTable: FC<Props> = ({ result, onSelectId, selectedId }) => {
  const [sortKey, setSortKey] = useState<SortKey>('flowRatio');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = useCallback((key: SortKey) => {
    setSortKey(prev => {
      if (prev === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
      else setSortDir('desc');
      return key;
    });
  }, []);

  const sorted = useMemo(() => {
    if (!result) return [];
    return [...result.conduitResults].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'string' ? av.localeCompare(String(bv)) : (av as number) - (bv as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [result, sortKey, sortDir]);

  if (!result || sorted.length === 0) {
    return (
      <EmptyState
        type="pipe"
        title="No conduit results yet"
        description="Select a design storm in Simulation Controls and click Run Simulation to compute capacity utilization."
      />
    );
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-ink-muted" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-sage-700" />
    ) : (
      <ArrowDown className="w-3 h-3 text-sage-700" />
    );
  }

  const thCls =
    'text-left text-[10px] font-mono uppercase tracking-wider text-ink-muted px-3 py-2 whitespace-nowrap cursor-pointer hover:text-ink select-none';
  const tdCls = 'px-3 py-2 text-xs font-mono whitespace-nowrap';

  return (
    <div className="flex flex-col gap-3 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold font-display text-ink">Conduit Flow Results</h3>
          {result && (
            <p className="text-[11px] text-ink-muted mt-0.5">
              {result.summaryOverloaded} of {result.conduitResults.length} conduits overloaded at{' '}
              {result.rainfallIntensityMmHr} mm/hr peak intensity
            </p>
          )}
        </div>
        {result && (
          <button
            type="button"
            id="export-conduits-csv"
            onClick={() => exportConduitsCsv(result.conduitResults, result.scenarioName)}
            className="btn-secondary px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full border-collapse text-left">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className={thCls} onClick={() => handleSort('conduitId')}>
                <div className="flex items-center gap-1">
                  ID <SortIcon col="conduitId" />
                </div>
              </th>
              <th className={thCls} onClick={() => handleSort('channelType')}>
                <div className="flex items-center gap-1">
                  Type <SortIcon col="channelType" />
                </div>
              </th>
              <th className={thCls} onClick={() => handleSort('effectiveCapacityM3s')}>
                <div className="flex items-center gap-1">
                  Eff. Cap. <SortIcon col="effectiveCapacityM3s" />
                </div>
              </th>
              <th className={thCls} onClick={() => handleSort('inflowM3s')}>
                <div className="flex items-center gap-1">
                  Sim. Inflow <SortIcon col="inflowM3s" />
                </div>
              </th>
              <th className={thCls} onClick={() => handleSort('flowRatio')}>
                <div className="flex items-center gap-1">
                  Utilization <SortIcon col="flowRatio" />
                </div>
              </th>
              <th className="text-left text-[10px] font-mono uppercase tracking-wider text-ink-muted px-3 py-2 whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {sorted.map(c => {
              const isSelected = selectedId === c.conduitId;
              const ratioPct = Math.round(c.flowRatio * 100);
              return (
                <tr
                  key={c.conduitId}
                  onClick={() => onSelectId?.(c.conduitId)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-pink/50' : 'hover:bg-cream dark:hover:bg-background/80'
                  }`}
                >
                  <td className={`${tdCls} font-bold text-ink`}>{c.conduitId}</td>
                  <td className={`${tdCls} text-ink-muted uppercase`}>{c.channelType}</td>
                  <td className={tdCls}>{c.effectiveCapacityM3s.toFixed(2)} m³/s</td>
                  <td className={tdCls}>{c.inflowM3s.toFixed(2)} m³/s</td>
                  <td className={`${tdCls} font-bold ${c.isOverloaded ? 'text-critical' : 'text-ink'}`}>
                    {ratioPct}%
                  </td>
                  <td className={tdCls}>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${SEVERITY_STYLES[c.severity] || ''}`}>
                      {c.severity}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
