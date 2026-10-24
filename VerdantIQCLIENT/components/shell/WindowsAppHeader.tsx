'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWindowsTheme } from '@/context/WindowsThemeContext';
import { useVoiceCommand } from '@/context/VoiceCommandContext';
import { ROLE_CONFIGS, RoleType } from '@/lib/services/authService';
import {
  Search,
  Sliders,
  Bell,
  Mic,
  MicOff,
  ChevronDown,
  LayoutDashboard,
  Bot,
  Cpu,
  ShieldCheck,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Leaf,
  GraduationCap,
  Layers,
  Building2,
  Globe,
  Radio,
  Check,
  Compass,
} from 'lucide-react';

export const WindowsAppHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, roleConfig, switchRole, notifications } = useAuth();
  const {
    setIsCommandPaletteOpen,
    setIsQuickSettingsOpen,
    setIsActionCenterOpen,
    setIsMobileWheelOpen,
  } = useWindowsTheme();
  const { isListening, toggleListening, setIsVoiceOverlayOpen } = useVoiceCommand();

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative z-40 w-full flex items-center justify-between px-3 sm:px-6 py-2 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md select-none font-segoe">
      {/* Left: Application Identity & Contextual Role Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* App Icon */}
        <Link
          href={roleConfig.dashboardPath}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 font-bold text-slate-950 shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Leaf className="h-4 w-4 text-slate-950" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold tracking-tight text-slate-100 flex items-center gap-1.5">
              VerdantIQ
              <span className="text-[10px] font-mono font-normal text-emerald-400 px-1 py-0.2 rounded bg-emerald-950/70 border border-emerald-500/30">
                v1.0.2
              </span>
            </span>
          </div>
        </Link>

        {/* Separator */}
        <div className="h-4 w-px bg-slate-800" />

        {/* Current Authenticated Role Badge (Clean Production Display) */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="font-medium text-slate-100">{roleConfig.label}</span>
        </div>
      </div>

      {/* Center: Primary Search & Command Trigger (Windows 11 Centered Search Bar) */}
      <div className="flex-1 max-w-md mx-3 hidden md:block">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between h-8 px-3 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer group shadow-inner"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-105 transition-transform" />
            <span className="truncate">Search pages, actions, and commands...</span>
          </span>
          <kbd className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Tools (Search, Mic, Settings, Alerts, User Profile) */}
      <div className="flex items-center gap-1.5">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Command Palette (Ctrl+K)"
        >
          <Search className="h-4 w-4 text-emerald-400" />
        </button>

        {/* Voice Controller Dictation */}
        <button
          onClick={() => {
            setIsVoiceOverlayOpen(true);
            toggleListening();
          }}
          className={`p-1.5 rounded-md transition-colors ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse'
              : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
          }`}
          title="Voice Command Assistant"
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        {/* Windows Quick Settings Trigger */}
        <button
          onClick={() => setIsQuickSettingsOpen((prev) => !prev)}
          className="p-1.5 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
          title="Windows Quick Settings"
        >
          <Sliders className="h-4 w-4" />
        </button>

        {/* Action Center Notifications Trigger */}
        <button
          onClick={() => setIsActionCenterOpen((prev) => !prev)}
          className="p-1.5 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors relative"
          title="Notifications & Action Center"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute 0 top-0.5 right-0.5 h-3.5 min-w-3.5 px-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Account Profile Flyout */}
        <div className="relative">
          <button
            onClick={() => {
              setIsAccountMenuOpen(!isAccountMenuOpen);
            }}
            className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
          >
            <div className="h-5 w-5 rounded bg-emerald-600 text-slate-950 font-bold text-[10px] flex items-center justify-center">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden xl:inline text-xs font-medium text-slate-200">
              {user.name}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isAccountMenuOpen && (
            <>
              {/* Invisible backdrop to dismiss when clicking anywhere outside */}
              <div
                className="fixed inset-0 z-50 bg-transparent"
                onClick={() => setIsAccountMenuOpen(false)}
              />
              <div className="absolute top-9 right-0 w-56 rounded-xl win11-acrylic-surface border border-slate-700/80 p-1.5 shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="text-xs font-semibold text-slate-100 truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{user.email}</div>
                </div>

                <div className="mt-1 space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <User className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Profile & Security</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Settings className="h-3.5 w-3.5 text-teal-400" />
                    <span>Settings & Preferences</span>
                  </Link>
                  <Link
                    href="/help"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                    <span>Help & Documentation</span>
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Privacy Policy & Ethics</span>
                  </Link>
                  <div className="my-1 border-t border-slate-800" />
                  <Link
                    href="/logout"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
