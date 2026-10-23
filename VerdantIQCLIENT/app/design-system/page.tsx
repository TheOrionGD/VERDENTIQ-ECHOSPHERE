'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatGauge } from '@/components/ui/StatGauge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { MorphismPanel } from '@/components/ui/MorphismPanel';
import { MorphismButton } from '@/components/ui/MorphismButton';
import { useToast } from '@/components/ui/Toast';
import { useWindowsTheme } from '@/context/WindowsThemeContext';
import { useMorphism, MorphismStyle } from '@/context/MorphismContext';
import { useAuth } from '@/context/AuthContext';
import {
  Palette,
  Sliders,
  Check,
  Copy,
  Sparkles,
  Layers,
  Shield,
  Activity,
  Search,
  RefreshCw,
  AlertTriangle,
  Cpu,
  Database,
  Lock,
  Boxes,
  Terminal,
} from 'lucide-react';

export default function DesignSystemPage() {
  const toast = useToast();
  const { role, switchRole } = useAuth();
  const { activeProfile } = useMorphism();
  const {
    accentColor,
    setAccentColor,
    setIsCommandPaletteOpen,
    setIsQuickSettingsOpen,
    setIsActionCenterOpen,
  } = useWindowsTheme();

  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeMorphismPreview, setActiveMorphismPreview] = useState<MorphismStyle>('glassmorphism');

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    toast.success('Token Copied', `${hex} copied to clipboard`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const morphismStyles: {
    id: MorphismStyle;
    name: string;
    roleAssignment: string;
    description: string;
    accentColor: string;
  }[] = [
    {
      id: 'glassmorphism',
      name: 'Obsidian Smoked Glassmorphism',
      roleAssignment: 'System Administrator & Platform Admin',
      description: 'Signature charcoal smoke glass, silver-white edge illumination, deep multi-layered shadows & backdrop saturation.',
      accentColor: '#10b981',
    },
    {
      id: 'flat',
      name: 'High-Density Flat Design',
      roleAssignment: 'ESG Auditor, SEC Disclosures & Data Tables',
      description: 'Zero blur, high-contrast, pure geometric borders and compact tables for dense audit logs and compliance.',
      accentColor: '#64748b',
    },
    {
      id: 'material',
      name: 'Structured Material Design',
      roleAssignment: 'MLOps Architect & Institution Admin',
      description: 'Predictable Z-index elevation, structured surface cards, and tactile feedback for complex workflows.',
      accentColor: '#0284c7',
    },
    {
      id: 'neumorphism',
      name: 'Soft Neumorphism',
      roleAssignment: 'Department Admin & Facility Ops',
      description: 'Subtle extruded and debossed dual-light shadows, tactile controls, and gentle plastic tactile feel.',
      accentColor: '#8b5cf6',
    },
    {
      id: 'claymorphism',
      name: 'Inflated Claymorphism',
      roleAssignment: 'Student Campus Portal & Gamification',
      description: 'Puffy high-radius surfaces, inner glow highlights, floating depth, and friendly interactive elements.',
      accentColor: '#ec4899',
    },
    {
      id: 'neubrutalism',
      name: 'Neubrutalism (Emergency Switches)',
      roleAssignment: 'Incident Response & Dangerous Actions',
      description: 'Thick stark black/red borders, hard zero-blur offset drop shadows, and unmistakable high-contrast urgency.',
      accentColor: '#ef4444',
    },
    {
      id: 'skeuomorphism',
      name: 'Tactile Skeuomorphism',
      roleAssignment: 'Hardware Telemetry & Sensor Gauges',
      description: 'Physical dial metaphors, inset bevelled gauges, brushed surfaces, and analog sensory indicators.',
      accentColor: '#f59e0b',
    },
    {
      id: 'polymorphism',
      name: 'Contextual Polymorphism Engine',
      roleAssignment: 'All Roles (Adaptive Orchestrator)',
      description: 'Deterministic dynamic style selection based on authenticated role, device class, task risk, and accessibility.',
      accentColor: '#34d399',
    },
  ];

  const sampleData = [
    { id: '1', name: 'Chiller Unit #3', building: 'Life Sciences B', co2: '48.2 kg/hr', status: 'Warning' },
    { id: '2', name: 'Rooftop Solar Alpha', building: 'Engineering Quad', co2: '0.0 kg/hr', status: 'Optimal' },
    { id: '3', name: 'Main Substation S1', building: 'Campus Grid', co2: '122.5 kg/hr', status: 'Optimal' },
    { id: '4', name: 'Hydraulics Water Manifold', building: 'Central Plant', co2: '3.1 kg/hr', status: 'Maintenance' },
  ];

  const tableColumns: Column<typeof sampleData[0]>[] = [
    { key: 'name', header: 'System Asset / Control', sortable: true },
    { key: 'building', header: 'Location Node', sortable: true },
    { key: 'co2', header: 'Emissions Metric', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <Badge
          variant={
            row.status === 'Optimal' ? 'emerald' : row.status === 'Warning' ? 'amber' : 'stone'
          }
          dot
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8 pb-12 font-segoe">
        {/* Windows 11 Multi-Morphism Design Engine Master Header */}
        <MorphismPanel
          glassLevel="premium"
          glow={true}
          className="p-6 sm:p-8 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Palette className="h-5 w-5 text-emerald-400" />
                <Badge variant="emerald" className="font-mono text-[10px] uppercase">
                  Windows 11 Multi-Morphism Engine v3.0
                </Badge>
                <span className="text-xs font-mono text-slate-400">
                  Active Role: <strong className="text-emerald-300 uppercase">{role}</strong>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-segoe">
                Eight-Style Multi-Morphism Architecture & Inspector
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                A unified design architecture supporting all 8 core morphism styles: Obsidian Smoked Glassmorphism,
                Flat Design, Material Design, Neumorphism, Claymorphism, Neubrutalism, Skeuomorphism, and Polymorphism.
                Styles are deterministically mapped to user roles, device capabilities, and critical risk contexts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCommandPaletteOpen(true)}
              >
                <Search className="h-3.5 w-3.5 mr-1.5" />
                Command Palette (Ctrl+K)
              </Button>
              <Button
                variant="glass"
                size="sm"
                onClick={() => setIsQuickSettingsOpen(true)}
              >
                <Sliders className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                Quick Settings
              </Button>
            </div>
          </div>
        </MorphismPanel>

        {/* SECTION 1: Eight-Style Interactive Morphism Gallery */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Boxes className="h-5 w-5 text-emerald-400" />
              <span>1. The Eight Morphism Styles (Live Interactive Demonstration)</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Section 5 & 6 Compliant</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {morphismStyles.map((item) => {
              const isSelected = activeMorphismPreview === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveMorphismPreview(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.accentColor }}
                    />
                    <Badge variant="stone" className="text-[9px] font-mono">
                      {item.id}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-[10px] text-emerald-400 font-mono mb-2">Role: {item.roleAssignment}</p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Active Style Live Preview Sandbox */}
          <div className="mt-6 p-6 rounded-2xl border border-slate-800 bg-black/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-300">
                ACTIVE STYLE PREVIEW:{' '}
                <strong className="text-emerald-400 uppercase">{activeMorphismPreview}</strong>
              </span>
              <span className="text-[11px] text-slate-400">
                Demonstrating adaptive panel, button, and input rendered in {activeMorphismPreview}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Morphism Panel Demo */}
              <MorphismPanel
                styleVariant={activeMorphismPreview}
                className="p-5 space-y-2"
              >
                <h4 className="text-sm font-bold text-white">Adaptive Container</h4>
                <p className="text-xs text-slate-300">
                  Surfaces dynamically calculate blur, shadows, border highlights and opacity for {activeMorphismPreview}.
                </p>
              </MorphismPanel>

              {/* Morphism Button Demo */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400">Interactive Controls</div>
                <div className="flex flex-wrap gap-2">
                  <MorphismButton styleVariant={activeMorphismPreview} size="md">
                    Execute Command
                  </MorphismButton>
                  <MorphismButton
                    styleVariant={activeMorphismPreview}
                    variant="danger"
                    size="md"
                  >
                    Kill Switch (Neubrutal)
                  </MorphismButton>
                </div>
              </div>

              {/* Skeuomorphic Gauge or Flat Input Demo */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400">Sensory / Data Element</div>
                {activeMorphismPreview === 'skeuomorphism' ? (
                  <div className="morphism-skeuo-panel p-4 flex items-center justify-around">
                    <div className="morphism-skeuo-gauge h-16 w-16 flex items-center justify-center font-mono text-emerald-400 text-xs font-bold">
                      78%
                    </div>
                    <span className="text-xs font-mono text-slate-300">Analog Grid Dial</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    readOnly
                    value="System Token: SEC-09821-HEX"
                    className="w-full text-xs p-2.5 rounded-lg border font-mono"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Role Switcher & Deterministic Profile Matrix */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span>2. Role-Based Morphism Assignment (Section 6 Compliance)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { r: 'admin', label: 'System Admin', style: 'Obsidian Glass + Flat' },
              { r: 'mlops', label: 'MLOps Architect', style: 'Material + Glass' },
              { r: 'audit', label: 'ESG Auditor', style: 'Flat + Frosted Glass' },
              { r: 'institution', label: 'Institution Admin', style: 'Material + Glass' },
              { r: 'dept', label: 'Dept Admin', style: 'Neumorphism + Flat' },
              { r: 'student', label: 'Student', style: 'Claymorphism + Soft Neuo' },
              { r: 'region', label: 'Regional District', style: 'Flat + Material' },
              { r: 'user', label: 'Household User', style: 'Glassmorphism + Material' },
            ].map((item) => (
              <button
                key={item.r}
                onClick={() => {
                  switchRole(item.r as any);
                  toast.success('Role Switched', `Active design profile set to ${item.style}`);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  role === item.r
                    ? 'border-emerald-500 bg-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{item.label}</span>
                  {role === item.r && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                </div>
                <p className="text-[11px] font-mono text-emerald-400">{item.style}</p>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 3: Live Component Hierarchy Test */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            <span>3. Universal Adaptive Components (Card & DataTable)</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-5 space-y-4">
              <CardHeader className="p-0">
                <CardTitle className="text-base text-white">Universal Card Component</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Card now inherits active role-based morphism automatically without requiring hardcoded styles.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <StatGauge
                    title="Active Core Node"
                    value={99.98}
                    unit="%"
                    target={100}
                    status="optimal"
                  />
                  <StatGauge
                    title="Telemetry Feed"
                    value={12.4}
                    unit="ms"
                    target={20}
                    status="optimal"
                  />
                </div>
              </CardContent>
            </Card>

            <DataTable
              columns={tableColumns}
              data={sampleData}
              searchKey="name"
              searchPlaceholder="Filter system assets..."
            />
          </div>
        </section>

        {/* SECTION 4: Windows 11 Fluent System Iconography & Density Matrix */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Palette className="h-5 w-5 text-emerald-400" />
                <span>4. Windows 11 Fluent System Iconography Standard</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Standardized geometric stroke density (1.75–2.0px), optical centering, and sizing scale across dark Glassmorphism surfaces.
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 w-fit">
              100% System Icon Compliance
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Compact / Dense', size: 'xs', px: '13px', stroke: '2.0px', icon: Sliders },
              { label: 'Standard Inline', size: 'sm', px: '16px', stroke: '1.85px', icon: Activity },
              { label: 'Grid / Card Header', size: 'md', px: '18px', stroke: '1.85px', icon: Cpu },
              { label: 'Action Button', size: 'lg', px: '20px', stroke: '1.75px', icon: Shield },
              { label: 'Navigation / Tab', size: 'xl', px: '24px', stroke: '1.75px', icon: Layers },
              { label: 'Empty State / Hero', size: '2xl', px: '32px', stroke: '1.75px', icon: Sparkles },
            ].map((token) => {
              const IconComponent = token.icon;
              return (
                <div
                  key={token.label}
                  className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 flex flex-col items-center text-center space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-slate-800/80 border border-white/10 flex items-center justify-center text-emerald-400">
                    <IconComponent className={token.size === 'xs' ? 'h-3.5 w-3.5 stroke-[2]' : token.size === 'sm' ? 'h-4 w-4 stroke-[1.85]' : token.size === 'md' ? 'h-[18px] w-[18px] stroke-[1.85]' : token.size === 'lg' ? 'h-5 w-5 stroke-[1.75]' : token.size === 'xl' ? 'h-6 w-6 stroke-[1.75]' : 'h-8 w-8 stroke-[1.75]'} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{token.label}</div>
                    <div className="text-[10px] font-mono text-emerald-400/90">{token.px} • {token.stroke}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
