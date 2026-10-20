import { type FC } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-lg border-[1.5px] border-[#24302A] dark:border-[#3A4A40] bg-white dark:bg-[#25312A] text-[#24302A] dark:text-[#FEFAF3] shadow-[2px_2px_0px_#24302A] dark:shadow-[2px_2px_0px_#0E1410] hover:bg-[#F6E2E9]/60 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer inline-flex items-center justify-center ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-[#E6B04A]" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-[#24302A]" aria-hidden="true" />
      )}
    </button>
  );
};
