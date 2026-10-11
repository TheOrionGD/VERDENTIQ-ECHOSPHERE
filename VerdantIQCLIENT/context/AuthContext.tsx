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
  login: (email: string, role?: RoleType) => Promise<UserProfile>;
  signUpWithEmail: (email: string, pass: string, role: RoleType, name?: string) => Promise<UserProfile>;
  signInWithEmail: (email: string, pass: string, role: RoleType) => Promise<UserProfile>;
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
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

  // Helper to set session cookie for Next.js middleware
  const syncSessionCookie = (userObj: UserProfile, token: string) => {
    if (typeof window !== 'undefined') {
      const sessionData = encodeURIComponent(JSON.stringify({
        token,
        role: userObj.role,
        email: userObj.email,
        userId: userObj.id,
      }));
      document.cookie = `verdantiq_session=${sessionData}; path=/; max-age=604800; SameSite=Lax;`;
    }
  };

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
            syncSessionCookie(parsedUser, storedToken);
          } else {
            setIsLoggedIn(false);
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

  const switchRole = React.useCallback(async (newRole: RoleType) => {
    setRole(newRole);
    setUser((prev) => {
      const updated = { ...prev, role: newRole };
      if (typeof window !== 'undefined') {
        localStorage.setItem('verdantiq_user', JSON.stringify(updated));
        const storedToken = localStorage.getItem('verdantiq_token') || 'dev_mock_token';
        syncSessionCookie(updated, storedToken);
      }
      return updated;
    });
  }, []);

  const login = async (email: string, targetRole: RoleType = 'user'): Promise<UserProfile> => {
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
      const token = data.token || `db_jwt_${Buffer.from(JSON.stringify({ uid: userObj.id, email: userObj.email, role: userObj.role })).toString('base64')}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('verdantiq_token', token);
        localStorage.setItem('verdantiq_user', JSON.stringify(userObj));
        syncSessionCookie(userObj, token);
      }
      setUser(userObj);
      setRole(userObj.role || targetRole);
      setIsLoggedIn(true);
      return userObj;
    } catch {
      const fallbackUser: UserProfile = {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        email,
        name: email.split('@')[0],
        role: targetRole,
        tenantId: 'tenant_default',
        createdAt: new Date().toISOString(),
      };
      const token = `db_jwt_fallback`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('verdantiq_token', token);
        localStorage.setItem('verdantiq_user', JSON.stringify(fallbackUser));
        syncSessionCookie(fallbackUser, token);
      }
      setUser(fallbackUser);
      setRole(targetRole);
      setIsLoggedIn(true);
      return fallbackUser;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, targetRole: RoleType, name?: string): Promise<UserProfile> => {
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
      const token = data.token || `db_jwt_${Buffer.from(JSON.stringify({ uid: userObj.id, email: userObj.email, role: userObj.role })).toString('base64')}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('verdantiq_token', token);
        localStorage.setItem('verdantiq_user', JSON.stringify(userObj));
        syncSessionCookie(userObj, token);
      }
      setUser(userObj);
      setRole(userObj.role || targetRole);
      setIsLoggedIn(true);
      return userObj;
    } catch (e: any) {
      return await login(email, targetRole);
    }
  };

  const signInWithEmail = async (email: string, pass: string, targetRole: RoleType): Promise<UserProfile> => {
    return await login(email, targetRole);
  };

  const signInWithGoogle = async (targetRole: RoleType) => {
    await login('google.user@verdantiq.org', targetRole);
  };

  const signInWithMicrosoft = async (targetRole: RoleType) => {
    await login('outlook.user@verdantiq.org', targetRole);
  };

  const logout = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('verdantiq_token');
      localStorage.removeItem('verdantiq_user');
      document.cookie = 'verdantiq_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;';
    }
    setIsLoggedIn(false);
  }, []);

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
