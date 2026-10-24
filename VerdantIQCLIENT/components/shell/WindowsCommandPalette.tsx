'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWindowsTheme } from '@/context/WindowsThemeContext';
import { useVoiceCommand } from '@/context/VoiceCommandContext';
import {
  Search,
  Bot,
  LayoutDashboard,
  ShieldCheck,
  Palette,
  Settings,
  Bell,
  Activity,
  ArrowRight,
  Sparkles,
  X,
  Mic,
  MicOff,
  Cpu,
  Layers,
  Building2,
  GraduationCap,
  Leaf,
  Globe,
  Sliders,
  Database,
  Radio,
  FileCode,
  FileText,
  Clock,
  Terminal,
  Zap,
  Check,
  History,
  Workflow,
  TestTube,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  path?: string;
  action?: () => void;
  category: 'Pages' | 'Actions' | 'Tools' | 'Settings';
  icon: React.ElementType;
  shortcut?: string;
  keywords?: string[];
}

export const WindowsCommandPalette: React.FC = () => {
  const router = useRouter();
  const { user, role, roleConfig, switchRole, notifications } = useAuth();
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setIsQuickSettingsOpen,
    setIsActionCenterOpen,
    setIsCopilotFlyoutOpen,
    accentColor,
    setAccentColor,
  } = useWindowsTheme();
  const { isListening, toggleListening, interimTranscript, transcript } = useVoiceCommand();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sync voice transcription into search query if active
  useEffect(() => {
    if (interimTranscript) {
      setQuery(interimTranscript);
    } else if (transcript) {
      setQuery(transcript);
    }
  }, [interimTranscript, transcript]);

  // Load recent commands from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('verdantiq_recent_commands');
      if (stored) {
        setRecentIds(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Keyboard shortcut: Ctrl + K (and Cmd + K for development), Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        e.preventDefault();
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Complete registry of all application routes, tools, and actions
  const allCommands: CommandItem[] = [
    // Primary Pages
    {
      id: 'page_role_dashboard',
      title: `${roleConfig.label} Dashboard`,
      subtitle: 'Primary role workspace and high-level sustainability overview',
      path: roleConfig.dashboardPath,
      category: 'Pages',
      icon: LayoutDashboard,
      shortcut: 'Alt + 1',
      keywords: ['home', 'overview', 'summary', 'main'],
    },
    {
      id: 'page_ai_assistant',
      title: 'AI Copilot Assistant',
      subtitle: 'Ask Gemini multi-agent reasoning for HVAC, carbon abatement & tariffs',
      path: '/assistant',
      category: 'Pages',
      icon: Bot,
      shortcut: 'Alt + A',
      keywords: ['chat', 'gemini', 'copilot', 'llm', 'prompt'],
    },
    {
      id: 'page_ml_models',
      title: 'Predictive ML Models',
      subtitle: 'Model registry, drift metrics, solver weights & inference latency',
      path: '/mlops/models',
      category: 'Pages',
      icon: Cpu,
      shortcut: 'Alt + M',
      keywords: ['machine learning', 'weights', 'solver', 'drift'],
    },
    {
      id: 'page_compliance_ledger',
      title: 'Audit & Compliance Ledger',
      subtitle: 'Auditor-certified ESG compliance, differential privacy & redacted logs',
      path: '/audit/overview',
      category: 'Pages',
      icon: ShieldCheck,
      shortcut: 'Alt + C',
      keywords: ['esg', 'audit', 'sec', 'privacy', 'compliance'],
    },
    {
      id: 'page_notifications',
      title: 'Notifications & Alerts Feed',
      subtitle: `${notifications.filter((n) => !n.read).length} unread alerts on grid & telemetry anomalies`,
      path: '/notifications',
      category: 'Pages',
      icon: Bell,
      shortcut: 'Alt + N',
      keywords: ['alerts', 'push', 'sse', 'messages'],
    },
    {
      id: 'page_design_system',
      title: 'Design System & Component Kit',
      subtitle: 'Fluent design tokens, typography, Mica materials & controls',
      path: '/design-system',
      category: 'Pages',
      icon: Palette,
      keywords: ['components', 'ui', 'tokens', 'style'],
    },
    {
      id: 'page_activity',
      title: 'User Activity Ledger',
      subtitle: 'Audit trail of recent user operations and state changes',
      path: '/my-activity',
      category: 'Pages',
      icon: Activity,
      keywords: ['history', 'logs', 'audit'],
    },
    {
      id: 'page_settings',
      title: 'System Preferences & Settings',
      subtitle: 'Manage theme, display calibration, and notification thresholds',
      path: '/settings',
      category: 'Settings',
      icon: Settings,
      shortcut: 'Alt + S',
      keywords: ['config', 'options', 'theme', 'account'],
    },
    {
      id: 'page_profile',
      title: 'Account Profile & Security',
      subtitle: `Logged in as ${user.name} (${user.email})`,
      path: '/profile',
      category: 'Settings',
      icon: Building2,
      keywords: ['credentials', 'identity', 'password'],
    },

    // Role-Specific Workspaces
    {
      id: 'page_user_digital_twin',
      title: 'Household Digital Twin',
      subtitle: 'Spatial room-by-room HVAC thermodynamic simulator',
      path: '/user/digital-twin',
      category: 'Pages',
      icon: Cpu,
      keywords: ['room', 'hvac', 'energy', 'thermal'],
    },
    {
      id: 'page_user_forecast',
      title: '30-Day Predictive Tariff Forecast',
      subtitle: 'Hourly dynamic tariff prediction and peak-shaving recommendations',
      path: '/user/forecast',
      category: 'Pages',
      icon: Zap,
      keywords: ['tariff', 'pricing', 'forecast', 'rates'],
    },
    {
      id: 'page_privacy_policy',
      title: 'Privacy Policy & Data Ethics Charter',
      subtitle: 'Zero surveillance telemetry, AES-256 encryption & FERPA/GDPR compliance',
      path: '/privacy',
      category: 'Pages',
      icon: ShieldCheck,
      keywords: ['privacy', 'policy', 'ethics', 'terms', 'security', 'gdpr'],
    },
    {
      id: 'page_user_optimization',
      title: 'MILP Energy Optimizer',
      subtitle: 'Mixed-Integer Linear Programming appliance scheduler',
      path: '/user/optimization',
      category: 'Tools',
      icon: Sliders,
      keywords: ['milp', 'schedule', 'optimize', 'cost'],
    },
    {
      id: 'page_admin_telemetry',
      title: 'Platform Hardware Telemetry',
      subtitle: 'Host system load, Spring Boot status and ML-Gateway health',
      path: '/admin/telemetry',
      category: 'Tools',
      icon: Terminal,
      keywords: ['cpu', 'ram', 'cluster', 'node'],
    },
    {
      id: 'page_admin_database',
      title: 'Database Admin Console',
      subtitle: 'MongoDB collections, sync state, and persistence health',
      path: '/admin/database',
      category: 'Tools',
      icon: Database,
      keywords: ['mongodb', 'records', 'collections'],
    },

    // Fast Contextual Actions
    {
      id: 'action_open_quick_settings',
      title: 'Open Windows Quick Settings',
      subtitle: 'Adjust display brightness, volume, Wi-Fi & accent theme',
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsQuickSettingsOpen(true);
      },
      category: 'Actions',
      icon: Sliders,
      shortcut: 'Win + A',
      keywords: ['quick', 'slider', 'sound', 'brightness'],
    },
    {
      id: 'action_open_action_center',
      title: 'Open Action Center Notifications',
      subtitle: 'View live notification flyout drawer and system calendar',
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsActionCenterOpen(true);
      },
      category: 'Actions',
      icon: Bell,
      shortcut: 'Win + N',
      keywords: ['notifications', 'drawer', 'alerts'],
    },
    {
      id: 'action_switch_to_admin',
      title: 'Switch Role to Platform Admin',
      subtitle: 'Access Tier 1 global governance, RBAC & system telemetry',
      action: () => {
        switchRole('admin');
        setIsCommandPaletteOpen(false);
        router.push('/admin/telemetry');
      },
      category: 'Actions',
      icon: ShieldCheck,
      keywords: ['admin', 'role', 'switch'],
    },
    {
      id: 'action_switch_to_mlops',
      title: 'Switch Role to MLOps Architect',
      subtitle: 'Access ML model registry, LLM gateway and canary rollouts',
      action: () => {
        switchRole('mlops');
        setIsCommandPaletteOpen(false);
        router.push('/mlops/models');
      },
      category: 'Actions',
      icon: Cpu,
      keywords: ['mlops', 'models', 'role'],
    },
    {
      id: 'action_switch_to_user',
      title: 'Switch Role to Household User',
      subtitle: 'Access EcoScore dashboard, digital twin and rewards catalog',
      action: () => {
        switchRole('user');
        setIsCommandPaletteOpen(false);
        router.push('/user/dashboard');
      },
      category: 'Actions',
      icon: Leaf,
      keywords: ['household', 'user', 'role'],
    },
    {
      id: 'action_switch_to_student',
      title: 'Switch Role to Campus Student',
      subtitle: 'Access campus challenges, dorm digital twin & student rewards',
      action: () => {
        switchRole('student');
        setIsCommandPaletteOpen(false);
        router.push('/student/dashboard');
      },
      category: 'Actions',
      icon: GraduationCap,
      keywords: ['student', 'campus', 'role'],
    },
    {
      id: 'action_toggle_mic',
      title: isListening ? 'Stop Voice Controller' : 'Start Voice Controller Dictation',
      subtitle: isListening ? 'Voice listening is currently active' : 'Speak voice instructions to navigate',
      action: () => {
        toggleListening();
      },
      category: 'Actions',
      icon: isListening ? MicOff : Mic,
      shortcut: 'Alt + V',
      keywords: ['voice', 'microphone', 'speech'],
    },
  ];

  // Filter commands by query
  const filtered = query.trim()
    ? allCommands.filter((cmd) => {
        const q = query.toLowerCase();
        return (
          cmd.title.toLowerCase().includes(q) ||
          cmd.subtitle.toLowerCase().includes(q) ||
          cmd.category.toLowerCase().includes(q) ||
          (cmd.keywords && cmd.keywords.some((kw) => kw.toLowerCase().includes(q)))
        );
      })
    : allCommands;

  // Execute selected command
  const executeCommand = (cmd: CommandItem) => {
    // Record into recent items
    const nextRecents = [cmd.id, ...recentIds.filter((id) => id !== cmd.id)].slice(0, 5);
    setRecentIds(nextRecents);
    try {
      localStorage.setItem('verdantiq_recent_commands', JSON.stringify(nextRecents));
    } catch {}

    setIsCommandPaletteOpen(false);
    setQuery('');

    if (cmd.action) {
      cmd.action();
    } else if (cmd.path) {
      router.push(cmd.path);
    }
  };

  // Keyboard navigation within list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        executeCommand(filtered[selectedIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else {
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const activeEl = listEl.children[selectedIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-150 select-none font-segoe">
      {/* Backdrop click to dismiss */}
      <div
        className="fixed inset-0"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Centered Floating Windows 11 Command Palette Window */}
      <div className="relative w-full max-w-2xl flex flex-col rounded-xl win11-mica-surface border border-slate-700/60 shadow-2xl text-slate-100 z-50 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Top Accent Strip */}
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/40">
          <Search className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command, page name, or action (e.g. 'Audit', 'Forecast', 'Admin')..."
            className="flex-1 bg-transparent text-sm font-normal text-slate-100 outline-none placeholder:text-slate-400"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Voice Input Trigger */}
          <button
            onClick={toggleListening}
            className={`p-1.5 rounded-md transition-colors ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
            }`}
            title={isListening ? 'Stop voice recording' : 'Dictate search with voice'}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            Ctrl+K
          </kbd>

          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="p-2 max-h-[380px] overflow-y-auto space-y-1 scrollbar-none"
        >
          {filtered.length > 0 ? (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-emerald-600/20 text-white border border-emerald-500/40 shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-emerald-400 group-hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 truncate">
                          {cmd.title}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800/90 text-slate-400 border border-slate-700/80">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {cmd.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                    {cmd.shortcut && (
                      <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-slate-800/90 text-[10px] font-mono text-slate-400 border border-slate-700">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight
                      className={`h-3.5 w-3.5 transition-transform ${
                        isSelected
                          ? 'text-emerald-400 translate-x-0.5 opacity-100'
                          : 'text-slate-600 opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <Sparkles className="h-6 w-6 text-emerald-400 mx-auto animate-pulse" />
              <p className="font-semibold text-slate-200">No matching command found</p>
              <p className="text-[11px] text-slate-400">
                Press Enter to ask Gemini AI Copilot directly, or check for typos.
              </p>
              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  router.push(`/assistant?q=${encodeURIComponent(query)}`);
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-medium cursor-pointer"
              >
                <span>Ask Gemini Copilot: &quot;{query}&quot;</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Windows 11 Bottom Status & Hints Bar */}
        <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-slate-800 text-[9px] border border-slate-700">↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-slate-800 text-[9px] border border-slate-700">Enter</kbd>
              <span>Select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-slate-800 text-[9px] border border-slate-700">Esc</kbd>
              <span>Close</span>
            </span>
          </div>

          <span className="text-[10px] font-mono text-emerald-400/90">
            Fluent Command Engine
          </span>
        </div>
      </div>
    </div>
  );
};
