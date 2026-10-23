'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWindowsTheme } from '@/context/WindowsThemeContext';
import {
  LayoutDashboard,
  Bot,
  Cpu,
  ShieldCheck,
  Palette,
  Bell,
  Activity,
  Settings,
  Search,
  Compass,
  Terminal,
  Zap,
} from 'lucide-react';

export const WindowsCommandStrip: React.FC = () => {
  const pathname = usePathname();
  const { roleConfig, notifications } = useAuth();
  const { setIsCommandPaletteOpen } = useWindowsTheme();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const quickLinks = [
    {
      label: 'Role Workspace',
      path: roleConfig.dashboardPath,
      icon: LayoutDashboard,
    },
    {
      label: 'AI Copilot',
      path: '/assistant',
      icon: Bot,
    },
    {
      label: 'ML Models',
      path: '/mlops/models',
      icon: Cpu,
    },
    {
      label: 'ESG Compliance',
      path: '/audit/overview',
      icon: ShieldCheck,
    },
    {
      label: 'Live Telemetry',
      path: '/admin/telemetry',
      icon: Terminal,
    },
    {
      label: 'Design Kit',
      path: '/design-system',
      icon: Palette,
    },
  ];

  return (
    <div className="w-full px-3 sm:px-6 py-1.5 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40 text-xs text-slate-300 font-segoe select-none overflow-x-auto scrollbar-none">
      {/* Left: Compact Windows Command Links Strip */}
      <div className="flex items-center gap-1 min-w-max">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.path ||
            (item.path !== '/' && pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/35 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right: Windows Command Shortcut Cue */}
      <div className="hidden lg:flex items-center gap-2 pl-4 flex-shrink-0">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <Search className="h-3 w-3 text-emerald-400" />
          <span>Press</span>
          <kbd className="px-1 py-0.2 rounded bg-slate-900 text-[10px] font-mono text-slate-300 border border-slate-700">Ctrl+K</kbd>
          <span>for all commands</span>
        </button>
      </div>
    </div>
  );
};
