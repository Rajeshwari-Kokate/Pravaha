import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { PravahaLogo } from './PravahaLogo';
import { ShieldAlert } from 'lucide-react';

interface FooterProps {
  onOpenStoragePreferences?: () => void;
}

export const Footer: FC<FooterProps> = ({ onOpenStoragePreferences }) => {
  // Use injected build date
  const lastUpdated = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '2026-10-18';

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#070b12] text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="md:col-span-2 space-y-3">
            <PravahaLogo size={24} />
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              PRAVAHA models rainfall scenarios, drainage constraints, and potentially affected infrastructure
              to support municipal engineers, infrastructure analysts, and researchers in urban flood investigation.
            </p>
            <div className="flex items-start gap-2 p-2.5 rounded-md border border-amber-300/60 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 max-w-md">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-[11px] leading-tight">
                <strong>Emergency Notice:</strong> PRAVAHA is an analytical engineering decision-support tool, not an
                operational flood warning system. If flooding is occurring in your area, follow instructions from local
                municipal authorities and contact emergency services.
              </p>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Investigation System
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/workspace" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Interactive Workspace
                </Link>
              </li>
              <li>
                <Link to="/scenarios" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Scenario Laboratory
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Engineering Methodology
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Flood School (Lessons)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Governance */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Transparency & Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Technical Contact
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenStoragePreferences}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left"
                >
                  Storage Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with build date */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>Open engineering screening tool. Open Database License (ODbL) for OpenStreetMap base layers.</p>
          <p className="font-mono">
            System build date: <span className="text-slate-700 dark:text-slate-300 font-semibold">{lastUpdated}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
