'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { MorphismPanel } from '@/components/ui/MorphismPanel';
import { MorphismButton } from '@/components/ui/MorphismButton';
import { Badge } from '@/components/ui/Badge';
import { StatGauge } from '@/components/ui/StatGauge';
import { useAuth } from '@/context/AuthContext';
import { useWindowsTheme } from '@/context/WindowsThemeContext';
import {
  ShieldCheck,
  Server,
  Activity,
  Terminal,
  Database,
  Lock,
  Cpu,
  Radio,
  FileCode,
  KeyRound,
  AlertTriangle,
  RefreshCw,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Users,
  Search,
  Eye,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function SystemAdminWorkspacePage() {
  const { user, roleConfig } = useAuth();
  const { setIsCommandPaletteOpen } = useWindowsTheme();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'security' | 'database' | 'rbac'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const adminCapabilities = [
    {
      title: 'Global Telemetry Grid',
      desc: 'Actuator microservice metrics, CPU/memory loads, and host diagnostics',
      path: '/admin/telemetry',
      icon: Activity,
      stat: '99.98% Uptime',
    },
    {
      title: 'Database Admin',
      desc: 'MongoDB collections, sync state, documents integrity and mirror status',
      path: '/admin/database',
      icon: Database,
      stat: 'Synced (Mirror Online)',
    },
    {
      title: 'Immutable Audit Logs',
      desc: 'Security event traces, administrative access history and signed hashes',
      path: '/admin/audit-logs',
      icon: FileCode,
      stat: 'Tamper-Proof Block 82',
    },
    {
      title: 'Tenant Requests Queue',
      desc: 'Institutional domain onboarding, tenant provisioning and claims validation',
      path: '/admin/tenant-requests',
      icon: ShieldCheck,
      stat: '3 Pending Review',
    },
    {
      title: 'RBAC Access Matrix',
      desc: 'Role hierarchy, claims schema, differential permissions, and token revocation',
      path: '/admin/rbac-schema',
      icon: KeyRound,
      stat: '8 Hierarchies Enforced',
    },
    {
      title: 'Global Broadcast System',
      desc: 'Broadcast grid advisories and maintenance alerts over SSE stream',
      path: '/admin/broadcasts',
      icon: Radio,
      stat: 'Live Push Ready',
    },
  ];

  return (
    <AppShell>
      <RoleSubNav />

      <div className="space-y-6">
        {/* Obsidian Glass Signature Banner (image.png inspired) */}
        <MorphismPanel
          glassLevel="premium"
          glow={true}
          className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <Badge variant="emerald" className="font-mono text-[10px] uppercase tracking-wider">
                System Administrator Console • Tier 1 Authority
              </Badge>
              <span className="text-xs font-mono text-slate-400">Node: SEC-OBSIDIAN-01</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-segoe">
              Enterprise Governance & Security Workspace
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              Operating in high-security Obsidian Glassmorphic mode with deterministic Flat Design data matrices.
              Access to cross-tenant administration, database claims mirrors, and system telemetry.
            </p>
          </div>

          {/* Right Action Stack */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <MorphismButton
              variant="primary"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="text-xs"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Admin Commands</span>
              <kbd className="ml-1 text-[10px] font-mono bg-black/40 px-1 py-0.2 rounded border border-white/20">Ctrl+K</kbd>
            </MorphismButton>

            <MorphismButton
              variant="secondary"
              onClick={handleRefresh}
              className="text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh Health</span>
            </MorphismButton>
          </div>
        </MorphismPanel>

        {/* System Health Status Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatGauge
            title="Spring Boot Gateway"
            value={99.98}
            unit="%"
            target={100}
            trend="neutral"
            status="optimal"
            subtitle="Actuator Port 8080 : ONLINE"
          />
          <StatGauge
            title="FastAPI ML Gateway"
            value={14.2}
            unit="ms"
            target={20}
            trend="down"
            changePercentage={-12.4}
            status="optimal"
            subtitle="Inference Latency Nominal"
          />
          <StatGauge
            title="MongoDB State"
            value={100}
            unit="%"
            target={100}
            trend="neutral"
            status="optimal"
            subtitle="Replica Set Healthy"
          />
          <StatGauge
            title="Security Anomalies"
            value={0}
            unit="Alerts"
            target={0}
            trend="neutral"
            status="optimal"
            subtitle="Differential Privacy Active"
          />
        </div>

        {/* Administrative Capabilities Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase font-mono">
              Administrative Capabilities & Workspaces
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Role: System Administrator (RBAC Tier 1)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminCapabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <Link key={cap.path} href={cap.path} className="group block">
                  <MorphismPanel
                    glassLevel="standard"
                    className="p-5 h-full flex flex-col justify-between hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                          {cap.stat}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                        {cap.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {cap.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-emerald-400 transition-colors">
                      <span>Launch capability</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                  </MorphismPanel>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Critical Incident Response Action Surface (Neubrutalism Polymorphic Treatment) */}
        <MorphismPanel
          styleVariant="flat"
          className="p-5 rounded-xl border border-rose-500/40 bg-slate-950/90 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded bg-rose-600 text-white font-bold">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider font-mono">
                  Critical Incident Response & Security Kill Switches
                </h3>
                <p className="text-[11px] text-slate-400">
                  Polymorphic Neubrutalism styling assigned to dangerous or irreversible administrative actions.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-rose-400 uppercase bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
              High Impact
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <MorphismButton
              variant="danger"
              size="sm"
              onClick={() => alert('Broadcast Alert: Emergency Grid Load Shedding broadcasted.')}
            >
              Trigger Emergency Load Shedding
            </MorphismButton>

            <MorphismButton
              variant="danger"
              size="sm"
              onClick={() => alert('Access Matrix: Revoked all transient student session tokens.')}
            >
              Revoke Transient Sessions
            </MorphismButton>

            <MorphismButton
              variant="secondary"
              size="sm"
              onClick={() => alert('Isolation Check: Enforced strict database tenant boundaries.')}
            >
              Verify Tenant Partition Isolation
            </MorphismButton>
          </div>
        </MorphismPanel>
      </div>
    </AppShell>
  );
}
