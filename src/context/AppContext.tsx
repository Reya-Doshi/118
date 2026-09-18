import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Worker, ExposureReading, DemoSample, PageView, UserProfile, AlertItem } from '../types';
import { INITIAL_WORKERS, INITIAL_READINGS, DEMO_SAMPLES, INITIAL_ALERTS } from '../data/mockData';

interface AppContextType {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  isExplanationOpen: boolean;
  openExplanation: () => void;
  closeExplanation: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  workers: Worker[];
  readings: ExposureReading[];
  alerts: AlertItem[];
  setAlerts: React.Dispatch<React.SetStateAction<AlertItem[]>>;
  latestReading: ExposureReading | null;
  setLatestReading: (reading: ExposureReading | null) => void;
  selectedSample: DemoSample;
  setSelectedSample: (sample: DemoSample) => void;
  selectedWorker: Worker | null;
  setSelectedWorker: (worker: Worker | null) => void;
  saveReading: (reading: ExposureReading) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  resetDemoData: () => void;
  logout: () => void;
  workerLanguage: 'en' | 'hi';
  setWorkerLanguage: (lang: 'en' | 'hi') => void;
  autoScanPending: boolean;
  setAutoScanPending: (val: boolean) => void;
  loadAndScanSample: (sample: DemoSample) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_WORKERS_KEY = '118_workers_v2';
const STORAGE_READINGS_KEY = '118_readings_v2';
const STORAGE_ALERTS_KEY = '118_alerts_v1';
const STORAGE_USER_KEY = '118_user_profile_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageView>('landing');
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<DemoSample>(DEMO_SAMPLES[1]); // Default Sample B (Monitor)
  
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      // Clear legacy storage key so old sessions don't persist Mira
      localStorage.removeItem('118_user_profile_v1');
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Local storage state initialization
  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WORKERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_WORKERS;
    } catch {
      return INITIAL_WORKERS;
    }
  });

  const [readings, setReadings] = useState<ExposureReading[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_READINGS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_READINGS;
    } catch {
      return INITIAL_READINGS;
    }
  });

  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ALERTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [latestReading, setLatestReading] = useState<ExposureReading | null>(readings[0] || null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [workerLanguage, setWorkerLanguageState] = useState<'en' | 'hi'>('hi');
  const [autoScanPending, setAutoScanPending] = useState(false);

  const loadAndScanSample = (sample: DemoSample) => {
    setSelectedSample(sample);
    setAutoScanPending(true);
    setActivePage('scan');
  };

  const setWorkerLanguage = (lang: 'en' | 'hi') => {
    setWorkerLanguageState(lang);
    try {
      localStorage.setItem('118_worker_lang', lang);
    } catch {}
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WORKERS_KEY, JSON.stringify(workers));
    } catch (e) {
      console.error('Failed to save workers to localStorage', e);
    }
  }, [workers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_READINGS_KEY, JSON.stringify(readings));
    } catch (e) {
      console.error('Failed to save readings to localStorage', e);
    }
  }, [readings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ALERTS_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.error('Failed to save alerts to localStorage', e);
    }
  }, [alerts]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to save currentUser to localStorage', e);
    }
  }, [currentUser]);

  const openExplanation = () => setIsExplanationOpen(true);
  const closeExplanation = () => setIsExplanationOpen(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const saveReading = (newReading: ExposureReading) => {
    // 1. Prepend reading to history log
    setReadings(prev => [newReading, ...prev]);
    setLatestReading(newReading);

    // 2. Update target worker's current dose & status if found
    setWorkers(prevWorkers =>
      prevWorkers.map(w => {
        if (w.badgeId === newReading.badgeId || w.workerId === newReading.workerId || w.name === newReading.workerName) {
          return {
            ...w,
            currentDose: newReading.dosePpmH,
            status: newReading.status,
            lastReadingTime: 'Just Now',
            trend7Day: w.trend7Day.map((t, idx) =>
              idx === w.trend7Day.length - 1 ? { ...t, dose: newReading.dosePpmH } : t
            )
          };
        }
        return w;
      })
    );

    // 3. Auto-generate Safety Officer Prototype Review Alert if dose > 1.00 ppm·h or status is REVIEW
    if (newReading.status === 'REVIEW' || newReading.dosePpmH > 1.00) {
      const reviewAlert: AlertItem = {
        id: `alt-${Date.now()}`,
        type: 'REVIEW',
        title: `Prototype Review Alert: ${newReading.badgeId}`,
        description: `${newReading.workerName} (${newReading.workerId}) recorded ${newReading.dosePpmH.toFixed(2)} ppm·h at ${newReading.tempC}°C, ${newReading.humidityPercent}% RH. Action: Review exposure and verify workplace conditions.`,
        badgeId: newReading.badgeId,
        workerId: newReading.workerId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        safetyOfficer: 'Mira Patel',
        actionRequired: 'Review exposure and verify workplace conditions.',
        dosePpmH: newReading.dosePpmH,
        tempC: newReading.tempC,
        humidityPercent: newReading.humidityPercent
      };
      setAlerts(prev => [reviewAlert, ...prev]);
      showToast(`PROTOTYPE REVIEW ALERT created for Safety Officer Mira Patel (${newReading.badgeId}: ${newReading.dosePpmH} ppm·h)`);
    } else {
      showToast(`Reading saved for ${newReading.workerName} (${newReading.badgeId}): ${newReading.dosePpmH} ppm·h [${newReading.status}]`);
    }
  };

  const resetDemoData = () => {
    setWorkers(INITIAL_WORKERS);
    setReadings(INITIAL_READINGS);
    setAlerts(INITIAL_ALERTS);
    setLatestReading(INITIAL_READINGS[0]);
    localStorage.removeItem(STORAGE_WORKERS_KEY);
    localStorage.removeItem(STORAGE_READINGS_KEY);
    localStorage.removeItem(STORAGE_ALERTS_KEY);
    showToast('Demo data reset to initial shift state.');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    setActivePage('landing');
    showToast('Signed out successfully.');
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        isExplanationOpen,
        openExplanation,
        closeExplanation,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        currentUser,
        setCurrentUser,
        workers,
        readings,
        alerts,
        setAlerts,
        latestReading,
        setLatestReading,
        selectedSample,
        setSelectedSample,
        selectedWorker,
        setSelectedWorker,
        saveReading,
        toastMessage,
        showToast,
        resetDemoData,
        logout,
        workerLanguage,
        setWorkerLanguage,
        autoScanPending,
        setAutoScanPending,
        loadAndScanSample
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
