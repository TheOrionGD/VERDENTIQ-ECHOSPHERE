'use client';

import React from 'react';
import Link from 'next/link';
import { useWindowsTheme } from '@/context/WindowsThemeContext';
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
  Sliders,
} from 'lucide-react';

export const WindowsActionCenter: React.FC = () => {
  const { isActionCenterOpen, setIsActionCenterOpen } = useWindowsTheme();
  const { notifications, markNotificationRead, clearNotifications, sseStatus, triggerLivePushAlert } = useAuth();

  if (!isActionCenterOpen) return null;

  const handlePushTestAlert = () => {
    triggerLivePushAlert({
      title: 'Windows Action Center Test Alert',
      description: 'Dispatched through live SSE event stream pipeline to Windows notification drawer.',
      severity: 'warning',
      location: 'Administrative Terminal',
      source: 'Admin-Test-Trigger',
    });
  };

  return (
    <div className="fixed top-12 right-3 z-50 w-84 sm:w-96 max-h-[85vh] rounded-xl win11-acrylic-surface p-4 shadow-2xl border border-slate-700/80 text-slate-100 animate-in slide-in-from-right-4 duration-150 select-none font-segoe flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-emerald-400" />
          <span className="font-semibold text-xs tracking-wide">Notifications & Action Center</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearNotifications}
            title="Clear all notifications"
            className="px-2 py-0.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 text-[10px] transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={() => setIsActionCenterOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* SSE Connection Health Bar */}
      <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                sseStatus === 'connected'
                  ? 'bg-emerald-400'
                  : sseStatus === 'connecting'
                  ? 'bg-amber-400'
                  : 'bg-slate-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                sseStatus === 'connected'
                  ? 'bg-emerald-500'
                  : sseStatus === 'connecting'
                  ? 'bg-amber-500'
                  : 'bg-slate-500'
              }`}
            />
          </span>
          <span className="font-medium text-slate-300">
            {sseStatus === 'connected'
              ? 'Telemetry Stream: Active'
              : sseStatus === 'connecting'
              ? 'Reconnecting Stream...'
              : 'Polling Fallback'}
          </span>
        </div>
        <button
          onClick={handlePushTestAlert}
          title="Send test alert"
          className="text-emerald-400 hover:underline flex items-center gap-1 font-sans text-[10px]"
        >
          <Send className="h-2.5 w-2.5" />
          Test
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-0.5 scrollbar-none">
        {/* Windows Mini Calendar Widget Card */}
        <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-950/70 to-slate-900/90 border border-emerald-500/30 text-white space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">
            <span>Carbon Intensity Index</span>
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xl font-bold font-mono text-emerald-400">242 gCO2e/kWh</div>
              <div className="text-[10px] text-slate-300">Grid State: Normal</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-teal-300">+18.4%</div>
              <div className="text-[9px] text-slate-400">Renewable Mix</div>
            </div>
          </div>
        </div>

        {/* Notifications Stack */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              System Events
            </span>
            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
              <Radio className="h-2.5 w-2.5 animate-pulse" />
              Live
            </span>
          </div>

          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-70'
                    : 'bg-slate-900/80 border-emerald-500/40 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-1.5 rounded-md flex-shrink-0 mt-0.5 ${
                      notif.severity === 'critical'
                        ? 'bg-rose-600 text-white'
                        : notif.severity === 'warning'
                        ? 'bg-amber-600 text-white'
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
                      <span className="truncate text-slate-100">{notif.title}</span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                      {notif.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              No new notifications.
            </div>
          )}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-2.5 border-t border-slate-800 text-center flex-shrink-0">
        <Link
          href="/notifications"
          onClick={() => setIsActionCenterOpen(false)}
          className="text-[11px] font-medium text-emerald-400 hover:underline inline-flex items-center gap-1"
        >
          <span>All Notification History</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};
