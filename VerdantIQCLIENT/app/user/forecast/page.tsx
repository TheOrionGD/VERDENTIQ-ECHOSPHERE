// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Info,
  Calendar,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ForecastDataPoint,  } from '@/lib/services/userDataService';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from 'recharts';

export default function UserForecastPage() {
  const [data] = useState<ForecastDataPoint[]>(() => []);
  const [selectedAnomaly, setSelectedAnomaly] = useState<ForecastDataPoint | null>(
    data.find((d) => d.isAnomaly) || null
  );

  const anomalies = data.filter((d) => d.isAnomaly);

  // Custom dot rendering to highlight anomaly points on chart
  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.isAnomaly) {
      const isSelected = selectedAnomaly?.day === payload.day;
      return (
        <g key={`dot-${payload.day}`}>
          <circle
            cx={cx}
            cy={cy}
            r={isSelected ? 8 : 6}
            fill="#e11d48"
            stroke="#ffffff"
            strokeWidth={2}
            className="cursor-pointer animate-pulse"
            onClick={() => setSelectedAnomaly(payload)}
          />
          <circle
            cx={cx}
            cy={cy}
            r={isSelected ? 14 : 10}
            fill="none"
            stroke="#e11d48"
            strokeWidth={1.5}
            opacity={0.6}
            className="cursor-pointer"
            onClick={() => setSelectedAnomaly(payload)}
          />
        </g>
      );
    }
    return <Dot key={`dot-std-${payload.day}`} cx={cx} cy={cy} r={2} fill="#065f46" opacity={0.6} />;
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">ML Predictive Model (95% CI)</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              30-Day Energy & Carbon Forecast
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Predictive load profile with shaded confidence bounds and interactive anomaly explanation flags.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-100 p-2.5 rounded-2xl border border-stone-200 text-xs font-mono text-stone-700">
            <Calendar className="h-4 w-4 text-emerald-700" />
            <span>Aug 1 - Aug 30, 2026</span>
          </div>
        </div>

        {/* Chart + Anomaly Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Forecast Chart (2 cols) */}
          <Card className="lg:col-span-2 border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-700" />
                    <span>Predicted Daily kWh Load vs Baseline</span>
                  </CardTitle>
                  <CardDescription>Click any red anomaly marker on the chart to inspect cause & remedies</CardDescription>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" />
                    <span>Forecast</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                    <span>Anomaly Point</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-2 bg-emerald-200/60 rounded-xs inline-block" />
                    <span>95% Confidence Band</span>
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload[0]) {
                        const point = e.activePayload[0].payload as ForecastDataPoint;
                        if (point.isAnomaly) setSelectedAnomaly(point);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716c' }} dy={5} />
                    <YAxis
                      unit=" kWh"
                      tick={{ fontSize: 11, fill: '#78716c' }}
                      domain={[0, 40]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const p = payload[0].payload as ForecastDataPoint;
                          return (
                            <div className="p-3 bg-stone-900 text-white rounded-xl shadow-lg border border-stone-700 text-xs space-y-1">
                              <div className="font-bold flex items-center justify-between gap-3">
                                <span>{p.date} (Day {p.day})</span>
                                {p.isAnomaly && <Badge variant="coral" size="xs">Anomaly</Badge>}
                              </div>
                              <div className="font-mono text-emerald-400">
                                Forecast Load: <strong>{p.actualOrForecastKw} kWh</strong>
                              </div>
                              <div className="font-mono text-stone-300">
                                Confidence Range: [{p.confidenceLower} - {p.confidenceUpper}] kWh
                              </div>
                              <div className="font-mono text-stone-400">
                                Est. Carbon: {p.carbonGco2e} gCO2e
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    {/* Shaded Confidence Band */}
                    <Area
                      type="monotone"
                      dataKey="confidenceUpper"
                      stroke="none"
                      fill="#d1fae5"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="confidenceLower"
                      stroke="none"
                      fill="#ffffff"
                      fillOpacity={1.0}
                    />

                    {/* Baseline Line */}
                    <Line
                      type="monotone"
                      dataKey="baselineKw"
                      stroke="#a8a29e"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={false}
                      name="Baseline"
                    />

                    {/* Forecast Line with Custom Dots */}
                    <Line
                      type="monotone"
                      dataKey="actualOrForecastKw"
                      stroke="#065f46"
                      strokeWidth={2.5}
                      dot={renderCustomDot}
                      name="Forecast Load"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs text-stone-600">
                <span>Total 30-Day Forecast Consumption: <strong>512.4 kWh</strong></span>
                <span>Expected Carbon Intensity: <strong>138.2 gCO2e/kWh</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Anomaly Explanation Panel (1 col) */}
          <div className="space-y-4">
            <Card className="border border-stone-200 bg-white/90 shadow-xs">
              <CardHeader className="border-b border-stone-100 pb-3">
                <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  <span>Plain-Language Anomaly Panel</span>
                </CardTitle>
                <CardDescription>Detected variance explanations from ML telemetry</CardDescription>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {selectedAnomaly ? (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="coral">{selectedAnomaly.date} (Day {selectedAnomaly.day})</Badge>
                        <span className="text-xs font-mono font-bold text-rose-800">
                          {selectedAnomaly.actualOrForecastKw} kWh (+58% vs baseline)
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-rose-950">{selectedAnomaly.anomalyTitle}</h4>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Info className="h-4 w-4 text-stone-600" /> Root Cause Diagnosis
                      </span>
                      <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200 leading-relaxed">
                        {selectedAnomaly.anomalyReason}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Lightbulb className="h-4 w-4 text-amber-600" /> Recommended Action
                      </span>
                      <p className="text-xs text-emerald-900 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-medium leading-relaxed">
                        {selectedAnomaly.recommendedAction}
                      </p>
                    </div>

                    <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                      <span>Apply Automated Remediation Schedule</span>
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-stone-500">
                    Click any anomaly point on the chart to inspect details.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* List of Detected Anomaly Flags */}
            <Card className="border border-stone-200 bg-white/90 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  All 30-Day Anomaly Flags ({anomalies.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {anomalies.map((anom) => (
                  <button
                    key={anom.day}
                    onClick={() => setSelectedAnomaly(anom)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                      selectedAnomaly?.day === anom.day
                        ? 'bg-rose-50 border-rose-300 font-semibold'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-stone-900">{anom.date}: </span>
                      <span className="text-stone-700">{anom.anomalyTitle}</span>
                    </div>
                    <span className="font-mono text-[10px] text-rose-700 font-bold">{anom.actualOrForecastKw} kWh</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
