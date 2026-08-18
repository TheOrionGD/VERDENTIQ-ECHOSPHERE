'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Flame,
  Calendar,
  Filter,
  RefreshCw,
  X,
  AlertTriangle,
  Building,
  Layers,
  Search,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Info,
  SlidersHorizontal,
  Download,
  ShieldAlert,
  BarChart2,
} from 'lucide-react';

export interface AlertEvent {
  id: string;
  timestamp: string;
  department: string;
  building: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  metricValue?: string;
  sensorId?: string;
}

export interface HotspotCellData {
  department: string;
  building: string;
  count: number;
  bySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  alerts: AlertEvent[];
}

const DEPARTMENTS = [
  'Facilities & Energy',
  'Engineering',
  'Science & Labs',
  'Dormitories & Housing',
  'Administrative',
  'Library & IT',
  'Student Hub',
];

const BUILDINGS = [
  'Building A',
  'Building B',
  'Science Center',
  'Dorm Block C',
  'Library Tower',
  'Utility Plant',
  'Student Hub',
];

// Reusable Hook for Data Fetching with client-side fallback
export function useAlerts(params: {
  startDate?: string;
  endDate?: string;
  severity?: string;
}) {
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (params.startDate) query.set('startDate', params.startDate);
      if (params.endDate) query.set('endDate', params.endDate);
      if (params.severity && params.severity !== 'ALL') query.set('severity', params.severity);

      const res = await fetch(`/api/alerts?${query.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch alerts: ${res.statusText}`);
      }
      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch (err: any) {
      console.warn('API fetch error, using local fallback:', err);
      setError(err.message || 'API unavailable');
      const now = new Date('2026-08-03T06:00:00Z');
      const fallbackList: AlertEvent[] = [];
      let counter = 5000;

      for (let day = 0; day < 30; day++) {
        const date = new Date(now.getTime() - day * 86400000);
        for (let j = 0; j < 5; j++) {
          counter++;
          const dept = DEPARTMENTS[(day + j) % DEPARTMENTS.length];
          const bld = BUILDINGS[(day * 3 + j) % BUILDINGS.length];
          const sev: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
          const severity = sev[(j + day) % 4];

          fallbackList.push({
            id: `ALT-FB-${counter}`,
            timestamp: date.toISOString(),
            department: dept,
            building: bld,
            severity,
            type: j % 2 === 0 ? 'Thermal Load Spike' : 'HVAC Pressure Drop',
            description: `Automated detection trigger on ${bld} - ${dept}`,
            sensorId: `SENS-${bld.slice(0, 3)}-${100 + j}`,
            metricValue: `${(22.4 + j * 1.5).toFixed(1)}°C`,
          });
        }
      }
      setAlerts(fallbackList);
    } finally {
      setLoading(false);
    }
  }, [params.startDate, params.endDate, params.severity]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return { alerts, loading, error, refetch: fetchAlerts };
}

// Color scale interpolator from light green (low) -> yellow/amber -> dark red (high/critical)
function getHeatmapColor(count: number, maxCount: number): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (count === 0) {
    return {
      bg: 'bg-emerald-50/40 hover:bg-emerald-100/60',
      text: 'text-stone-400',
      border: 'border-stone-200/60',
      label: 'Zero Alerts',
    };
  }

  const ratio = maxCount > 0 ? count / maxCount : 0;

  if (ratio <= 0.2) {
    return {
      bg: 'bg-emerald-100/80 hover:bg-emerald-200/90',
      text: 'text-emerald-950 font-semibold',
      border: 'border-emerald-300',
      label: 'Low Hotspot Density',
    };
  } else if (ratio <= 0.45) {
    return {
      bg: 'bg-yellow-200/90 hover:bg-yellow-300',
      text: 'text-amber-950 font-bold',
      border: 'border-yellow-400',
      label: 'Moderate Hotspot Density',
    };
  } else if (ratio <= 0.75) {
    return {
      bg: 'bg-orange-400 hover:bg-orange-500',
      text: 'text-stone-950 font-bold',
      border: 'border-orange-500',
      label: 'High Hotspot Density',
    };
  } else {
    return {
      bg: 'bg-rose-700 hover:bg-rose-800',
      text: 'text-white font-extrabold',
      border: 'border-rose-900',
      label: 'Critical Hotspot Density',
    };
  }
}

function AlertHotspotsWidgetInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize state from URL search parameters for serialization persistence
  const initialPreset = (searchParams?.get('preset') as '7d' | '14d' | '30d' | '60d' | 'custom') || '30d';
  const initialSeverity = searchParams?.get('severity') || 'ALL';
  const initialCustomStart = searchParams?.get('startDate') || '';
  const initialCustomEnd = searchParams?.get('endDate') || '';

  // Date Preset State
  const [datePreset, setDatePreset] = useState<'7d' | '14d' | '30d' | '60d' | 'custom'>(initialPreset);
  const [customStartDate, setCustomStartDate] = useState<string>(initialCustomStart);
  const [customEndDate, setCustomEndDate] = useState<string>(initialCustomEnd);

  // Severity Filter State
  const [severityFilter, setSeverityFilter] = useState<string>(initialSeverity);

  // Selected Cell for Detailed Side Panel
  const [selectedCell, setSelectedCell] = useState<HotspotCellData | null>(null);

  // Hover Tooltip State
  const [hoveredCell, setHoveredCell] = useState<{
    data: HotspotCellData;
    x: number;
    y: number;
  } | null>(null);

  // Focused Keyboard Cell Indices
  const [focusedCellIndex, setFocusedCellIndex] = useState<{ row: number; col: number }>({ row: 0, col: 0 });

  // Detail Side Drawer Search/Filter
  const [drawerSearch, setDrawerSearch] = useState<string>('');

  // Synchronize state changes to URL query string for persistence on refresh
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

    params.set('preset', datePreset);
    params.set('severity', severityFilter);

    if (datePreset === 'custom' && customStartDate && customEndDate) {
      params.set('startDate', customStartDate);
      params.set('endDate', customEndDate);
    } else {
      params.delete('startDate');
      params.delete('endDate');
    }

    const newUrl = `${pathname || ''}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [datePreset, severityFilter, customStartDate, customEndDate, pathname]);

  // Calculate Start & End Dates based on Preset
  const { startDate, endDate } = useMemo(() => {
    const end = new Date('2026-08-03T23:59:59Z'); // Fixed anchor timestamp for deterministic demonstration
    let days = 30;

    if (datePreset === '7d') days = 7;
    else if (datePreset === '14d') days = 14;
    else if (datePreset === '30d') days = 30;
    else if (datePreset === '60d') days = 60;

    if (datePreset === 'custom' && customStartDate && customEndDate) {
      return {
        startDate: new Date(customStartDate).toISOString(),
        endDate: new Date(customEndDate).toISOString(),
      };
    }

    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, [datePreset, customStartDate, customEndDate]);

  // Data Fetching Hook
  const { alerts, loading, error, refetch } = useAlerts({
    startDate,
    endDate,
    severity: severityFilter,
  });

  // Client-side Aggregation memoized by Department and Building
  const { aggregatedGrid, maxCellCount, totalAlerts, peakCell, criticalRatio } = useMemo(() => {
    const cellMap: Record<string, Record<string, HotspotCellData>> = {};

    BUILDINGS.forEach((bld) => {
      cellMap[bld] = {};
      DEPARTMENTS.forEach((dept) => {
        cellMap[bld][dept] = {
          building: bld,
          department: dept,
          count: 0,
          bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
          alerts: []
        };
      });
    });

    let total = 0;
    let criticalCount = 0;

    alerts.forEach((alert) => {
      total++;
      if (alert.severity === 'critical') criticalCount++;

      const bld = BUILDINGS.find((b) => b.toLowerCase() === alert.building.toLowerCase()) || alert.building;
      const dept = DEPARTMENTS.find((d) => d.toLowerCase() === alert.department.toLowerCase()) || alert.department;

      if (cellMap[bld] && cellMap[bld][dept]) {
        const cell = cellMap[bld][dept];
        cell.count += 1;
        cell.bySeverity[alert.severity] = (cell.bySeverity[alert.severity] || 0) + 1;
        cell.alerts.push(alert);
      }
    });

    let maxCount = 0;
    let peakCellVal: HotspotCellData | null = null;

    BUILDINGS.forEach((bld) => {
      DEPARTMENTS.forEach((dept) => {
        const cell = cellMap[bld][dept];
        if (cell.count > maxCount) {
          maxCount = cell.count;
          peakCellVal = cell;
        }
      });
    });

    return {
      aggregatedGrid: cellMap,
      maxCellCount: maxCount,
      totalAlerts: total,
      peakCell: peakCellVal as HotspotCellData | null,
      criticalRatio: total > 0 ? ((criticalCount / total) * 100).toFixed(1) : '0.0',
    };
  }, [alerts]);

  // Daily Trend Line Chart Aggregation
  const trendData = useMemo(() => {
    if (!alerts || alerts.length === 0) return [];

    const dateMap: Record<
      string,
      {
        dateKey: string;
        displayDate: string;
        Total: number;
        Critical: number;
        High: number;
        Medium: number;
        Low: number;
      }
    > = {};

    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    const dayMs = 86400000;

    for (let ms = startMs; ms <= endMs; ms += dayMs) {
      const d = new Date(ms);
      const dateKey = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateMap[dateKey] = {
        dateKey,
        displayDate,
        Total: 0,
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0,
      };
    }

    alerts.forEach((alert) => {
      const key = alert.timestamp.split('T')[0];
      if (!dateMap[key]) {
        const d = new Date(alert.timestamp);
        dateMap[key] = {
          dateKey: key,
          displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          Total: 0,
          Critical: 0,
          High: 0,
          Medium: 0,
          Low: 0,
        };
      }
      dateMap[key].Total += 1;
      if (alert.severity === 'critical') dateMap[key].Critical += 1;
      if (alert.severity === 'high') dateMap[key].High += 1;
      if (alert.severity === 'medium') dateMap[key].Medium += 1;
      if (alert.severity === 'low') dateMap[key].Low += 1;
    });

    return Object.values(dateMap).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  }, [alerts, startDate, endDate]);

  // Tooltip mini-table alert type breakdown for hovered cell
  const hoveredCellTypeBreakdown = useMemo(() => {
    if (!hoveredCell?.data?.alerts || hoveredCell.data.alerts.length === 0) return [];
    const counts: Record<string, number> = {};
    hoveredCell.data.alerts.forEach((alert) => {
      counts[alert.type] = (counts[alert.type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [hoveredCell]);

  // Download filtered dataset as clean CSV file
  const handleDownloadCSV = useCallback(() => {
    if (!alerts || alerts.length === 0) {
      alert('No alert records available to download for the selected filters.');
      return;
    }

    const headers = [
      'Alert ID',
      'Timestamp',
      'Department',
      'Building',
      'Severity',
      'Alert Type',
      'Description',
      'Sensor ID',
      'Metric Value',
    ];

    const rows = alerts.map((a) => [
      `"${a.id}"`,
      `"${a.timestamp}"`,
      `"${a.department}"`,
      `"${a.building}"`,
      `"${a.severity}"`,
      `"${a.type.replace(/"/g, '""')}"`,
      `"${a.description.replace(/"/g, '""')}"`,
      `"${a.sensorId || ''}"`,
      `"${a.metricValue || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `alert_hotspots_${datePreset}_${severityFilter.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [alerts, datePreset, severityFilter]);

  // Keyboard navigation handler for heatmap accessibility
  const handleKeyDown = (e: React.KeyboardEvent, rowIdx: number, colIdx: number) => {
    let nextRow = rowIdx;
    let nextCol = colIdx;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextRow = Math.max(0, rowIdx - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextRow = Math.min(BUILDINGS.length - 1, rowIdx + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextCol = Math.max(0, colIdx - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextCol = Math.min(DEPARTMENTS.length - 1, colIdx + 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const bld = BUILDINGS[rowIdx];
      const dept = DEPARTMENTS[colIdx];
      if (aggregatedGrid[bld] && aggregatedGrid[bld][dept]) {
        setSelectedCell(aggregatedGrid[bld][dept]);
      }
      return;
    } else if (e.key === 'Escape') {
      setSelectedCell(null);
      return;
    }

    setFocusedCellIndex({ row: nextRow, col: nextCol });
    const targetElement = document.getElementById(`cell-${nextRow}-${nextCol}`);
    if (targetElement) {
      targetElement.focus();
    }
  };

  // Filter drawer alerts
  const filteredDrawerAlerts = useMemo(() => {
    if (!selectedCell) return [];
    if (!drawerSearch.trim()) return selectedCell.alerts;
    const q = drawerSearch.toLowerCase();
    return selectedCell.alerts.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.sensorId && a.sensorId.toLowerCase().includes(q))
    );
  }, [selectedCell, drawerSearch]);

  return (
    <Card id="alert-hotspots-widget" className="p-6 bg-white/95 border-stone-200/90 shadow-md space-y-6 relative overflow-hidden">
      {/* Widget Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-5 w-5 text-rose-700" />
            <Badge variant="rose" className="font-semibold">
              PowerBI Spatial Heatmap Analytics
            </Badge>
          </div>
          <h2 className="font-editorial text-xl font-bold text-stone-900 tracking-tight">
            Alert Hotspots Matrix
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Cross-sectional density of anomaly alert telemetry across campus buildings and operational departments over the selected time horizon.
          </p>
        </div>

        {/* Global Toolbar: Date Preset, Severity Filters & CSV Download */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-medium">
            {(['7d', '14d', '30d', '60d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setDatePreset(p)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  datePreset === p
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {p === '7d' ? '7 Days' : p === '14d' ? '14 Days' : p === '30d' ? '30 Days' : '60 Days'}
              </button>
            ))}
          </div>

          {/* Severity Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-mono">
            <Filter className="h-3.5 w-3.5 text-stone-500" />
            <span className="text-stone-500 font-sans font-semibold">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="low">Low Only</option>
              <option value="medium">Medium Only</option>
              <option value="high">High Only</option>
              <option value="critical">Critical Only</option>
            </select>
          </div>

          {/* Download CSV Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCSV}
            className="h-8 border-emerald-300 text-emerald-950 hover:bg-emerald-50 font-semibold"
            title="Export filtered dataset to CSV file"
          >
            <Download className="h-3.5 w-3.5 mr-1 text-emerald-800" />
            <span className="text-xs">Download CSV</span>
          </Button>

          {/* Refresh Action */}
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading} className="h-8">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* PowerBI Top Key Performance Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-200/80 space-y-1">
          <span className="text-[10px] text-stone-400 font-sans uppercase font-bold tracking-wider block">
            Total Aggregated Alerts
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-stone-900">{totalAlerts}</span>
            <span className="text-[10px] text-stone-500 font-sans">Active Window</span>
          </div>
        </div>

        <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200/80 space-y-1">
          <span className="text-[10px] text-rose-800 font-sans uppercase font-bold tracking-wider block">
            Peak Hotspot Cell
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-extrabold text-rose-950 truncate">
              {peakCell ? `${peakCell.building} (${peakCell.department})` : 'N/A'}
            </span>
            <Badge variant="rose" className="ml-1 text-[10px]">
              {peakCell ? `${peakCell.count} alerts` : '0'}
            </Badge>
          </div>
        </div>

        <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1">
          <span className="text-[10px] text-amber-900 font-sans uppercase font-bold tracking-wider block">
            Critical Severity %
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-amber-900">{criticalRatio}%</span>
            <span className="text-[10px] text-amber-800 font-sans">Immediate Action</span>
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-1">
          <span className="text-[10px] text-emerald-900 font-sans uppercase font-bold tracking-wider block">
            Active Density Scale
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-emerald-950">0 - {maxCellCount}</span>
            <span className="text-[10px] text-emerald-800 font-sans">Alerts/Cell</span>
          </div>
        </div>
      </div>

      {/* Main Heatmap Visual Grid Container */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5 font-mono">
            <Layers className="h-4 w-4 text-emerald-800" />
            BUILDING (Y-AXIS) vs DEPARTMENT (X-AXIS) DENSITY GRID
          </span>

          <span className="text-[11px] text-stone-500 italic hidden sm:inline">
            Click any matrix cell to open full alert record logs. Keyboard navigate with arrow keys + Enter.
          </span>
        </div>

        {/* Heatmap Table Grid */}
        <div
          role="grid"
          aria-label="Alert Hotspots Heatmap Matrix"
          className="overflow-x-auto rounded-2xl border border-stone-200/90 shadow-xs bg-white"
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr role="row" className="bg-stone-100/90 border-b border-stone-200 text-stone-700 text-[11px] font-bold uppercase tracking-wider font-mono">
                <th role="columnheader" className="py-3 px-4 border-r border-stone-200/80 sticky left-0 bg-stone-100 z-10 min-w-[140px]">
                  Building / Location
                </th>
                {DEPARTMENTS.map((dept) => (
                  <th key={dept} role="columnheader" className="py-3 px-3 text-center min-w-[120px] max-w-[150px]">
                    <span className="line-clamp-1" title={dept}>
                      {dept}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/80 text-xs font-mono">
              {BUILDINGS.map((building, rowIdx) => (
                <tr key={building} role="row" className="hover:bg-stone-50/50">
                  {/* Row Header (Building Label) */}
                  <th
                    role="rowheader"
                    className="py-3 px-4 border-r border-stone-200/80 font-bold text-stone-900 sticky left-0 bg-white z-10 min-w-[140px] text-left font-sans"
                  >
                    {building}
                  </th>

                  {/* Heatmap Cells */}
                  {DEPARTMENTS.map((dept, colIdx) => {
                    const cellData = aggregatedGrid[building]?.[dept] || {
                      building,
                      department: dept,
                      count: 0,
                      bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
                      alerts: [] };

                    const style = getHeatmapColor(cellData.count, maxCellCount);
                    const isSelected =
                      selectedCell?.building === building && selectedCell?.department === dept;

                    return (
                      <td
                        key={dept}
                        id={`cell-${rowIdx}-${colIdx}`}
                        role="gridcell"
                        tabIndex={0}
                        aria-label={`${building}, ${dept}: ${cellData.count} alerts. ${style.label}`}
                        aria-selected={isSelected}
                        onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                        onClick={() => setSelectedCell(cellData)}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredCell({
                            data: cellData,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 8,
                          });
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`p-2 text-center cursor-pointer transition-all duration-150 border-r last:border-r-0 border-stone-200/50 relative focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:z-20 ${style.bg} ${style.border} ${
                          isSelected ? 'ring-2 ring-rose-700 z-20 shadow-sm' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center py-1">
                          <span className={`text-sm ${style.text}`}>{cellData.count}</span>
                          {cellData.count > 0 && (
                            <span className="text-[9px] text-stone-600/80 font-sans block mt-0.5 font-medium">
                              {((cellData.count / (totalAlerts || 1)) * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend Bar (Light Green to Dark Red Color Scale) */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700 font-sans">Density Color Scale:</span>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded bg-emerald-100 border border-emerald-300" title="Low (0-20%)" />
              <div className="w-5 h-5 rounded bg-yellow-200 border border-yellow-400" title="Medium (20-45%)" />
              <div className="w-5 h-5 rounded bg-orange-400 border border-orange-500" title="High (45-75%)" />
              <div className="w-5 h-5 rounded bg-rose-700 border border-rose-900" title="Critical (75-100%)" />
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-600">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low (0 - {Math.round(maxCellCount * 0.2)})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Medium ({Math.round(maxCellCount * 0.2) + 1} - {Math.round(maxCellCount * 0.45)})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High ({Math.round(maxCellCount * 0.45) + 1} - {Math.round(maxCellCount * 0.75)})
            </span>
            <span className="flex items-center gap-1 font-bold text-rose-800">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-700" /> Critical ({Math.round(maxCellCount * 0.75) + 1} - {maxCellCount})
            </span>
          </div>
        </div>
      </div>

      {/* Historical Alert Trend Line Chart Section */}
      <div className="pt-4 border-t border-stone-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 font-mono">
              <BarChart2 className="h-4 w-4 text-emerald-800" />
              HISTORICAL ALERT TREND (SELECTED WINDOW)
            </span>
            <p className="text-[11px] text-stone-500 mt-0.5 font-sans">
              Daily frequency trajectory of anomaly telemetry events across the active date range.
            </p>
          </div>
          <Badge variant="stone" className="font-mono text-[10px]">
            {trendData.length} Days Recorded
          </Badge>
        </div>

        <div className="h-64 w-full bg-stone-50/70 p-4 rounded-2xl border border-stone-200/90 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="displayDate" stroke="#78716c" fontSize={11} tickLine={false} />
              <YAxis stroke="#78716c" fontSize={11} tickLine={false} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  borderColor: '#292524',
                  borderRadius: '12px',
                  color: '#f5f5f4',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="Total"
                stroke="#15803d"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#15803d' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Critical"
                stroke="#be123c"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 2, fill: '#be123c' }}
              />
              <Line
                type="monotone"
                dataKey="High"
                stroke="#f97316"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Floating Hover Tooltip with Mini-Table Alert Type Breakdown */}
      {hoveredCell && (
        <div
          style={{
            position: 'fixed',
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="pointer-events-none z-50 p-3 bg-stone-900 text-stone-100 rounded-xl shadow-2xl text-xs space-y-2 font-sans min-w-[240px] max-w-[280px] border border-stone-800 animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Tooltip Header */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
            <span className="font-bold text-emerald-400">{hoveredCell.data.building}</span>
            <Badge variant="stone" className="text-[9px]">
              {hoveredCell.data.department}
            </Badge>
          </div>

          {/* Alert Count KPI */}
          <div className="font-mono text-xs font-bold flex justify-between items-center text-stone-200">
            <span>Total Hotspot Events:</span>
            <span className="text-rose-400 font-extrabold text-sm">{hoveredCell.data.count}</span>
          </div>

          {/* Severity Breakdown Pills */}
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-stone-300 bg-stone-950/60 p-1.5 rounded-lg border border-stone-800">
            <div>Low: {hoveredCell.data.bySeverity.low}</div>
            <div>Med: {hoveredCell.data.bySeverity.medium}</div>
            <div>High: {hoveredCell.data.bySeverity.high}</div>
            <div className="text-rose-400 font-bold">Crit: {hoveredCell.data.bySeverity.critical}</div>
          </div>

          {/* Mini-Table Breakdown of Alert Types */}
          {hoveredCellTypeBreakdown.length > 0 ? (
            <div className="pt-1.5 border-t border-stone-800/80 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                Alert Type Breakdown
              </span>
              <table className="w-full text-[10px] text-left border-collapse">
                <thead>
                  <tr className="text-stone-500 border-b border-stone-800/80 font-mono">
                    <th className="pb-0.5 font-normal">Anomaly Type</th>
                    <th className="pb-0.5 text-right font-normal">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/50 font-mono">
                  {hoveredCellTypeBreakdown.slice(0, 5).map(({ type, count }) => (
                    <tr key={type} className="text-stone-300">
                      <td className="py-0.5 truncate max-w-[150px] font-sans text-stone-200" title={type}>
                        {type}
                      </td>
                      <td className="py-0.5 text-right font-bold text-emerald-400">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {hoveredCellTypeBreakdown.length > 5 && (
                <div className="text-[9px] text-stone-500 italic text-right pt-0.5">
                  +{hoveredCellTypeBreakdown.length - 5} additional alert types
                </div>
              )}
            </div>
          ) : (
            <div className="text-[10px] text-stone-500 italic">No alerts in this matrix cell.</div>
          )}
        </div>
      )}

      {/* PowerBI Style Selected Cell Details Side Drawer / Modal */}
      {selectedCell && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-stone-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Building className="h-4 w-4 text-emerald-800" />
                    <Badge variant="emerald">{selectedCell.department}</Badge>
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-stone-900">
                    {selectedCell.building} Hotspot Breakdown
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Individual anomaly alert logs and severity distribution for this specific spatial matrix cell.
                  </p>
                </div>

                <Button variant="ghost" size="sm" onClick={() => setSelectedCell(null)}>
                  <X className="h-5 w-5 text-stone-500 hover:text-stone-900" />
                </Button>
              </div>

              {/* Cell Stats Bar */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 font-sans block">Total Alerts</span>
                  <span className="text-lg font-bold text-stone-900">{selectedCell.count}</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-rose-800 font-sans block">Critical Alerts</span>
                  <span className="text-lg font-bold text-rose-900">{selectedCell.bySeverity.critical}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-900 font-sans block">% Campus Share</span>
                  <span className="text-lg font-bold text-emerald-950">
                    {totalAlerts > 0 ? ((selectedCell.count / totalAlerts) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>

              {/* Severity Breakdown Visual Bar */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-800 font-mono">Severity Breakdown</span>
                <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex">
                  {selectedCell.count > 0 ? (
                    <>
                      <div
                        style={{ width: `${(selectedCell.bySeverity.low / selectedCell.count) * 100}%` }}
                        className="bg-emerald-500 h-full"
                        title={`Low: ${selectedCell.bySeverity.low}`}
                      />
                      <div
                        style={{ width: `${(selectedCell.bySeverity.medium / selectedCell.count) * 100}%` }}
                        className="bg-yellow-400 h-full"
                        title={`Medium: ${selectedCell.bySeverity.medium}`}
                      />
                      <div
                        style={{ width: `${(selectedCell.bySeverity.high / selectedCell.count) * 100}%` }}
                        className="bg-orange-500 h-full"
                        title={`High: ${selectedCell.bySeverity.high}`}
                      />
                      <div
                        style={{ width: `${(selectedCell.bySeverity.critical / selectedCell.count) * 100}%` }}
                        className="bg-rose-700 h-full"
                        title={`Critical: ${selectedCell.bySeverity.critical}`}
                      />
                    </>
                  ) : (
                    <div className="w-full bg-stone-200 h-full" />
                  )}
                </div>
              </div>

              {/* Search Log Filter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 font-mono">
                    Recent Incident Log Events ({filteredDrawerAlerts.length})
                  </span>

                  <div className="relative w-48">
                    <Search className="h-3.5 w-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter cell logs..."
                      value={drawerSearch}
                      onChange={(e) => setDrawerSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Log List */}
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {filteredDrawerAlerts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500 border border-dashed border-stone-200 rounded-2xl">
                      No matching alert logs found for this matrix cell.
                    </div>
                  ) : (
                    filteredDrawerAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200/90 space-y-1 text-xs hover:border-stone-300 transition-all"
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-stone-900">{alert.id}</span>
                          <Badge
                            variant={
                              alert.severity === 'critical'
                                ? 'coral'
                                : alert.severity === 'high'
                                ? 'amber'
                                : alert.severity === 'medium'
                                ? 'stone'
                                : 'emerald'
                            }
                          >
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="font-semibold text-stone-800">{alert.type}</div>
                        <p className="text-[11px] text-stone-600">{alert.description}</p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 pt-1 border-t border-stone-200/60">
                          <span>Sensor: {alert.sensorId || 'N/A'}</span>
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setSelectedCell(null)}>
                Close Panel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert(`Created maintenance escalation ticket for ${selectedCell.building} - ${selectedCell.department}!`);
                  setSelectedCell(null);
                }}
              >
                <ShieldAlert className="h-3.5 w-3.5 mr-1.5" /> Dispatch Field Escalation
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export function AlertHotspotsWidget() {
  return (
    <Suspense
      fallback={
        <Card className="p-6 bg-white border-stone-200 space-y-4">
          <div className="h-6 bg-stone-100 rounded w-48 animate-pulse" />
          <div className="h-64 bg-stone-50 rounded-2xl border border-stone-200 animate-pulse" />
        </Card>
      }
    >
      <AlertHotspotsWidgetInner />
    </Suspense>
  );
}
