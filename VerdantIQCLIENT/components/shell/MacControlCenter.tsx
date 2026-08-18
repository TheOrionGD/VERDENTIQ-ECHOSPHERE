'use client';

import React from 'react';
import {
  useMacTheme,
  ACCENT_COLOR_MAP,
  WALLPAPER_STYLES,
  MacAccentColor,
  MacWallpaper,
} from '@/context/MacThemeContext';
import {
  Wifi,
  Volume2,
  Sun,
  Moon,
  Bluetooth,
  Radio,
  Sliders,
  Check,
  Sparkles,
  Layers,
  X,
  Palette,
  Eye,
  Activity,
  Laptop,
  CheckSquare,
  ExternalLink,
} from 'lucide-react';

export const MacControlCenter: React.FC = () => {
  const {
    themeMode,
    effectiveTheme,
    accentColor,
    wallpaper,
    glassOpacity,
    volume,
    brightness,
    isControlCenterOpen,
    setIsControlCenterOpen,
    setThemeMode,
    setAccentColor,
    setWallpaper,
    setGlassOpacity,
    setVolume,
    setBrightness,
  } = useMacTheme();

  if (!isControlCenterOpen) return null;

  return (
    <div className="fixed top-9 sm:top-8 inset-x-2 sm:inset-x-auto sm:right-3 z-50 w-auto sm:w-80 max-h-[85vh] overflow-y-auto rounded-2xl macos-liquid-glass p-3.5 sm:p-4 shadow-2xl border border-white/50 dark:border-white/10 text-stone-900 dark:text-stone-100 animate-in slide-in-from-top-2 duration-200 select-none font-sf">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/50 dark:border-stone-800/50">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-xs tracking-tight">System Control Center</span>
        </div>
        <button
          onClick={() => setIsControlCenterOpen(false)}
          className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Top 2-Column Connectivity Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Wi-Fi & Bluetooth Panel */}
          <div className="p-2.5 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-white/60 dark:border-white/10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-emerald-600 text-white">
                <Wifi className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[11px]">Wi-Fi</span>
                <span className="text-[9px] text-stone-500 dark:text-stone-400 truncate">
                  Campus Microgrid
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-stone-200/30 dark:border-stone-800/30">
              <div className="p-1.5 rounded-full bg-blue-600 text-white">
                <Bluetooth className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[11px]">Bluetooth</span>
                <span className="text-[9px] text-stone-500 dark:text-stone-400">On (2 Devices)</span>
              </div>
            </div>
          </div>

          {/* AirDrop & Theme Selector */}
          <div className="p-2.5 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-white/60 dark:border-white/10 flex flex-col justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-purple-600 text-white">
                <Radio className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[11px]">AirDrop</span>
                <span className="text-[9px] text-stone-500 dark:text-stone-400">Everyone</span>
              </div>
            </div>

            {/* System Dark Mode Status */}
            <div className="flex items-center gap-1.5 p-1.5 bg-stone-800/80 rounded-lg text-emerald-400 font-medium text-[10px] justify-center border border-emerald-800/30">
              <Moon className="h-3.5 w-3.5 fill-emerald-400/20" />
              <span>Dark Theme Active</span>
            </div>
          </div>
        </div>

        {/* Display Brightness Slider */}
        <div className="p-2.5 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-white/60 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              <span>Display Brightness</span>
            </span>
            <span className="font-mono text-[10px] text-stone-500">{brightness}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* Sound Volume Slider */}
        <div className="p-2.5 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-white/60 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-blue-500" />
              <span>Sound Output</span>
            </span>
            <span className="font-mono text-[10px] text-stone-500">{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Liquid Glass Opacity Slider */}
        <div className="p-2.5 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-white/60 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-purple-500" />
              <span>Glass Translucency</span>
            </span>
            <span className="font-mono text-[10px] text-stone-500">
              {Math.round(glassOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.3"
            max="0.9"
            step="0.05"
            value={glassOpacity}
            onChange={(e) => setGlassOpacity(Number(e.target.value))}
            className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        {/* VerdantIQ Accent Color Tokens */}
        <div className="p-2.5 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-white/60 dark:border-white/10 space-y-2">
          <span className="font-semibold text-[11px] block flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-emerald-600" />
            <span>Accent Color Theme</span>
          </span>
          <div className="flex items-center justify-between">
            {(Object.keys(ACCENT_COLOR_MAP) as MacAccentColor[]).map((col) => {
              const info = ACCENT_COLOR_MAP[col];
              const isSelected = accentColor === col;
              return (
                <button
                  key={col}
                  onClick={() => setAccentColor(col)}
                  title={info.label}
                  className={`h-6 w-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-offset-1 ring-stone-900 dark:ring-stone-100 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: info.primary }}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Google Tasks Quick Reminder Section */}
        <div className="p-2.5 rounded-xl bg-blue-950/30 dark:bg-blue-950/50 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold flex items-center gap-1.5 text-blue-300">
              <CheckSquare className="h-3.5 w-3.5 text-blue-400" />
              <span>Google Tasks Reminder</span>
            </span>
            <a
              href="https://tasks.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline font-medium"
            >
              tasks.google.com
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
          <button
            onClick={() => {
              window.open('https://tasks.google.com', '_blank', 'noopener,noreferrer');
            }}
            className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Open Google Tasks App</span>
            <ExternalLink className="h-3 w-3 opacity-80 ml-auto" />
          </button>
        </div>

        {/* VerdantIQ Canvas Themes */}
        <div className="p-2.5 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-white/60 dark:border-white/10 space-y-2">
          <span className="font-semibold text-[11px] block flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-teal-600" />
            <span>Workspace Canvas Theme</span>
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(WALLPAPER_STYLES) as MacWallpaper[]).map((wpKey) => {
              const wp = WALLPAPER_STYLES[wpKey];
              const isSelected = wallpaper === wpKey;
              return (
                <button
                  key={wpKey}
                  onClick={() => setWallpaper(wpKey)}
                  className={`h-10 rounded-lg p-1 text-[9px] font-medium text-white flex items-center justify-center text-center transition-all cursor-pointer overflow-hidden relative shadow-xs ${
                    isSelected ? 'ring-2 ring-emerald-500 scale-102' : 'hover:opacity-90'
                  }`}
                  style={{ background: wp.gradient }}
                >
                  <span className="drop-shadow-sm font-semibold truncate px-1">{wp.name.split(' ')[1] || wpKey}</span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 h-3 w-3 bg-emerald-500 rounded-full flex items-center justify-center text-[8px]">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
