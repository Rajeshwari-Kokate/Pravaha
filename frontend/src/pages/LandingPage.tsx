import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, BookOpen, Activity, ShieldAlert } from 'lucide-react';
import { RainCordHero } from '../components/home/RainCordHero';
import { WorkflowRollingCards } from '../components/home/WorkflowRollingCards';
import { FaqSection } from '../components/home/FaqSection';

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

      {/* Interactive Rain Cord Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RainCordHero />
      </section>

      {/* Three Workflow Cards with Rolling Snap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WorkflowRollingCards />
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FaqSection />
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
