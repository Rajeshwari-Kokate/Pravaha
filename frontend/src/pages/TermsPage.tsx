import { type FC } from 'react';
import { AlertTriangle } from 'lucide-react';

export const TermsPage: FC = () => {
  const buildDate = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '2026-10-18';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Terms of Use
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Terms and Conditions
        </h1>
        <p className="text-xs font-mono text-slate-500 mt-1">Effective & Last Updated: {buildDate}</p>
      </div>

      <div className="p-4 rounded-md border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <p>
          <strong>Notice to Deployment Operators:</strong> This document serves as a baseline legal template. Operating organizations must review, adapt, and customize these terms to align with local jurisdictional requirements prior to public release.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Decision-Support and Educational Scope</h2>
          <p>
            PRAVAHA is designed solely as an engineering screening, educational, and decision-support platform. It utilizes simplified deterministic hydraulic approximations (the Rational Method and topological conveyance). It does NOT replace site-specific professional hydrological engineering assessments, official municipal drainage master plans, or certified civil engineering reviews.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. No Emergency Warning Capability</h2>
          <p>
            PRAVAHA does not provide real-time flood early warning, emergency life safety alerts, or certified evacuation routing. In any severe weather or flooding event, users and authorities must rely exclusively on official state and municipal disaster management channels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Synthetic Data and Model Uncertainty</h2>
          <p>
            Where municipal stormwater conduit geometries are unavailable, PRAVAHA presents synthetic network representations derived from road centerlines and topographical low points. All simulated accumulation hotspots denote relative screening indicators rather than observed inundation depths.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, the contributors, authors, and operators of PRAVAHA shall not be held liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this platform, or reliance on simulated results.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Operator Contact Placeholders</h2>
          <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono text-[11px] space-y-1">
            <p>LEGAL_ENTITY: [CONFIG_REQUIRED: Enter Legal Entity Name]</p>
            <p>DESIGNATED_OFFICE: [CONFIG_REQUIRED: Urban Planning / Engineering Directorate]</p>
            <p>CONTACT_EMAIL: [CONFIG_REQUIRED: legal@operator.example.gov.in]</p>
          </div>
        </section>
      </div>
    </div>
  );
};
