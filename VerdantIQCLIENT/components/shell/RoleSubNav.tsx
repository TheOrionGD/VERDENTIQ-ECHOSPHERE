'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Cpu,
  TrendingUp,
  SlidersHorizontal,
  Users,
  FileText,
  Target,
  Smartphone,
  History,
  Gift,
  UserCheck,
  Trophy,
  GraduationCap,
  Sparkles,
  Bot,
  Activity,
  Database,
  FileCode,
  ShieldCheck,
  Globe,
  Sliders,
  Clock,
  Radio,
  Workflow,
  Server,
  Zap,
  TestTube,
  AlertTriangle,
  GitCompare,
  Flame,
  KeyRound,
  Eye,
  Download,
  FileCheck,
  FileQuestion,
  Layers,
  Scale,
  Building,
  MapPin,
  Home,
  ChevronDown,
  Settings,
  CheckCircle,
  BarChart3,
} from 'lucide-react';

export const RoleSubNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdminRoute = role === 'admin' || pathname.startsWith('/admin');
  const isMlopsRoute = role === 'mlops' || pathname.startsWith('/mlops');
  const isAuditRoute = role === 'audit' || pathname.startsWith('/audit');
  const isDeptRoute = role === 'dept' || pathname.startsWith('/dept');
  const isInstitutionRoute = role === 'institution' || pathname.startsWith('/institution');
  const isRegionRoute = role === 'region' || pathname.startsWith('/region');
  const isStudentRoute = role === 'student' || pathname.startsWith('/student');
  const isUserRoute = role === 'user' || pathname.startsWith('/user');

  let title = 'User Suite';
  let tabs: { label: string; path: string; icon: any }[] = [];

  if (isAdminRoute) {
    title = 'Platform Admin';
    tabs = [
      { label: 'System Center', path: '/admin-dashboard', icon: LayoutDashboard },
      { label: 'Telemetry Grid', path: '/admin/telemetry', icon: Activity },
      { label: 'Database Admin', path: '/admin/database', icon: Database },
      { label: 'Global Audit Logs', path: '/admin/audit-logs', icon: FileCode },
      { label: 'Tenant Requests', path: '/admin/tenant-requests', icon: ShieldCheck },
      { label: 'Domain Conflicts', path: '/admin/domains', icon: Globe },
      { label: 'Feature Flags', path: '/admin/feature-flags', icon: Sliders },
      { label: 'Rate Limits', path: '/admin/rate-limits', icon: Zap },
      { label: 'RBAC Schema', path: '/admin/rbac-schema', icon: KeyRound },
      { label: 'Access Grants', path: '/admin/access-grants', icon: Clock },
      { label: 'Broadcasts', path: '/admin/broadcasts', icon: Radio },
    ];
  } else if (isMlopsRoute) {
    title = 'ML Ops Admin';
    tabs = [
      { label: 'ML Center', path: '/mlops-dashboard', icon: LayoutDashboard },
      { label: 'Model Registry', path: '/mlops/models', icon: Server },
      { label: 'Solver Weights', path: '/mlops/optimizer', icon: SlidersHorizontal },
      { label: 'LLM Gateway', path: '/mlops/llm-gateway', icon: Zap },
      { label: 'Experiments', path: '/mlops/experiments', icon: TestTube },
      { label: 'Data Pipeline', path: '/mlops/data-pipeline', icon: Workflow },
      { label: 'Drift Alerts', path: '/mlops/alerts', icon: AlertTriangle },
      { label: 'Registry Diff', path: '/mlops/registry-diff', icon: GitCompare },
      { label: 'Canary Rollout', path: '/mlops/canary', icon: Flame },
      { label: 'Fallback Console', path: '/mlops/fallback-console', icon: Radio },
      { label: 'Governance Settings', path: '/mlops/settings', icon: Settings },
    ];
  } else if (isAuditRoute) {
    title = 'Auditor & Research';
    tabs = [
      { label: 'Audit Dashboard', path: '/audit-dashboard', icon: LayoutDashboard },
      { label: 'Anonymized Overview', path: '/audit/overview', icon: Eye },
      { label: 'Redacted Logs', path: '/audit/logs', icon: FileCode },
      { label: 'Immutable Export', path: '/audit/export', icon: Download },
      { label: 'Domain Registry', path: '/audit/domains', icon: Globe },
      { label: 'Tenant History', path: '/audit/tenant-history', icon: History },
      { label: 'Data Requests', path: '/audit/requests', icon: FileQuestion },
      { label: 'Model Cards', path: '/audit/model-cards', icon: FileCheck },
      { label: 'Data Lineage Flow', path: '/audit/data-flow', icon: Layers },
      { label: 'Fairness Reports', path: '/audit/fairness-reports', icon: Scale },
      { label: 'Retention Policies', path: '/audit/settings', icon: Settings },
    ];
  } else if (isDeptRoute) {
    title = 'Department Suite';
    tabs = [
      { label: 'Overview', path: '/dept/dashboard', icon: LayoutDashboard },
      { label: 'Verification Queue', path: '/dept/verify', icon: CheckCircle },
      { label: 'Escalations', path: '/dept/escalate', icon: AlertTriangle },
      { label: 'Member Roster', path: '/dept/members', icon: Users },
      { label: 'Student Directory', path: '/dept/students', icon: GraduationCap },
      { label: 'Domain Onboarding', path: '/dept/onboarding-requests', icon: FileCheck },
      { label: 'Challenge Templates', path: '/dept/challenges/templates', icon: Trophy },
      { label: 'Analytics & Baselines', path: '/dept/analytics', icon: BarChart3 },
      { label: 'Reports & Export', path: '/dept/reports', icon: FileText },
      { label: 'Settings & Geofence', path: '/dept/settings', icon: Settings },
    ];
  } else if (isInstitutionRoute) {
    title = 'Institution Suite';
    tabs = [
      { label: 'Overview', path: '/institution-dashboard', icon: LayoutDashboard },
      { label: 'Analytics', path: '/institution/analytics', icon: BarChart3 },
      { label: 'Departments', path: '/institution/departments', icon: Building },
      { label: 'Domains', path: '/institution/domains', icon: Globe },
      { label: 'Geofence', path: '/institution/geofence', icon: MapPin },
      { label: 'Students', path: '/institution/students', icon: GraduationCap },
      { label: 'Challenges', path: '/institution/challenges', icon: Trophy },
      { label: 'Verify', path: '/institution/verify', icon: CheckCircle },
      { label: 'Reports', path: '/institution/reports', icon: FileText },
      { label: 'Settings', path: '/institution/settings', icon: Settings },
    ];
  } else if (isRegionRoute) {
    title = 'Regional Suite (District Governance)';
    tabs = [
      { label: 'Overview', path: '/region/dashboard', icon: LayoutDashboard },
      { label: 'Institutions Stream', path: '/region/institutions', icon: Building },
      { label: 'Standard Household Stream', path: '/user/dashboard', icon: Home },
      { label: 'Benchmarking', path: '/region/benchmark', icon: Scale },
      { label: 'Reports', path: '/region/reports', icon: FileText },
      { label: 'Tenant Requests', path: '/region/tenant-requests', icon: FileCheck },
      { label: 'Domains', path: '/region/domains', icon: Globe },
      { label: 'Analytics', path: '/region/analytics', icon: BarChart3 },
      { label: 'Settings', path: '/region/settings', icon: Settings },
      { label: 'Students', path: '/region/students', icon: GraduationCap },
    ];
  } else if (isStudentRoute) {
    title = 'Student Suite';
    tabs = [
      { label: 'Domain Verify', path: '/student/register', icon: UserCheck },
      { label: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
      { label: 'Dorm Twin', path: '/student/digital-twin', icon: Cpu },
      { label: 'Forecast', path: '/student/forecast', icon: TrendingUp },
      { label: 'Simulator', path: '/student/optimization', icon: SlidersHorizontal },
      { label: 'AI Assistant', path: '/student/assistant', icon: Bot },
      { label: 'Campus Challenges', path: '/student/challenges', icon: Trophy },
      { label: 'Cohort Leaderboard', path: '/student/community', icon: Users },
      { label: 'Research Projects', path: '/student/academic-projects', icon: GraduationCap },
      { label: 'Campus Rewards', path: '/student/rewards', icon: Gift },
      { label: 'Activity Log', path: '/student/history', icon: History },
    ];
  } else {
    title = 'User Suite';
    tabs = [
      { label: 'Overview', path: '/user/dashboard', icon: LayoutDashboard },
      { label: 'Digital Twin', path: '/user/digital-twin', icon: Cpu },
      { label: '30D Forecast', path: '/user/forecast', icon: TrendingUp },
      { label: 'MILP Simulator', path: '/user/optimization', icon: SlidersHorizontal },
      { label: 'AI Assistant', path: '/user/assistant', icon: Bot },
      { label: 'Community Zone', path: '/user/community', icon: Users },
      { label: 'Reports', path: '/user/reports', icon: FileText },
      { label: 'Goals', path: '/user/goals', icon: Target },
      { label: 'Devices', path: '/user/devices', icon: Smartphone },
      { label: 'History & CSV', path: '/user/history', icon: History },
      { label: 'Rewards Catalog', path: '/user/rewards', icon: Gift },
    ];
  }

  const activeTab = tabs.find((t) => t.path === pathname) || tabs[0];

  return (
    <div className="mb-4 sm:mb-6">
      {/* Mobile-Friendly Quick Tab Dropdown (Small Viewports) */}
      <div className="sm:hidden mb-2 relative">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between p-2.5 bg-white/90 dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800 rounded-xl shadow-xs text-xs font-semibold text-stone-900 dark:text-stone-100 cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span className="text-[11px] text-stone-500 font-mono uppercase">{title}:</span>
            <span className="truncate text-emerald-800 dark:text-emerald-400 font-bold">{activeTab?.label || 'Select View'}</span>
          </div>
          <ChevronDown className={cn('h-4 w-4 text-stone-400 transition-transform', isMobileMenuOpen && 'rotate-180')} />
        </button>

        {isMobileMenuOpen && (
          <div className="absolute top-12 left-0 right-0 z-40 bg-stone-900/95 dark:bg-stone-950/95 border border-stone-800 rounded-xl shadow-2xl p-1.5 space-y-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                  {isActive && <span className="text-[10px] uppercase font-mono">Current</span>}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Touch-Scrollable Horizontal Tab Bar */}
      <div className="p-1 sm:p-1.5 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border border-stone-200/90 dark:border-stone-800/90 rounded-2xl shadow-xs overflow-x-auto scrollbar-none snap-x flex items-center">
        <div className="flex items-center gap-1 min-w-max">
          <div className="hidden sm:flex px-3 py-1.5 items-center gap-1.5 text-xs font-semibold text-emerald-950 dark:text-emerald-300 border-r border-stone-200 dark:border-stone-800 mr-1 flex-shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>{title}</span>
          </div>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap min-h-[36px] sm:min-h-[32px]',
                  isActive
                    ? 'bg-[#064E3B] text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/80'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-emerald-300' : 'text-stone-500 dark:text-stone-400')} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
