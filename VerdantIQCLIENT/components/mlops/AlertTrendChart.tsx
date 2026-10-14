'use client';

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
import { Badge } from '@/components/ui/Badge';
import { BarChart2 } from 'lucide-react';

interface TrendPoint {
  dateKey: string;
  displayDate: string;
  Total: number;
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
}

interface AlertTrendChartProps {
  trendData: TrendPoint[];
}

export function AlertTrendChart({ trendData }: AlertTrendChartProps) {
  return (
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
  );
}

export function AlertTrendChartSkeleton() {
  return (
    <div className="pt-4 border-t border-stone-200 space-y-3">
      <div className="h-5 w-56 bg-stone-200 animate-pulse rounded-lg" />
      <div className="h-64 w-full bg-stone-100 animate-pulse rounded-2xl" />
    </div>
  );
}
