import { type FC } from 'react';
import { Sliders, Play, AlertCircle } from 'lucide-react';

export const ScenariosPage: FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Simulation Lab
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Scenario Laboratory
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Configure deterministic storm parameters, adjust conduit blockage factors, and evaluate baseline versus intervention metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="p-6 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <Sliders className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Rainfall & Drainage Parameters</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rainfall Intensity (mm/h)
              </label>
              <input
                type="range"
                min="10"
                max="150"
                defaultValue="65"
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-slate-500 font-mono text-[10px] mt-1">
                <span>10 mm/h (Light)</span>
                <span className="font-bold text-teal-600">65 mm/h (Monsoon Downpour)</span>
                <span>150 mm/h (Extreme)</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Storm Duration (Hours)
              </label>
              <input
                type="range"
                min="0.5"
                max="6"
                step="0.5"
                defaultValue="2"
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-slate-500 font-mono text-[10px] mt-1">
                <span>30 min</span>
                <span className="font-bold text-teal-600">2.0 Hours</span>
                <span>6 Hours</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Antecedent Soil Saturation (Runoff Multiplier)
              </label>
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.05"
                defaultValue="0.75"
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-slate-500 font-mono text-[10px] mt-1">
                <span>Dry Ground (0.4)</span>
                <span className="font-bold text-teal-600">Saturated (0.75)</span>
                <span>Impervious (1.0)</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-md bg-teal-600 hover:bg-teal-700 text-white transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Execute Scenario Simulation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Comparison */}
        <div className="lg:col-span-2 p-6 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Baseline vs. Intervention Comparison</h2>
            <span className="font-mono text-xs text-slate-500">Deterministic Outputs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2">
              <span className="font-mono text-[11px] text-slate-500 uppercase">Baseline Exceedance</span>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">28 Segments</p>
              <p className="text-xs text-slate-500">Peak flow exceeds nominal capacity by 1.4x</p>
            </div>

            <div className="p-4 rounded-md border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20 space-y-2">
              <span className="font-mono text-[11px] text-teal-700 dark:text-teal-400 uppercase">Intervention Modeled</span>
              <p className="text-2xl font-bold font-mono text-teal-700 dark:text-teal-300">11 Segments</p>
              <p className="text-xs text-teal-600 dark:text-teal-400">Removing 40% trunk blockage restores capacity</p>
            </div>
          </div>

          <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/30 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              Notice: All differences represent calculated outcomes from deterministic network graph routing. Metrics do not fabricate synthetic improvement percentages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
