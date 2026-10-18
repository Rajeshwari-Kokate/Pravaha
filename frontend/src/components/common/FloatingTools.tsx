import { useState, useEffect, type FC } from 'react';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FloatingTools: FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll Progress Bar at very top of screen */}
      <div
        className="fixed top-0 left-0 h-1 bg-teal-500 z-50 transition-all duration-150 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />

      {/* Floating Action Buttons (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2.5 no-print">
        {/* Floating Contact Button */}
        <Link
          to="/contact"
          className="p-3 rounded-full bg-slate-900 dark:bg-slate-800 text-white shadow-xl hover:bg-teal-600 transition-colors border border-slate-700/60 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-500"
          title="Contact Technical Support"
          aria-label="Contact Technical Support"
        >
          <MessageSquare className="w-4 h-4" />
        </Link>

        {/* Back to top button */}
        {showBackToTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-500"
            title="Back to top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  );
};
