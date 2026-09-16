import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ExplanationModal } from './components/ExplanationModal';
import { LoginModal } from './components/LoginModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkerDashboardPage } from './pages/WorkerDashboardPage';
import { ScanPage } from './pages/ScanPage';
import { ResultPage } from './pages/ResultPage';
import { CalibrationPage } from './pages/CalibrationPage';
import { WorkersPage } from './pages/WorkersPage';
import { HistoryPage } from './pages/HistoryPage';
import { KioskPage } from './pages/KioskPage';
import { ExplainabilityPage } from './pages/ExplainabilityPage';
import { FaqPage } from './pages/FaqPage';
import { ProjectOverviewPage } from './pages/ProjectOverviewPage';
import { CheckCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activePage, toastMessage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1E7] text-[#292925] overflow-x-hidden">
      {/* Scroll-Aware Fixed Navigation */}
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#292925] text-[#F6F1E7] px-4 py-3 rounded-xl shadow-2xl border border-[#D8D0C2] flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle className="w-4 h-4 text-[#71806B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Page Body: Full bleed on landing hero, padded on inner pages */}
      <main className={`flex-1 w-full ${
        activePage === 'landing'
          ? 'pt-0'
          : 'max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-20 pb-8'
      }`}>
        {activePage === 'landing' && <LandingPage />}
        {activePage === 'overview' && <ProjectOverviewPage />}
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'worker-dashboard' && <WorkerDashboardPage />}
        {activePage === 'scan' && <ScanPage />}
        {activePage === 'result' && <ResultPage />}
        {activePage === 'calibration' && <CalibrationPage />}
        {activePage === 'workers' && <WorkersPage />}
        {activePage === 'history' && <HistoryPage />}
        {activePage === 'kiosk' && <KioskPage />}
        {activePage === 'explainability' && <ExplainabilityPage />}
        {activePage === 'faq' && <FaqPage />}
      </main>

      {/* Modals & Dialogs */}
      <ExplanationModal />
      <LoginModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
