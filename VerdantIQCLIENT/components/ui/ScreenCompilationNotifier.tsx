'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Cpu, CheckCircle2, Sparkles, X, Clock, Layers, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScreenCompilationContextType {
  isCompiling: boolean;
  screenName: string;
  compilationTime: number;
  status: 'idle' | 'compiling' | 'ready';
  startCompilation: (name?: string, note?: string) => void;
  finishCompilation: (name?: string) => void;
  dismissNotification: () => void;
}

const ScreenCompilationContext = createContext<ScreenCompilationContextType | null>(null);

// Human-friendly mapping of known route paths to Screen Names
const ROUTE_NAME_MAP: Record<string, string> = {
  '/': 'Root Auth Resolver',
  '/landing': 'Platform Landing Showcase',
  '/login': 'Identity Authentication Portal',
  '/design-system': 'Design System Kit Inspector',
  '/assistant': 'AI Copilot Assistant',
  '/my-activity': 'System Activity Ledger',
  '/profile': 'User Profile & Security',
  '/settings': 'Preferences & Settings',
  '/notifications': 'Notification Center',
  '/help': 'Documentation & Operations Manual',
  '/403': 'Role-Based Access Control Matrix',
  '/admin': 'Platform Administration Center',
  '/admin-dashboard': 'Admin Telemetry Mesh',
  '/admin/telemetry': 'Platform Telemetry Mesh',
  '/admin/audit-logs': 'Security & Compliance Logs',
  '/admin/database': 'Database Cluster Monitor',
  '/admin/access-grants': 'IAM Access Grants',
  '/admin/domains': 'Allowed Domain Registry',
  '/admin/feature-flags': 'Feature Flags Controller',
  '/admin/rate-limits': 'API Rate Limit Rules',
  '/admin/rbac-schema': 'RBAC Security Schema',
  '/admin/broadcasts': 'Emergency Broadcast Engine',
  '/admin/tenant-requests': 'Tenant Provisioning Queue',
  '/institution': 'Institution Admin Center',
  '/institution-dashboard': 'Institution Executive Center',
  '/institution/dashboard': 'Institution Executive Center',
  '/institution/geofence': 'Campus Geofence Engine',
  '/institution/departments': 'Department ESG Performance',
  '/institution/challenges': 'Campus Sustainability Challenges',
  '/institution/verify': 'Anomaly Escalation Queue',
  '/institution/reports': 'Executive ESG Reports',
  '/institution/domains': 'Institutional Domain Oversight',
  '/institution/students': 'Student Registry & Cohorts',
  '/institution/analytics': 'MILP Multi-Facility Optimizer',
  '/institution/settings': 'Institution Policy Config',
  '/dept': 'Department Operations Center',
  '/dept-dashboard': 'Department Operations Center',
  '/dept/dashboard': 'Department Operations Center',
  '/student': 'Student Climate Hub',
  '/student-dashboard': 'Student Climate Hub',
  '/student/dashboard': 'Student Climate Hub',
  '/mlops': 'MLOps Intelligence Engine',
  '/mlops-dashboard': 'MLOps Intelligence Engine',
  '/mlops/dashboard': 'MLOps Intelligence Engine',
  '/audit': 'Auditor Compliance Ledger',
  '/audit-dashboard': 'Auditor Compliance Ledger',
  '/audit/dashboard': 'Auditor Compliance Ledger',
  '/region': 'Regional Policy & Oversight Center',
  '/region-dashboard': 'Regional Policy & Oversight Center',
  '/region/dashboard': 'Regional Policy & Oversight Center',
  '/user': 'Household Digital Twin & Rewards',
  '/user-dashboard': 'Household Digital Twin & Rewards',
  '/user/dashboard': 'Household Digital Twin & Rewards',
};

// Common routes to prefetch for near-zero compilation latency
const HIGH_PRIORITY_ROUTES = [
  '/admin/telemetry',
  '/institution/dashboard',
  '/dept/dashboard',
  '/student/dashboard',
  '/mlops/models',
  '/audit/overview',
  '/region/dashboard',
  '/user/dashboard',
  '/design-system',
  '/assistant',
];

export const ScreenCompilationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [status, setStatus] = useState<'idle' | 'compiling' | 'ready'>('idle');
  const [screenName, setScreenName] = useState<string>('Screen View');
  const [customNote, setCustomNote] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoDismissRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastPathnameRef = useRef<string>(pathname);

  // Background route prefetcher to eliminate future compilation latency
  useEffect(() => {
    const prefetchRoutes = () => {
      HIGH_PRIORITY_ROUTES.forEach((route) => {
        if (route !== pathname) {
          try {
            router.prefetch(route);
          } catch {
            // ignore prefetch errors
          }
        }
      });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetchRoutes, { timeout: 3000 });
    } else {
      const timeout = setTimeout(prefetchRoutes, 1500);
      return () => clearTimeout(timeout);
    }
  }, [router, pathname]);

  const startCompilation = useCallback((name?: string, note?: string) => {
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    const targetName = name || ROUTE_NAME_MAP[pathname] || pathname || 'Active View';
    setScreenName(targetName);
    setCustomNote(note || 'Compiling Next.js route chunks & hydrating client components...');
    setStatus('compiling');
    setVisible(true);
    setElapsedTime(0);

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const currentElapsed = (Date.now() - startTimeRef.current) / 1000;
      setElapsedTime(Number(currentElapsed.toFixed(1)));
    }, 100);

    // Safety fallback: Never stay stuck in compiling state for longer than 1.5s
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    autoDismissRef.current = setTimeout(() => {
      setStatus('ready');
      setTimeout(() => {
        setVisible(false);
        setStatus('idle');
      }, 500);
    }, 1500);
  }, [pathname]);

  const finishCompilation = useCallback((name?: string) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const targetName = name || ROUTE_NAME_MAP[pathname] || pathname || 'Screen View';
    setScreenName(targetName);
    setStatus('ready');

    const totalSeconds = ((Date.now() - startTimeRef.current) / 1000).toFixed(1);
    setElapsedTime(Number(totalSeconds));

    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    autoDismissRef.current = setTimeout(() => {
      setVisible(false);
      setStatus('idle');
    }, 800);
  }, [pathname]);

  const dismissNotification = useCallback(() => {
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setVisible(false);
    setStatus('idle');
  }, []);

  // Listen to Next.js route path changes to trigger automatic notification cycle
  useEffect(() => {
    if (pathname !== lastPathnameRef.current) {
      const prevPath = lastPathnameRef.current;
      lastPathnameRef.current = pathname;

      // Only trigger if changing to a distinct route
      if (prevPath) {
        const destName = ROUTE_NAME_MAP[pathname] || pathname;
        // Fast instant completion since page transition already mounted
        finishCompilation(destName);
      }
    }
  }, [pathname, finishCompilation]);

  return (
    <ScreenCompilationContext.Provider
      value={{
        isCompiling: false,
        screenName: '',
        compilationTime: 0,
        status: 'idle',
        startCompilation: () => {},
        finishCompilation: () => {},
        dismissNotification: () => {},
      }}
    >
      {children}
    </ScreenCompilationContext.Provider>
  );
};

export const useScreenCompilation = () => {
  const context = useContext(ScreenCompilationContext);
  if (!context) {
    throw new Error('useScreenCompilation must be used within a ScreenCompilationProvider');
  }
  return context;
};

