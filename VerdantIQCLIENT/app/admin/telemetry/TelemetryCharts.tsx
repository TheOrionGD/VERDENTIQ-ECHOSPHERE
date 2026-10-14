'use client';

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
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface TimelinePoint {
  time: string;
  gateway: number;
  groq: number;
  gemini: number;
  milp: number;
}

interface AnalyticsPoint {
  endpoint: string;
  rpm: number;
  errPercent: number;
}

interface TelemetryChartsProps {
  timePreset: string;
  activeTimeline: TimelinePoint[];
  activeAnalytics: AnalyticsPoint[];
}

export function TelemetryCharts({ timePreset, activeTimeline, activeAnalytics }: TelemetryChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Latency Area Chart */}
      <div className="lg:col-span-2 p-5 bg-white/95 border border-stone-200 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-base font-bold text-stone-900">
              Microservice Latency Trends ({timePreset.toUpperCase()} Window)
            </h3>
            <p className="text-[11px] text-stone-500 font-mono">Response time comparison across core service routes</p>
          </div>
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
      </div>

      {/* Endpoint Bar Chart */}
      <div className="p-5 bg-white/95 border border-stone-200 rounded-2xl space-y-3">
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
      </div>
    </div>
  );
}

export function TelemetryChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 p-5 bg-white/95 border border-stone-200 rounded-2xl">
        <LoadingSkeleton rows={1} className="h-72" />
      </div>
      <div className="p-5 bg-white/95 border border-stone-200 rounded-2xl">
        <LoadingSkeleton rows={1} className="h-72" />
      </div>
    </div>
  );
}
