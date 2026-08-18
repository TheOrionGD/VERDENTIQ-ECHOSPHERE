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

export default function StudentForecastPage() {
  const [data] = useState<ForecastDataPoint[]>(() => []);
  const [selectedAnomaly, setSelectedAnomaly] = useState<ForecastDataPoint | null>(
    data.find((d) => d.isAnomaly) || null
  );

  const anomalies = data.filter((d) => d.isAnomaly);

  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.isAnomaly) {
      const isSelected = selectedAnomaly?.day === payload.day;
      return (
        <circle
          key={`std-dot-${payload.day}`}
          cx={cx}
          cy={cy}
          r={isSelected ? 7 : 5}
          fill="#e11d48"
          stroke="#ffffff"
          strokeWidth={2}
          className="cursor-pointer animate-pulse"
          onClick={() => setSelectedAnomaly(payload)}
        />
      );
    }
    return <Dot key={`std-dot-std-${payload.day}`} cx={cx} cy={cy} r={2} fill="#065f46" opacity={0.6} />;
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
              <Badge variant="emerald">Campus Predictive Model</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Campus & Dorm 30-Day Load Forecast
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Predicted electrical demand for Founders Hall Dorm & Computer Science Department Labs.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-100 p-2.5 rounded-2xl border border-stone-200 text-xs font-mono text-stone-700">
            <Calendar className="h-4 w-4 text-emerald-700" />
            <span>Campus Semester Forecast</span>
          </div>
        </div>

        {/* Chart + Anomaly Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-700" />
                <span>Predicted Daily Dorm Load vs Campus Baseline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716c' }} dy={5} />
                    <YAxis unit=" kWh" tick={{ fontSize: 11, fill: '#78716c' }} domain={[0, 40]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="confidenceUpper" stroke="none" fill="#d1fae5" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="confidenceLower" stroke="none" fill="#ffffff" fillOpacity={1.0} />
                    <Line type="monotone" dataKey="baselineKw" stroke="#a8a29e" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="actualOrForecastKw" stroke="#065f46" strokeWidth={2.5} dot={renderCustomDot} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Anomaly Panel */}
          <Card className="border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>Campus Anomaly Explanation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {selectedAnomaly ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                    <Badge variant="coral">{selectedAnomaly.date}</Badge>
                    <h4 className="text-xs font-bold text-rose-950 mt-1">{selectedAnomaly.anomalyTitle}</h4>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-900">Campus Root Cause</span>
                    <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200">{selectedAnomaly.anomalyReason}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-900">Student Action</span>
                    <p className="text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">{selectedAnomaly.recommendedAction}</p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-stone-500">Click any red marker on chart.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
