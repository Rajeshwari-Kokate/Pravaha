/**
 * KpiCards: animated KPI summary cards for simulation results.
 * Shows overloaded conduit count, max flow ratio, and total inflow.
 */
import { type FC, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Gauge, Droplets, TrendingUp } from 'lucide-react';
import type { SimulationOutput } from '../../hooks/useSimulation';

interface KpiCardsProps {
  result:     SimulationOutput | null;
  isLoading:  boolean;
  totalConduits: number;
}

function useAnimatedNumber(target: number, duration = 600): number {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const startVal = useRef(0);
  const rafRef   = useRef<number | null>(null);

  useEffect(() => {
    startVal.current = value;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    function tick(ts: number) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(startVal.current + (target - startVal.current) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  return value;
}

function severityColor(ratio: number): string {
  if (ratio < 0.75) return 'text-emerald-600 dark:text-emerald-400';
  if (ratio < 1.0)  return 'text-amber-600  dark:text-amber-400';
  if (ratio < 1.5)  return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

export const KpiCards: FC<KpiCardsProps> = ({ result, isLoading, totalConduits }) => {
  const overloaded  = result?.summaryOverloaded ?? 0;
  const maxFr       = result?.summaryMaxFlowRatio ?? 0;
  const totalQ      = result?.summaryTotalInflowM3s ?? 0;
  const intensity   = result?.rainfallIntensityMmHr ?? 0;

  const animOverloaded = useAnimatedNumber(overloaded);
  const animMaxFr      = useAnimatedNumber(maxFr * 100) / 100;
  const animTotalQ     = useAnimatedNumber(totalQ);
  const animIntensity  = useAnimatedNumber(intensity);

  const skeleton = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-7 w-20';

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">

      {/* Overloaded conduits */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800
                      bg-white dark:bg-slate-900 flex flex-col gap-1.5 group
                      hover:border-red-300 dark:hover:border-red-800 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Overloaded Conduits
          </span>
          <AlertTriangle className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
        </div>
        {isLoading
          ? <div className={skeleton} />
          : (
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-black font-mono tabular-nums ${overloaded > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {Math.round(animOverloaded)}
              </span>
              <span className="text-xs text-slate-400 font-mono">of {totalConduits}</span>
            </div>
          )
        }
        {!isLoading && (
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${overloaded > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${totalConduits > 0 ? (overloaded / totalConduits) * 100 : 0}%` }}
            />
          </div>
        )}
      </div>

      {/* Max flow ratio */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800
                      bg-white dark:bg-slate-900 flex flex-col gap-1.5 group
                      hover:border-amber-300 dark:hover:border-amber-800 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Peak Flow Ratio
          </span>
          <Gauge className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
        </div>
        {isLoading
          ? <div className={skeleton} />
          : (
            <span className={`text-3xl font-black font-mono tabular-nums ${severityColor(maxFr)}`}>
              {animMaxFr.toFixed(2)}<span className="text-base font-semibold">x</span>
            </span>
          )
        }
        <span className="text-[10px] text-slate-400">inflow / effective capacity</span>
      </div>

      {/* Total inflow */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800
                      bg-white dark:bg-slate-900 flex flex-col gap-1.5 group
                      hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Total Network Inflow
          </span>
          <Droplets className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
        </div>
        {isLoading
          ? <div className={skeleton} />
          : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-mono tabular-nums text-blue-600 dark:text-blue-400">
                {animTotalQ.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-mono">m3/s</span>
            </div>
          )
        }
        <span className="text-[10px] text-slate-400">peak storm inflow (rational method)</span>
      </div>

      {/* Rainfall intensity */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800
                      bg-white dark:bg-slate-900 flex flex-col gap-1.5 group
                      hover:border-teal-300 dark:hover:border-teal-800 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Storm Intensity
          </span>
          <TrendingUp className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
        </div>
        {isLoading
          ? <div className={skeleton} />
          : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-mono tabular-nums text-teal-600 dark:text-teal-400">
                {Math.round(animIntensity)}
              </span>
              <span className="text-xs text-slate-400 font-mono">mm/hr</span>
            </div>
          )
        }
        <span className="text-[10px] text-slate-400 font-mono">
          {result?.returnPeriodLabel ?? '--'} return period
        </span>
      </div>

    </div>
  );
};
