import { useState, useEffect, type FC } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
}

export const CookieBanner: FC<Props> = ({ isOpenOverride, onCloseOverride }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpenOverride) {
      setIsVisible(true);
      return;
    }
    const stored = localStorage.getItem('pravaha-consent');
    if (!stored) {
      setIsVisible(true);
    }
  }, [isOpenOverride]);

  const handleChoice = (choice: 'accepted' | 'rejected') => {
    localStorage.setItem('pravaha-consent', choice);
    setIsVisible(false);
    if (onCloseOverride) onCloseOverride();
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Storage and Cookie Preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xl space-y-4 text-xs"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Local Storage & Privacy Preferences
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
            PRAVAHA stores your active simulation parameters, theme preferences, and completed lessons locally in your browser’s localStorage. No commercial advertising trackers are deployed.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
        <Link
          to="/privacy"
          className="text-[11px] text-teal-600 dark:text-teal-400 underline hover:text-teal-700"
        >
          Read Policy
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleChoice('rejected')}
            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold"
          >
            Reject Optional
          </button>
          <button
            type="button"
            onClick={() => handleChoice('accepted')}
            className="px-3 py-1.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm"
          >
            Accept Optional
          </button>
        </div>
      </div>
    </aside>
  );
};
