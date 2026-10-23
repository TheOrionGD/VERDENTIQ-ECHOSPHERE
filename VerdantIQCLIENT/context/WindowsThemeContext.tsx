'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type WindowsThemeMode = 'dark' | 'light';
export type WindowsAccentColor = 'emerald' | 'cobalt' | 'violet' | 'amber' | 'crimson' | 'slate';
export type WindowsMicaSurface =
  | 'mica_default'
  | 'mica_alt'
  | 'acrylic_dark'
  | 'acrylic_aurora'
  | 'deep_obsidian'
  | 'slate_mesh';

export type MicaBlurLevel = 'subtle' | 'medium' | 'deep';

export interface WindowsThemeContextType {
  themeMode: WindowsThemeMode;
  effectiveTheme: 'dark';
  accentColor: WindowsAccentColor;
  micaSurface: WindowsMicaSurface;
  micaBlur: MicaBlurLevel;
  acrylicOpacity: number;
  
  // Windows Floating Surfaces & Dialogs
  isCommandPaletteOpen: boolean;
  isQuickSettingsOpen: boolean;
  isActionCenterOpen: boolean;
  isMobileWheelOpen: boolean;
  isCopilotFlyoutOpen: boolean;

  volume: number;
  brightness: number;
  windowState: {
    isMaximized: boolean;
    isMinimized: boolean;
  };

  setThemeMode: (mode: WindowsThemeMode) => void;
  setAccentColor: (color: WindowsAccentColor) => void;
  setMicaSurface: (surface: WindowsMicaSurface) => void;
  setMicaBlur: (blur: MicaBlurLevel) => void;
  setAcrylicOpacity: (opacity: number) => void;
  setVolume: (val: number) => void;
  setBrightness: (val: number) => void;
  setIsCommandPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsQuickSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsActionCenterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileWheelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCopilotFlyoutOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleWindowMinimize: () => void;
  toggleWindowMaximize: () => void;
  restoreWindow: () => void;

  // Compatibility aliases for legacy Mac theme references
  isSpotlightOpen: boolean;
  setIsSpotlightOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isControlCenterOpen: boolean;
  setIsControlCenterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSiriOpen: boolean;
  setIsSiriOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  wallpaper: string;
  setWallpaper: (wp: any) => void;
  glassBlur: string;
  setGlassBlur: (b: any) => void;
  glassOpacity: number;
  setGlassOpacity: (o: number) => void;
}

const WindowsThemeContext = createContext<WindowsThemeContextType | null>(null);

export const WINDOWS_ACCENTS: Record<
  WindowsAccentColor,
  {
    primary: string;
    hover: string;
    lightBg: string;
    border: string;
    ring: string;
    glow: string;
    label: string;
  }
> = {
  emerald: {
    primary: '#10b981',
    hover: '#059669',
    lightBg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    ring: '#34d399',
    glow: '0 0 16px rgba(16, 185, 129, 0.35)',
    label: 'Verdant Mint',
  },
  cobalt: {
    primary: '#0078d4',
    hover: '#106ebe',
    lightBg: 'rgba(0, 120, 212, 0.12)',
    border: 'rgba(0, 120, 212, 0.35)',
    ring: '#60a5fa',
    glow: '0 0 16px rgba(0, 120, 212, 0.35)',
    label: 'Windows Cobalt',
  },
  violet: {
    primary: '#8b5cf6',
    hover: '#7c3aed',
    lightBg: 'rgba(139, 92, 246, 0.12)',
    border: 'rgba(139, 92, 246, 0.35)',
    ring: '#c084fc',
    glow: '0 0 16px rgba(139, 92, 246, 0.35)',
    label: 'Iris Purple',
  },
  amber: {
    primary: '#f59e0b',
    hover: '#d97706',
    lightBg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    ring: '#fcd34d',
    glow: '0 0 16px rgba(245, 158, 11, 0.35)',
    label: 'Sunlit Amber',
  },
  crimson: {
    primary: '#ef4444',
    hover: '#dc2626',
    lightBg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.35)',
    ring: '#f87171',
    glow: '0 0 16px rgba(239, 68, 68, 0.35)',
    label: 'Crimson Pulse',
  },
  slate: {
    primary: '#64748b',
    hover: '#475569',
    lightBg: 'rgba(100, 116, 139, 0.12)',
    border: 'rgba(100, 116, 139, 0.35)',
    ring: '#94a3b8',
    glow: '0 0 16px rgba(100, 116, 139, 0.35)',
    label: 'Obsidian Zinc',
  },
};

export const MICA_SURFACE_STYLES: Record<
  WindowsMicaSurface,
  { name: string; gradient: string }
> = {
  mica_default: {
    name: 'Fluent Mica (Dark)',
    gradient:
      'radial-gradient(120% 80% at 50% -10%, rgba(16, 185, 129, 0.10) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(9, 12, 20, 0.98) 100%)',
  },
  mica_alt: {
    name: 'Fluent Mica Alt',
    gradient:
      'radial-gradient(100% 70% at 80% 0%, rgba(0, 120, 212, 0.12) 0%, rgba(13, 20, 36, 0.85) 55%, rgba(6, 9, 17, 0.98) 100%)',
  },
  acrylic_dark: {
    name: 'Windows Acrylic Deep',
    gradient:
      'radial-gradient(circle at 50% 0%, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 70%, rgba(3, 7, 18, 0.98) 100%)',
  },
  acrylic_aurora: {
    name: 'Verdant Aurora',
    gradient:
      'radial-gradient(ellipse at top left, rgba(6, 78, 59, 0.35) 0%, rgba(15, 23, 42, 0.85) 55%, rgba(6, 9, 18, 0.98) 100%)',
  },
  deep_obsidian: {
    name: 'Pure Obsidian',
    gradient:
      'linear-gradient(180deg, rgba(15, 23, 42, 0.92) 0%, rgba(8, 11, 19, 0.98) 100%)',
  },
  slate_mesh: {
    name: 'Carbon Matrix',
    gradient:
      'radial-gradient(circle at 20% 20%, rgba(51, 65, 85, 0.25) 0%, rgba(15, 23, 42, 0.9) 60%, rgba(4, 7, 14, 0.98) 100%)',
  },
};

// Aliases for backwards compatibility with any existing imports
export const ACCENT_COLOR_MAP = WINDOWS_ACCENTS as any;
export const WALLPAPER_STYLES = MICA_SURFACE_STYLES as any;
export type MacAccentColor = WindowsAccentColor;
export type MacWallpaper = WindowsMicaSurface;
export type MacThemeMode = WindowsThemeMode;
export type GlassBlurLevel = MicaBlurLevel;

export const WindowsThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<WindowsThemeMode>('dark');
  const [accentColor, setAccentColor] = useState<WindowsAccentColor>('emerald');
  const [micaSurface, setMicaSurface] = useState<WindowsMicaSurface>('mica_default');
  const [micaBlur, setMicaBlur] = useState<MicaBlurLevel>('deep');
  const [acrylicOpacity, setAcrylicOpacity] = useState<number>(0.82);
  const [volume, setVolume] = useState<number>(80);
  const [brightness, setBrightness] = useState<number>(95);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
  const [isMobileWheelOpen, setIsMobileWheelOpen] = useState(false);
  const [isCopilotFlyoutOpen, setIsCopilotFlyoutOpen] = useState(false);

  // Legacy compatibility dummy state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [windowState, setWindowState] = useState({
    isMaximized: false,
    isMinimized: false,
  });

  const effectiveTheme: 'dark' = 'dark';

  const toggleWindowMinimize = () => {
    setWindowState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const toggleWindowMaximize = () => {
    setWindowState((prev) => ({ ...prev, isMaximized: !prev.isMaximized }));
  };

  const restoreWindow = () => {
    setWindowState({ isMaximized: false, isMinimized: false });
  };

  const accent = WINDOWS_ACCENTS[accentColor];

  return (
    <WindowsThemeContext.Provider
      value={{
        themeMode,
        effectiveTheme,
        accentColor,
        micaSurface,
        micaBlur,
        acrylicOpacity,
        isCommandPaletteOpen,
        isQuickSettingsOpen,
        isActionCenterOpen,
        isMobileWheelOpen,
        isCopilotFlyoutOpen,
        volume,
        brightness,
        windowState,
        setThemeMode,
        setAccentColor,
        setMicaSurface,
        setMicaBlur,
        setAcrylicOpacity,
        setVolume,
        setBrightness,
        setIsCommandPaletteOpen,
        setIsQuickSettingsOpen,
        setIsActionCenterOpen,
        setIsMobileWheelOpen,
        setIsCopilotFlyoutOpen,
        toggleWindowMinimize,
        toggleWindowMaximize,
        restoreWindow,

        // Legacy Aliases
        isSpotlightOpen: isCommandPaletteOpen,
        setIsSpotlightOpen: setIsCommandPaletteOpen,
        isControlCenterOpen: isQuickSettingsOpen,
        setIsControlCenterOpen: setIsQuickSettingsOpen,
        isNotificationCenterOpen: isActionCenterOpen,
        setIsNotificationCenterOpen: setIsActionCenterOpen,
        isSiriOpen: isCopilotFlyoutOpen,
        setIsSiriOpen: setIsCopilotFlyoutOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        wallpaper: micaSurface,
        setWallpaper: (wp: any) => setMicaSurface(wp),
        glassBlur: micaBlur,
        setGlassBlur: (b: any) => setMicaBlur(b),
        glassOpacity: acrylicOpacity,
        setGlassOpacity: (o: number) => setAcrylicOpacity(o),
      }}
    >
      <div
        className="dark min-h-screen font-segoe text-slate-100 bg-stone-950"
        style={
          {
            '--win-accent-primary': accent.primary,
            '--win-accent-hover': accent.hover,
            '--win-accent-light': accent.lightBg,
            '--win-accent-border': accent.border,
            '--win-accent-ring': accent.ring,
            '--win-acrylic-opacity': acrylicOpacity,
            // Legacy fallbacks for any lingering CSS vars
            '--mac-accent-primary': accent.primary,
            '--mac-accent-hover': accent.hover,
            '--mac-accent-light': accent.lightBg,
            '--mac-accent-ring': accent.ring,
            '--mac-glass-opacity': acrylicOpacity,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </WindowsThemeContext.Provider>
  );
};

export const useWindowsTheme = () => {
  const context = useContext(WindowsThemeContext);
  if (!context) {
    throw new Error('useWindowsTheme must be used within a WindowsThemeProvider');
  }
  return context;
};

// Aliases for seamless drop-in backwards compatibility
export const MacThemeProvider = WindowsThemeProvider;
export const useMacTheme = useWindowsTheme;
