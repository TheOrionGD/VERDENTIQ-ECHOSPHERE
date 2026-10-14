import React, { useState } from 'react';
import { 
  Wifi, 
  Bluetooth, 
  Moon, 
  Sun, 
  Volume2, 
  Bell,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../lib/useAuth';

export function WindowsActionCenter({ isOpen, onClose }) {
  const { isDarkMode, toggleTheme, fluidDensity, updateFluidDensity } = useAuth();
  const [volume, setVolume] = useState(80);
  const [wifiActive, setWifiActive] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-14 right-3 w-[340px] fluent-mica rounded-xl shadow-2xl p-4 z-50 flex flex-col text-neutral-100 animate-in fade-in slide-in-from-bottom-2 duration-150 border border-white/10">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
        <span className="text-xs font-semibold text-neutral-300">Quick Settings</span>
        <button
          onClick={onClose}
          className="text-xs text-neutral-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10 transition"
        >
          ✕
        </button>
      </div>
      {/* Quick Action Tiles */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <button
          onClick={() => setWifiActive(!wifiActive)}
          className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-1.5 transition-colors ${
            wifiActive ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-400'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span className="text-[10px] font-medium">Internet</span>
        </button>

        <button
          className="p-3 rounded-lg flex flex-col items-center justify-center space-y-1.5 bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <Bluetooth className="w-4 h-4" />
          <span className="text-[10px] font-medium">Bluetooth</span>
        </button>

        <button
          onClick={toggleTheme}
          className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-1.5 transition-colors cursor-pointer ${
            isDarkMode ? 'bg-emerald-600 text-white shadow-md' : 'bg-neutral-800 text-neutral-300 hover:text-white'
          }`}
          title="Toggle Light / Dark Mica"
        >
          {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span className="text-[10px] font-medium">{isDarkMode ? 'Dark Mica' : 'Light Mode'}</span>
        </button>
      </div>

      {/* Fluid Glass UI Density Controls */}
      <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-white/5 space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white font-medium flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fluid Glass Density</span>
          </span>
          <span className="font-mono text-emerald-400 font-bold text-[11px]">{fluidDensity}%</span>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={fluidDensity}
            onChange={(e) => updateFluidDensity(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
            title="Adjust fluid glass blur and opacity"
          />
        </div>

        {/* Quick Density Presets */}
        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
          <button
            type="button"
            onClick={() => updateFluidDensity(30)}
            className={`px-2 py-0.5 rounded cursor-pointer transition ${
              fluidDensity <= 35 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Clear (30%)
          </button>
          <button
            type="button"
            onClick={() => updateFluidDensity(65)}
            className={`px-2 py-0.5 rounded cursor-pointer transition ${
              fluidDensity > 35 && fluidDensity <= 75 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Balanced (65%)
          </button>
          <button
            type="button"
            onClick={() => updateFluidDensity(95)}
            className={`px-2 py-0.5 rounded cursor-pointer transition ${
              fluidDensity > 75 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Frosted (95%)
          </button>
        </div>
      </div>

      {/* Volume Slider */}
      <div className="flex items-center space-x-3 mb-4 px-1">
        <Volume2 className="w-4 h-4 text-neutral-400" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <span className="text-[10px] text-neutral-400 font-mono w-6 text-right">{volume}%</span>
      </div>

      {/* Notifications Section */}
      <div className="pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
          <div className="flex items-center space-x-1.5">
            <Bell className="w-3.5 h-3.5" />
            <span>System Notifications</span>
          </div>
          <button className="text-[10px] text-emerald-400 hover:underline">Clear all</button>
        </div>

        <div className="p-2.5 rounded bg-neutral-900/60 border border-white/5 text-xs space-y-1">
          <div className="flex justify-between font-semibold text-white">
            <span>Audit Chain Secured</span>
            <span className="text-[10px] text-neutral-400">Just now</span>
          </div>
          <p className="text-[11px] text-neutral-300">
            Cryptographic SHA-256 hash verified across all MongoDB records.
          </p>
        </div>
      </div>
    </div>
  );
}
