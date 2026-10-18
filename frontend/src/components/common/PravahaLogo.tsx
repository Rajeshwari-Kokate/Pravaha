import { type FC } from 'react';

interface PravahaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const PravahaLogo: FC<PravahaLogoProps> = ({
  className = '',
  size = 28,
  showText = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 font-semibold tracking-tight ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="4" className="fill-slate-900 dark:fill-slate-800" />
        {/* Main conveyance trunk */}
        <path d="M16 4V28" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" />
        {/* Converging lateral collectors */}
        <path d="M7 11L16 16L25 11" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 20L16 23L23 20" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Manhole / hydraulic junction nodes */}
        <circle cx="16" cy="16" r="2.2" className="fill-slate-900 dark:fill-slate-800" stroke="#14b8a6" strokeWidth="1.8" />
        <circle cx="16" cy="23" r="1.8" className="fill-slate-900 dark:fill-slate-800" stroke="#14b8a6" strokeWidth="1.8" />
        <circle cx="7" cy="11" r="1.5" fill="#38bdf8" />
        <circle cx="25" cy="11" r="1.5" fill="#38bdf8" />
      </svg>
      {showText && (
        <span className="flex flex-col text-left leading-none">
          <span className="text-base font-bold tracking-wider text-slate-900 dark:text-white uppercase font-mono">
            PRAVAHA
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-normal mt-0.5">
            Urban Flood Intelligence
          </span>
        </span>
      )}
    </div>
  );
};
