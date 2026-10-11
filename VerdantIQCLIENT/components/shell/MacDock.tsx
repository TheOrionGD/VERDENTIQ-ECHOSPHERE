'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMacTheme } from '@/context/MacThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Bot,
  Cpu,
  ShieldCheck,
  Palette,
  Bell,
  Activity,
  Settings,
  HelpCircle,
  Trash2,
  Minimize2,
  Folder,
} from 'lucide-react';

export const MacDock: React.FC = () => {
  const pathname = usePathname();
  const { roleConfig, notifications } = useAuth();
  const { windowState, restoreWindow } = useMacTheme();
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const dockApps = [
    {
      id: 'dashboard',
      label: 'System Dashboard',
      path: roleConfig.dashboardPath,
      icon: LayoutDashboard,
      color: 'bg-gradient-to-tr from-blue-600 to-cyan-400',
    },
    {
      id: 'assistant',
      label: 'AI Copilot Assistant',
      path: '/assistant',
      icon: Bot,
      color: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400',
    },
    {
      id: 'mlops',
      label: 'MLOps Pipeline',
      path: '/mlops/models',
      icon: Cpu,
      color: 'bg-gradient-to-tr from-emerald-600 to-teal-400',
    },
    {
      id: 'audit',
      label: 'Audit & Compliance',
      path: '/audit/overview',
      icon: ShieldCheck,
      color: 'bg-gradient-to-tr from-stone-800 to-stone-600',
    },
    {
      id: 'design-system',
      label: 'Design System Kit',
      path: '/design-system',
      icon: Palette,
      color: 'bg-gradient-to-tr from-indigo-600 to-purple-500',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      color: 'bg-gradient-to-tr from-rose-500 to-amber-500',
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
    },
    {
      id: 'activity',
      label: 'My Activity Log',
      path: '/my-activity',
      icon: Activity,
      color: 'bg-gradient-to-tr from-emerald-700 to-green-500',
    },
    {
      id: 'settings',
      label: 'System Settings',
      path: '/settings',
      icon: Settings,
      color: 'bg-gradient-to-tr from-slate-600 to-slate-400',
    },
  ];

  return (
    <div className="fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-40 select-none font-sf max-w-[96vw]">
      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl macos-liquid-glass shadow-2xl border border-white/60 dark:border-white/10 backdrop-blur-2xl overflow-x-auto scrollbar-none">
        {dockApps.map((app) => {
          const Icon = app.icon;
          const isActive = pathname === app.path;

          return (
            <div key={app.id} className="relative group flex flex-col items-center flex-shrink-0">
              {/* Tooltip Hover Label (Desktop only) */}
              <AnimatePresence>
                {hoveredApp === app.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: -10 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="hidden sm:block absolute -top-10 px-2.5 py-1 rounded-lg bg-stone-900/90 text-white dark:bg-stone-100/90 dark:text-stone-900 text-[10px] font-semibold tracking-tight shadow-md whitespace-nowrap pointer-events-none z-50 border border-white/20"
                  >
                    {app.label}
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                href={app.path}
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
                className="relative block"
              >
                <motion.div
                  whileHover={{ scale: 1.2, y: -6 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl ${app.color} text-white flex items-center justify-center shadow-lg border border-white/30 relative cursor-pointer`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white drop-shadow-xs" />

                  {/* Badge */}
                  {app.badge && (
                    <span className="absolute -top-1 -right-1 h-3.5 min-w-3.5 sm:h-4 sm:min-w-4 px-0.5 sm:px-1 rounded-full bg-rose-500 text-white font-bold text-[8px] sm:text-[9px] flex items-center justify-center border border-white shadow-xs">
                      {app.badge}
                    </span>
                  )}
                </motion.div>

                {/* Active App Indicator Dot */}
                {isActive && (
                  <motion.div
                    layoutId="activeDockDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-stone-900 dark:bg-stone-100 shadow-xs"
                  />
                )}
              </Link>
            </div>
          );
        })}

        {/* Separator */}
        <div className="h-6 sm:h-8 w-[0.5px] bg-stone-300 dark:bg-stone-700 mx-0.5 sm:mx-1 flex-shrink-0" />

        {/* Minimized Window or Downloads / Trash */}
        {windowState.isMinimized ? (
          <div className="relative group flex-shrink-0">
            <button
              onClick={restoreWindow}
              onMouseEnter={() => setHoveredApp('minimizedWindow')}
              onMouseLeave={() => setHoveredApp(null)}
              className="relative block"
            >
              <motion.div
                whileHover={{ scale: 1.2, y: -6 }}
                className="h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-stone-800/80 text-emerald-400 border border-emerald-500/50 flex items-center justify-center shadow-md cursor-pointer"
              >
                <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
            </button>
            {hoveredApp === 'minimizedWindow' && (
              <div className="hidden sm:block absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-stone-900/90 text-white text-[10px] font-semibold shadow-md whitespace-nowrap z-50">
                Restore Window
              </div>
            )}
          </div>
        ) : (
          <div className="relative group flex-shrink-0">
            <Link
              href="/help"
              onMouseEnter={() => setHoveredApp('downloads')}
              onMouseLeave={() => setHoveredApp(null)}
              className="relative block"
            >
              <motion.div
                whileHover={{ scale: 1.2, y: -6 }}
                className="h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-stone-200/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-white/30 flex items-center justify-center shadow-md cursor-pointer"
              >
                <Folder className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
            </Link>
            {hoveredApp === 'downloads' && (
              <div className="hidden sm:block absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-stone-900/90 text-white text-[10px] font-semibold shadow-md whitespace-nowrap z-50">
                Downloads & Help
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
