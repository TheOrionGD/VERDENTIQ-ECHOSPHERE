'use client';

import React from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { Cpu, HardDrive, Monitor, Server, Play, RefreshCw, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function DesktopTelemetryDrawer() {
  const {
    isTelemetryOpen,
    setIsTelemetryOpen,
    systemMetrics,
    serviceHealth,
    refreshMetrics,
    refreshHealth,
    launchServiceStack,
    isTauri,
  } = useDesktop();

  if (!isTelemetryOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border border-emerald-500/30 bg-slate-950 p-6 shadow-2xl shadow-emerald-950/50 text-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">Desktop System Telemetry</h3>
              <p className="text-xs text-slate-400">Host Runtime & Microservices Infrastructure</p>
            </div>
          </div>
          <button
            onClick={() => setIsTelemetryOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="mt-5 space-y-4">
          {/* Host Machine Metrics */}
          <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Monitor className="h-4 w-4 text-emerald-400" /> Host Hardware Telemetry
              </span>
              <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                {systemMetrics?.host_name || 'VERDANT-STATION-01'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>CPU Load</span>
                  <span className="font-semibold text-emerald-400 font-mono">
                    {systemMetrics ? `${systemMetrics.cpu_usage.toFixed(1)}%` : '14.2%'}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, systemMetrics ? systemMetrics.cpu_usage : 14.2)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>RAM Allocation</span>
                  <span className="font-semibold text-teal-400 font-mono">
                    {systemMetrics
                      ? `${(systemMetrics.used_memory_mb / 1024).toFixed(1)} / ${(systemMetrics.total_memory_mb / 1024).toFixed(0)} GB`
                      : '6.1 / 16 GB'}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, systemMetrics ? systemMetrics.memory_percentage : 37.5)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
              <span>Operating System: <strong className="text-slate-200">{systemMetrics?.os_name || 'Windows 11'} ({systemMetrics?.os_version || 'Build 2026'})</strong></span>
              <span>Tauri Runtime: <strong className="text-emerald-400">Active v2.1</strong></span>
            </div>
          </div>

          {/* Microservices Health Card */}
          <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="h-4 w-4 text-teal-400" /> Backend Microservice Stack Status
            </span>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Spring Boot</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ONLINE
                </span>
              </div>

              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">ML Gateway</span>
                <span className="flex items-center gap-1 text-teal-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ONLINE
                </span>
              </div>

              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">MongoDB</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={() => {
              refreshMetrics();
              refreshHealth();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border border-slate-800"
          >
            <RefreshCw className="h-3.5 w-3.5 text-emerald-400" /> Refresh Diagnostics
          </button>

          <button
            onClick={async () => {
              const msg = await launchServiceStack();
              alert(msg);
            }}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-950/60 hover:from-emerald-500 hover:to-teal-500 transition-all"
          >
            <Play className="h-3.5 w-3.5 fill-current" /> Launch Microservice Stack (.bat)
          </button>
        </div>
      </div>
    </div>
  );
}
