'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMacTheme, ACCENT_COLOR_MAP } from '@/context/MacThemeContext';
import { useVoiceCommand } from '@/context/VoiceCommandContext';
import { ROLE_CONFIGS, RoleType } from '@/lib/services/authService';
import {
  Wifi,
  BatteryCharging,
  Search,
  Sliders,
  Sparkles,
  Command,
  Sun,
  Moon,
  Volume2,
  Check,
  Shield,
  User,
  Power,
  RotateCcw,
  Monitor,
  LayoutGrid,
  Bell,
  HelpCircle,
  Mic,
  Menu,
  X,
  ChevronRight,
  Bot,
  Cpu,
  ShieldCheck,
  Activity,
  Settings,
  Building2,
  GraduationCap,
  MapPin,
  Leaf,
  Layers,
  FileText,
  BarChart3,
  Calendar,
  Globe,
  Database,
  Lock,
  ArrowRight,
  Radio,
} from 'lucide-react';

export const MacMenuBar: React.FC = () => {
  const { user, roleConfig, switchRole, notifications, mongoConnected, firebaseReady } = useAuth();
  const {
    effectiveTheme,
    accentColor,
    isControlCenterOpen,
    setIsControlCenterOpen,
    isSpotlightOpen,
    setIsSpotlightOpen,
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    isSiriOpen,
    setIsSiriOpen,
    setThemeMode,
    themeMode,
  } = useMacTheme();

  const { isListening, toggleListening, setIsVoiceOverlayOpen } = useVoiceCommand();
  const pathname = usePathname();
  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [selectedMobileSuite, setSelectedMobileSuite] = useState<RoleType>(user.role);
  const [timeString, setTimeString] = useState<string>('');
  const [shortTimeString, setShortTimeString] = useState<string>('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setSelectedMobileSuite(user.role);
  }, [user.role]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      const day = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      setTimeString(`${day} ${time}`);
      setShortTimeString(time);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  });

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  // Close desktop dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mac-menu-container') && !target.closest('.mac-mobile-drawer')) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  });

  // Close mobile drawer on route changes
  useEffect(() => {
    setIsMobileDrawerOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  // Suite pages mapping for the mobile navigation drawer
  const SUITE_NAVIGATION: Record<
    RoleType,
    { label: string; icon: any; color: string; pages: { label: string; path: string; icon: any; badge?: string }[] }
  > = {
    admin: {
      label: 'Platform Admin',
      icon: Shield,
      color: 'text-rose-400',
      pages: [
        { label: 'Telemetry & System Health', path: '/admin/telemetry', icon: Activity, badge: 'Live' },
        { label: 'Database & MongoDB Engine', path: '/admin/database', icon: Database },
        { label: 'Global Audit Logs', path: '/admin/audit-logs', icon: FileText },
        { label: 'Tenant Onboarding Requests', path: '/admin/tenant-requests', icon: Building2 },
        { label: 'Domain Whitelist Governance', path: '/admin/domains', icon: Globe },
        { label: 'Dynamic Feature Flags', path: '/admin/feature-flags', icon: Sliders },
        { label: 'API Rate Limits & Throttling', path: '/admin/rate-limits', icon: Cpu },
        { label: 'RBAC Access Schema', path: '/admin/rbac-schema', icon: Lock },
        { label: 'Emergency Broadcast System', path: '/admin/broadcasts', icon: Radio },
      ],
    },
    mlops: {
      label: 'MLOps Pipeline',
      icon: Cpu,
      color: 'text-amber-400',
      pages: [
        { label: 'Predictive Model Registry', path: '/mlops/models', icon: Layers, badge: 'v2.4' },
        { label: 'MILP Optimization Engine', path: '/mlops/optimizer', icon: Cpu },
        { label: 'LLM Gateway (Gemini 2.5)', path: '/mlops/llm-gateway', icon: Bot },
        { label: 'A/B Canary Deployments', path: '/mlops/canary', icon: Sliders },
        { label: 'Data Pipeline & Feature Store', path: '/mlops/data-pipeline', icon: Database },
        { label: 'Drift & Anomaly Alerts', path: '/mlops/alerts', icon: Bell },
        { label: 'Fallback Model Console', path: '/mlops/fallback-console', icon: RotateCcw },
      ],
    },
    audit: {
      label: 'Auditor Compliance',
      icon: ShieldCheck,
      color: 'text-stone-300',
      pages: [
        { label: 'Audit Compliance Overview', path: '/audit/overview', icon: ShieldCheck },
        { label: 'Immutable Audit Logs', path: '/audit/logs', icon: FileText, badge: 'SHA-256' },
        { label: 'Scientific Data Exports', path: '/audit/export', icon: Database },
        { label: 'Verified Domain Registry', path: '/audit/domains', icon: Globe },
        { label: 'Tenant Access History', path: '/audit/tenant-history', icon: Building2 },
        { label: 'Algorithmic Fairness Reports', path: '/audit/fairness-reports', icon: BarChart3 },
        { label: 'Data Flow Topology Graph', path: '/audit/data-flow', icon: Layers },
      ],
    },
    region: {
      label: 'Regional District',
      icon: MapPin,
      color: 'text-emerald-400',
      pages: [
        { label: 'District Multi-Campus Dashboard', path: '/region/dashboard', icon: LayoutGrid, badge: 'Primary' },
        { label: 'Institutional Tenants Directory', path: '/region/institutions', icon: Building2 },
        { label: 'Cross-District Benchmark', path: '/region/benchmark', icon: BarChart3 },
        { label: 'Regional Target Reports', path: '/region/reports', icon: FileText },
        { label: 'Regional Domain Approval', path: '/region/domains', icon: Globe },
        { label: 'District Student Aggregate', path: '/region/students', icon: GraduationCap },
      ],
    },
    institution: {
      label: 'Campus Institution',
      icon: Building2,
      color: 'text-teal-400',
      pages: [
        { label: 'Campus ESG Dashboard', path: '/institution/dashboard', icon: LayoutGrid, badge: 'Primary' },
        { label: 'Department ESG Analytics', path: '/institution/departments', icon: Building2 },
        { label: 'Institutional Domain Setup', path: '/institution/domains', icon: Globe },
        { label: 'Campus Geofence Configuration', path: '/institution/geofence', icon: MapPin },
        { label: 'Verified Students Roster', path: '/institution/students', icon: GraduationCap },
        { label: 'Campus-wide Eco Challenges', path: '/institution/challenges', icon: Sparkles },
        { label: 'Institutional Carbon Reports', path: '/institution/reports', icon: FileText },
      ],
    },
    dept: {
      label: 'Department Moderator',
      icon: Layers,
      color: 'text-amber-300',
      pages: [
        { label: 'Department HVAC & Energy Board', path: '/dept/dashboard', icon: LayoutGrid, badge: 'Primary' },
        { label: 'Student ID Verification Queue', path: '/dept/verify', icon: ShieldCheck },
        { label: 'Department Member Directory', path: '/dept/members', icon: User },
        { label: 'Department Students', path: '/dept/students', icon: GraduationCap },
        { label: 'Local Challenge Templates', path: '/dept/challenges/templates', icon: Sparkles },
        { label: 'Department Energy Analytics', path: '/dept/analytics', icon: BarChart3 },
      ],
    },
    student: {
      label: 'Student Campus',
      icon: GraduationCap,
      color: 'text-emerald-300',
      pages: [
        { label: 'Student EcoScore Dashboard', path: '/student/dashboard', icon: LayoutGrid, badge: 'Primary' },
        { label: 'Dorm Room Digital Twin', path: '/student/digital-twin', icon: Monitor },
        { label: 'Predictive Energy Forecast', path: '/student/forecast', icon: BarChart3 },
        { label: 'HVAC Shift Solver & Optimizer', path: '/student/optimization', icon: Cpu },
        { label: 'AI Campus Copilot', path: '/student/assistant', icon: Bot },
        { label: 'Campus Eco Challenges', path: '/student/challenges', icon: Sparkles },
        { label: 'Cohort Community & Leaderboard', path: '/student/community', icon: Leaf },
        { label: 'Academic Green Projects', path: '/student/academic-projects', icon: FileText },
        { label: 'Student Rewards & EcoPoints', path: '/student/rewards', icon: ShieldCheck },
      ],
    },
    user: {
      label: 'Standard Household',
      icon: Leaf,
      color: 'text-emerald-400',
      pages: [
        { label: 'Personal EcoScore Dashboard', path: '/user/dashboard', icon: LayoutGrid, badge: 'Primary' },
        { label: 'Home IoT Digital Twin', path: '/user/digital-twin', icon: Monitor },
        { label: 'Predictive Solar & Load Forecast', path: '/user/forecast', icon: BarChart3 },
        { label: 'HVAC & Battery Optimizer', path: '/user/optimization', icon: Cpu },
        { label: 'AI Eco Assistant', path: '/user/assistant', icon: Bot },
        { label: 'Neighborhood Community', path: '/user/community', icon: Leaf },
        { label: 'Smart Home Devices', path: '/user/devices', icon: Cpu },
        { label: 'Eco Goals & Milestones', path: '/user/goals', icon: Sparkles },
        { label: 'Historical Activity Logs', path: '/user/history', icon: Activity },
      ],
    },
  };

  // Collect all searchable pages for global mobile quick search
  const allSearchablePages = Object.entries(SUITE_NAVIGATION).flatMap(([roleKey, suite]) =>
    suite.pages.map((p) => ({
      ...p,
      roleKey,
      suiteName: suite.label,
    }))
  );

  const filteredSearchPages = mobileSearchQuery.trim()
    ? allSearchablePages.filter(
        (p) =>
          p.label.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
          p.suiteName.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
          p.path.toLowerCase().includes(mobileSearchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <header className="mac-menu-container fixed top-0 left-0 right-0 z-50 h-8 sm:h-7 text-xs font-sf flex items-center justify-between px-2 sm:px-3 macos-menubar select-none shadow-xs text-stone-900 dark:text-stone-100 backdrop-blur-xl border-b border-white/20 dark:border-white/10">
        {/* Left Menu Items */}
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          {/* VerdantIQ System Logo Menu */}
          <div className="relative">
            <button
              onClick={() => handleMenuClick('verdantiq')}
              title="VerdantIQ System Menu"
              className={`p-1.5 sm:px-2 sm:py-0.5 rounded-md transition-colors flex items-center justify-center font-bold text-sm cursor-pointer ${
                activeMenu === 'verdantiq'
                  ? 'bg-stone-900/10 dark:bg-stone-100/15'
                  : 'hover:bg-stone-900/5 dark:hover:bg-stone-100/10'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/20" />
            </button>

            {activeMenu === 'verdantiq' && (
              <div className="absolute top-8 sm:top-7 left-0 w-60 max-w-[calc(100vw-1rem)] rounded-xl macos-liquid-glass p-2 shadow-2xl z-50 border border-white/40 dark:border-white/10 text-[11px] animate-in fade-in duration-100">
                <div className="px-3 py-1.5 font-bold border-b border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between text-stone-900 dark:text-stone-100">
                  <span>VerdantIQ OS v2.6</span>
                  <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    Liquid Glass
                  </span>
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsControlCenterOpen(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>System Settings...</span>
                    <Sliders className="h-3 w-3 opacity-60" />
                  </button>

                  <Link
                    href="/design-system"
                    onClick={() => setActiveMenu(null)}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Design System Kit</span>
                    <LayoutGrid className="h-3 w-3 opacity-60" />
                  </Link>

                  <button
                    onClick={() => {
                      setIsSpotlightOpen(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Spotlight Search (⌘Space)</span>
                    <Search className="h-3 w-3 opacity-60" />
                  </button>
                </div>

                <div className="my-1 border-t border-stone-200/50 dark:border-stone-800/50" />

                <div className="px-3 py-1 text-[10px] font-semibold text-stone-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Active Suite</span>
                  <span className="text-emerald-500 font-mono text-[9px] font-bold uppercase">{user.role}</span>
                </div>

                <div className="px-3 py-1 text-xs text-stone-300 font-medium truncate">
                  {roleConfig.label}
                </div>

                <div className="my-1 border-t border-stone-200/50 dark:border-stone-800/50" />

                <button
                  onClick={() => {
                    window.location.reload();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-600 hover:text-white transition-colors flex items-center justify-between text-rose-600 dark:text-rose-400 cursor-pointer"
                >
                  <span>Restart Session</span>
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* App Title Button */}
          <div className="relative">
            <button
              onClick={() => handleMenuClick('app')}
              className={`px-1.5 sm:px-2 py-0.5 font-bold rounded-md transition-colors text-xs sm:text-xs cursor-pointer ${
                activeMenu === 'app'
                  ? 'bg-stone-900/10 dark:bg-stone-100/15'
                  : 'hover:bg-stone-900/5 dark:hover:bg-stone-100/10'
              }`}
            >
              VerdantIQ
            </button>

            {activeMenu === 'app' && (
              <div className="absolute top-8 sm:top-7 left-0 w-52 max-w-[calc(100vw-1rem)] rounded-xl macos-liquid-glass p-2 shadow-2xl z-50 text-[11px] animate-in fade-in duration-100">
                <Link
                  href="/profile"
                  onClick={() => setActiveMenu(null)}
                  className="block px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white"
                >
                  Profile ({user.name})
                </Link>
                <button
                  onClick={() => {
                    setIsControlCenterOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white cursor-pointer"
                >
                  Preferences...
                </button>
                <div className="my-1 border-t border-stone-200/50 dark:border-stone-800/50" />
                <Link
                  href="/logout"
                  onClick={() => setActiveMenu(null)}
                  className="block px-3 py-1.5 rounded-lg hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400"
                >
                  Quit VerdantIQ
                </Link>
              </div>
            )}
          </div>

          {/* Mobile View Menu Bar Button (Prominent Menu Toggle) */}
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            title="Open Mobile Navigation Menu Bar View"
            className="flex items-center gap-1 px-2 py-1 sm:py-0.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30 transition-all cursor-pointer shadow-xs text-[11px] sm:text-xs"
          >
            <Menu className="h-3.5 w-3.5" />
            <span>Menu</span>
            <span className="hidden sm:inline-block text-[9px] px-1 py-0.2 bg-emerald-500/20 rounded font-mono uppercase">
              {user.role}
            </span>
          </button>

          {/* Desktop Classic Sub-Menus (File, Edit, View, Window, Help) */}
          <div className="hidden lg:flex items-center gap-1 text-[11px]">
            {/* File Menu */}
            <div className="relative">
              <button
                onClick={() => handleMenuClick('file')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  activeMenu === 'file'
                    ? 'bg-stone-900/10 dark:bg-stone-100/15 font-semibold'
                    : 'hover:bg-stone-900/5 dark:hover:bg-stone-100/10'
                }`}
              >
                File
              </button>
              {activeMenu === 'file' && (
                <div className="absolute top-7 left-0 w-52 rounded-xl macos-liquid-glass p-1.5 shadow-2xl z-50 text-[11px] animate-in fade-in duration-100">
                  <Link
                    href={roleConfig.dashboardPath}
                    onClick={() => setActiveMenu(null)}
                    className="block px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white"
                  >
                    Open Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsSpotlightOpen(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white cursor-pointer"
                  >
                    Spotlight Search (⌘Space)
                  </button>
                  <Link
                    href="/audit/export"
                    onClick={() => setActiveMenu(null)}
                    className="block px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white"
                  >
                    Export Compliance Package...
                  </Link>
                </div>
              )}
            </div>

            {/* Edit Menu */}
            <div className="relative">
              <button
                onClick={() => handleMenuClick('edit')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  activeMenu === 'edit'
                    ? 'bg-stone-900/10 dark:bg-stone-100/15 font-semibold'
                    : 'hover:bg-stone-900/5 dark:hover:bg-stone-100/10'
                }`}
              >
                Edit
              </button>
              {activeMenu === 'edit' && (
                <div className="absolute top-7 left-0 w-48 rounded-xl macos-liquid-glass p-1.5 shadow-2xl z-50 text-[11px] animate-in fade-in duration-100">
                  <Link
                    href="/assistant"
                    onClick={() => setActiveMenu(null)}
                    className="block px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white"
                  >
                    Synthesize with AI
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setActiveMenu(null)}
                    className="block px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white"
                  >
                    Preferences
                  </Link>
                </div>
              )}
            </div>

            {/* View Menu */}
            <div className="relative">
              <button
                onClick={() => handleMenuClick('view')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  activeMenu === 'view'
                    ? 'bg-stone-900/10 dark:bg-stone-100/15 font-semibold'
                    : 'hover:bg-stone-900/5 dark:hover:bg-stone-100/10'
                }`}
              >
                View
              </button>
              {activeMenu === 'view' && (
                <div className="absolute top-7 left-0 w-48 rounded-xl macos-liquid-glass p-1.5 shadow-2xl z-50 text-[11px] animate-in fade-in duration-100">
                  <button
                    onClick={() => {
                      setThemeMode('dark');
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer"
                  >
                    <span>Theme: Dark Glass</span>
                    <Moon className="h-3 w-3" />
                  </button>
                  <Link
                    href="/design-system"
                    onClick={() => setActiveMenu(null)}
                    className="block px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white"
                  >
                    Inspect Design Tokens
                  </Link>
                </div>
              )}
            </div>

            {/* Help Menu */}
            <div className="relative">
              <button
                onClick={() => handleMenuClick('help')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  activeMenu === 'help'
                    ? 'bg-stone-900/10 dark:bg-stone-100/15 font-semibold'
                    : 'hover:bg-stone-900/5 dark:hover:bg-stone-100/10'
                }`}
              >
                Help
              </button>
              {activeMenu === 'help' && (
                <div className="absolute top-7 left-0 w-48 rounded-xl macos-liquid-glass p-1.5 shadow-2xl z-50 text-[11px] animate-in fade-in duration-100">
                  <Link
                    href="/help"
                    onClick={() => setActiveMenu(null)}
                    className="block px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white"
                  >
                    VerdantIQ Manual
                  </Link>
                  <Link
                    href="/assistant"
                    onClick={() => setActiveMenu(null)}
                    className="block px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white"
                  >
                    AI Help Desk
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right System Tray Icons */}
        <div className="flex items-center gap-1 sm:gap-1.5 font-medium">
          {/* Wi-Fi Status Icon */}
          <button
            onClick={() => setIsControlCenterOpen(!isControlCenterOpen)}
            title="Wi-Fi: Microgrid Connected"
            className="p-1.5 hover:bg-stone-900/10 dark:hover:bg-stone-100/15 rounded-md transition-colors cursor-pointer"
          >
            <Wifi className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Voice Command Mic Trigger */}
          <button
            onClick={() => {
              setIsVoiceOverlayOpen(true);
              toggleListening();
            }}
            title="Voice Commands Intelligence"
            className={`p-1.5 rounded-md transition-colors cursor-pointer relative ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-sm shadow-rose-500/50'
                : 'hover:bg-stone-900/10 dark:hover:bg-stone-100/15'
            }`}
          >
            <Mic className={`h-3.5 w-3.5 ${isListening ? 'text-white' : 'text-emerald-500 dark:text-emerald-400'}`} />
          </button>

          {/* Spotlight Trigger */}
          <button
            onClick={() => setIsSpotlightOpen(true)}
            title="Spotlight Search (⌘Space)"
            className="p-1.5 hover:bg-stone-900/10 dark:hover:bg-stone-100/15 rounded-md transition-colors cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
          </button>

          {/* VerdantIQ AI Orb Button */}
          <button
            onClick={() => setIsSiriOpen(!isSiriOpen)}
            title="VerdantIQ AI Assistant"
            className="p-1.5 hover:bg-stone-900/10 dark:hover:bg-stone-100/15 rounded-md transition-colors group cursor-pointer"
          >
            <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-purple-500 via-emerald-400 to-amber-300 animate-pulse shadow-xs group-hover:scale-110 transition-transform" />
          </button>

          {/* Control Center Toggle */}
          <button
            onClick={() => setIsControlCenterOpen(!isControlCenterOpen)}
            title="Control Center Settings"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isControlCenterOpen
                ? 'bg-stone-900/15 dark:bg-stone-100/20 text-emerald-600 dark:text-emerald-400'
                : 'hover:bg-stone-900/10 dark:hover:bg-stone-100/15'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
          </button>

          {/* Notification Center / Time */}
          <button
            onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
            title="Notification Center & Clock"
            className="px-1.5 py-1 hover:bg-stone-900/10 dark:hover:bg-stone-100/15 rounded-md transition-colors text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            {unreadCount > 0 && (
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            )}
            <span className="hidden sm:inline">{timeString || '8:52 AM'}</span>
            <span className="sm:hidden">{shortTimeString || '8:52 AM'}</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE FIRST NAVIGATION DRAWER & FULL APP EXPLORER OVERLAY */}
      {/* ========================================================================= */}
      {isMobileDrawerOpen && (
        <div className="mac-mobile-drawer fixed inset-0 z-50 flex flex-col bg-stone-950/95 text-stone-100 backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-200 overflow-hidden font-sf select-none">
          {/* Top Drawer Header Bar */}
          <div className="flex items-center justify-between p-3.5 border-b border-stone-800 bg-stone-900/80 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="font-editorial text-sm font-bold text-white flex items-center gap-1.5">
                  <span>VerdantIQ Navigation</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-700/50 rounded-full font-mono font-normal">
                    Mobile View
                  </span>
                </div>
                <div className="text-[10px] text-stone-400 flex items-center gap-2 font-mono">
                  <span>Role: <strong className="text-emerald-400">{user.role.toUpperCase()}</strong></span>
                  <span>•</span>
                  <span>{mongoConnected ? 'DB Active' : 'Memory'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsSpotlightOpen(true);
                  setIsMobileDrawerOpen(false);
                }}
                className="p-2 text-stone-400 hover:text-white bg-stone-800/80 rounded-xl cursor-pointer"
                title="Search"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 text-stone-400 hover:text-white bg-stone-800/80 rounded-xl cursor-pointer"
                title="Close Navigation"
              >
                <X className="h-5 w-5 text-stone-300" />
              </button>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="p-3 bg-stone-900/50 border-b border-stone-800/80 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder="Search all VerdantIQ dashboards, twins, models..."
                className="w-full h-10 pl-9 pr-8 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {mobileSearchQuery && (
                <button
                  onClick={() => setMobileSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Drawer Content Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-5 pb-24">
            {/* If Search Query is Active: Show Search Results */}
            {mobileSearchQuery.trim() ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400 font-semibold px-1">
                  <span>Search Results ({filteredSearchPages.length})</span>
                  <span className="text-[10px] font-mono text-emerald-400">Jump directly</span>
                </div>

                {filteredSearchPages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500 bg-stone-900/40 rounded-2xl border border-stone-800">
                    No pages matching &ldquo;{mobileSearchQuery}&rdquo;
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredSearchPages.map((page) => {
                      const Icon = page.icon;
                      const isCurrent = pathname === page.path;
                      return (
                        <Link
                          key={`${page.roleKey}_${page.path}`}
                          href={page.path}
                          onClick={() => {
                            if (user.role !== page.roleKey) {
                              switchRole(page.roleKey as RoleType);
                            }
                            setIsMobileDrawerOpen(false);
                          }}
                          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                            isCurrent
                              ? 'bg-emerald-900/40 border-emerald-500/60 text-white font-semibold'
                              : 'bg-stone-900/60 border-stone-800 hover:bg-stone-800/80 text-stone-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-2 rounded-lg bg-stone-800 text-emerald-400 flex-shrink-0">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="truncate">
                              <div className="text-xs truncate font-medium">{page.label}</div>
                              <div className="text-[10px] text-stone-400 font-mono truncate">
                                {page.suiteName} • {page.path}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-stone-500 flex-shrink-0 ml-2" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* 1. Quick Suite Switcher Segment Tabs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-1">
                    <span>Select Suite / Role Workspace</span>
                    <span className="text-[10px] font-mono text-emerald-400">8 Roles Available</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(Object.keys(SUITE_NAVIGATION) as RoleType[]).map((roleKey) => {
                      const suite = SUITE_NAVIGATION[roleKey];
                      const Icon = suite.icon;
                      const isSelected = selectedMobileSuite === roleKey;
                      const isUserRole = user.role === roleKey;

                      return (
                        <button
                          key={roleKey}
                          onClick={() => setSelectedMobileSuite(roleKey)}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-900/60 border-emerald-500 text-white shadow-md'
                              : 'bg-stone-900/60 border-stone-800/80 hover:bg-stone-800/60 text-stone-300'
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg ${
                              isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-emerald-400'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold truncate leading-tight">{suite.label}</div>
                            {isUserRole && (
                              <div className="text-[9px] text-emerald-400 font-mono">Current User</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Selected Suite Navigation Cards Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {SUITE_NAVIGATION[selectedMobileSuite].label} Pages
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-stone-800 rounded-full font-mono text-stone-300">
                        {SUITE_NAVIGATION[selectedMobileSuite].pages.length} views
                      </span>
                    </div>

                    {user.role !== selectedMobileSuite && (
                      <button
                        onClick={() => {
                          switchRole(selectedMobileSuite);
                          const targetPath = ROLE_CONFIGS[selectedMobileSuite].dashboardPath;
                          router.push(targetPath);
                          setIsMobileDrawerOpen(false);
                        }}
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                      >
                        Switch Active Session to This Role →
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUITE_NAVIGATION[selectedMobileSuite].pages.map((page) => {
                      const Icon = page.icon;
                      const isCurrent = pathname === page.path;

                      return (
                        <Link
                          key={page.path}
                          href={page.path}
                          onClick={() => {
                            if (user.role !== selectedMobileSuite) {
                              switchRole(selectedMobileSuite);
                            }
                            setIsMobileDrawerOpen(false);
                          }}
                          className={`p-3 rounded-xl border flex items-center justify-between transition-all group ${
                            isCurrent
                              ? 'bg-emerald-900/50 border-emerald-500 text-white font-semibold shadow-xs'
                              : 'bg-stone-900/50 border-stone-800 hover:bg-stone-800/70 text-stone-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`p-2 rounded-lg ${
                                isCurrent ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-emerald-400'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="truncate">
                              <div className="text-xs font-medium truncate">{page.label}</div>
                              <div className="text-[10px] text-stone-500 font-mono truncate">{page.path}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                            {page.badge && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                                {page.badge}
                              </span>
                            )}
                            <ChevronRight className="h-4 w-4 text-stone-500 group-hover:text-white transition-colors" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Global System & Tools Grid */}
                <div className="space-y-2 pt-2 border-t border-stone-800/80">
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-1">
                    System Tools & Utilities
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Link
                      href="/assistant"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="p-3 rounded-xl bg-gradient-to-tr from-purple-950/60 to-pink-950/40 border border-purple-800/40 hover:border-purple-600 flex flex-col items-center text-center gap-1.5 transition-all"
                    >
                      <Bot className="h-5 w-5 text-purple-400" />
                      <span className="text-xs font-bold text-white">AI Copilot</span>
                      <span className="text-[9px] text-purple-300 font-mono">Gemini 2.5 Flash</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsControlCenterOpen(true);
                        setIsMobileDrawerOpen(false);
                      }}
                      className="p-3 rounded-xl bg-stone-900/70 border border-stone-800 hover:border-stone-700 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sliders className="h-5 w-5 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Control Center</span>
                      <span className="text-[9px] text-stone-400 font-mono">Theme & Glass</span>
                    </button>

                    <Link
                      href="/notifications"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="p-3 rounded-xl bg-stone-900/70 border border-stone-800 hover:border-stone-700 flex flex-col items-center text-center gap-1.5 transition-all relative"
                    >
                      {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500" />
                      )}
                      <Bell className="h-5 w-5 text-amber-400" />
                      <span className="text-xs font-bold text-white">Notifications</span>
                      <span className="text-[9px] text-stone-400 font-mono">{unreadCount} Unread</span>
                    </Link>

                    <Link
                      href="/design-system"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="p-3 rounded-xl bg-stone-900/70 border border-stone-800 hover:border-stone-700 flex flex-col items-center text-center gap-1.5 transition-all"
                    >
                      <LayoutGrid className="h-5 w-5 text-cyan-400" />
                      <span className="text-xs font-bold text-white">Design Tokens</span>
                      <span className="text-[9px] text-stone-400 font-mono">20+ UI Elements</span>
                    </Link>
                  </div>
                </div>

                {/* 4. Active User Account & Quick Actions */}
                <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{user.name}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{user.email}</div>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 rounded-lg text-xs font-semibold text-stone-200 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
                    <Link
                      href="/tenant-request"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="text-emerald-400 hover:underline font-medium text-[11px]"
                    >
                      Register New Tenant →
                    </Link>

                    <Link
                      href="/login"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="text-stone-400 hover:text-stone-200 text-[11px]"
                    >
                      Switch / Auth Portal
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
