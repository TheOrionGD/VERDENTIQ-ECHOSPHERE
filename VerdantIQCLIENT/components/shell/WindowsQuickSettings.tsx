'use client';

import React from 'react';
import { useWindowsTheme, WINDOWS_ACCENTS, WindowsAccentColor, MICA_SURFACE_STYLES, WindowsMicaSurface } from '@/context/WindowsThemeContext';
import {
  Sliders,
  X,
  Wifi,
  Bluetooth,
  Sun,
  Volume2,
  Moon,
  Layers,
  Palette,
  Check,
  Radio,
  Eye,
  ExternalLink,
  CheckSquare,
  ShieldCheck,
} from 'lucide-react';

export const WindowsQuickSettings: React.FC = () => {
  const {
    isQuickSettingsOpen,
    setIsQuickSettingsOpen,
    accentColor,
    setAccentColor,
    micaSurface,
    setMicaSurface,
    acrylicOpacity,
    setAcrylicOpacity,
    volume,
    setVolume,
    brightness,
    setBrightness,
  } = useWindowsTheme();

  if (!isQuickSettingsOpen) return null;

  return (
    <div className="fixed top-12 right-3 z-50 w-84 max-h-[85vh] overflow-y-auto rounded-xl win11-acrylic-surface p-4 shadow-2xl border border-slate-700/80 text-slate-100 animate-in slide-in-from-top-2 duration-150 select-none font-segoe">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-emerald-400" />
          <span className="font-semibold text-xs tracking-wide">Quick Settings</span>
        </div>
        <button
          onClick={() => setIsQuickSettingsOpen(false)}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Connectivity Quick Action Tiles (Windows 11 Tile Grid) */}
        <div className="grid grid-cols-2 gap-2">
          {/* Wi-Fi Tile */}
          <div className="p-2.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-emerald-500 text-slate-950 font-bold">
              <Wifi className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-[11px] text-white">Wi-Fi</div>
              <div className="text-[9px] text-emerald-400 truncate">Campus Microgrid</div>
            </div>
          </div>

          {/* Bluetooth Tile */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-slate-800 text-slate-300">
              <Bluetooth className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-[11px] text-slate-200">Bluetooth</div>
              <div className="text-[9px] text-slate-400 truncate">2 Sensors Paired</div>
            </div>
          </div>
        </div>

        {/* Display Brightness Slider */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium flex items-center gap-1.5 text-slate-300">
              <Sun className="h-3.5 w-3.5 text-amber-400" />
              <span>Display Brightness</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">{brightness}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Sound Volume Slider */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium flex items-center gap-1.5 text-slate-300">
              <Volume2 className="h-3.5 w-3.5 text-blue-400" />
              <span>Volume</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Acrylic Translucency Slider */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium flex items-center gap-1.5 text-slate-300">
              <Eye className="h-3.5 w-3.5 text-purple-400" />
              <span>Acrylic Opacity</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {Math.round(acrylicOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.4"
            max="0.95"
            step="0.05"
            value={acrylicOpacity}
            onChange={(e) => setAcrylicOpacity(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Windows Accent Color Tokens */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="font-medium text-[11px] block flex items-center gap-1.5 text-slate-300">
            <Palette className="h-3.5 w-3.5 text-emerald-400" />
            <span>Windows Accent Color</span>
          </span>
          <div className="flex items-center justify-between">
            {(Object.keys(WINDOWS_ACCENTS) as WindowsAccentColor[]).map((col) => {
              const info = WINDOWS_ACCENTS[col];
              const isSelected = accentColor === col;
              return (
                <button
                  key={col}
                  onClick={() => setAccentColor(col)}
                  title={info.label}
                  className={`h-6 w-6 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-slate-100 ring-offset-slate-900 scale-110 shadow-md'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: info.primary }}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 text-slate-950 font-bold" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mica Background Surfaces */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="font-medium text-[11px] block flex items-center gap-1.5 text-slate-300">
            <Layers className="h-3.5 w-3.5 text-teal-400" />
            <span>Mica Material Backdrop</span>
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(MICA_SURFACE_STYLES) as WindowsMicaSurface[]).map((key) => {
              const item = MICA_SURFACE_STYLES[key];
              const isSelected = micaSurface === key;
              return (
                <button
                  key={key}
                  onClick={() => setMicaSurface(key)}
                  className={`px-2.5 py-1.5 rounded-md text-[10px] font-medium text-left transition-all truncate border ${
                    isSelected
                      ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
