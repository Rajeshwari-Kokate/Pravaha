/**
 * InterventionComparison: side-by-side baseline vs intervention metrics
 * with a per-conduit delta table showing flow ratio change.
 */
import { type FC } from 'react';
import { TrendingDown, TrendingUp, Minus, CheckCircle, XCircle } from 'lucide-react';
import { INTERVENTION_SCENARIOS } from '../../lib/bottleneck';
import type { InterventionId, ConduitDelta } from '../../hooks/useBottleneck';
import type { SimulationOutput } from '../../hooks/useSimulation';

interface Props {
  baselineResult:      SimulationOutput | null;
  interventionResult:  SimulationOutput | null;
  selectedIntervention: InterventionId;
  onSelectIntervention: (id: InterventionId) => void;
  deltas:              ConduitDelta[];
  isLoading:           boolean;
}

function Metric({ label, value, unit, highlight }: {
  label: string; value: string | number; unit?: string; highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-black font-mono tabular-nums ${
          highlight ? 'text-teal-600 dark:text-teal-400' : 'text-slate-800 dark:text-white'
        }`}>{value}</span>
        {unit && <span className="text-xs text-slate-400 font-mono">{unit}</span>}
      </div>
    </div>
  );
}

export const InterventionComparison: FC<Props> = ({
  baselineResult,
  interventionResult,
  selectedIntervention,
  onSelectIntervention,
  deltas,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500 animate-pulse font-mono">
        Calculating intervention impacts...
      </div>
    );
  }

  const totalConduits = baselineResult?.conduitResults.length ?? 0;
  const baseOverloaded = baselineResult?.summaryOverloaded ?? 0;
  const afterOverloaded = interventionResult?.summaryOverloaded ?? 0;
  const improvement = baseOverloaded - afterOverloaded;
  const improved = deltas.filter(d => d.improved).length;

  return (
    <div className="space-y-6">

      {/* Scenario Selector */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Intervention Scenario
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {INTERVENTION_SCENARIOS.map(s => (
            <button
              key={s.id}
              type="button"
              id={`intervention-${s.id}`}
              onClick={() => onSelectIntervention(s.id)}
              className={`text-left px-4 py-3 rounded-xl border transition-all
                ${selectedIntervention === s.id
                  ? 'border-2 shadow-sm bg-white dark:bg-slate-900'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 opacity-70 hover:opacity-100'
                }`}
              style={selectedIntervention === s.id ? { borderColor: s.color } : {}}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{s.label}</span>
                {selectedIntervention === s.id && (
                  <CheckCircle className="w-3.5 h-3.5 ml-auto" style={{ color: s.color }} />
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed pl-4">
                {s.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Comparison */}
      {baselineResult && interventionResult && (
        <div className="grid grid-cols-2 gap-4">
          {/* Baseline */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Baseline
            </span>
            <Metric label="Overloaded"  value={baseOverloaded}   unit={`/ ${totalConduits}`} />
            <Metric label="Max Flow"    value={`${baselineResult.summaryMaxFlowRatio.toFixed(2)}x`} />
            <Metric label="Peak Inflow" value={baselineResult.summaryTotalInflowM3s.toFixed(1)} unit="m3/s" />
          </div>

          {/* After intervention */}
          <div className="p-4 rounded-xl border-2 bg-white dark:bg-slate-900 space-y-4"
               style={{ borderColor: INTERVENTION_SCENARIOS.find(s => s.id === selectedIntervention)?.color ?? '#14b8a6' }}>
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold"
                  style={{ color: INTERVENTION_SCENARIOS.find(s => s.id === selectedIntervention)?.color }}>
              After Intervention
            </span>
            <Metric label="Overloaded"  value={afterOverloaded}  unit={`/ ${totalConduits}`} highlight />
            <Metric label="Max Flow"    value={`${interventionResult.summaryMaxFlowRatio.toFixed(2)}x`} highlight />
            <Metric label="Peak Inflow" value={interventionResult.summaryTotalInflowM3s.toFixed(1)} unit="m3/s" highlight />
          </div>
        </div>
      )}

      {/* Summary banner */}
      {improvement !== 0 && (
        <div className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-semibold
          ${improvement > 0
            ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
            : 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
          }`}>
          {improvement > 0
            ? <TrendingDown className="w-4 h-4 shrink-0" />
            : <TrendingUp   className="w-4 h-4 shrink-0" />
          }
          <span>
            {Math.abs(improvement)} conduit{Math.abs(improvement) !== 1 ? 's' : ''}{' '}
            {improvement > 0 ? 'removed from overload' : 'newly overloaded'} vs baseline.{' '}
            {improved} of {totalConduits} conduits show reduced flow ratio.
          </span>
        </div>
      )}
      {improvement === 0 && baselineResult && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-sm text-slate-500">
          <Minus className="w-4 h-4 shrink-0" />
          No change in overloaded conduit count for this scenario.
        </div>
      )}

      {/* Per-conduit delta table */}
      {deltas.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Per-Conduit Flow Ratio Change
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">Conduit</th>
                  <th className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">Type</th>
                  <th className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">Baseline</th>
                  <th className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">After</th>
                  <th className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">Delta</th>
                  <th className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">Change %</th>
                </tr>
              </thead>
              <tbody>
                {deltas.map(d => (
                  <tr key={d.conduitId}
                      className="border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
                    <td className="px-3 py-2 font-bold text-slate-800 dark:text-slate-200">{d.conduitId}</td>
                    <td className="px-3 py-2 text-slate-500">{d.channelType}</td>
                    <td className="px-3 py-2 tabular-nums text-slate-700 dark:text-slate-300">
                      {d.baselineFlow.toFixed(3)}x
                    </td>
                    <td className="px-3 py-2 tabular-nums text-slate-700 dark:text-slate-300">
                      {d.afterFlow.toFixed(3)}x
                    </td>
                    <td className={`px-3 py-2 tabular-nums font-bold flex items-center gap-1
                      ${d.deltaFlow < -0.001 ? 'text-emerald-600 dark:text-emerald-400'
                      : d.deltaFlow > 0.001  ? 'text-red-600 dark:text-red-400'
                      : 'text-slate-400'}`}>
                      {d.improved
                        ? <TrendingDown className="w-3 h-3 shrink-0" />
                        : d.deltaFlow > 0.001
                          ? <TrendingUp className="w-3 h-3 shrink-0" />
                          : <Minus className="w-3 h-3 shrink-0" />
                      }
                      {d.deltaFlow > 0 ? '+' : ''}{d.deltaFlow.toFixed(3)}x
                    </td>
                    <td className={`px-3 py-2 tabular-nums
                      ${d.deltaFlow < -0.001 ? 'text-emerald-600 dark:text-emerald-400'
                      : d.deltaFlow > 0.001  ? 'text-red-500 dark:text-red-400'
                      : 'text-slate-400'}`}>
                      {d.deltaRatio > 0 ? '+' : ''}{d.deltaRatio.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            Sorted by most improved first. Negative delta = capacity exceedance reduced.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
        <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Intervention outputs are deterministic model estimates only. No field survey or hydraulic design has been performed. Dataset: origin and licence unverified.
        </p>
      </div>
    </div>
  );
};
