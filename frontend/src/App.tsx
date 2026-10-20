import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Preloader } from './components/common/Preloader';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { SiteSearchModal } from './components/common/SiteSearchModal';
import { CookieBanner } from './components/common/CookieBanner';
import { FloatingTools } from './components/common/FloatingTools';
import { PasscodeModal } from './components/common/PasscodeModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ScenariosPage } from './pages/ScenariosPage';
import { BottleneckPage } from './pages/BottleneckPage';
import { ReportPage } from './pages/ReportPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { LearnPage } from './pages/LearnPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  const [storageModalOpen, setStorageModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [cookieBannerOpen, setCookieBannerOpen] = useState(false);
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut for Site Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenStoragePreferences = () => {
    setCookieBannerOpen(true);
  };

  const handleClearPreferences = () => {
    localStorage.removeItem('pravaha-theme');
    localStorage.removeItem('pravaha-consent');
    localStorage.removeItem('pravaha-completed-lessons');
    sessionStorage.removeItem('pravaha-preloaded');
    sessionStorage.removeItem('pravaha-utm');
    window.location.reload();
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* 1.2s Tactical Preloader */}
        <Preloader />

        {/* Floating Tools: Scroll progress bar and back-to-top */}
        <FloatingTools />

        {/* Site Search Modal (Cmd/Ctrl+K) */}
        <SiteSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />

        {/* Operator Passcode Area Modal */}
        <PasscodeModal
          isOpen={passcodeModalOpen}
          onClose={() => setPasscodeModalOpen(false)}
        />

        {/* Cookie & Local Storage Banner */}
        <CookieBanner
          isOpenOverride={cookieBannerOpen}
          onCloseOverride={() => setCookieBannerOpen(false)}
        />

        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
          {/* Main Navigation Header */}
          <Header onOpenSearch={() => setSearchModalOpen(true)} />

          {/* Page Routing Container */}
          <main id="main-content" className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route path="/scenarios" element={<ScenariosPage />} />
              <Route path="/bottleneck" element={<BottleneckPage />} />
              <Route path="/reports/:id" element={<ReportPage />} />
              <Route path="/reports" element={<ReportPage />} />
              <Route path="/methodology" element={<MethodologyPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Infrastructure Footer */}
          <Footer
            onOpenStoragePreferences={handleOpenStoragePreferences}
            onOpenOperatorPasscode={() => setPasscodeModalOpen(true)}
          />

          {/* Storage & Cookie Preferences Modal */}
          <ConfirmationModal
            isOpen={storageModalOpen}
            title="Storage and Cookie Preferences"
            description="PRAVAHA stores local interface preferences (theme, lesson progress) in localStorage and optional UTM campaign attribution in sessionStorage. No third-party tracking scripts or advertising cookies are utilized. Would you like to reset your stored local preferences?"
            confirmLabel="Reset Stored Data"
            cancelLabel="Keep Preferences"
            isDestructive={true}
            onConfirm={handleClearPreferences}
            onClose={() => setStorageModalOpen(false)}
          />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
