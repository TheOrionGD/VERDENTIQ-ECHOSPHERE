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

  // Global click interception to catch navigational link clicks immediately
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (target && target.href) {
        try {
          const targetUrl = new URL(target.href);
          if (targetUrl.origin === window.location.origin) {
            const destPath = targetUrl.pathname;
            if (destPath !== pathname && !destPath.startsWith('/#') && !destPath.startsWith('mailto:')) {
              const destName = ROUTE_NAME_MAP[destPath] || destPath;
              startCompilation(destName, 'Preparing and compiling target screen...');
            }
          }
        } catch {
          // ignore non-URL clicks
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, [pathname, startCompilation]);

  return (
    <ScreenCompilationContext.Provider
      value={{
        isCompiling: status === 'compiling',
        screenName,
        compilationTime: elapsedTime,
        status,
        startCompilation,
        finishCompilation,
        dismissNotification,
      }}
    >
      {children}

      {/* In-App Notification Component anchored at LEFT BOTTOM */}
      {visible && (
        <aside
          role="status"
          aria-live="polite"
          aria-label="Screen Compilation Notification"
          className={cn(
            'fixed bottom-5 left-5 z-[9999] pointer-events-auto max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)]',
            'transition-all duration-300 ease-out select-none font-sans',
            'animate-in fade-in slide-in-from-bottom-4'
          )}
        >
          <div
            className={cn(
              'relative overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-xl border',
              'transition-colors duration-300',
              status === 'compiling'
                ? 'bg-slate-950/90 border-emerald-500/40 text-slate-100 shadow-[0_10px_35px_-5px_rgba(6,78,59,0.3)]'
                : 'bg-slate-950/95 border-emerald-400/60 text-slate-100 shadow-[0_10px_35px_-5px_rgba(16,185,129,0.35)]'
            )}
          >
            {/* Ambient Background Gradient Glow */}
            <div
              className={cn(
                'absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity duration-500',
                status === 'compiling' ? 'bg-emerald-500/15' : 'bg-emerald-400/20'
              )}
            />

            {/* Top Bar: Icon + Status Tag + Timer + Close */}
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-xl border flex-shrink-0 transition-colors',
                    status === 'compiling'
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                      : 'bg-emerald-900/60 border-emerald-400 text-emerald-300'
                  )}
                >
                  {status === 'compiling' ? (
                    <Cpu className="h-4 w-4 animate-spin text-emerald-400" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-[10px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md border',
                        status === 'compiling'
                          ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                          : 'bg-emerald-900/40 border-emerald-400/50 text-emerald-300'
                      )}
                    >
                      {status === 'compiling' ? 'Compiling Screen' : 'Compiled & Ready'}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Right Controls: Timer Badge + Dismiss */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700/60 text-[10px] font-mono text-emerald-300">
                  <Clock className="h-3 w-3 text-emerald-400" />
                  <span>{elapsedTime > 0 ? `${elapsedTime}s` : '0.1s'}</span>
                </div>

                <button
                  type="button"
                  onClick={dismissNotification}
                  title="Dismiss notification"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Screen Title & Description */}
            <div className="mt-2.5 relative z-10 space-y-1">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{screenName}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                {status === 'compiling'
                  ? customNote || 'Compiling Next.js route chunks & hydrating client components...'
                  : `Hydration completed in ${elapsedTime > 0 ? `${elapsedTime}s` : 'instantaneous'}. Screen components active.`}
              </p>
            </div>

            {/* Micro Progress Bar along bottom */}
            <div className="mt-3 h-1 w-full rounded-full bg-slate-800/80 overflow-hidden relative">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  status === 'compiling'
                    ? 'w-2/3 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 animate-pulse'
                    : 'w-full bg-emerald-400'
                )}
              />
            </div>
          </div>
        </aside>
      )}
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
