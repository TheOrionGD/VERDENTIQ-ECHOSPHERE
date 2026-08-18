'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type MacThemeMode = 'dark';
export type MacAccentColor = 'emerald' | 'blue' | 'purple' | 'amber' | 'coral' | 'graphite';
export type MacWallpaper =
  | 'sonoma'
  | 'sequoia'
  | 'emerald_oasis'
  | 'bigsur'
  | 'dark_aurora'
  | 'monterey';

export type GlassBlurLevel = 'low' | 'medium' | 'high';

interface MacThemeContextType {
  themeMode: MacThemeMode;
  effectiveTheme: 'dark';
  accentColor: MacAccentColor;
  wallpaper: MacWallpaper;
  glassBlur: GlassBlurLevel;
  glassOpacity: number;
  isControlCenterOpen: boolean;
  isSpotlightOpen: boolean;
  isNotificationCenterOpen: boolean;
  isSiriOpen: boolean;
  volume: number;
  brightness: number;
  sidebarCollapsed: boolean;
  windowState: {
    isMaximized: boolean;
    isMinimized: boolean;
  };
  setThemeMode: (mode: MacThemeMode) => void;
  setAccentColor: (color: MacAccentColor) => void;
  setWallpaper: (wallpaper: MacWallpaper) => void;
  setGlassBlur: (blur: GlassBlurLevel) => void;
  setGlassOpacity: (opacity: number) => void;
  setVolume: (val: number) => void;
  setBrightness: (val: number) => void;
  setIsControlCenterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSpotlightOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNotificationCenterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSiriOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleWindowMinimize: () => void;
  toggleWindowMaximize: () => void;
  restoreWindow: () => void;
}

const MacThemeContext = createContext<MacThemeContextType | null>(null);

export const ACCENT_COLOR_MAP: Record<
  MacAccentColor,
  { primary: string; hover: string; lightBg: string; border: string; ring: string; label: string }
> = {
  emerald: {
    primary: '#064e3b',
    hover: '#065f46',
    lightBg: 'rgba(6, 78, 59, 0.12)',
    border: 'rgba(6, 78, 59, 0.3)',
    ring: '#10b981',
    label: 'Emerald Oasis',
  },
  blue: {
    primary: '#0284c7',
    hover: '#0369a1',
    lightBg: 'rgba(2, 132, 199, 0.12)',
    border: 'rgba(2, 132, 199, 0.3)',
    ring: '#38bdf8',
    label: 'Pacific Cobalt',
  },
  purple: {
    primary: '#7c3aed',
    hover: '#6d28d9',
    lightBg: 'rgba(124, 58, 237, 0.12)',
    border: 'rgba(124, 58, 237, 0.3)',
    ring: '#a78bfa',
    label: 'Spectral Violet',
  },
  amber: {
    primary: '#d97706',
    hover: '#b45309',
    lightBg: 'rgba(217, 119, 6, 0.12)',
    border: 'rgba(217, 119, 6, 0.3)',
    ring: '#fbbf24',
    label: 'Solar Amber',
  },
  coral: {
    primary: '#e11d48',
    hover: '#be123c',
    lightBg: 'rgba(225, 29, 72, 0.12)',
    border: 'rgba(225, 29, 72, 0.3)',
    ring: '#fb7185',
    label: 'Thermal Coral',
  },
  graphite: {
    primary: '#374151',
    hover: '#1f2937',
    lightBg: 'rgba(55, 65, 81, 0.12)',
    border: 'rgba(55, 65, 81, 0.3)',
    ring: '#9ca3af',
    label: 'Obsidian Slate',
  },
};

export const WALLPAPER_STYLES: Record<
  MacWallpaper,
  { name: string; bgClass: string; gradient: string }
> = {
  sonoma: {
    name: 'VerdantIQ Liquid Glass',
    bgClass: 'bg-gradient-to-br from-emerald-900 via-teal-800 to-amber-900',
    gradient: 'url("/bg.png") no-repeat center center / cover fixed, radial-gradient(ellipse at top left, rgba(15, 118, 110, 0.85), rgba(6, 78, 59, 0.85) 40%, rgba(23, 37, 84, 0.85) 80%)',
  },
  sequoia: {
    name: 'VerdantIQ Redwood Biome',
    bgClass: 'bg-gradient-to-br from-amber-950 via-emerald-950 to-stone-900',
    gradient: 'url("/bg.png") no-repeat center center / cover fixed, radial-gradient(circle at 50% 20%, rgba(69, 26, 3, 0.85) 0%, rgba(6, 78, 59, 0.85) 60%, rgba(12, 10, 9, 0.9) 100%)',
  },
  emerald_oasis: {
    name: 'VerdantIQ Emerald Oasis',
    bgClass: 'bg-gradient-to-tr from-emerald-950 via-emerald-800 to-teal-900',
    gradient: 'url("/bg.png") no-repeat center center / cover fixed, linear-gradient(135deg, rgba(2, 44, 34, 0.85) 0%, rgba(6, 78, 59, 0.85) 50%, rgba(15, 118, 110, 0.85) 100%)',
  },
  bigsur: {
    name: 'Hydro Kinetic Wave',
    bgClass: 'bg-gradient-to-r from-blue-900 via-indigo-800 to-emerald-800',
    gradient: 'url("/bg.png") no-repeat center center / cover fixed, radial-gradient(circle at top right, rgba(30, 58, 138, 0.85), rgba(6, 95, 70, 0.85) 50%, rgba(15, 23, 42, 0.85) 100%)',
  },
  dark_aurora: {
    name: 'Obsidian Dark Aurora',
    bgClass: 'bg-gradient-to-b from-stone-950 via-slate-900 to-emerald-950',
    gradient: 'url("/bg.png") no-repeat center center / cover fixed, radial-gradient(ellipse at bottom, rgba(2, 44, 34, 0.85) 0%, rgba(9, 9, 11, 0.9) 70%)',
  },
  monterey: {
    name: 'Atmospheric Dusk Glass',
    bgClass: 'bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-950',
    gradient: 'url("/bg.png") no-repeat center center / cover fixed, linear-gradient(160deg, rgba(59, 7, 100, 0.85) 0%, rgba(30, 27, 75, 0.85) 50%, rgba(2, 44, 34, 0.85) 100%)',
  },
};

export const MacThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode] = useState<MacThemeMode>('dark');
  const [accentColor, setAccentColor] = useState<MacAccentColor>('emerald');
  const [wallpaper, setWallpaper] = useState<MacWallpaper>('sonoma');
  const [glassBlur, setGlassBlur] = useState<GlassBlurLevel>('high');
  const [glassOpacity, setGlassOpacity] = useState<number>(0.65);
  const [volume, setVolume] = useState<number>(80);
  const [brightness, setBrightness] = useState<number>(90);

  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isSiriOpen, setIsSiriOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [windowState, setWindowState] = useState({
    isMaximized: false,
    isMinimized: false,
  });

  const effectiveTheme: 'dark' = 'dark';

  const setThemeMode = () => {};

  const toggleWindowMinimize = () => {
    setWindowState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const toggleWindowMaximize = () => {
    setWindowState((prev) => ({ ...prev, isMaximized: !prev.isMaximized }));
  };

  const restoreWindow = () => {
    setWindowState({ isMaximized: false, isMinimized: false });
  };

  return (
    <MacThemeContext.Provider
      value={{
        themeMode,
        effectiveTheme,
        accentColor,
        wallpaper,
        glassBlur,
        glassOpacity,
        isControlCenterOpen,
        isSpotlightOpen,
        isNotificationCenterOpen,
        isSiriOpen,
        volume,
        brightness,
        sidebarCollapsed,
        windowState,
        setThemeMode,
        setAccentColor,
        setWallpaper,
        setGlassBlur,
        setGlassOpacity,
        setVolume,
        setBrightness,
        setIsControlCenterOpen,
        setIsSpotlightOpen,
        setIsNotificationCenterOpen,
        setIsSiriOpen,
        setSidebarCollapsed,
        toggleWindowMinimize,
        toggleWindowMaximize,
        restoreWindow,
      }}
    >
      <div
        className="dark min-h-screen bg-stone-950 text-stone-100"
        style={
          {
            '--mac-accent-primary': ACCENT_COLOR_MAP[accentColor].primary,
            '--mac-accent-hover': ACCENT_COLOR_MAP[accentColor].hover,
            '--mac-accent-light': ACCENT_COLOR_MAP[accentColor].lightBg,
            '--mac-accent-ring': ACCENT_COLOR_MAP[accentColor].ring,
            '--mac-glass-opacity': glassOpacity,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </MacThemeContext.Provider>
  );
};

export const useMacTheme = () => {
  const context = useContext(MacThemeContext);
  if (!context) {
    throw new Error('useMacTheme must be used within a MacThemeProvider');
  }
  return context;
};
