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
        className="fixed top-0 left-0 h-[3px] bg-[#84A282] z-50 transition-all duration-150 pointer-events-none"
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
          className="p-3 rounded-xl bg-white dark:bg-[#25312A] text-[#24302A] dark:text-[#FEFAF3] shadow-[3px_3px_0px_#24302A] dark:shadow-[3px_3px_0px_#0E1410] hover:bg-[#F6E2E9]/60 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all border-[1.5px] border-[#24302A] dark:border-[#3A4A40] flex items-center justify-center cursor-pointer"
          title="Contact Technical Support"
          aria-label="Contact Technical Support"
        >
          <MessageSquare className="w-4 h-4 text-[#4F6B52] dark:text-[#B8CFB3]" />
        </Link>

        {/* Back to top button */}
        {showBackToTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="p-3 rounded-xl bg-white dark:bg-[#25312A] text-[#24302A] dark:text-[#FEFAF3] shadow-[3px_3px_0px_#24302A] dark:shadow-[3px_3px_0px_#0E1410] border-[1.5px] border-[#24302A] dark:border-[#3A4A40] hover:bg-[#F6E2E9]/60 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center cursor-pointer"
            title="Back to top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4 text-[#24302A] dark:text-[#FEFAF3]" />
          </button>
        )}
      </div>
    </>
  );
};
