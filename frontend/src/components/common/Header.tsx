import { useState, useEffect, type FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PravahaLogo } from './PravahaLogo';
import { ThemeToggle } from './ThemeToggle';
import { Search, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export const Header: FC<HeaderProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Methodology', path: '/methodology' },
    { name: 'Workspace', path: '/workspace' },
    { name: 'Scenarios', path: '/scenarios' },
    { name: 'Flood School', path: '/learn' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full border-b-[1.5px] border-[#24302A] dark:border-[#3A4A40] bg-[#FEFAF3]/95 dark:bg-[#1C2620]/95 backdrop-blur-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand mark */}
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-[#F6E2E9]/50 transition-colors focus-visible:ring-2 focus-visible:ring-[#4F6B52]"
            aria-label="PRAVAHA Home"
          >
            <PravahaLogo size={30} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium" aria-label="Main Navigation">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#B8CFB3] text-[#24302A] font-bold border border-[#24302A] shadow-[1px_1px_0px_#24302A]'
                      : 'text-[#24302A] dark:text-[#FEFAF3] hover:bg-[#F6E2E9]/60 hover:text-[#24302A]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Search shortcut button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#24302A] dark:text-[#FEFAF3] bg-white dark:bg-[#25312A] border-[1.5px] border-[#24302A] dark:border-[#3A4A40] rounded-lg shadow-[2px_2px_0px_#24302A] dark:shadow-[2px_2px_0px_#0E1410] hover:bg-[#F6E2E9]/40 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              aria-label="Search site documentation and assets (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline font-medium">Search</span>
              <kbd className="hidden sm:inline-block font-mono text-[10px] bg-[#FEFAF3] dark:bg-[#1C2620] px-1.5 py-0.5 rounded border border-[#24302A] dark:border-[#3A4A40] text-[#24302A] dark:text-[#FEFAF3]">
                ⌘K
              </kbd>
            </button>

            {/* Dark mode switch */}
            <ThemeToggle />

            {/* Primary Action Button */}
            <Link
              to="/workspace"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#84A282] text-[#24302A] border-2 border-[#24302A] shadow-[3px_3px_0px_#24302A] hover:shadow-[4px_4px_0px_#24302A] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[1px_1px_0px_#24302A] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
            >
              <span>Open Workspace</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-lg border border-[#24302A] dark:border-[#3A4A40] bg-white dark:bg-[#25312A] text-[#24302A] dark:text-[#FEFAF3] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden border-b-[1.5px] border-[#24302A] dark:border-[#3A4A40] bg-[#FEFAF3] dark:bg-[#1C2620] px-4 pt-2 pb-4 space-y-1.5"
          >
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-[#B8CFB3] text-[#24302A] font-bold border border-[#24302A]'
                      : 'text-[#24302A] dark:text-[#FEFAF3] hover:bg-[#F6E2E9]/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#24302A]/20 dark:border-[#3A4A40] mt-2">
              <Link
                to="/workspace"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg bg-[#84A282] text-[#24302A] border-2 border-[#24302A] shadow-[3px_3px_0px_#24302A]"
              >
                <span>Open Flood Workspace</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
