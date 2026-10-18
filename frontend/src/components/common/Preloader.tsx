import { useEffect, useState, type FC } from 'react';

export const Preloader: FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [show, setShow] = useState<boolean>(() => {
    // Check if reduced motion or already preloaded in session
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

    // Auto dismiss after 1.1s (under 1.2s limit)
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
      className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-slate-900 text-white transition-opacity duration-200 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* SVG drainage mark drawing itself */}
        <svg
          width="72"
          height="72"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4"
        >
          <rect width="48" height="48" rx="8" fill="#1e293b" />
          {/* Main trunk */}
          <path
            d="M24 6V42"
            stroke="#14b8a6"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="animate-[drawTrunk_0.8s_ease-out_forwards]"
            style={{
              strokeDasharray: 36,
              strokeDashoffset: 36,
              animation: 'drawPath 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          />
          {/* Lateral branches */}
          <path
            d="M10 16L24 24L38 16"
            stroke="#38bdf8"
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
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 30,
              strokeDashoffset: 30,
              animation: 'drawPath 0.5s 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          />
          <circle cx="24" cy="24" r="3" fill="#14b8a6" />
          <circle cx="24" cy="35" r="2.5" fill="#14b8a6" />
        </svg>

        <span className="font-mono text-sm tracking-widest text-teal-400 font-bold uppercase">
          PRAVAHA
        </span>
        <span className="text-xs text-slate-400 mt-1">Initializing drainage graph...</span>

        <button
          onClick={handleSkip}
          className="mt-6 text-xs text-slate-400 hover:text-white px-3 py-1 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors"
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
