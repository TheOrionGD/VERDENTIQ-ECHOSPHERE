'use client';

import React from 'react';

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ForecastDataPoint } from '@/lib/services/userDataService';

interface ForecastChartProps {
  data: ForecastDataPoint[];
  height?: number;
  renderCustomDot: (props: any) => React.ReactElement | null;
  tooltipContent?: (props: any) => React.ReactElement | null;
}

export function ForecastChart({ data, height = 340, renderCustomDot, tooltipContent }: ForecastChartProps) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716c' }} dy={5} />
          <YAxis unit=" kWh" tick={{ fontSize: 11, fill: '#78716c' }} domain={[0, 40]} />
          {tooltipContent ? (
            <Tooltip content={tooltipContent} />
          ) : (
            <Tooltip />
          )}
          {/* Shaded Confidence Band */}
          <Area type="monotone" dataKey="confidenceUpper" stroke="none" fill="#d1fae5" fillOpacity={0.6} />
          <Area type="monotone" dataKey="confidenceLower" stroke="none" fill="#ffffff" fillOpacity={1.0} />
          {/* Baseline Line */}
          <Line type="monotone" dataKey="baselineKw" stroke="#a8a29e" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Baseline" />
          {/* Forecast Line with Custom Anomaly Dots */}
          <Line type="monotone" dataKey="actualOrForecastKw" stroke="#065f46" strokeWidth={2.5} dot={renderCustomDot as any} name="Forecast Load" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ForecastChartSkeleton({ height = 340 }: { height?: number }) {
  return <div style={{ height }} className="w-full bg-stone-100 animate-pulse rounded-xl" />;
}
