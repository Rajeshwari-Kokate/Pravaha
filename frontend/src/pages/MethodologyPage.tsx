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
        <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tabular Susceptibility Model Profile
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Origin and Licence Unverified
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            A supervised classifier is trained on held-out tabular splits (80/20 train/test) to evaluate statistical associations with recorded historical flood flags. Detailed classification metrics (ROC AUC, Precision, Recall, F1, Confusion Matrix) are computed from real held-out data in Phase 7.
          </p>
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
