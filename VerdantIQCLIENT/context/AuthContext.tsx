'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RoleType, UserProfile, ROLE_CONFIGS,  } from '@/lib/services/authService';
import { NotificationItem, SSEConnectionStatus,  } from '@/lib/services/notificationsService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

export type ViewMode = 'desktop';

interface AuthContextType {
  role: RoleType;
  user: UserProfile;
  viewMode: ViewMode;
  notifications: NotificationItem[];
  sseStatus: SSEConnectionStatus;
  isLoggedIn: boolean;
  isInitializing: boolean;
  firebaseReady: boolean;
  mongoConnected: boolean;
  switchRole: (newRole: RoleType) => void;
  setViewMode: (mode: ViewMode) => void;
  login: (email: string, role?: RoleType) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, role: RoleType, name?: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string, role: RoleType) => Promise<void>;
  signInWithGoogle: (role: RoleType) => Promise<void>;
  signInWithMicrosoft: (role: RoleType) => Promise<void>;
  logout: () => void;
  verifyStudentEmail: (email: string) => Promise<{ success: boolean; institution: string }>;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  triggerLivePushAlert: (alert: Partial<NotificationItem>) => Promise<boolean>;
  roleConfig: typeof ROLE_CONFIGS[RoleType];
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<RoleType>('user');
  const [user, setUser] = useState<UserProfile>(() => ({ id: "1", role: "user", email: "", name: "User", settings: {} } as any));
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [firebaseReady, setFirebaseReady] = useState<boolean>(false);
  const [mongoConnected, setMongoConnected] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    []
  );
  const [sseStatus, setSseStatus] = useState<SSEConnectionStatus>('connecting');

  // Check MongoDB and Firebase status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/db/status');
        const data = await res.json();
        setMongoConnected(Boolean(data?.mongodb?.connected));
        setFirebaseReady(Boolean(data?.firebase?.configured));
      } catch {
        setMongoConnected(false);
      }
    };
    checkStatus();
  });

  // Listen for Firebase Auth state changes if Firebase is configured
  useEffect(() => {
    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser && firebaseUser.email) {
          const stored = null as any;
          const targetRole = stored?.role || role || 'user';
          const updatedUser = (({ id: "1", role: "user", email: "", name: "User", settings: {} } as any) as any);
          setUser(updatedUser);
          setIsLoggedIn(true);
          /* removed mock async call */
        }
      });
      return () => unsubscribe();
    }
  }, [role]);

  // Restore stored session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = null as any;
        if (stored && stored.role) {
          const mockUsr = (({ id: "1", role: "user", email: "", name: "User", settings: {} } as any) as any);
          setUser(mockUsr);
          setRole(stored.role);
          setIsLoggedIn(true);
          /* removed mock async call */
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  });

  // Live SSE push-based administrative infrastructure alert stream
  useEffect(() => {
    if (!isLoggedIn || isInitializing) return;

    const cleanup = () => {};

    return () => {
      cleanup();
    };
  }, [isLoggedIn, isInitializing]);

  const switchRole = async (newRole: RoleType) => {
    setRole(newRole);
    const userObj = ({ id: "1", role: "user", email: "", name: "User", settings: {} } as any);
    setUser(userObj);
    // no-op mock save

    /* removed mock async call */
  };

  const login = async (email: string, targetRole: RoleType = 'user') => {
    const loggedInUser = ({} as any);
    setUser(loggedInUser);
    setRole(targetRole);
    setIsLoggedIn(true);
  };

  const signUpWithEmail = async (email: string, pass: string, targetRole: RoleType, name?: string) => {
    const loggedInUser = ({} as any);
    setUser(loggedInUser);
    setRole(targetRole);
    setIsLoggedIn(true);
  };

  const signInWithEmail = async (email: string, pass: string, targetRole: RoleType) => {
    const loggedInUser = ({} as any);
    setUser(loggedInUser);
    setRole(targetRole);
    setIsLoggedIn(true);
  };

  const signInWithGoogle = async (targetRole: RoleType) => {
    const loggedInUser = ({} as any);
    setUser(loggedInUser);
    setRole(targetRole);
    setIsLoggedIn(true);
  };

  const signInWithMicrosoft = async (targetRole: RoleType) => {
    const loggedInUser = ({} as any);
    setUser(loggedInUser);
    setRole(targetRole);
    setIsLoggedIn(true);
  };

  const logout = () => {
    
    setIsLoggedIn(false);
  };

  const verifyStudentEmail = async (email: string) => {
    const res = ({ success: false, institution: "" } as any);
    if (res.success) {
      setUser((prev) => ({
        ...prev,
        email,
        isVerifiedStudent: true,
        institution: res.institution,
      }));
    }
    return res;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const triggerLivePushAlert = async (alert: Partial<NotificationItem>) => {
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        viewMode,
        notifications,
        sseStatus,
        isLoggedIn,
        isInitializing,
        firebaseReady,
        mongoConnected,
        switchRole,
        setViewMode,
        login,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signInWithMicrosoft,
        logout,
        verifyStudentEmail,
        markNotificationRead,
        clearNotifications,
        triggerLivePushAlert,
        roleConfig: ROLE_CONFIGS[role],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
