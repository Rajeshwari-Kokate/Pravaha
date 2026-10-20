import { useEffect, useState, type FC } from 'react';

export const Preloader: FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [show, setShow] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return false;
    const alreadySeen = sessionStorage.getItem('pravaha-preloaded');
    return !alreadySeen;
  });

  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!show) {
      if (onComplete) onComplete();
      return;
    }

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 850);

    const endTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('pravaha-preloaded', 'true');
      if (onComplete) onComplete();
    }, 1100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        setShow(false);
        sessionStorage.setItem('pravaha-preloaded', 'true');
        if (onComplete) onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, onComplete]);

  const handleSkip = () => {
    setShow(false);
    sessionStorage.setItem('pravaha-preloaded', 'true');
    if (onComplete) onComplete();
  };

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#1C2620] text-[#FEFAF3] transition-opacity duration-200 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* SVG drainage mark drawing itself */}
        <svg
          width="76"
          height="76"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4"
        >
          <rect width="48" height="48" rx="8" fill="#24302A" stroke="#84A282" strokeWidth="2" />
          <path
            d="M24 6V42"
            stroke="#84A282"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: 36,
              strokeDashoffset: 36,
              animation: 'drawPath 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          />
          <path
            d="M10 16L24 24L38 16"
            stroke="#3A7F8F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 40,
              strokeDashoffset: 40,
              animation: 'drawPath 0.6s 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          />
          <path
            d="M13 30L24 35L35 30"
            stroke="#3A7F8F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 30,
              strokeDashoffset: 30,
              animation: 'drawPath 0.5s 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          />
          <circle cx="24" cy="24" r="3" fill="#B8CFB3" />
          <circle cx="24" cy="35" r="2.5" fill="#B8CFB3" />
        </svg>

        <span className="font-mono text-base tracking-widest text-[#B8CFB3] font-bold uppercase">
          PRAVAHA
        </span>
        <span className="text-xs text-[#B9C7BD] mt-1 font-sans">
          Initializing hydraulic network model...
        </span>

        <button
          onClick={handleSkip}
          className="mt-6 text-xs text-[#FEFAF3] px-3.5 py-1.5 rounded-lg border-[1.5px] border-[#3A4A40] bg-[#25312A] hover:bg-[#2F4A38] active:translate-y-[1px] shadow-[2px_2px_0px_#0E1410] transition-all cursor-pointer font-medium"
          aria-label="Skip preloader animation"
        >
          Skip (Esc)
        </button>
      </div>

      <style>{`
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};
