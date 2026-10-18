import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Preloader } from './components/common/Preloader';
import { SiteCursor } from './components/common/SiteCursor';
import { ConfirmationModal } from './components/common/ConfirmationModal';

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

  const handleOpenStoragePreferences = () => {
    setStorageModalOpen(true);
  };

  const handleClearPreferences = () => {
    localStorage.removeItem('pravaha-theme');
    localStorage.removeItem('pravaha-consent');
    sessionStorage.removeItem('pravaha-preloaded');
    sessionStorage.removeItem('pravaha-utm');
    window.location.reload();
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* Subtle Custom Cursor for main interface */}
        <SiteCursor />

        {/* 1.2s Tactical Preloader */}
        <Preloader />

        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
          {/* Main Navigation Header */}
          <Header />

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
          <Footer onOpenStoragePreferences={handleOpenStoragePreferences} />

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
