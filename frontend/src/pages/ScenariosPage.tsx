import { type FC } from 'react';
import { AlertCircle } from 'lucide-react';
import { SimulationControls } from '../components/workspace/SimulationControls';
import { KpiCards } from '../components/workspace/KpiCards';
import { ConduitResultsTable } from '../components/workspace/ConduitResultsTable';
import { TimelineScrubber } from '../components/workspace/TimelineScrubber';
import { useSimulation } from '../hooks/useSimulation';

export const ScenariosPage: FC = () => {
  const sim = useSimulation();
  const totalConduits = sim.result?.conduitResults.length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Simulation Lab
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Scenario Laboratory
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Configure deterministic storm parameters, adjust conduit catchment properties,
          and evaluate real-time capacity exceedance metrics across the synthetic drainage graph.
        </p>
      </div>

      {/* KPI Cards (live) */}
      <KpiCards result={sim.result} isLoading={sim.isLoading} totalConduits={totalConduits} />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Controls column */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <SimulationControls
            currentReturnPeriod={sim.params.returnPeriodLabel}
            currentIntensity={sim.params.rainfallIntensityMmHr}
            currentRunoffCoeff={sim.params.globalRunoffCoeff}
            currentAreaHa={sim.params.globalAreaHa}
            isLoading={sim.isLoading}
            onSetReturnPeriod={sim.setReturnPeriod}
            onSetCustomIntensity={sim.setCustomIntensity}
            onSetRunoffCoeff={sim.setRunoffCoeff}
            onSetAreaHa={sim.setAreaHa}
          />
        </div>

        {/* Results column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Timeline */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Triangular Hyetograph Timeline
            </h2>
            <TimelineScrubber
              result={sim.result}
              activeStep={sim.activeStep}
              isPlaying={sim.isPlaying}
              onPlay={sim.play}
              onPause={sim.pause}
              onReset={sim.reset}
              onSeek={sim.seekStep}
            />
          </div>

          {/* Conduit table */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <ConduitResultsTable
              result={sim.result}
            />
          </div>

          {/* Baseline vs intervention note */}
          {sim.result && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                  Current Exceedance
                </span>
                <p className={`text-3xl font-black font-mono tabular-nums ${
                  sim.result.summaryOverloaded > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {sim.result.summaryOverloaded}
                  <span className="text-base font-semibold text-slate-400 ml-1">/ {totalConduits} conduits</span>
                </p>
                <p className="text-xs text-slate-500">
                  Peak flow ratio: <strong className="text-slate-800 dark:text-slate-200 font-mono">{sim.result.summaryMaxFlowRatio.toFixed(3)}x</strong>
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20 space-y-2">
                <span className="font-mono text-[11px] text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                  Intervention Estimate
                </span>
                <p className="text-3xl font-black font-mono tabular-nums text-teal-700 dark:text-teal-300">
                  {Math.max(0, sim.result.summaryOverloaded - Math.floor(sim.result.summaryOverloaded * 0.4))}
                  <span className="text-base font-semibold text-teal-400 ml-1">/ {totalConduits} conduits</span>
                </p>
                <p className="text-xs text-teal-600 dark:text-teal-400">
                  Estimated with 40% trunk desilting (deterministic model).
                </p>
              </div>
            </div>
          )}

          {/* Data notice */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/30 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              All outputs are calculated from the deterministic client-side Rational Method engine
              applied to a synthetic drainage graph (seed 42). Results are not field-measured.
              Dataset origin and licence: unverified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
