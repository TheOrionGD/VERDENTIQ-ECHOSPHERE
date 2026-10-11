'use client';

import React, { useEffect, useState } from 'react';
import { useApiLoading } from '@/lib/api/client';
import { Loader2, CheckCircle2, Server } from 'lucide-react';

export const ApiProgressIndicator: React.FC = () => {
  const { isLoading, activeCount, currentPath, method, progressPercent, lastSuccess } = useApiLoading();
  const [visible, setVisible] = useState(false);
  const [completedToast, setCompletedToast] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setCompletedToast(null);
    } else if (visible) {
      // Show brief completion state
      if (currentPath) {
        setCompletedToast(currentPath);
        const toastTimer = setTimeout(() => {
          setCompletedToast(null);
        }, 1200);
        const hideTimer = setTimeout(() => {
          setVisible(false);
        }, 300);
        return () => {
          clearTimeout(toastTimer);
          clearTimeout(hideTimer);
        };
      } else {
        setVisible(false);
      }
    }
  }, [isLoading, progressPercent, currentPath]);

  if (!visible && !completedToast) return null;

  return (
    <>
      {/* Top Window/Screen Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-1 bg-stone-900/30 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-150 ease-out shadow-[0_0_10px_#10b981]"
          style={{
            width: `${isLoading ? Math.min(progressPercent, 95) : 100}%`,
            opacity: isLoading || visible ? 1 : 0,
          }}
        />
      </div>

      {/* Floating Network Request Pill Badge */}
      <div className="fixed top-2.5 right-16 z-[9999] pointer-events-none transition-all duration-200">
        {isLoading ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-stone-900/90 text-stone-100 border border-emerald-500/40 rounded-full text-xs shadow-xl backdrop-blur-md animate-pulse">
            <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              {method || 'REQ'}
            </span>
            <span className="font-mono text-stone-300 max-w-[180px] sm:max-w-[260px] truncate text-[11px]">
              {currentPath || '/api/v1'}
            </span>
            {activeCount > 1 && (
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full border border-emerald-500/30 font-mono">
                +{activeCount - 1}
              </span>
            )}
            <span className="text-[9px] uppercase px-1 py-0.5 rounded bg-stone-800 text-stone-400 font-mono">
              Gateway
            </span>
          </div>
        ) : completedToast ? (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-900/90 text-stone-100 border border-emerald-500/30 rounded-full text-xs shadow-lg backdrop-blur-md transition-all duration-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-stone-300 max-w-[200px] truncate text-[11px]">
              {completedToast}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Fetched</span>
          </div>
        ) : null}
      </div>
    </>
  );
};
