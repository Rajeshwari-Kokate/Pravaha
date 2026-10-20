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
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white dark:bg-[#25312A] border-[1.5px] border-[#24302A] dark:border-[#3A4A40] rounded-2xl p-5 shadow-[4px_4px_0px_#24302A] dark:shadow-[4px_4px_0px_#0E1410] space-y-4 text-xs text-[#24302A] dark:text-[#FEFAF3]"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#4F6B52] dark:text-[#B8CFB3] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-bold font-heading text-sm text-[#24302A] dark:text-[#FEFAF3]">
            Local Storage and Privacy Preferences
          </h3>
          <p className="text-[#55655B] dark:text-[#B9C7BD] leading-relaxed text-[11px]">
            PRAVAHA stores your active simulation parameters, theme preferences, and completed lessons locally in your browser localStorage. No commercial advertising trackers are deployed.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#24302A]/15 dark:border-[#3A4A40]">
        <Link
          to="/privacy"
          className="text-[11px] text-[#4F6B52] dark:text-[#B8CFB3] underline font-semibold hover:text-[#24302A]"
        >
          Read Policy
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleChoice('rejected')}
            className="px-3 py-1.5 rounded-lg border-[1.5px] border-[#24302A] dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#1C2620] text-[#24302A] dark:text-[#FEFAF3] text-xs font-semibold shadow-[1px_1px_0px_#24302A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            Reject Optional
          </button>
          <button
            type="button"
            onClick={() => handleChoice('accepted')}
            className="px-3.5 py-1.5 rounded-lg bg-[#84A282] text-[#24302A] border-2 border-[#24302A] text-xs font-bold shadow-[2px_2px_0px_#24302A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            Accept Optional
          </button>
        </div>
      </div>
    </aside>
  );
};
