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
import { CheckCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activePage, toastMessage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-grid-refinery text-[var(--text-primary)] overflow-x-hidden selection:bg-[var(--accent-primary)] selection:text-black">
      {/* Scroll-Aware Fixed Navigation */}
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 command-card px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-mono font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="text-[var(--text-primary)]">{toastMessage}</span>
        </div>
      )}

      {/* Main Page Body: Full bleed on landing hero, padded on inner pages */}
      <main className={`flex-1 w-full ${
        activePage === 'landing'
          ? 'pt-0'
          : 'max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-24 pb-8'
      }`}>
        {activePage === 'landing' && <LandingPage />}
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'worker-dashboard' && <WorkerDashboardPage />}
        {activePage === 'scan' && <ScanPage />}
        {activePage === 'result' && <ResultPage />}
        {activePage === 'calibration' && <CalibrationPage />}
        {activePage === 'workers' && <WorkersPage />}
        {activePage === 'history' && <HistoryPage />}
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
