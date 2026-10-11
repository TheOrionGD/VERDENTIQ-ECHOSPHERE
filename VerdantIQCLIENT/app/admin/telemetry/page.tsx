'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatGauge } from '@/components/ui/StatGauge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import {
  Activity,
  Server,
  Cpu,
  Database,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play,
  Zap,
  Radio,
  CheckCircle2,
  XCircle,
  BarChart2,
  Terminal,
  Calendar,
  Clock,
  Filter,
  RotateCcw,
  ChevronDown,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

interface ServiceStatus {
  id: string;
  name: string;
  type: string;
  source: 'Spring Boot Actuator' | 'FastAPI Health' | 'Gateway Ping' | 'S3/MinIO API';
  status: 'healthy' | 'degraded' | 'warning';
  latencyMs: number;
  throughputReqSec: number;
  uptimePercent: number;
  errorRate: number;
  sparkline: number[];
  version: string;
}

interface IsolationAlert {
  id: string;
  timestamp: string;
  tenantAttempted: string;
  violatingTenant: string;
  endpoint: string;
  actionTaken: 'BLOCKED_BY_MIDDLEWARE' | 'TOKEN_REVOKED' | 'IP_QUARANTINED';
  severity: 'high' | 'critical';
}

const initialServices: ServiceStatus[] = [
  {
    id: 'spring_boot_actuator',
    name: 'Spring Boot Core Actuator',
    type: 'Telemetry Ingestion',
    source: 'Spring Boot Actuator',
    status: 'healthy',
    latencyMs: 12,
    throughputReqSec: 2840,
    uptimePercent: 99.99,
    errorRate: 0.01,
    sparkline: [12, 14, 11, 13, 12, 15, 12, 13, 12, 11, 13, 12],
    version: 'v3.2.1-actuator',
  },
  {
    id: 'fastapi_milp',
    name: 'FastAPI MILP Solver Health',
    type: 'Microservice Async Engine',
    source: 'FastAPI Health',
    status: 'healthy',
    latencyMs: 38,
    throughputReqSec: 420,
    uptimePercent: 99.95,
    errorRate: 0.04,
    sparkline: [35, 38, 42, 38, 39, 45, 38, 37, 40, 38, 39, 38],
    version: 'v1.14.0-fastapi',
  },
  {
    id: 'groq_lpu',
    name: 'Groq LPU Gateway Ping',
    type: 'Sub-Second LLM Gateway',
    source: 'Gateway Ping',
    status: 'degraded',
    latencyMs: 195,
    throughputReqSec: 88,
    uptimePercent: 98.42,
    errorRate: 1.85,
    sparkline: [120, 130, 240, 290, 180, 210, 195, 205, 195, 210, 195],
    version: 'groq-llama3-70b',
  },
  {
    id: 'gemini_api',
    name: 'Gemini 3.5 Multimodal Engine',
    type: 'Primary LLM Pipeline',
    source: 'Gateway Ping',
    status: 'healthy',
    latencyMs: 220,
    throughputReqSec: 175,
    uptimePercent: 99.98,
    errorRate: 0.02,
    sparkline: [210, 220, 230, 220, 225, 215, 220, 222, 218, 220],
    version: 'gemini-3.5-flash',
  },
  {
    id: 'mongodb_cluster',
    name: 'MongoDB Atlas Operational Store',
    type: 'Document Store',
    source: 'Spring Boot Actuator',
    status: 'healthy',
    latencyMs: 6,
    throughputReqSec: 3200,
    uptimePercent: 100.0,
    errorRate: 0.0,
    sparkline: [6, 7, 6, 8, 6, 6, 7, 6, 6, 7, 6, 6],
    version: 'mongodb-6.2-replica',
  },
  {
    id: 'minio_s3',
    name: 'MinIO S3 API Object Storage',
    type: 'Object Persistence',
    source: 'S3/MinIO API',
    status: 'healthy',
    latencyMs: 10,
    throughputReqSec: 680,
    uptimePercent: 99.92,
    errorRate: 0.02,
    sparkline: [9, 11, 10, 10, 12, 10, 9, 11, 10, 10],
    version: 'minio-2026-RELEASE',
  },
];

const latencyTimelineData = [
  { time: '00:00', gateway: 12, groq: 120, gemini: 210, milp: 35 },
  { time: '04:00', gateway: 14, groq: 135, gemini: 215, milp: 38 },
  { time: '08:00', gateway: 18, groq: 280, gemini: 240, milp: 45 },
  { time: '12:00', gateway: 15, groq: 210, gemini: 225, milp: 40 },
  { time: '16:00', gateway: 13, groq: 195, gemini: 220, milp: 38 },
  { time: '20:00', gateway: 14, groq: 185, gemini: 218, milp: 36 },
];

const endpointAnalytics = [
  { endpoint: '/api/telemetry/ingest', rpm: 18400, errPercent: 0.01 },
  { endpoint: '/api/gemini/generate', rpm: 8900, errPercent: 0.05 },
  { endpoint: '/api/milp/solve', rpm: 4200, errPercent: 0.08 },
  { endpoint: '/api/reports/export', rpm: 1200, errPercent: 0.2 },
];

export default function AdminTelemetryPage() {
  const [services, setServices] = useState<ServiceStatus[]>(initialServices);
  const [sseActive, setSseActive] = useState(true);
  const [filter, setFilter] = useState<'all' | 'healthy' | 'warning'>('all');
  const [runbookOpen, setRunbookOpen] = useState(false);
  const [runbookLogs, setRunbookLogs] = useState<string[]>([]);
  const [executingRunbook, setExecutingRunbook] = useState<string | null>(null);

  // Date Range Picker State
  const [timePreset, setTimePreset] = useState<'1h' | '6h' | '24h' | '7d' | 'custom'>('24h');
  const [startDate, setStartDate] = useState<string>('2026-08-02T05:00');
  const [endDate, setEndDate] = useState<string>('2026-08-03T05:00');
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);

  // Dynamic Latency & Endpoint analytics generated based on active date/time range
  const getFilteredTimelineData = () => {
    if (timePreset === '1h') {
      return [
        { time: '04:00', gateway: 11, groq: 115, gemini: 205, milp: 34 },
        { time: '04:15', gateway: 12, groq: 122, gemini: 208, milp: 36 },
        { time: '04:30', gateway: 11, groq: 140, gemini: 212, milp: 35 },
        { time: '04:45', gateway: 13, groq: 180, gemini: 215, milp: 38 },
        { time: '05:00', gateway: 12, groq: 195, gemini: 220, milp: 38 },
      ];
    }
    if (timePreset === '6h') {
      return [
        { time: '23:00', gateway: 13, groq: 140, gemini: 215, milp: 36 },
        { time: '00:00', gateway: 12, groq: 120, gemini: 210, milp: 35 },
        { time: '01:00', gateway: 11, groq: 125, gemini: 208, milp: 34 },
        { time: '02:00', gateway: 14, groq: 150, gemini: 214, milp: 37 },
        { time: '03:00', gateway: 15, groq: 175, gemini: 218, milp: 39 },
        { time: '04:00', gateway: 14, groq: 188, gemini: 222, milp: 38 },
        { time: '05:00', gateway: 12, groq: 195, gemini: 220, milp: 38 },
      ];
    }
    if (timePreset === '7d') {
      return [
        { time: 'Jul 28', gateway: 15, groq: 110, gemini: 200, milp: 32 },
        { time: 'Jul 29', gateway: 14, groq: 118, gemini: 205, milp: 33 },
        { time: 'Jul 30', gateway: 16, groq: 145, gemini: 212, milp: 36 },
        { time: 'Jul 31', gateway: 18, groq: 260, gemini: 235, milp: 44 },
        { time: 'Aug 01', gateway: 15, groq: 220, gemini: 225, milp: 41 },
        { time: 'Aug 02', gateway: 13, groq: 190, gemini: 218, milp: 37 },
        { time: 'Aug 03', gateway: 12, groq: 195, gemini: 220, milp: 38 },
      ];
    }
    if (timePreset === 'custom') {
      const sLabel = startDate ? startDate.replace('T', ' ') : 'Start';
      const eLabel = endDate ? endDate.replace('T', ' ') : 'End';
      return [
        { time: sLabel, gateway: 14, groq: 130, gemini: 210, milp: 35 },
        { time: 'Midpoint', gateway: 18, groq: 240, gemini: 230, milp: 42 },
        { time: eLabel, gateway: 12, groq: 195, gemini: 220, milp: 38 },
      ];
    }
    // Default 24h
    return latencyTimelineData;
  };

  const getFilteredEndpointAnalytics = () => {
    const multiplier =
      timePreset === '1h'
        ? 0.85
        : timePreset === '6h'
        ? 0.95
        : timePreset === '7d'
        ? 1.4
        : 1.0;
    return endpointAnalytics.map((ep) => ({
      ...ep,
      rpm: Math.round(ep.rpm * multiplier),
    }));
  };

  const activeTimeline = getFilteredTimelineData();
  const activeAnalytics = getFilteredEndpointAnalytics();

  const handleDownloadCsv = () => {
    const timestamp = new Date().toISOString();
    const timeWindowLabel =
      timePreset === '1h'
        ? 'Last 1 Hour'
        : timePreset === '6h'
        ? 'Last 6 Hours'
        : timePreset === '24h'
        ? 'Last 24 Hours'
        : timePreset === '7d'
        ? 'Last 7 Days'
        : `Custom Range (${startDate.replace('T', ' ')} to ${endDate.replace('T', ' ')})`;

    let csv = `SECTION: TELEMETRY COMPLIANCE AUDIT REPORT\n`;
    csv += `Report Generated At,${timestamp}\n`;
    csv += `Filtered Time Window,${timeWindowLabel}\n`;
    csv += `Target Cluster,Production Multi-Tenant Microservice Mesh\n\n`;

    csv += `SECTION 1: MICROSERVICE HEALTH & ACTUATOR STATUS\n`;
    csv += `Service Name,Type,Source Engine,Status,Latency (ms),Throughput (req/s),Uptime (%),Error Rate (%),Version\n`;
    services.forEach((s) => {
      csv += `"${s.name}","${s.type}","${s.source}","${s.status}",${s.latencyMs},${s.throughputReqSec},${s.uptimePercent},${s.errorRate},"${s.version}"\n`;
    });
    csv += `\n`;

    csv += `SECTION 2: LATENCY TRENDS (${timePreset.toUpperCase()} WINDOW)\n`;
    csv += `Time Interval,Gateway (ms),Groq LPU (ms),Gemini 3.5 (ms),FastAPI MILP (ms)\n`;
    activeTimeline.forEach((t) => {
      csv += `"${t.time}",${t.gateway},${t.groq},${t.gemini},${t.milp}\n`;
    });
    csv += `\n`;

    csv += `SECTION 3: ENDPOINT ROUTE ANALYTICS\n`;
    csv += `Endpoint Route,RPM (Req/Min),Error Rate (%)\n`;
    activeAnalytics.forEach((ep) => {
      csv += `"${ep.endpoint}",${ep.rpm},${ep.errPercent}\n`;
    });
    csv += `\n`;

    csv += `SECTION 4: TENANT ISOLATION SECURITY ALERTS\n`;
    csv += `Alert ID,Timestamp,Attempted Tenant,Violating Tenant,Endpoint,Action Taken,Severity\n`;
    alerts.forEach((a) => {
      csv += `"${a.id}","${a.timestamp}","${a.tenantAttempted}","${a.violatingTenant}","${a.endpoint}","${a.actionTaken}","${a.severity}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `telemetry_health_report_${timePreset}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [alerts, setAlerts] = useState<IsolationAlert[]>([
    {
      id: 'iso_alert_91',
      timestamp: '2026-08-03 04:12:05',
      tenantAttempted: 'west-district-ca',
      violatingTenant: 'guest-unauthenticated-ip',
      endpoint: '/api/telemetry/raw_export',
      actionTaken: 'BLOCKED_BY_MIDDLEWARE',
      severity: 'high',
    },
    {
      id: 'iso_alert_90',
      timestamp: '2026-08-02 23:45:12',
      tenantAttempted: 'cascadia-alliance',
      violatingTenant: 'tenant-sub-8812',
      endpoint: '/api/milp/override_schedule',
      actionTaken: 'TOKEN_REVOKED',
      severity: 'critical',
    },
  ]);

  // Simulated SSE Feed
  useEffect(() => {
    if (!sseActive) return;
    const interval = setInterval(() => {
      setServices((prev) =>
        prev.map((s) => {
          const jitter = Math.floor((Math.random() - 0.48) * 4);
          const nextLat = Math.max(4, s.latencyMs + jitter);
          return {
            ...s,
            latencyMs: nextLat,
            sparkline: [...s.sparkline.slice(1), nextLat],
          };
        })
      );
    }, 2500);
    return () => clearInterval(interval);
  }, [sseActive]);

  const runRunbook = (name: string, steps: string[]) => {
    setExecutingRunbook(name);
    setRunbookLogs([`[00:00] Initializing runbook script: ${name}...`]);

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setRunbookLogs((prev) => [...prev, `[00:0${idx + 1}] Executing: ${step}... SUCCESS`]);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setRunbookLogs((prev) => [...prev, `[COMPLETED] Runbook ${name} executed successfully.`]);
            setExecutingRunbook(null);
          }, 400);
        }
      }, (idx + 1) * 700);
    });
  };

  const filteredServices = services.filter((s) => {
    if (filter === 'healthy') return s.status === 'healthy';
    if (filter === 'warning') return s.status !== 'healthy';
    return true;
  });

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">Platform Telemetry Center</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Real-time Service Health & Latency Mesh
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Live SSE streamed metrics from Spring Boot Actuator, FastAPI health checks, Groq/Gemini pings & S3/MinIO.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCsv}
              className="text-xs bg-emerald-900/10 border-emerald-800/30 text-[#064E3B] hover:bg-emerald-800 hover:text-white"
              title="Download formatted CSV report for offline compliance review"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" /> Bulk CSV Export
            </Button>
            <Button
              variant={sseActive ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSseActive(!sseActive)}
              className="text-xs"
            >
              <Radio className={`h-3.5 w-3.5 mr-1.5 ${sseActive ? 'animate-pulse text-emerald-300' : ''}`} />
              {sseActive ? 'SSE Stream: LIVE' : 'SSE Stream: PAUSED'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setRunbookOpen(!runbookOpen)} className="text-xs">
              <Terminal className="h-3.5 w-3.5 mr-1.5" /> Incident Runbooks
            </Button>
          </div>
        </div>

        {/* Global Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatGauge
            title="Mesh Availability Score"
            value={99.88}
            target={99.9}
            unit="% system uptime"
            trend="up"
            changePercentage={0.02}
            status="optimal"
            subtitle="Actuator & FastAPI health active"
          />
          <StatGauge
            title="Gateway Ingress Latency"
            value={services.find((s) => s.id === 'spring_boot_actuator')?.latencyMs || 12}
            target={20}
            unit="ms response time"
            trend="down"
            changePercentage={-8.5}
            status="optimal"
            subtitle="Spring Boot Actuator Ingest"
          />
          <StatGauge
            title="Total Combined Ingress"
            value={7395}
            target={7000}
            unit="req / sec"
            trend="up"
            changePercentage={5.2}
            status="optimal"
            subtitle="Campus peak traffic balance"
          />
        </div>

        {/* Incident Runbook Modal/Drawer */}
        {runbookOpen && (
          <Card className="p-5 bg-stone-900 text-stone-100 border-stone-800 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-400" />
                <h3 className="font-mono text-sm font-bold text-white">
                  Incident Response Automated Runbook Launcher
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRunbookOpen(false)}
                className="text-stone-400 hover:text-white text-xs"
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <button
                onClick={() =>
                  runRunbook('Flush Rate Limit Redis Cache', [
                    'redis-cli FLUSHDB --async',
                    're-sync token bucket rules from DB',
                    'verify gateway proxy response time',
                  ])
                }
                disabled={executingRunbook !== null}
                className="p-3 bg-stone-800/80 hover:bg-stone-800 rounded-xl border border-stone-700 text-left font-mono space-y-1 cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>Runbook #1</span>
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <span className="text-white block font-sans font-semibold">Flush Redis Rate Limits</span>
                <p className="text-[10px] text-stone-400">Purge stale throttled IPs and reset token bucket cache.</p>
              </button>

              <button
                onClick={() =>
                  runRunbook('Failover Groq LPU to Gemini', [
                    'set feature_flag groq_fallback_mode=true',
                    'redirect 100% LLM traffic to gemini-3.5-flash',
                    'ping Groq API health endpoint until recovery',
                  ])
                }
                disabled={executingRunbook !== null}
                className="p-3 bg-stone-800/80 hover:bg-stone-800 rounded-xl border border-stone-700 text-left font-mono space-y-1 cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span>Runbook #2</span>
                  <AlertTriangle className="h-3.5 w-3.5" />
                </div>
                <span className="text-white block font-sans font-semibold">LLM Gateway Failover</span>
                <p className="text-[10px] text-stone-400">Force immediate fallback from Groq LPU to Gemini.</p>
              </button>

              <button
                onClick={() =>
                  runRunbook('Quarantine Tenant Boundary Breach', [
                    'revoke bearer tokens for offending tenant ID',
                    'apply strict WAF block on source IP range',
                    'emit high-priority audit security log',
                  ])
                }
                disabled={executingRunbook !== null}
                className="p-3 bg-stone-800/80 hover:bg-stone-800 rounded-xl border border-stone-700 text-left font-mono space-y-1 cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center justify-between text-rose-400 font-bold">
                  <span>Runbook #3</span>
                  <ShieldAlert className="h-3.5 w-3.5" />
                </div>
                <span className="text-white block font-sans font-semibold">Tenant Boundary Quarantine</span>
                <p className="text-[10px] text-stone-400">Isolate cross-tenant intrusion vectors automatically.</p>
              </button>
            </div>

            {/* Terminal Execution Log */}
            {runbookLogs.length > 0 && (
              <div className="p-3 bg-black/90 rounded-xl border border-stone-800 font-mono text-[11px] text-emerald-400 space-y-1 max-h-36 overflow-y-auto">
                {runbookLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Date Range Picker Toolbar */}
        <Card className="p-4 bg-white/95 border-stone-200 shadow-xs space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-900/10 text-[#064E3B] rounded-xl border border-emerald-800/20">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-editorial text-sm font-bold text-stone-900 flex items-center gap-2">
                  Telemetry Time Window Filter
                  <Badge variant="stone" className="text-[10px] font-mono font-normal">
                    {timePreset === '1h' && 'Last 1 Hour'}
                    {timePreset === '6h' && 'Last 6 Hours'}
                    {timePreset === '24h' && 'Last 24 Hours'}
                    {timePreset === '7d' && 'Last 7 Days'}
                    {timePreset === 'custom' && `${startDate.replace('T', ' ')} → ${endDate.replace('T', ' ')}`}
                  </Badge>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Select a preset interval or custom date range to filter service health metrics & latency graphs.
                </p>
              </div>
            </div>

            {/* Quick Presets & Custom Trigger */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {(['1h', '6h', '24h', '7d'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setTimePreset(preset);
                    setShowCustomPicker(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-all ${
                    timePreset === preset
                      ? 'bg-[#064E3B] text-white font-semibold shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {preset === '1h' && 'Last 1H'}
                  {preset === '6h' && 'Last 6H'}
                  {preset === '24h' && 'Last 24H'}
                  {preset === '7d' && 'Last 7 Days'}
                </button>
              ))}

              <button
                onClick={() => {
                  setTimePreset('custom');
                  setShowCustomPicker(!showCustomPicker);
                }}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-all ${
                  timePreset === 'custom'
                    ? 'bg-[#064E3B] text-white font-semibold shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                Custom Range
                <ChevronDown className={`h-3 w-3 transition-transform ${showCustomPicker ? 'rotate-180' : ''}`} />
              </button>

              {timePreset !== '24h' && (
                <button
                  onClick={() => {
                    setTimePreset('24h');
                    setShowCustomPicker(false);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Reset filter to default 24h interval"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              )}

              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#064E3B] text-white hover:bg-emerald-800 font-medium cursor-pointer transition-colors shadow-xs ml-1"
                title="Download filtered health logs as CSV report"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-300" />
                Export CSV Report
              </button>
            </div>
          </div>

          {/* Collapsible Custom Date Range Picker Form */}
          {showCustomPicker && (
            <div className="pt-3 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-emerald-800" /> Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-300 text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-emerald-800" /> End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-300 text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div className="flex items-end gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setTimePreset('custom');
                    setShowCustomPicker(false);
                  }}
                  className="w-full text-xs py-1.5"
                >
                  Apply Time Interval
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Latency & Throughput Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-5 bg-white/95 border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-base font-bold text-stone-900">
                  Microservice Latency Trends ({timePreset.toUpperCase()} Window)
                </h3>
                <p className="text-[11px] text-stone-500 font-mono">Response time comparison across core service routes</p>
              </div>
              <Badge variant="stone">Recharts Real-time</Badge>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="time" stroke="#78716c" fontSize={11} />
                  <YAxis stroke="#78716c" fontSize={11} unit="ms" />
                  <Tooltip />
                  <Area type="monotone" dataKey="groq" stackId="1" stroke="#d97706" fill="#fef3c7" name="Groq LPU (ms)" />
                  <Area type="monotone" dataKey="gemini" stackId="2" stroke="#059669" fill="#d1fae5" name="Gemini Engine (ms)" />
                  <Area type="monotone" dataKey="milp" stackId="3" stroke="#0284c7" fill="#e0f2fe" name="FastAPI MILP (ms)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Endpoint Usage Analytics Chart */}
          <Card className="p-5 bg-white/95 border-stone-200 space-y-3">
            <div>
              <h3 className="font-editorial text-base font-bold text-stone-900">Endpoint Usage Volume</h3>
              <p className="text-[11px] text-stone-500 font-mono">Requests per minute by primary endpoint</p>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeAnalytics} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis type="number" stroke="#78716c" fontSize={10} />
                  <YAxis dataKey="endpoint" type="category" stroke="#78716c" fontSize={9} width={100} />
                  <Tooltip />
                  <Bar dataKey="rpm" fill="#064E3B" radius={[0, 6, 6, 0]} name="Requests / Min" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Tenant Isolation Violation Alert Feed */}
        <Card className="p-5 bg-rose-50/40 border-rose-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-rose-200 pb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-700" />
              <h3 className="font-editorial text-sm font-bold text-rose-950">
                Tenant Isolation Security Violation Alert Feed
              </h3>
            </div>
            <Badge variant="coral">{alerts.length} Active Incidents Intercepted</Badge>
          </div>

          <div className="space-y-2">
            {alerts.map((al) => (
              <div
                key={al.id}
                className="p-3 bg-white rounded-xl border border-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-900">{al.id}</span>
                    <Badge variant="coral">{al.actionTaken}</Badge>
                  </div>
                  <p className="text-stone-700 text-[11px] mt-1 font-mono">
                    Violating: <strong className="text-stone-900">{al.violatingTenant}</strong> attempted boundary traversal on <strong className="text-stone-900">{al.tenantAttempted}</strong> ({al.endpoint})
                  </p>
                </div>

                <span className="text-[10px] text-stone-400 font-mono whitespace-nowrap">
                  {al.timestamp}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Services Health Grid */}
        <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-2xl border border-stone-200 text-xs">
          <span className="font-semibold text-stone-700 ml-2">Services Grid ({filteredServices.length})</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl font-medium cursor-pointer transition-all ${
                filter === 'all' ? 'bg-[#064E3B] text-white font-semibold' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setFilter('healthy')}
              className={`px-3 py-1 rounded-xl font-medium cursor-pointer transition-all ${
                filter === 'healthy' ? 'bg-emerald-800 text-white font-semibold' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Healthy Only
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-3 py-1 rounded-xl font-medium cursor-pointer transition-all ${
                filter === 'warning' ? 'bg-amber-700 text-white font-semibold' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Degraded / Warning
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((srv) => (
            <Card key={srv.id} className="p-5 bg-white/95 border-stone-200/90 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-stone-900">{srv.name}</h3>
                  <span className="text-[10px] text-stone-500 font-mono block">
                    {srv.source} • {srv.version}
                  </span>
                </div>
                <Badge variant={srv.status === 'healthy' ? 'emerald' : 'amber'}>
                  {srv.status === 'healthy' ? 'HEALTHY' : 'DEGRADED'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-center font-mono">
                <div>
                  <span className="text-[9px] text-stone-400 block uppercase font-sans">Latency</span>
                  <span className="text-xs font-bold text-stone-800">{srv.latencyMs}ms</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block uppercase font-sans">Throughput</span>
                  <span className="text-xs font-bold text-stone-800">{srv.throughputReqSec} r/s</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block uppercase font-sans">Uptime</span>
                  <span className="text-xs font-bold text-emerald-700">{srv.uptimePercent}%</span>
                </div>
              </div>

              {/* Sparkline */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span>Live Pulse Trend</span>
                  <span>Err: {srv.errorRate}%</span>
                </div>
                <div className="h-9 w-full bg-stone-100/80 rounded-xl p-1.5 flex items-end gap-1">
                  {srv.sparkline.map((val, idx) => {
                    const maxVal = Math.max(...srv.sparkline) || 1;
                    const heightPercent = Math.max(15, (val / maxVal) * 100);
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-sm transition-all ${
                          val > 180 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                        title={`Point ${idx + 1}: ${val}ms`}
                      />
                    );
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
