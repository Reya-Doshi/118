import React, { useState, useEffect } from 'react';
import { MobileAuthProvider, useMobileAuth } from './context/MobileAuthContext';
import { repository } from './services/DosimeterRepository';
import { CalibrationEngine } from './services/CalibrationEngine';
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
import { KioskModeView } from './views/KioskModeView';

import { Home, Camera, Clock, User, ShieldAlert, Users, Radio, LogOut, Scan } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, role, isAuthenticated, logout } = useMobileAuth();

  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'HOME' | 'SCAN' | 'HISTORY' | 'PROFILE' | 'WORKERS' | 'ALERTS' | 'BANDS' | 'KIOSK'>('HOME');

  // Live repository states
  const [workers, setWorkers] = useState<Worker[]>(repository.getWorkers());
  const [readings, setReadings] = useState<Reading[]>(repository.getReadings());
  const [alerts, setAlerts] = useState<Alert[]>(repository.getAlerts());
  const [wristbands, setWristbands] = useState<Wristband[]>(repository.getWristbands());

  // Worker language preference (Default English, Worker can toggle to Hindi)
  const [workerLanguage, setWorkerLanguage] = useState<'hi' | 'en'>('en');

  // Camera & Analysis Modal States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [pendingSampleResponse, setPendingSampleResponse] = useState<BackendAnalyzeResponse | null>(null);

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
      setSelectedDemoSample(data.sample);
      const sampleImg = data.sample.imageUri || data.imageUri || null;
      setSelectedImageUri(sampleImg);

      const hex = data.sample.colorHex;
      const r = parseInt(hex.slice(1, 3), 16) || 200;
      const g = parseInt(hex.slice(3, 5), 16) || 200;
      const b = parseInt(hex.slice(5, 7), 16) || 200;
      const lab = CalibrationEngine.srgbToLab(r, g, b);
      const deltaE = Math.round(CalibrationEngine.computeDeltaE(lab) * 10) / 10;

      const sampleResp: BackendAnalyzeResponse = {
        estimated_exposure_ppm_h: data.sample.estimatedDose,
        status: data.sample.status,
        confidence: {
          score: data.sample.confidence / 100,
          uncertainty_95_ci_ppm_h: 0.12,
          ci_lower_ppm_h: Math.max(0, data.sample.estimatedDose - 0.12),
          ci_upper_ppm_h: data.sample.estimatedDose + 0.12
        },
        rgb: { r, g, b, hex },
        lab,
        delta_e: deltaE,
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
          notes: 'Calibrated Dual-Zone physical reference sample.'
        },
        band_detected: true,
        action_guideline: data.sample.description,
        prototype: true,
        vision_engine: 'Calibrated Dual-Zone Physical Reference Sample'
      };

      // Store pending sample response and trigger the 5-step AI thinking sequence
      setPendingSampleResponse(sampleResp);
      setIsAnalyzing(true);
    } else if (data.imageUri) {
      // Real captured photo -> Start analysis sequence & backend API call
      setPendingSampleResponse(null);
      setIsAnalyzing(true);
    }
  };

  // Handler: When backend API responds successfully
  const handleAnalysisSuccess = (response: BackendAnalyzeResponse) => {
    setCurrentApiResponse(response);
    setPendingSampleResponse(null);
    setIsAnalyzing(false);
    setIsResultOpen(true);
  };

  // Handler: When user cancels during analysis
  const handleAnalysisCancel = () => {
    setIsAnalyzing(false);
    setPendingSampleResponse(null);
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
          workerLanguage={workerLanguage}
        />
      );
    }

    if (activeTab === 'PROFILE') {
      return (
        <ProfileView 
          onBack={() => setActiveTab('HOME')} 
          workerLanguage={workerLanguage}
        />
      );
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

    if (activeTab === 'KIOSK') {
      return (
        <KioskModeView
          onBack={() => setActiveTab('HOME')}
          onOpenScanModal={() => setIsCameraOpen(true)}
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
            workerLanguage={workerLanguage}
            onToggleLanguage={(lang) => setWorkerLanguage(lang)}
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
            readings={readings}
            alerts={alerts}
            wristbands={wristbands}
            onViewWorkers={() => setActiveTab('WORKERS')}
            onViewAlerts={() => setActiveTab('ALERTS')}
            onViewBands={() => setActiveTab('BANDS')}
          />
        );

      default:
        return null;
    }
  };

  const isHindiWorker = role === 'WORKER' && workerLanguage === 'hi';

  return (
    <div 
      className="min-h-screen bg-[#F6F1E7] text-[#292925] flex flex-col max-w-md mx-auto relative px-3.5 pb-8"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}
    >
      {/* Top Sleek Header Bar — SARVAS by RageB8 */}
      <header className="flex items-center justify-between py-2 px-3 mb-3 bg-white rounded-2xl border border-[#D8D0C2] shadow-xs">
        <div className="flex items-center gap-2.5">
          <img 
            src="/sarvas_logo_v2.png" 
            alt="SARVAS by RageB8 Logo" 
            className="w-9 h-9 rounded-xl object-contain bg-[#FAF8F5] p-0.5 border border-[#D8D0C2] shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-serif font-bold text-base text-[#292925] tracking-tight">SARVAS</span>
            </div>
            <span className="text-[9px] font-mono text-[#878377] block mt-0.5">
              {isHindiWorker ? 'स्मार्ट रिस्टबैंड डॉसिमीटर' : 'SIH 2026 · PS-118 Dosimeter'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('KIOSK')}
            className={`py-1 px-2 rounded-md text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-all shadow-2xs cursor-pointer ${
              activeTab === 'KIOSK'
                ? 'bg-black text-white ring-1 ring-black'
                : 'bg-[#292925] hover:bg-black text-white'
            }`}
            title="Interactive Kiosk Flow"
          >
            <Scan className="w-3 h-3 text-emerald-400" />
            <span>Kiosk</span>
          </button>

          <button
            onClick={logout}
            className="py-1 px-2 rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-medium flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            title={isHindiWorker ? 'लॉग आउट' : 'Sign Out'}
          >
            <LogOut className="w-3 h-3" />
            <span>{isHindiWorker ? 'लॉग आउट' : 'Sign Out'}</span>
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Subtle Mobile Brand Footer with Team Attribution */}
      <footer className="text-center py-3 pb-20 text-[10px] font-mono text-[#878377] space-y-0.5">
        <div>
          <span className="font-bold text-[#292925]">SARVAS</span>
          <span> · Built by </span>
          <span className="font-bold text-[#2F6B38]">RageB8</span>
          <span> (SIH 2026)</span>
        </div>
        <div className="text-[9px] text-[#A8A398]">
          PS-118 · Real-Time H₂S Dosimeter
        </div>
      </footer>

      {/* Role-Specific Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#EDE5D6]/95 backdrop-blur-md border-t border-[#D8D0C2] px-3 py-2 flex items-center justify-around z-40 shadow-lg">
        <button
          onClick={() => setActiveTab('HOME')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono transition-colors ${
            activeTab === 'HOME' ? 'text-[#292925] font-bold' : 'text-[#878377]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{isHindiWorker ? 'मुख्य' : 'Home'}</span>
        </button>

        {role === 'WORKER' && (
          <button
            onClick={() => setIsCameraOpen(true)}
            className="flex flex-col items-center gap-0.5 text-[10px] font-mono text-[#292925] active:scale-95 transition-transform"
          >
            <div className="w-11 h-11 -mt-5 rounded-full bg-[#292925] text-[#F6F1E7] flex items-center justify-center shadow-lg border-2 border-[#F6F1E7]">
              <Camera className="w-5 h-5 text-[#EDE5D6]" />
            </div>
            <span className="font-bold">{isHindiWorker ? 'स्कैन करें' : 'Scan Band'}</span>
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
          <span>{isHindiWorker ? 'इतिहास' : 'History'}</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono transition-colors ${
            activeTab === 'PROFILE' ? 'text-[#292925] font-bold' : 'text-[#878377]'
          }`}
        >
          <User className="w-5 h-5" />
          <span>{isHindiWorker ? 'प्रोफाइल' : 'Profile'}</span>
        </button>
      </nav>

      {/* Real Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        userRole={role || 'WORKER'}
        currentWorker={activeWorker}
        workerLanguage={workerLanguage}
        onClose={() => setIsCameraOpen(false)}
        onPhotoSelected={handlePhotoSelected}
      />

      {/* 5-Step Animated Analysis Sequence Modal */}
      <AnalysisSequenceModal
        isOpen={isAnalyzing}
        imageUri={selectedImageUri}
        precomputedResponse={pendingSampleResponse}
        workerLanguage={workerLanguage}
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
          workerLanguage={workerLanguage}
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
