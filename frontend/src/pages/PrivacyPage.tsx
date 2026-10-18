import { type FC } from 'react';
import { Info } from 'lucide-react';

export const PrivacyPage: FC = () => {
  const buildDate = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '2026-10-18';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Data Governance
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-slate-500 mt-1">Effective & Last Updated: {buildDate}</p>
      </div>

      <div className="p-4 rounded-md border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <p>
          <strong>Operator Notice:</strong> This privacy policy reflects the exact technical implementation of the PRAVAHA system. Deployment operators must configure contact details in the designated placeholders prior to public production hosting.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information Architecture & What We Store</h2>
          <p>
            PRAVAHA does not require user accounts, passwords, or personal profile registrations. We do not integrate third-party tracking scripts, advertising pixels, or telemetry beacons. The system retains only the following data:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Browser Storage (localStorage):</strong> User interface color theme preference (`pravaha-theme`), Flood School quiz progress, and cookie/storage preference acknowledgments.
            </li>
            <li>
              <strong>Session Storage (sessionStorage):</strong> Campaign attribution parameters (UTM parameters) are captured only if you explicitly choose "Accept optional" on the storage preferences prompt. Preloader session status is also stored.
            </li>
            <li>
              <strong>Scenario Simulation History (SQLite):</strong> Run configurations and deterministic outputs generated in the workspace and scenario lab are saved locally in the server SQLite database (`pravaha.db`) to enable scenario comparison and report generation.
            </li>
            <li>
              <strong>Technical Contact Inquiries (SQLite):</strong> Messages submitted through the contact form (name, email address, inquiry text, and timestamp) are stored in server-side storage for operator review.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Third-Party Map Tile Services</h2>
          <p>
            To render interactive geospatial map layers, PRAVAHA requests raster and vector basemap tiles from OpenStreetMap tile servers and CartoDB endpoints. When your browser requests tiles, your IP address is transmitted to these independent infrastructure providers under their respective service policies. If third-party tile endpoints are unreachable, PRAVAHA gracefully falls back to an offline geometric rendering canvas.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Data Retention and Deletion Procedure</h2>
          <p>
            Scenario history records may be cleared locally at any time using the workspace reset dialog. On the server side, operators may purge history logs using the passcode-protected administration endpoint.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Operator Contact Configuration Placeholders</h2>
          <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono text-[11px] space-y-1">
            <p>OPERATOR_ORGANIZATION: [CONFIG_REQUIRED: Enter Operating Entity / Institution]</p>
            <p>DATA_PROTECTION_EMAIL: [CONFIG_REQUIRED: contact@operator.example.gov.in]</p>
            <p>JURISDICTION_LOCATION: [CONFIG_REQUIRED: Bengaluru / New Delhi, India]</p>
          </div>
        </section>
      </div>
    </div>
  );
};
