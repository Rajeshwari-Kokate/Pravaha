import { type FC } from 'react';
import { AlertTriangle, Scale } from 'lucide-react';

export const TermsPage: FC = () => {
  const buildDate = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '2026-10-20';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-sage-300">
          Terms of Service and Scope
        </span>
        <h1 className="text-3xl font-bold text-ink dark:text-cream mt-1 font-sans">
          Terms and Conditions
        </h1>
        <p className="text-xs font-mono text-ink-muted dark:text-muted-dark mt-1">
          Effective and Last Updated: {buildDate}
        </p>
      </div>

      <div className="p-4 rounded-xl border border-amber/40 bg-amber/10 text-ink dark:text-cream text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber" />
        <div className="space-y-1">
          <p className="font-bold uppercase tracking-wide font-mono text-[11px] text-amber">
            Notice to Operators and Engineers
          </p>
          <p className="leading-relaxed">
            This document outlines acceptable usage parameters. Operating authorities should verify local regulatory requirements prior to municipal deployment.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark shadow-tactile-sm space-y-6 text-xs text-ink-muted dark:text-muted-dark leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink dark:text-cream font-sans flex items-center gap-2">
            <Scale className="w-4 h-4 text-sage-700 dark:text-sage-300" />
            <span>1. Decision Support and Screening Purpose</span>
          </h2>
          <p>
            PRAVAHA is designed as an urban drainage screening and educational evaluation platform. It implements deterministic hydraulic approximations (the Rational Method and topological conveyance). It does not replace site-specific hydrodynamic simulations (2D SWMM or certified shallow-water modeling) or statutory civil engineering reviews.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink dark:text-cream font-sans">
            2. No Emergency Life Safety Alerts
          </h2>
          <p>
            PRAVAHA does not provide real-time flood warning, emergency routing, or evacuation instructions. In any active storm or severe flood situation, citizens and operators must rely exclusively on official state and municipal emergency services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink dark:text-cream font-sans">
            3. Synthetic Data and Model Uncertainty
          </h2>
          <p>
            Where municipal stormwater conduit geometries are unavailable, PRAVAHA presents synthetic network representations derived from road centerlines and topographical low points. All simulated accumulation hotspots denote relative screening indicators rather than observed inundation depths.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink dark:text-cream font-sans">
            4. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, the contributors, authors, and operators of PRAVAHA shall not be held liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this platform, or reliance on simulated results.
          </p>
        </section>

        <section className="space-y-2 pt-2 border-t border-border-light dark:border-border-dark">
          <h2 className="text-sm font-bold text-ink dark:text-cream font-sans">
            5. Operator Placeholders
          </h2>
          <div className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-cream dark:bg-bg-dark font-mono text-[11px] space-y-1 text-ink dark:text-cream">
            <p>LEGAL_ENTITY: [CONFIG_REQUIRED: Operating Directorate]</p>
            <p>DESIGNATED_OFFICE: [CONFIG_REQUIRED: Urban Planning / Engineering Directorate]</p>
            <p>CONTACT_EMAIL: [CONFIG_REQUIRED: legal@operator.example.gov.in]</p>
          </div>
        </section>
      </div>
    </div>
  );
};
