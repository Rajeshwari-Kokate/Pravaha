import { type FC } from 'react';
import { Info, ShieldCheck } from 'lucide-react';

export const PrivacyPage: FC = () => {
  const buildDate = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '2026-10-20';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-sage-300">
          Data Governance and Privacy
        </span>
        <h1 className="text-3xl font-bold text-ink dark:text-cream mt-1 font-sans">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-ink-muted dark:text-muted-dark mt-1">
          Effective and Last Updated: {buildDate}
        </p>
      </div>

      <div className="p-4 rounded-xl border border-amber/40 bg-amber/10 text-ink dark:text-cream text-xs flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber" />
        <div className="space-y-1">
          <p className="font-bold uppercase tracking-wide font-mono text-[11px] text-amber">
            Operator Notice
          </p>
          <p className="leading-relaxed">
            This policy outlines the technical architecture of PRAVAHA. Deployment operators should configure organization contact records prior to production hosting.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark shadow-tactile-sm space-y-6 text-xs text-ink-muted dark:text-muted-dark leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink dark:text-cream font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sage-700 dark:text-sage-300" />
            <span>1. Self-Hosted Assets and Font Delivery</span>
          </h2>
          <p>
            PRAVAHA does not load web fonts, stylesheets, or static assets from external content delivery networks (CDNs). All typography (Bricolage Grotesque, DM Sans, and JetBrains Mono) is self-hosted directly within the application bundle via Fontsource npm packages. Your browser performs zero external requests to third-party font tracking servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink dark:text-cream font-sans">
            2. Local Browser Storage Usage
          </h2>
          <p>
            PRAVAHA operates without user registration, cookies, or profiling tracking beacons. The system utilizes client-side browser storage exclusively for functional interface preferences:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-ink dark:text-cream">Color Theme Preference:</strong> Light or dark mode setting saved in local storage.
            </li>
            <li>
              <strong className="text-ink dark:text-cream">Tour Acknowledgment:</strong> Guided walkthrough completion flag saved locally.
            </li>
            <li>
              <strong className="text-ink dark:text-cream">Flood School Progress:</strong> Lesson completion stamps preserved on your device only.
            </li>
            <li>
              <strong className="text-ink dark:text-cream">Storage Choices:</strong> Storage preference banner response status.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink dark:text-cream font-sans">
            3. Geospatial Basemap Tiles
          </h2>
          <p>
            When viewing interactive map layers, your browser fetches public raster or vector tiles from OpenStreetMap or CartoDB tile servers. If tile servers are unreachable or offline, PRAVAHA falls back to an offline vector rendering canvas.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-ink dark:text-cream font-sans">
            4. Scenario Records and Technical Inquiries
          </h2>
          <p>
            Simulated scenarios run on the workspace may be stored in local application memory or an operational SQLite database to enable side-by-side comparison. Messages sent through the technical contact form are recorded for operational audit.
          </p>
        </section>

        <section className="space-y-2 pt-2 border-t border-border-light dark:border-border-dark">
          <h2 className="text-sm font-bold text-ink dark:text-cream font-sans">
            5. Operator Configuration Placeholders
          </h2>
          <div className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-cream dark:bg-bg-dark font-mono text-[11px] space-y-1 text-ink dark:text-cream">
            <p>OPERATOR_ORGANIZATION: [CONFIG_REQUIRED: Operating Directorate]</p>
            <p>DATA_PROTECTION_EMAIL: [CONFIG_REQUIRED: contact@operator.example.gov.in]</p>
            <p>JURISDICTION_LOCATION: [CONFIG_REQUIRED: Bengaluru / New Delhi, India]</p>
          </div>
        </section>
      </div>
    </div>
  );
};
