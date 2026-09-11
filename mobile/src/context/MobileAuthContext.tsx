import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types/mobile';
import { DEMO_USERS } from '../services/DosimeterRepository';

interface MobileAuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginAsDemoRole: (role: UserRole) => void;
  logout: () => void;
}

const MobileAuthContext = createContext<MobileAuthContextType | undefined>(undefined);

export const MobileAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('118_mobile_current_role');
    if (saved) {
      const matched = DEMO_USERS.find(u => u.role === saved);
      if (matched) return matched;
    }
    return null;
  });

  const loginAsDemoRole = (role: UserRole) => {
    const user = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(user);
    localStorage.setItem('118_mobile_current_role', role);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('118_mobile_current_role');
  };

  return (
    <MobileAuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        loginAsDemoRole,
        logout
      }}
    >
      {children}
    </MobileAuthContext.Provider>
  );
};

export const useMobileAuth = () => {
  const context = useContext(MobileAuthContext);
  if (!context) {
    throw new Error('useMobileAuth must be used within a MobileAuthProvider');
  }
  return context;
};
