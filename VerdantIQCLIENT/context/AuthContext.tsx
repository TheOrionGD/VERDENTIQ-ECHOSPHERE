'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RoleType, UserProfile, ROLE_CONFIGS } from '@/lib/services/authService';
import { NotificationItem, SSEConnectionStatus } from '@/lib/services/notificationsService';

export type ViewMode = 'desktop';

interface AuthContextType {
  role: RoleType;
  user: UserProfile;
  viewMode: ViewMode;
  notifications: NotificationItem[];
  sseStatus: SSEConnectionStatus;
  isLoggedIn: boolean;
  isInitializing: boolean;
  dbAuthReady: boolean;
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
  const [user, setUser] = useState<UserProfile>(() => ({
    id: 'usr_default',
    role: 'user',
    email: 'user@verdantiq.org',
    name: 'User',
    tenantId: 'tenant_default',
    createdAt: new Date().toISOString(),
  }));
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [dbAuthReady, setDbAuthReady] = useState<boolean>(true);
  const [mongoConnected, setMongoConnected] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [sseStatus, setSseStatus] = useState<SSEConnectionStatus>('connecting');

  // Check MongoDB and Database status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/db/status');
        const data = await res.json();
        setMongoConnected(Boolean(data?.mongodb?.connected));
        setDbAuthReady(Boolean(data?.databaseAuth?.configured));
      } catch {
        setMongoConnected(false);
      }
    };
    checkStatus();
  }, []);

  // Restore stored session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('verdantiq_token');
          const storedUserJson = localStorage.getItem('verdantiq_user');
          if (storedToken && storedUserJson) {
            const parsedUser = JSON.parse(storedUserJson);
            setUser(parsedUser);
            setRole(parsedUser.role || 'user');
            setIsLoggedIn(true);
          }
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, []);

  const switchRole = async (newRole: RoleType) => {
    setRole(newRole);
    setUser((prev) => {
      const updated = { ...prev, role: newRole };
      if (typeof window !== 'undefined') {
        localStorage.setItem('verdantiq_user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const login = async (email: string, targetRole: RoleType = 'user') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: targetRole }),
      });
      const data = await res.json();
      const userObj: UserProfile = data.user || {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        email,
        name: email.split('@')[0],
        role: targetRole,
        tenantId: 'tenant_default',
        createdAt: new Date().toISOString(),
      };
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('verdantiq_token', data.token);
        localStorage.setItem('verdantiq_user', JSON.stringify(userObj));
      }
      setUser(userObj);
      setRole(targetRole);
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(true);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, targetRole: RoleType, name?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, role: targetRole, name }),
      });
      const data = await res.json();
      const userObj: UserProfile = data.user || {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        email,
        name: name || email.split('@')[0],
        role: targetRole,
        tenantId: 'tenant_default',
        createdAt: new Date().toISOString(),
      };
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('verdantiq_token', data.token);
        localStorage.setItem('verdantiq_user', JSON.stringify(userObj));
      }
      setUser(userObj);
      setRole(targetRole);
      setIsLoggedIn(true);
    } catch (e: any) {
      await login(email, targetRole);
    }
  };

  const signInWithEmail = async (email: string, pass: string, targetRole: RoleType) => {
    await login(email, targetRole);
  };

  const signInWithGoogle = async (targetRole: RoleType) => {
    await login('google.user@verdantiq.org', targetRole);
  };

  const signInWithMicrosoft = async (targetRole: RoleType) => {
    await login('outlook.user@verdantiq.org', targetRole);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('verdantiq_token');
      localStorage.removeItem('verdantiq_user');
    }
    setIsLoggedIn(false);
  };

  const verifyStudentEmail = async (email: string) => {
    const isEdu = email.endsWith('.edu') || email.includes('institution.org');
    if (isEdu) {
      setUser((prev) => ({
        ...prev,
        email,
        isVerifiedStudent: true,
        institution: 'Academic Partner',
      }));
      return { success: true, institution: 'Academic Partner' };
    }
    return { success: false, institution: '' };
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
        dbAuthReady,
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
