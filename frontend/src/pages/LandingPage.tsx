import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, BookOpen, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { LandingHeroMap } from '../components/home/LandingHeroMap';
import { WorkflowRollingCards } from '../components/home/WorkflowRollingCards';
import { FaqSection } from '../components/home/FaqSection';

export const LandingPage: FC = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section with REAL Interactive MapLibre Map on the right half */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border border-[#24302A] bg-[#F6E2E9] text-[#24302A] font-mono text-[11px] font-bold uppercase tracking-wider shadow-[1px_1px_0px_#24302A]">
              <Activity className="w-3.5 h-3.5 text-[#24302A]" />
              <span>Deterministic Urban Flood Screening</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight text-[#24302A] dark:text-[#FEFAF3] leading-[1.12]">
              Investigate urban flooding before the next storm.
            </h1>

            <p className="text-sm sm:text-base text-[#55655B] dark:text-[#B9C7BD] leading-relaxed">
              PRAVAHA models rainfall scenarios, drainage constraints, and potentially affected infrastructure to support urban flood investigation.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/workspace"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#84A282] text-[#24302A] border-2 border-[#24302A] font-bold text-sm shadow-[3px_3px_0px_#24302A] hover:shadow-[4px_4px_0px_#24302A] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[1px_1px_0px_#24302A] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Open flood workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/methodology"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-[1.5px] border-[#24302A] dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#25312A] text-[#24302A] dark:text-[#FEFAF3] font-semibold text-sm shadow-[2px_2px_0px_#24302A] dark:shadow-[2px_2px_0px_#0E1410] hover:bg-[#F6E2E9]/60 active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#55655B] dark:text-[#B9C7BD]" />
                <span>Explore the methodology</span>
              </Link>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#55655B] dark:text-[#B9C7BD]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2F4A38] dark:text-[#B8CFB3]" />
                <span>Koramangala, Bengaluru</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2F4A38] dark:text-[#B8CFB3]" />
                <span>Offline-Resilient Hydrology</span>
              </span>
            </div>
          </div>

          {/* Right Column: Real Interactive MapLibre Canvas */}
          <div className="lg:col-span-7">
            <LandingHeroMap />
          </div>
        </div>
      </section>

      {/* Row of Three Workflow Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WorkflowRollingCards />
      </section>

      {/* Methodology Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl border-[1.5px] border-[#24302A] dark:border-[#3A4A40] bg-white dark:bg-[#25312A] shadow-[4px_4px_0px_#24302A] dark:shadow-[4px_4px_0px_#0E1410] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#24302A]/15 dark:border-[#3A4A40] pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#4F6B52] dark:text-[#B8CFB3]">
                Analytical Foundations
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#24302A] dark:text-[#FEFAF3]">
                Engineering Methodology Summary
              </h2>
            </div>
            <Link
              to="/methodology"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F6B52] dark:text-[#B8CFB3] hover:underline"
            >
              <span>Full methodology document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#55655B] dark:text-[#B9C7BD] leading-relaxed">
            <div className="space-y-2 p-4 rounded-xl border border-[#24302A]/20 dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#1C2620]">
              <span className="font-mono font-bold text-[#24302A] dark:text-[#FEFAF3] block text-sm">
                1. Rational Formula Runoff
              </span>
              <p>
                Calculates catchment runoff via Q = (C·I·A)/360, where C represents composite land-use runoff coefficient, I is rainfall intensity in mm/hr, and A is contributing nodal area in hectares.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl border border-[#24302A]/20 dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#1C2620]">
              <span className="font-mono font-bold text-[#24302A] dark:text-[#FEFAF3] block text-sm">
                2. Graph Routing & Manning
              </span>
              <p>
                Propagates discharge along a directed conduit graph using Manning friction equations. Conduits exceeding 100% capacity flag surcharge and trigger downstream backwater risk.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl border border-[#24302A]/20 dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#1C2620]">
              <span className="font-mono font-bold text-[#24302A] dark:text-[#FEFAF3] block text-sm">
                3. Evidence-Grounding LLM
              </span>
              <p>
                Google Gemma 4 synthesizes structured findings from verified simulation telemetry only. Citations link directly to simulation records with strict rejection of ungrounded depth claims.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FaqSection />
      </section>

      {/* Limitations and Integrity Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl border-[1.5px] border-[#C98A1B] bg-white dark:bg-[#25312A] shadow-[4px_4px_0px_#C98A1B] space-y-4 text-[#24302A] dark:text-[#FEFAF3]">
          <div className="flex items-center gap-2 font-bold font-heading text-sm text-[#8F5E05] dark:text-[#E6B04A]">
            <ShieldAlert className="w-5 h-5 text-[#C98A1B]" />
            <h2>Methodological Scope and Technical Limitations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#55655B] dark:text-[#B9C7BD] leading-relaxed">
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
