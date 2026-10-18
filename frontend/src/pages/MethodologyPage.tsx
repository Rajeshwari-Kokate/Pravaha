import { type FC } from 'react';
import { ShieldAlert, Layers, GitBranch, Database } from 'lucide-react';

export const MethodologyPage: FC = () => {
  const buildDate = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '2026-10-18';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Technical Specification
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Hydrological & Drainage Methodology
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          Detailed mathematical formulations, spatial algorithms, dataset card, and modeling constraints underpinning PRAVAHA.
        </p>
        <p className="text-[11px] font-mono text-slate-400 mt-1">Last updated: {buildDate}</p>
      </div>

      {/* Section 1: Hydrological Formulations */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Runoff Generation: The Rational Method
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Urban runoff peak flow is calculated per contributing node catchment using the Rational Method formulation:
        </p>
        <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200">
          Q = (C * I * A) / (3.6 * 10^6)
        </div>
        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc pl-5">
          <li><strong>Q</strong>: Peak runoff rate (cubic meters per second, m³/s).</li>
          <li><strong>C</strong>: Composite runoff coefficient (0.85 for paved urban surfaces; 0.25 for open vegetative land).</li>
          <li><strong>I</strong>: Uniform rainfall intensity in millimeters per hour (mm/h).</li>
          <li><strong>A</strong>: Contributing subcatchment surface area in square meters (m²).</li>
        </ul>
      </section>

      {/* Section 2: Flow Conveyance */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <GitBranch className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Topological Network Conveyance & Exceedance
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Drainage segments are represented as edges in a directed NetworkX graph. Runoff is routed downstream topologically:
        </p>
        <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200">
          Q_effective = Q_nominal * (1 - BlockageFactor)
          <br />
          ExceedanceRatio = Demand / Q_effective
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          When Demand exceeds Q_effective (ExceedanceRatio &gt; 1.0), the segment is flagged as exceeding modeled capacity, and relative accumulation indicators are mapped to adjacent spatial nodes.
        </p>
      </section>

      {/* Section 3: Dataset and Model Card */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Dataset & Model Card (flood_risk_dataset_india.csv)
          </h2>
        </div>
        <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white block">
                Supervised Susceptibility Model Evaluation Card
              </span>
              <span className="text-xs text-slate-500">
                Trained on 10,000 tabular observations with 80/20 stratified train/test split.
              </span>
            </div>
            <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 self-start sm:self-auto">
              Origin and Licence Unverified
            </span>
          </div>

          {/* Performance Benchmark Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 uppercase block">Logistic Reg. ROC AUC</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">0.4982</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Chance level (~0.50)</span>
            </div>
            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 uppercase block">GBDT ROC AUC</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">0.4921</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Non-linear trees</span>
            </div>
            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 uppercase block">Held-Out Test Set</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">2,000</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Stratified evaluation</span>
            </div>
            <div className="p-3 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 uppercase block">Target Class Balance</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">50.6%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">5,057 vs 4,943</span>
            </div>
          </div>

          {/* Confusion Matrix Table */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Held-Out Confusion Matrix (Logistic Regression, 20% split)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border border-slate-200 dark:border-slate-700 font-mono">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <th className="p-2 border border-slate-200 dark:border-slate-700 text-left font-sans">Ground Truth \ Predicted</th>
                    <th className="p-2 border border-slate-200 dark:border-slate-700">Predicted No Flood (0)</th>
                    <th className="p-2 border border-slate-200 dark:border-slate-700">Predicted Flood (1)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 text-left font-semibold">Actual No Flood (0)</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">540 (TN)</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 bg-rose-500/10 text-rose-700 dark:text-rose-400">449 (FP)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 text-left font-semibold">Actual Flood (1)</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 bg-rose-500/10 text-rose-700 dark:text-rose-400">555 (FN)</td>
                    <td className="p-2 border border-slate-200 dark:border-slate-700 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">456 (TP)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Synthetic Indicators & Scientific Caveats */}
          <div className="p-3.5 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs space-y-2 text-slate-700 dark:text-slate-300">
            <span className="font-bold text-amber-800 dark:text-amber-400 block">
              Methodological Findings & Caveats
            </span>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              <li>
                <strong>Synthetic distribution characteristics:</strong> The dataset exhibits near-uniform distributions across environmental continuous variables (e.g. Rainfall mean 150.0mm ±86.5) and equal proportions across categorical soil/land-cover types.
              </li>
              <li>
                <strong>Absence of physical correlation:</strong> Both linear and tree-based ensembles confirm near-zero correlation between input features and target labels (ROC AUC = ~0.49-0.50).
              </li>
              <li>
                <strong>Operational boundaries:</strong> Machine learning scores derived from this file are intended solely for sensitivity exploration and transparency demonstrations, not physical risk delineation. Engineering calculations in PRAVAHA utilize deterministic hydraulic formulas.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Limitations Notice */}
      <section className="p-6 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <h3>Engineering Constraints and Model Limitations</h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          PRAVAHA is designed strictly for screening and technical investigation. It does not model pressurized pipe dynamics, backwater surface profiles, pump station operations, or uncalibrated physical water depths.
        </p>
      </section>
    </div>
  );
};
