'use client';

import React from 'react';
import Link from 'next/link';
import { useMacTheme } from '@/context/MacThemeContext';
import { useAuth } from '@/context/AuthContext';
import {
  Bell,
  X,
  Zap,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronRight,
  Radio,
  Send,
} from 'lucide-react';

export const MacNotificationCenter: React.FC = () => {
  const { isNotificationCenterOpen, setIsNotificationCenterOpen } = useMacTheme();
  const { notifications, markNotificationRead, clearNotifications, sseStatus, triggerLivePushAlert } = useAuth();

  if (!isNotificationCenterOpen) return null;

  const handlePushTestAlert = () => {
    triggerLivePushAlert({
      title: 'Manual Admin Test Push Alert',
      description: 'Triggered from System Notification Center over live SSE push stream channel.',
      severity: 'warning',
      location: 'Administrative Terminal',
      source: 'Admin-Test-Trigger',
    });
  };

  return (
    <div className="fixed top-9 sm:top-8 inset-x-2 sm:inset-x-auto sm:right-3 z-50 w-auto sm:w-80 max-h-[85vh] rounded-2xl macos-liquid-glass p-3.5 sm:p-4 shadow-2xl border border-white/60 dark:border-white/10 text-stone-900 dark:text-stone-100 animate-in slide-in-from-right-4 duration-200 select-none font-sf flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/50 dark:border-stone-800/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-xs">Notification Center</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearNotifications}
            title="Clear all notifications"
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg text-[10px] cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={() => setIsNotificationCenterOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* SSE Live Stream Status Bar */}
      <div className="mt-2.5 px-2.5 py-1.5 rounded-xl bg-stone-100/70 dark:bg-stone-900/70 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                sseStatus === 'connected'
                  ? 'bg-emerald-400'
                  : sseStatus === 'connecting'
                  ? 'bg-amber-400'
                  : 'bg-stone-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                sseStatus === 'connected'
                  ? 'bg-emerald-500'
                  : sseStatus === 'connecting'
                  ? 'bg-amber-500'
                  : 'bg-stone-500'
              }`}
            />
          </span>
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            {sseStatus === 'connected'
              ? 'SSE Push Feed: Connected'
              : sseStatus === 'connecting'
              ? 'SSE Push Feed: Reconnecting...'
              : 'SSE Feed: Polling Fallback'}
          </span>
        </div>
        <button
          onClick={handlePushTestAlert}
          title="Push test alert over live SSE stream"
          className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-sans text-[10px] cursor-pointer"
        >
          <Send className="h-2.5 w-2.5" />
          Test
        </button>
      </div>

      {/* Widgets & Notifications Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-0.5">
        {/* Today Widget Card */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-900 to-teal-800 text-white shadow-md space-y-2">
          <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-200 uppercase tracking-wider">
            <span>Today Status Widget</span>
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xl font-bold font-editorial">242 gCO2e/kWh</div>
              <div className="text-[10px] text-emerald-200">Grid Intensity: Nominal</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-emerald-300">+18.4%</div>
              <div className="text-[9px] text-emerald-200">Solar Share</div>
            </div>
          </div>
        </div>

        {/* Live Notifications Feed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
              Recent System Activity
            </span>
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Radio className="h-2.5 w-2.5 animate-pulse" />
              Live Stream
            </span>
          </div>

          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-white/40 dark:bg-stone-900/40 border-stone-200/50 dark:border-stone-800/50 opacity-75'
                    : 'bg-white/80 dark:bg-stone-900/80 border-emerald-500/40 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                      notif.severity === 'critical'
                        ? 'bg-rose-500 text-white'
                        : notif.severity === 'warning'
                        ? 'bg-amber-500 text-white'
                        : notif.severity === 'success'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {notif.severity === 'critical' ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : notif.severity === 'warning' ? (
                      <Zap className="h-3 w-3" />
                    ) : notif.severity === 'success' ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Info className="h-3 w-3" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-xs">
                    <div className="font-semibold flex items-center justify-between">
                      <span className="truncate">{notif.title}</span>
                      <span className="text-[9px] font-mono text-stone-400">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-600 dark:text-stone-300 mt-0.5 line-clamp-2">
                      {notif.description}
                    </p>
                    {notif.channel === 'sse-push' && (
                      <span className="mt-1 inline-block text-[8px] font-mono px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-300 dark:border-emerald-800">
                        SSE LIVE PUSH
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-stone-400">
              No recent notifications.
            </div>
          )}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800/50 text-center flex-shrink-0">
        <Link
          href="/notifications"
          onClick={() => setIsNotificationCenterOpen(false)}
          className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
        >
          <span>View All System Notifications</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};
