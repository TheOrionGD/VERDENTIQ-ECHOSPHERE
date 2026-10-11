'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMacTheme, WALLPAPER_STYLES, ACCENT_COLOR_MAP } from '@/context/MacThemeContext';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Sidebar,
  Search,
  Sparkles,
  Command,
  LayoutDashboard,
  Palette,
  Bot,
  Bell,
  Activity,
  User,
  Settings,
  HelpCircle,
  ShieldAlert,
  Sliders,
  Globe,
  Monitor,
  Smartphone,
  Maximize2,
  Minimize2,
  RotateCcw,
  Compass,
  X,
} from 'lucide-react';
import { OmnibarModal } from './OmnibarModal';
import { DevRoleSwitcher } from '@/components/dev/DevRoleSwitcher';
import { Badge } from '@/components/ui/Badge';

export const MacWindow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { roleConfig, user, viewMode, setViewMode, notifications } = useAuth();
  const {
    effectiveTheme,
    accentColor,
    wallpaper,
    sidebarCollapsed,
    setSidebarCollapsed,
    windowState,
    toggleWindowMinimize,
    toggleWindowMaximize,
    setIsSpotlightOpen,
    setIsControlCenterOpen,
  } = useMacTheme();

  const [isOmnibarOpen, setIsOmnibarOpen] = useState(false);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const currentWallpaper = WALLPAPER_STYLES[wallpaper] || WALLPAPER_STYLES.sonoma;
  const currentAccent = ACCENT_COLOR_MAP[accentColor];

  // Navigation Items categorized HIG style
  const navFavorites = [
    {
      label: 'Role Dashboard',
      path: roleConfig.dashboardPath,
      icon: LayoutDashboard,
      badge: roleConfig.label,
    },
    {
      label: 'Design System Kit',
      path: '/design-system',
      icon: Palette,
      badge: 'Kit',
    },
    {
      label: 'AI Copilot Assistant',
      path: '/assistant',
      icon: Bot,
    },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? `${unreadNotifs}` : undefined,
    },
  ];

  const navSystem = [
    {
      label: 'Activity Log',
      path: '/my-activity',
      icon: Activity,
    },
    {
      label: 'User Profile',
      path: '/profile',
      icon: User,
    },
    {
      label: 'Preferences',
      path: '/settings',
      icon: Settings,
    },
    {
      label: 'Help Manual',
      path: '/help',
      icon: HelpCircle,
    },
    {
      label: 'Role Matrix (403)',
      path: '/403',
      icon: ShieldAlert,
    },
  ];

  // Generate page title based on path
  const getPageTitle = () => {
    if (pathname === roleConfig.dashboardPath) return `${roleConfig.label} Dashboard`;
    if (pathname === '/design-system') return 'Design System Kit Inspector';
    if (pathname === '/assistant') return 'Gemini AI Copilot Assistant';
    if (pathname === '/notifications') return 'Live Notifications & Alerts';
    if (pathname === '/my-activity') return 'User Activity Log';
    if (pathname === '/profile') return 'User Profile';
    if (pathname === '/settings') return 'System Preferences';
    if (pathname === '/help') return 'Documentation & Help';
    if (pathname.startsWith('/admin')) return `Admin: ${pathname.split('/')[2] || 'Console'}`;
    if (pathname.startsWith('/audit')) return `Audit: ${pathname.split('/')[2] || 'Overview'}`;
    if (pathname.startsWith('/mlops')) return `MLOps: ${pathname.split('/')[2] || 'Pipeline'}`;
    if (pathname.startsWith('/student')) return `Student: ${pathname.split('/')[2] || 'Portal'}`;
    if (pathname.startsWith('/user')) return `User: ${pathname.split('/')[2] || 'Dashboard'}`;
    return 'VerdantIQ Workspace';
  };

  if (windowState.isMinimized) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 text-center select-none font-sf min-h-[60vh]">
        <div className="p-6 sm:p-8 rounded-2xl macos-liquid-glass max-w-md space-y-4 shadow-2xl border border-white/50 dark:border-white/10">
          <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Minimize2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold">Window Minimized to Dock</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Click the window thumbnail in the bottom Dock to restore the active workspace.
          </p>
          <button
            onClick={toggleWindowMinimize}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs shadow-md hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            Restore Window Now
          </button>
        </div>
      </div>
    );
  }

  const renderSidebarContent = () => (
    <>
      {/* Favorites Section */}
      <div className="space-y-1 mb-4">
        <div className="px-2 py-1 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
          FAVORITES
        </div>

        {navFavorites.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => {
                // On mobile, close sidebar drawer after tap
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setSidebarCollapsed(true);
                }
              }}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer macos-sidebar-pill',
                isActive
                  ? 'active text-white font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-900/5 dark:hover:bg-stone-100/10'
              )}
              style={isActive ? { backgroundColor: currentAccent.primary } : {}}
            >
              <Icon
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  isActive ? 'text-white' : 'text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-100'
                )}
              />
              <span className="truncate flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border',
                    isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-stone-200/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* System Section */}
      <div className="space-y-1 mb-4">
        <div className="px-2 py-1 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
          SYSTEM & TOOLS
        </div>

        {navSystem.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setSidebarCollapsed(true);
                }
              }}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer macos-sidebar-pill',
                isActive
                  ? 'active text-white font-semibold'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-900/5 dark:hover:bg-stone-100/10'
              )}
              style={isActive ? { backgroundColor: currentAccent.primary } : {}}
            >
              <Icon
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  isActive ? 'text-white' : 'text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-100'
                )}
              />
              <span className="truncate flex-1">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Profile Footer Box */}
      <div className="mt-auto p-3 rounded-xl bg-white/40 dark:bg-stone-900/40 border border-white/50 dark:border-white/10 space-y-2">
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-lg text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs"
            style={{ backgroundColor: currentAccent.primary }}
          >
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-xs text-stone-900 dark:text-stone-100 truncate">
              {user.name}
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate capitalize">
              {user.role} Profile
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-stone-200/40 dark:border-stone-800/40 flex items-center justify-between text-[10px] text-stone-500">
          <span className="truncate">{user.institution || 'Sector 7 Node'}</span>
          <Badge variant={roleConfig.badgeColor} dot>
            Active
          </Badge>
        </div>
      </div>
    </>
  );

  return (
    <div
      className={cn(
        'flex-1 flex flex-col p-1 sm:p-3 md:p-6 pt-9 pb-16 sm:pb-20 transition-all duration-300 font-sf select-none min-h-screen',
        windowState.isMaximized ? 'p-0 sm:p-1 pt-8 pb-16' : ''
      )}
      style={{ background: currentWallpaper.gradient }}
    >
      {/* Main Window Frame Container */}
      <div
        className={cn(
          'flex-1 flex flex-col rounded-xl sm:rounded-2xl macos-liquid-glass macos-window-frame overflow-hidden relative border border-white/60 dark:border-white/15 shadow-2xl',
          windowState.isMaximized ? 'rounded-none border-none shadow-none' : ''
        )}
      >
        {/* Unified System Titlebar & Toolbar */}
        <div className="h-11 sm:h-12 px-2.5 sm:px-4 border-b border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between bg-white/40 dark:bg-stone-900/40 backdrop-blur-md z-30 select-none">
          {/* Left Traffic Lights & Navigation Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            {/* Traffic Lights */}
            <div className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer flex-shrink-0">
              <button
                onClick={() => router.push('/')}
                title="Close Window (Home)"
                className="macos-traffic-light macos-traffic-light-red"
              >
                <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-stone-900">
                  ✕
                </span>
              </button>
              <button
                onClick={toggleWindowMinimize}
                title="Minimize Window"
                className="macos-traffic-light macos-traffic-light-yellow"
              >
                <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-stone-900">
                  −
                </span>
              </button>
              <button
                onClick={toggleWindowMaximize}
                title="Maximize / Full Screen"
                className="macos-traffic-light macos-traffic-light-green"
              >
                <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-stone-900">
                  +
                </span>
              </button>
            </div>

            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title="Toggle Navigation Sidebar (⌘S)"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-900/10 dark:hover:bg-stone-100/10 transition-colors cursor-pointer"
            >
              <Sidebar className="h-4 w-4" />
            </button>

            {/* History Back/Forward */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => router.back()}
                title="Back"
                className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-900/10 dark:hover:bg-stone-100/10 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => router.forward()}
                title="Forward"
                className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-900/10 dark:hover:bg-stone-100/10 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Window Breadcrumb Title */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 dark:text-stone-100 pl-1 min-w-0 truncate">
              <span className="truncate max-w-[140px] sm:max-w-xs">{getPageTitle()}</span>
            </div>
          </div>

          {/* Center Search Input Trigger (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <button
              onClick={() => setIsSpotlightOpen(true)}
              className="w-full flex items-center justify-between h-8 px-3 text-xs bg-stone-200/50 dark:bg-stone-800/50 hover:bg-stone-200/80 dark:hover:bg-stone-800/80 border border-white/40 dark:border-white/10 rounded-lg text-stone-500 dark:text-stone-400 transition-all cursor-pointer group"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="truncate">Spotlight Search (⌘Space)</span>
              </span>
              <kbd className="text-[10px] font-mono text-stone-400 bg-white/60 dark:bg-stone-900/60 px-1.5 py-0.5 rounded-md border border-white/20">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsSpotlightOpen(true)}
              title="Spotlight Search"
              className="md:hidden p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-900/10 dark:hover:bg-stone-100/10 transition-colors cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Control Center Button */}
            <button
              onClick={() => setIsControlCenterOpen(true)}
              title="System Control Center"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-900/10 dark:hover:bg-stone-100/10 transition-colors cursor-pointer"
            >
              <Sliders className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Window Content Split View */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Desktop Navigation Sidebar (>= md) */}
          {!sidebarCollapsed && (
            <aside className="hidden md:flex w-56 lg:w-64 bg-white/30 dark:bg-stone-950/40 border-r border-stone-200/50 dark:border-stone-800/50 flex-col p-3 overflow-y-auto select-none backdrop-blur-lg flex-shrink-0 z-20">
              {renderSidebarContent()}
            </aside>
          )}

          {/* Mobile Navigation Sidebar Drawer (< md) */}
          {!sidebarCollapsed && (
            <div className="md:hidden fixed inset-0 z-40 flex">
              {/* Backdrop Overlay */}
              <div
                onClick={() => setSidebarCollapsed(true)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
              />

              {/* Slide-out Drawer */}
              <aside className="relative z-50 w-72 max-w-[85vw] h-full bg-stone-900/95 dark:bg-stone-950/95 border-r border-stone-800 flex flex-col p-4 overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200 text-stone-100">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <span className="font-bold text-xs tracking-tight">VerdantIQ Navigation</span>
                  </div>
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className="p-1 text-stone-400 hover:text-white rounded-lg cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {renderSidebarContent()}
              </aside>
            </div>
          )}

          {/* Main Content Workspace */}
          <main className="flex-1 overflow-y-auto min-w-0 bg-white/20 dark:bg-stone-950/20">
            <div className="p-3 sm:p-5 md:p-8 max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>

      {/* Dev Role Switcher */}
      <DevRoleSwitcher />
    </div>
  );
};
