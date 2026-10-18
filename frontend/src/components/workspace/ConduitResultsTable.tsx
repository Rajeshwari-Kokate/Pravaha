/**
 * ConduitResultsTable: sortable table of per-conduit simulation results
 * with severity color badges and CSV export button.
 */
import { type FC, useState, useMemo, useCallback } from 'react';
import { Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { exportConduitsCsv } from '../../lib/simulation';
import type { SimulationOutput } from '../../hooks/useSimulation';

interface Props {
  result:       SimulationOutput | null;
  onSelectId?:  (id: string) => void;
  selectedId?:  string;
}

type SortKey = 'conduitId' | 'channelType' | 'flowRatio' | 'inflowM3s' | 'effectiveCapacityM3s';
type SortDir = 'asc' | 'desc';

const SEVERITY_STYLES: Record<string, string> = {
  low:      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
  moderate: 'bg-amber-100   text-amber-800   dark:bg-amber-950/60   dark:text-amber-300',
  high:     'bg-orange-100  text-orange-800  dark:bg-orange-950/60  dark:text-orange-300',
  critical: 'bg-red-100     text-red-800     dark:bg-red-950/60     dark:text-red-300',
};

export const ConduitResultsTable: FC<Props> = ({ result, onSelectId, selectedId }) => {
  const [sortKey, setSortKey] = useState<SortKey>('flowRatio');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = useCallback((key: SortKey) => {
    setSortKey(prev => {
      if (prev === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
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

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-slate-400" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 text-teal-500" />
      : <ArrowDown className="w-3 h-3 text-teal-500" />;
  }

  const thCls = "text-left text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-2 whitespace-nowrap cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 select-none";
  const tdCls = "px-3 py-2 text-xs font-mono whitespace-nowrap";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Conduit Flow Results
          </h3>
          {result && (
            <p className="text-[11px] text-slate-500 mt-0.5">
              {result.summaryOverloaded} of {result.conduitResults.length} conduits overloaded
              at {result.rainfallIntensityMmHr} mm/hr peak intensity
            </p>
          )}
        </div>
        {result && (
          <button
            type="button"
            id="export-conduits-csv"
            onClick={() => exportConduitsCsv(result.conduitResults, result.scenarioName)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       border border-slate-300 dark:border-slate-700
                       text-xs font-semibold text-slate-700 dark:text-slate-300
                       hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className={thCls} onClick={() => handleSort('conduitId')}>
                <div className="flex items-center gap-1">ID <SortIcon col="conduitId" /></div>
              </th>
              <th className={thCls} onClick={() => handleSort('channelType')}>
                <div className="flex items-center gap-1">Type <SortIcon col="channelType" /></div>
              </th>
              <th className={thCls} onClick={() => handleSort('effectiveCapacityM3s')}>
                <div className="flex items-center gap-1">Eff. Cap. <SortIcon col="effectiveCapacityM3s" /></div>
              </th>
              <th className={thCls} onClick={() => handleSort('inflowM3s')}>
                <div className="flex items-center gap-1">Inflow <SortIcon col="inflowM3s" /></div>
              </th>
              <th className={thCls} onClick={() => handleSort('flowRatio')}>
                <div className="flex items-center gap-1">Flow Ratio <SortIcon col="flowRatio" /></div>
              </th>
              <th className={thCls}>Severity</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-xs text-slate-400 font-mono animate-pulse">
                  Awaiting simulation results...
                </td>
              </tr>
            )}
            {sorted.map(cr => {
              const isSelected = cr.conduitId === selectedId;
              return (
                <tr
                  key={cr.conduitId}
                  onClick={() => onSelectId?.(cr.conduitId)}
                  className={`border-t border-slate-100 dark:border-slate-800 transition-colors
                    ${onSelectId ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40' : ''}
                    ${isSelected ? 'bg-teal-50 dark:bg-teal-950/20' : ''}
                    ${cr.isOverloaded ? 'text-red-700 dark:text-red-300' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <td className={`${tdCls} font-semibold`}>{cr.conduitId}</td>
                  <td className={tdCls}>{cr.channelType}</td>
                  <td className={tdCls}>{cr.effectiveCapacityM3s.toFixed(2)} m3/s</td>
                  <td className={`${tdCls} font-bold`}>{cr.inflowM3s.toFixed(3)} m3/s</td>
                  <td className={`${tdCls} font-black`}>{cr.flowRatio.toFixed(3)}x</td>
                  <td className={tdCls}>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${SEVERITY_STYLES[cr.severity]}`}>
                      {cr.severity}
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
