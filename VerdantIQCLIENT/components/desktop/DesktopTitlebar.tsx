'use client';

import React from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { useWindowsTheme } from '@/context/WindowsThemeContext';
import {
  Server,
  Layers,
  Cpu,
  HardDrive,
  Minus,
  Square,
  X,
  Leaf,
  Activity,
  Sliders,
  Bell,
  Search,
} from 'lucide-react';

export function DesktopTitlebar() {
  const {
    isTauri,
    systemMetrics,
    serviceHealth,
    isTelemetryOpen,
    setIsTelemetryOpen,
    minimizeWindow,
    toggleMaximizeWindow,
    closeWindow,
  } = useDesktop();

  const {
    setIsCommandPaletteOpen,
    setIsQuickSettingsOpen,
    setIsActionCenterOpen,
  } = useWindowsTheme();

  return (
    <div
      data-tauri-drag-region
      className="sticky top-0 z-50 flex h-8 w-full select-none items-center justify-between border-b border-slate-800 bg-slate-950/95 px-2.5 text-xs text-slate-300 font-segoe transition-colors"
    >
      {/* Left: Windows Application Icon & Name */}
      <div data-tauri-drag-region className="flex items-center gap-2">
        <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold text-[9px]">
          V
        </div>
        <span className="font-normal text-[11px] tracking-normal text-slate-200">
          VerdantIQ Ecosphere Desktop
        </span>
        <span className="text-[10px] text-slate-500 hidden sm:inline">—</span>
        <span className="text-[10px] text-emerald-400/90 font-mono hidden sm:inline">
          Connected
        </span>
      </div>

      {/* Center: System Status Telemetry summary */}
      <div data-tauri-drag-region className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/60 border border-slate-800/80 text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">Spring Gateway:</span>
          <span className="text-emerald-400 font-mono">ONLINE</span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/60 border border-slate-800/80 text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          <span className="text-slate-400">ML Gateway:</span>
          <span className="text-teal-400 font-mono">ONLINE</span>
        </div>
      </div>

      {/* Right: Quick Telemetry & Native Windows Titlebar Control Buttons */}
      <div className="flex items-center gap-1">
        {/* Telemetry Indicator Button */}
        <button
          onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
          className={`flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] transition-colors ${
            isTelemetryOpen
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
              : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Hardware Telemetry"
        >
          <Cpu className="h-3 w-3 text-emerald-400" />
          <span className="hidden xl:inline font-mono">
            {systemMetrics ? `${systemMetrics.cpu_usage.toFixed(0)}%` : '14%'}
          </span>
          <HardDrive className="h-3 w-3 text-teal-400 ml-0.5" />
          <span className="hidden xl:inline font-mono">
            {systemMetrics ? `${(systemMetrics.used_memory_mb / 1024).toFixed(1)}G` : '6.1G'}
          </span>
        </button>

        {/* Windows Standard Title Bar Window Action Buttons (Minimize, Maximize, Close) */}
        <div className="flex items-center -mr-2.5">
          <button
            onClick={minimizeWindow}
            className="flex h-8 w-11 items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
            title="Minimize"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={toggleMaximizeWindow}
            className="flex h-8 w-11 items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
            title="Maximize"
          >
            <Square className="h-3 w-3" />
          </button>
          <button
            onClick={closeWindow}
            className="flex h-8 w-11 items-center justify-center hover:bg-red-600 text-slate-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DesktopTitlebar;
