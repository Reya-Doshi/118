import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Worker, ExposureReading, DemoSample, PageView } from '../types';
import { INITIAL_WORKERS, INITIAL_READINGS, DEMO_SAMPLES } from '../data/mockData';

interface AppContextType {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  isExplanationOpen: boolean;
  openExplanation: () => void;
  closeExplanation: () => void;
  workers: Worker[];
  readings: ExposureReading[];
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_WORKERS_KEY = '118_workers_v1';
const STORAGE_READINGS_KEY = '118_readings_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageView>('landing');
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<DemoSample>(DEMO_SAMPLES[1]); // Default Sample B (Monitor)
  
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

  const [latestReading, setLatestReading] = useState<ExposureReading | null>(readings[0] || null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const openExplanation = () => setIsExplanationOpen(true);
  const closeExplanation = () => setIsExplanationOpen(false);

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

    showToast(`Reading saved for ${newReading.workerName} (${newReading.badgeId}): ${newReading.dosePpmH} ppm·h [${newReading.status}]`);
  };

  const resetDemoData = () => {
    setWorkers(INITIAL_WORKERS);
    setReadings(INITIAL_READINGS);
    setLatestReading(INITIAL_READINGS[0]);
    localStorage.removeItem(STORAGE_WORKERS_KEY);
    localStorage.removeItem(STORAGE_READINGS_KEY);
    showToast('Demo data reset to initial shift state.');
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        isExplanationOpen,
        openExplanation,
        closeExplanation,
        workers,
        readings,
        latestReading,
        setLatestReading,
        selectedSample,
        setSelectedSample,
        selectedWorker,
        setSelectedWorker,
        saveReading,
        toastMessage,
        showToast,
        resetDemoData
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
