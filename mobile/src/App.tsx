import React, { useState, useEffect } from 'react';
import { MobileAuthProvider, useMobileAuth } from './context/MobileAuthContext';
import { repository } from './services/DosimeterRepository';
import { CalibrationEngine, CalibrationResult } from './services/CalibrationEngine';
import type { Worker, Reading, Alert, Wristband, DemoSampleBadge } from './types/mobile';

import { SplashView } from './components/SplashView';
import { LoginView } from './components/LoginView';
import { CameraCaptureModal } from './components/camera/CameraCaptureModal';
import { AnalysisSequenceModal } from './components/analysis/AnalysisSequenceModal';
import { ResultModal } from './components/result/ResultModal';

import { WorkerDashboard } from './views/WorkerDashboard';
import { SafetyOfficerDashboard } from './views/SafetyOfficerDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { HistoryView } from './views/HistoryView';
import { ProfileView } from './views/ProfileView';
import { WorkersListView } from './views/WorkersListView';
import { AlertsListView } from './views/AlertsListView';
import { BandsManagementView } from './views/BandsManagementView';

import { Home, Camera, Clock, User, ShieldAlert, Users, Radio } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, role, isAuthenticated } = useMobileAuth();

  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'HOME' | 'SCAN' | 'HISTORY' | 'PROFILE' | 'WORKERS' | 'ALERTS' | 'BANDS'>('HOME');

  // Live repository states
  const [workers, setWorkers] = useState<Worker[]>(repository.getWorkers());
  const [readings, setReadings] = useState<Reading[]>(repository.getReadings());
  const [alerts, setAlerts] = useState<Alert[]>(repository.getAlerts());
  const [wristbands, setWristbands] = useState<Wristband[]>(repository.getWristbands());

  // Camera & Analysis Modal States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  // Calibration pipeline data
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedDemoSample, setSelectedDemoSample] = useState<DemoSampleBadge | null>(null);
  const [currentResult, setCurrentResult] = useState<CalibrationResult | null>(null);

  // Subscribe to repository changes
  useEffect(() => {
    const unsubscribe = repository.subscribe(() => {
      setWorkers(repository.getWorkers());
      setReadings(repository.getReadings());
      setAlerts(repository.getAlerts());
      setWristbands(repository.getWristbands());
    });
    return () => unsubscribe();
  }, []);

  // Show Splash screen
  if (showSplash) {
    return <SplashView onComplete={() => setShowSplash(false)} />;
  }

  // Not authenticated -> Show Login with Demo Access
  if (!isAuthenticated || !currentUser) {
    return <LoginView />;
  }

  // Active Worker details
  const activeWorker: Worker = (currentUser.workerId && repository.getWorkerById(currentUser.workerId)) || workers[0];
  const workerReadings = readings.filter(r => r.workerId === activeWorker.workerId);

  // Handler: When user clicks "Use Photo" in CameraCaptureModal
  const handlePhotoSelected = (imageData: { imageUri?: string; sample?: DemoSampleBadge }) => {
    setIsCameraOpen(false);
    setSelectedImageUri(imageData.imageUri || null);
    setSelectedDemoSample(imageData.sample || null);

    // Compute calibration result
    let res: CalibrationResult;
    if (imageData.sample) {
      res = CalibrationEngine.analyzeSample(imageData.sample);
    } else if (imageData.imageUri) {
      res = CalibrationEngine.analyzeRawImage(imageData.imageUri);
    } else {
      res = CalibrationEngine.analyzeRawImage('');
    }
    setCurrentResult(res);

    // Trigger analysis animation sequence
    setIsAnalyzing(true);
  };

  // Handler: When 5-step analysis animation completes
  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    setIsResultOpen(true);
  };

  // Handler: When user clicks "Save Reading" in ResultModal
  const handleSaveComplete = () => {
    setIsResultOpen(false);
    setSelectedImageUri(null);
    setSelectedDemoSample(null);
    setCurrentResult(null);
    setActiveTab('HISTORY');
  };

  // Handler: When user clicks Retake in ResultModal
  const handleRetake = () => {
    setIsResultOpen(false);
    setIsCameraOpen(true);
  };

  // Render main screen based on activeTab & role
  const renderCurrentView = () => {
    if (activeTab === 'HISTORY') {
      return (
        <HistoryView
          readings={role === 'WORKER' ? workerReadings : readings}
          onBack={() => setActiveTab('HOME')}
        />
      );
    }

    if (activeTab === 'PROFILE') {
      return <ProfileView onBack={() => setActiveTab('HOME')} />;
    }

    if (activeTab === 'WORKERS') {
      return (
        <WorkersListView
          workers={workers}
          readings={readings}
          onBack={() => setActiveTab('HOME')}
        />
      );
    }

    if (activeTab === 'ALERTS') {
      return (
        <AlertsListView
          alerts={alerts}
          onBack={() => setActiveTab('HOME')}
        />
      );
    }

    if (activeTab === 'BANDS') {
      return (
        <BandsManagementView
          wristbands={wristbands}
          onBack={() => setActiveTab('HOME')}
        />
      );
    }

    // Role-Based Home Dashboards
    switch (role) {
      case 'WORKER':
        return (
          <WorkerDashboard
            worker={activeWorker}
            recentReadings={workerReadings}
            onOpenScan={() => setIsCameraOpen(true)}
            onViewHistory={() => setActiveTab('HISTORY')}
            onViewProfile={() => setActiveTab('PROFILE')}
          />
        );

      case 'SAFETY_OFFICER':
        return (
          <SafetyOfficerDashboard
            workers={workers}
            readings={readings}
            alerts={alerts}
            wristbands={wristbands}
            onOpenScan={() => setIsCameraOpen(true)}
            onViewWorkers={() => setActiveTab('WORKERS')}
            onViewAlerts={() => setActiveTab('ALERTS')}
            onSelectWorker={() => setActiveTab('WORKERS')}
          />
        );

      case 'ADMIN':
        return (
          <AdminDashboard
            workers={workers}
            wristbands={wristbands}
            readings={readings}
            alerts={alerts}
            onViewWorkers={() => setActiveTab('WORKERS')}
            onViewBands={() => setActiveTab('BANDS')}
            onViewAlerts={() => setActiveTab('ALERTS')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#292925] flex flex-col max-w-md mx-auto relative px-4 pt-4">
      {/* Main Viewport Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Role-Specific Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#EDE5D6]/95 backdrop-blur-md border-t border-[#D8D0C2] px-3 py-2 flex items-center justify-around z-40">
        <button
          onClick={() => setActiveTab('HOME')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono transition-colors ${
            activeTab === 'HOME' ? 'text-[#292925] font-bold' : 'text-[#878377]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        {role === 'WORKER' && (
          <button
            onClick={() => setIsCameraOpen(true)}
            className="flex flex-col items-center gap-0.5 text-[10px] font-mono text-[#292925] active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 -mt-5 rounded-full bg-[#292925] text-[#F6F1E7] flex items-center justify-center shadow-lg border-2 border-[#F6F1E7]">
              <Camera className="w-5 h-5 text-[#EDE5D6]" />
            </div>
            <span className="font-bold">Scan</span>
          </button>
        )}

        {role === 'SAFETY_OFFICER' && (
          <>
            <button
              onClick={() => setActiveTab('WORKERS')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-mono transition-colors ${
                activeTab === 'WORKERS' ? 'text-[#292925] font-bold' : 'text-[#878377]'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Workers</span>
            </button>

            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex flex-col items-center gap-0.5 text-[10px] font-mono text-[#292925] active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 -mt-5 rounded-full bg-[#292925] text-[#F6F1E7] flex items-center justify-center shadow-lg border-2 border-[#F6F1E7]">
                <Camera className="w-5 h-5 text-[#EDE5D6]" />
              </div>
              <span className="font-bold">Scan</span>
            </button>

            <button
              onClick={() => setActiveTab('ALERTS')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-mono transition-colors relative ${
                activeTab === 'ALERTS' ? 'text-[#292925] font-bold' : 'text-[#878377]'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              {alerts.filter(a => !a.resolved).length > 0 && (
                <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#9A6258]"></span>
              )}
              <span>Alerts</span>
            </button>
          </>
        )}

        {role === 'ADMIN' && (
          <>
            <button
              onClick={() => setActiveTab('WORKERS')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-mono transition-colors ${
                activeTab === 'WORKERS' ? 'text-[#292925] font-bold' : 'text-[#878377]'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Workers</span>
            </button>

            <button
              onClick={() => setActiveTab('BANDS')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-mono transition-colors ${
                activeTab === 'BANDS' ? 'text-[#292925] font-bold' : 'text-[#878377]'
              }`}
            >
              <Radio className="w-5 h-5" />
              <span>Bands</span>
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono transition-colors ${
            activeTab === 'HISTORY' ? 'text-[#292925] font-bold' : 'text-[#878377]'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>History</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono transition-colors ${
            activeTab === 'PROFILE' ? 'text-[#292925] font-bold' : 'text-[#878377]'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>

      {/* Real Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoSelected={handlePhotoSelected}
      />

      {/* 5-Step Animated Analysis Sequence Modal */}
      <AnalysisSequenceModal
        isOpen={isAnalyzing}
        onAnalysisComplete={handleAnalysisComplete}
      />

      {/* Result Screen Modal */}
      {currentResult && (
        <ResultModal
          isOpen={isResultOpen}
          result={currentResult}
          sample={selectedDemoSample}
          imageUri={selectedImageUri}
          onSaveComplete={handleSaveComplete}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MobileAuthProvider>
      <MainAppContent />
    </MobileAuthProvider>
  );
};

export default App;
