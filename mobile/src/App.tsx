import React, { useState, useEffect } from 'react';
import { MobileAuthProvider, useMobileAuth } from './context/MobileAuthContext';
import { repository } from './services/DosimeterRepository';
import type { Worker, Reading, Alert, Wristband, DemoSampleBadge, BackendAnalyzeResponse } from './types/mobile';

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
  const [targetWorker, setTargetWorker] = useState<Worker | null>(null);
  const [inspectionLocation, setInspectionLocation] = useState<string>('');
  const [officerNotes, setOfficerNotes] = useState<string>('');
  const [currentApiResponse, setCurrentApiResponse] = useState<BackendAnalyzeResponse | null>(null);

  // Sync state with repository changes
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
  const handlePhotoSelected = (data: {
    imageUri?: string;
    sample?: DemoSampleBadge;
    targetWorker?: Worker;
    inspectionLocation?: string;
    officerNotes?: string;
  }) => {
    setIsCameraOpen(false);
    setSelectedImageUri(data.imageUri || null);
    setSelectedDemoSample(data.sample || null);
    setTargetWorker(data.targetWorker || activeWorker);
    setInspectionLocation(data.inspectionLocation || '');
    setOfficerNotes(data.officerNotes || '');

    if (data.sample) {
      // Demo reference badge selected
      const sampleResp: BackendAnalyzeResponse = {
        estimated_exposure_ppm_h: data.sample.estimatedDose,
        status: data.sample.status,
        confidence: {
          score: data.sample.confidence / 100,
          uncertainty_95_ci_ppm_h: 0.25,
          ci_lower_ppm_h: Math.max(0, data.sample.estimatedDose - 0.25),
          ci_upper_ppm_h: data.sample.estimatedDose + 0.25
        },
        rgb: {
          r: parseInt(data.sample.colorHex.slice(1, 3), 16) || 150,
          g: parseInt(data.sample.colorHex.slice(3, 5), 16) || 100,
          b: parseInt(data.sample.colorHex.slice(5, 7), 16) || 120,
          hex: data.sample.colorHex
        },
        lab: { L: 55.0, a: 35.0, b: 10.0 },
        delta_e: data.sample.status === 'NORMAL' ? 8.5 : data.sample.status === 'MONITOR' ? 32.0 : 65.0,
        temperature: data.sample.temperature,
        humidity: data.sample.humidity,
        shelf_age_days: data.sample.shelfAgeDays,
        image_quality: {
          verdict: 'PASS',
          score: 0.98,
          is_too_dark: false,
          is_overexposed: false,
          is_blurry: false,
          strip_not_visible: false,
          reference_scale_missing: false,
          notes: 'Calibrated SIH physical reference sample.'
        },
        band_detected: true,
        action_guideline: data.sample.description,
        prototype: true,
        vision_engine: 'Calibrated Physical Reference Sample'
      };
      setCurrentApiResponse(sampleResp);
      setIsAnalyzing(false);
      setIsResultOpen(true);
    } else if (data.imageUri) {
      // Real captured photo -> Start analysis sequence & backend API call
      setIsAnalyzing(true);
    }
  };

  // Handler: When backend API responds successfully
  const handleAnalysisSuccess = (response: BackendAnalyzeResponse) => {
    setCurrentApiResponse(response);
    setIsAnalyzing(false);
    setIsResultOpen(true);
  };

  // Handler: When user cancels during analysis
  const handleAnalysisCancel = () => {
    setIsAnalyzing(false);
    setIsCameraOpen(true);
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
    setCurrentApiResponse(null);
    setTargetWorker(null);
    setInspectionLocation('');
    setOfficerNotes('');
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
    <div className="min-h-screen bg-[#F6F1E7] text-[#292925] flex flex-col max-w-md mx-auto relative px-4 pt-2 pb-8">
      {/* Top Branding Bar with 2nd Image Logo & PS-118 */}
      <header className="flex items-center justify-between py-2 px-1 mb-2 border-b border-[#D8D0C2]/80">
        <div className="flex items-center gap-2.5">
          <img 
            src="/sarvas_icon.png" 
            alt="SARVAS Logo" 
            className="w-8 h-8 rounded-lg object-contain bg-[#EDE5D6] p-0.5 border border-[#D8D0C2] shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-serif font-bold text-base text-[#292925] tracking-tight">SARVAS</span>
              <span className="text-[9px] font-mono bg-[#71806B]/20 text-[#4F5D4B] px-1.5 py-0.5 rounded font-semibold">PS-118</span>
            </div>
            <span className="text-[9px] font-mono text-[#878377] block mt-0.5">SIH 2026 · Dosimeter</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-medium text-[#5D5B53] bg-[#EDE5D6] px-2 py-0.5 rounded border border-[#D8D0C2]">
            {role ? role.replace('_', ' ') : 'OPERATOR'}
          </span>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Role-Specific Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#EDE5D6]/95 backdrop-blur-md border-t border-[#D8D0C2] px-3 py-2 flex items-center justify-around z-40 shadow-lg">
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
            <div className="w-11 h-11 -mt-5 rounded-full bg-[#292925] text-[#F6F1E7] flex items-center justify-center shadow-lg border-2 border-[#F6F1E7]">
              <Camera className="w-5 h-5 text-[#EDE5D6]" />
            </div>
            <span className="font-bold">Scan Band</span>
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
              <div className="w-11 h-11 -mt-5 rounded-full bg-[#292925] text-[#F6F1E7] flex items-center justify-center shadow-lg border-2 border-[#F6F1E7]">
                <Camera className="w-5 h-5 text-[#EDE5D6]" />
              </div>
              <span className="font-bold">Audit Scan</span>
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
        userRole={role || 'WORKER'}
        currentWorker={activeWorker}
        onClose={() => setIsCameraOpen(false)}
        onPhotoSelected={handlePhotoSelected}
      />

      {/* 5-Step Animated Analysis Sequence Modal */}
      <AnalysisSequenceModal
        isOpen={isAnalyzing}
        imageUri={selectedImageUri}
        onAnalysisSuccess={handleAnalysisSuccess}
        onClose={handleAnalysisCancel}
      />

      {/* Result Screen Modal */}
      {isResultOpen && currentApiResponse && (
        <ResultModal
          isOpen={isResultOpen}
          apiResult={currentApiResponse}
          sample={selectedDemoSample}
          imageUri={selectedImageUri}
          targetWorker={targetWorker}
          inspectionLocation={inspectionLocation}
          officerNotes={officerNotes}
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
