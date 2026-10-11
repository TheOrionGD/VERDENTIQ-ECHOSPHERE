'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatGauge } from '@/components/ui/StatGauge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/components/ui/Toast';
import { useMacTheme, ACCENT_COLOR_MAP, WALLPAPER_STYLES, MacAccentColor } from '@/context/MacThemeContext';
import {
  Palette,
  Sliders,
  Check,
  Copy,
  Sparkles,
  Layers,
  LayoutGrid,
  Sun,
  Moon,
  Monitor,
  Eye,
  SlidersHorizontal,
  SlidersVertical,
  Volume2,
  Wifi,
} from 'lucide-react';

export default function DesignSystemPage() {
  const toast = useToast();
  const {
    effectiveTheme,
    accentColor,
    setAccentColor,
    wallpaper,
    setWallpaper,
    glassOpacity,
    setGlassOpacity,
    setIsControlCenterOpen,
    setIsSpotlightOpen,
    themeMode,
    setThemeMode,
  } = useMacTheme();

  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [gaugeVal, setGaugeVal] = useState(184);
  const [segmentedVal, setSegmentedVal] = useState<'overview' | 'analytics' | 'logs'>('overview');

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    toast.success('Color Token Copied', `${hex} copied to clipboard`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Table mock data for NSTableView
  const sampleData = [
    { id: '1', name: 'Chiller Unit #3', building: 'Life Sciences B', co2: '48.2 kg/hr', status: 'Warning' },
    { id: '2', name: 'Rooftop Solar Alpha', building: 'Engineering Quad', co2: '0.0 kg/hr', status: 'Optimal' },
    { id: '3', name: 'Main Substation S1', building: 'Campus Grid', co2: '122.5 kg/hr', status: 'Optimal' },
    { id: '4', name: 'Hydraulics Water Manifold', building: 'Central Plant', co2: '3.1 kg/hr', status: 'Maintenance' },
    { id: '5', name: 'Lab Exhaust Fan Zone 4', building: 'Chemistry Wing', co2: '18.4 kg/hr', status: 'Warning' },
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
      <div className="space-y-8 pb-12 font-sf">
        {/* HIG Header Banner */}
        <div className="p-6 rounded-2xl macos-liquid-glass border border-white/60 dark:border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Palette className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <Badge variant="emerald" dot>VerdantIQ Design System v2.6</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                VerdantIQ Glass UI Kit & System Inspector
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
                Explore native VerdantIQ liquid glass controls: translucent materials, window controls, accent colors, segmented pickers, and responsive desktop depth.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsControlCenterOpen(true)}
              >
                <Sliders className="h-3.5 w-3.5 mr-1.5" />
                Open Control Center
              </Button>
              <Button
                variant="glass"
                size="sm"
                onClick={() => setIsSpotlightOpen(true)}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                Spotlight (⌘Space)
              </Button>
            </div>
          </div>
        </div>

        {/* SECTION 1: Interactive Theme Customizer */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>1. VerdantIQ Accent Colors & Canvas Customizer</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Accent Color Chooser */}
            <Card variant="glass" className="p-5 space-y-3">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                VerdantIQ Accent Colors
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(ACCENT_COLOR_MAP) as MacAccentColor[]).map((col) => {
                  const info = ACCENT_COLOR_MAP[col];
                  const isSelected = accentColor === col;
                  return (
                    <button
                      key={col}
                      onClick={() => {
                        setAccentColor(col);
                        toast.info('Accent Updated', `Set to ${info.label}`);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-white dark:bg-stone-800 shadow-sm'
                          : 'border-stone-200/50 dark:border-stone-800/50 hover:bg-white/40'
                      }`}
                    >
                      <div
                        className="h-4 w-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: info.primary }}
                      />
                      <span className="text-xs font-semibold truncate">{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Light / Dark & Glass Opacity */}
            <Card variant="glass" className="p-5 space-y-4">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Appearance Mode & Glass Material Translucency
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 bg-emerald-800 text-white cursor-default"
                >
                  <Moon className="h-3.5 w-3.5 mr-1.5" />
                  Dark Mode (System Locked)
                </Button>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-purple-500" />
                    <span>Material Opacity: {Math.round(glassOpacity * 100)}%</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="0.9"
                  step="0.05"
                  value={glassOpacity}
                  onChange={(e) => setGlassOpacity(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </Card>
          </div>
        </section>

        {/* SECTION 2: VerdantIQ Controls Showcase */}
        <section className="space-y-6 pt-4 border-t border-stone-200/50 dark:border-stone-800/50">
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            2. VerdantIQ System UI Control Suite
          </h2>

          {/* Segmented Picker Control */}
          <Card variant="glass" className="p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Segmented Picker Control
            </h3>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="macos-segmented-picker">
                <button
                  onClick={() => setSegmentedVal('overview')}
                  className={`macos-segmented-option ${segmentedVal === 'overview' ? 'active' : ''}`}
                >
                  System Overview
                </button>
                <button
                  onClick={() => setSegmentedVal('analytics')}
                  className={`macos-segmented-option ${segmentedVal === 'analytics' ? 'active' : ''}`}
                >
                  Telemetry Analytics
                </button>
                <button
                  onClick={() => setSegmentedVal('logs')}
                  className={`macos-segmented-option ${segmentedVal === 'logs' ? 'active' : ''}`}
                >
                  Audit Logs
                </button>
              </div>

              <span className="text-xs font-mono text-stone-500">
                Selected Segment: <strong className="text-emerald-600 dark:text-emerald-400 uppercase">{segmentedVal}</strong>
              </span>
            </div>
          </Card>

          {/* Buttons Showcase */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Push Button Variants
            </h3>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button variant="primary" onClick={() => toast.success('Primary Clicked')}>
                Primary Accent
              </Button>
              <Button variant="glass" onClick={() => toast.info('Glass Clicked')}>
                Liquid Glass
              </Button>
              <Button variant="secondary" onClick={() => toast.info('Secondary Clicked')}>
                Secondary Surface
              </Button>
              <Button variant="outline" onClick={() => toast.info('Outline Clicked')}>
                Outline
              </Button>
              <Button variant="amber" onClick={() => toast.warning('Amber Warning')}>
                Amber Warning
              </Button>
              <Button variant="coral" onClick={() => toast.error('Coral Error')}>
                Coral Anomaly
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Status Badges & Pill Indicators
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald" dot>Optimal Load</Badge>
              <Badge variant="amber" dot>Warning Drift</Badge>
              <Badge variant="coral" dot>Critical Alert</Badge>
              <Badge variant="stone">System User</Badge>
              <Badge variant="neutral">Root Admin</Badge>
              <Badge variant="outline">Verified Node</Badge>
            </div>
          </div>

          {/* Interactive StatGauge */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                StatGauge Meter Component
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span>Test Slider:</span>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={gaugeVal}
                  onChange={(e) => setGaugeVal(Number(e.target.value))}
                  className="w-28 accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatGauge
                title="Carbon Rate Intensity"
                value={gaugeVal}
                target={250}
                unit="gCO2e / kWh"
                trend={gaugeVal > 250 ? 'up' : 'down'}
                changePercentage={14.2}
                status={gaugeVal > 250 ? 'critical' : gaugeVal > 200 ? 'warning' : 'optimal'}
                subtitle="Live regional grid telemetry stream"
              />
              <StatGauge
                title="Renewable Microgrid Share"
                value={42.8}
                target={50}
                unit="% total load"
                trend="up"
                changePercentage={8.3}
                status="optimal"
                subtitle="Solar & BESS storage"
              />
            </div>
          </div>

          {/* Data Grid Component */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              System Data Grid Component
            </h3>
            <DataTable
              columns={tableColumns}
              data={sampleData}
              searchKey="name"
              searchPlaceholder="Filter system assets..."
            />
          </div>

          {/* EmptyState & Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                EmptyState View
              </h3>
              <EmptyState
                title="No Active Anomaly Detected"
                description="All 14 HVAC climate zones are currently operating within nominal baseline parameters."
                actionLabel="Trigger Telemetry Rescan"
                onAction={() => toast.success('Telemetry Rescanned', 'All nodes green.')}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                LoadingSkeleton Component
              </h3>
              <LoadingSkeleton type="card" />
              <LoadingSkeleton type="line" rows={2} />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
