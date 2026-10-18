import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, BookOpen, Sliders, ShieldAlert, Cpu, Activity } from 'lucide-react';

export const LandingPage: FC = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left pt-6 sm:pt-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-teal-500/30 bg-teal-500/10 text-teal-800 dark:text-teal-300 font-mono text-[11px] font-semibold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Deterministic Urban Flood Screening</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Investigate urban flooding before the next storm.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            PRAVAHA models rainfall scenarios, drainage constraints, and potentially affected infrastructure to support urban flood investigation.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/workspace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Open flood workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/methodology"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-sm transition-colors"
            >
              <BookOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Explore the methodology</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Interactive Map Placeholder (Detailed interactive map cord implemented in Phase 9) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">
                Demonstration Study Area
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Koramangala Catchment Demonstration Network
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              <span>Synthetic Drainage Model (Seed 42)</span>
            </div>
          </div>
          <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
            Interactive demonstration network preview with rain cord simulator loads in workspace and educational views.
          </div>
        </div>
      </section>

      {/* Three Workflow Cards: Rolling container in Phase 9 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Engineering Workflow
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Systematic Drainage Investigation Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-10 h-10 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Sliders className="w-5 h-5" />
            </div>
            <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">
              Step 01
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Configure Scenario</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Define design rainfall intensity (mm/h), storm hyetograph distribution, antecedent moisture conditions, and conduit obstruction factors across the urban network.
            </p>
          </div>

          <div className="p-6 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-10 h-10 rounded-md bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="font-mono text-[11px] text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-wider">
              Step 02
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Run Simulation</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Execute deterministic topological flow routing via the Rational Method. Step through simulated time horizons to examine progressive conduit exceedance and hotspot emergence.
            </p>
          </div>

          <div className="p-6 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-10 h-10 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
              Step 03
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Investigate & Compare</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Identify candidate bottlenecks, inspect affected road corridors and civic assets, test remediation interventions, and formulate evidence-grounded technical reports.
            </p>
          </div>
        </div>
      </section>

      {/* Limitations and Integrity Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h2>Methodological Scope and Technical Limitations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              PRAVAHA performs simplified deterministic hydrological screening using the Rational Method and topological graph conveyance. It is intended for early-stage bottleneck investigation and scenario comparison. It does not replace 2D hydrodynamic simulation (such as SWMM or TELEMAC), continuous soil moisture accounting, or real-time sensor telemetry.
            </p>
            <p>
              In the absence of publicly available municipal GIS stormwater records, the demonstration drainage network is generated synthetically from road centerlines and topographical low points. Modeled accumulation points denote relative ponding susceptibility rather than calibrated water depths.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
