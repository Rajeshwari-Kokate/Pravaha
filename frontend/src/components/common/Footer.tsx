import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { PravahaLogo } from './PravahaLogo';
import { ShieldAlert } from 'lucide-react';

interface FooterProps {
  onOpenStoragePreferences?: () => void;
  onOpenOperatorPasscode?: () => void;
}

export const Footer: FC<FooterProps> = ({ onOpenStoragePreferences, onOpenOperatorPasscode }) => {
  const lastUpdated = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '2026-10-20';

  return (
    <footer className="border-t-[1.5px] border-[#24302A] dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#1C2620] text-[#24302A] dark:text-[#FEFAF3] text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="md:col-span-2 space-y-3.5">
            <PravahaLogo size={26} />
            <p className="text-xs text-[#55655B] dark:text-[#B9C7BD] max-w-md leading-relaxed">
              PRAVAHA models rainfall scenarios, drainage constraints, and potentially affected infrastructure
              to support municipal engineers, infrastructure analysts, and researchers in urban flood investigation.
            </p>
            <div className="flex items-start gap-2.5 p-3 rounded-xl border-[1.5px] border-[#C98A1B] bg-white dark:bg-[#25312A] text-[#8F5E05] dark:text-[#E6B04A] shadow-[2px_2px_0px_#C98A1B] max-w-md">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#C98A1B]" aria-hidden="true" />
              <p className="text-[11px] leading-tight">
                <strong>Emergency Notice:</strong> PRAVAHA is an analytical engineering decision-support tool, not an
                operational flood warning system. If flooding is occurring in your area, follow instructions from local
                municipal authorities and contact emergency services.
              </p>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h3 className="font-mono text-[11px] font-bold text-[#24302A] dark:text-[#FEFAF3] uppercase tracking-wider mb-3">
              Investigation System
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/workspace" className="text-[#55655B] dark:text-[#B9C7BD] hover:text-[#24302A] dark:hover:text-[#FEFAF3] hover:underline transition-colors">
                  Interactive Workspace
                </Link>
              </li>
              <li>
                <Link to="/scenarios" className="text-[#55655B] dark:text-[#B9C7BD] hover:text-[#24302A] dark:hover:text-[#FEFAF3] hover:underline transition-colors">
                  Scenario Laboratory
                </Link>
              </li>
              <li>
                <Link to="/bottleneck" className="text-[#55655B] dark:text-[#B9C7BD] hover:text-[#24302A] dark:hover:text-[#FEFAF3] hover:underline transition-colors">
                  Bottleneck Analysis
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="text-[#55655B] dark:text-[#B9C7BD] hover:text-[#24302A] dark:hover:text-[#FEFAF3] hover:underline transition-colors">
                  Engineering Methodology
                </Link>
              </li>
              <li>
                <Link to="/learn" className="text-[#55655B] dark:text-[#B9C7BD] hover:text-[#24302A] dark:hover:text-[#FEFAF3] hover:underline transition-colors">
                  Flood School (Lessons)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Governance */}
          <div>
            <h3 className="font-mono text-[11px] font-bold text-[#24302A] dark:text-[#FEFAF3] uppercase tracking-wider mb-3">
              Transparency & Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-[#55655B] dark:text-[#B9C7BD] hover:text-[#24302A] dark:hover:text-[#FEFAF3] hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#55655B] dark:text-[#B9C7BD] hover:text-[#24302A] dark:hover:text-[#FEFAF3] hover:underline transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#55655B] dark:text-[#B9C7BD] hover:text-[#24302A] dark:hover:text-[#FEFAF3] hover:underline transition-colors">
                  Technical Contact
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenStoragePreferences}
                  className="text-[#55655B] dark:text-[#B9C7BD] hover:text-[#24302A] dark:hover:text-[#FEFAF3] hover:underline transition-colors text-left cursor-pointer"
                >
                  Storage Preferences
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenOperatorPasscode}
                  className="text-[#55655B] dark:text-[#B9C7BD] hover:text-[#24302A] dark:hover:text-[#FEFAF3] font-mono text-[10px] text-left cursor-pointer"
                >
                  Operator Passcode (Admin)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with build date */}
        <div className="mt-8 pt-6 border-t-[1.5px] border-[#24302A]/15 dark:border-[#3A4A40] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#55655B] dark:text-[#B9C7BD]">
          <p>Open engineering screening tool. Open Database License (ODbL) for OpenStreetMap base layers.</p>
          <p className="font-mono">
            System build date: <span className="text-[#24302A] dark:text-[#FEFAF3] font-bold">{lastUpdated}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
