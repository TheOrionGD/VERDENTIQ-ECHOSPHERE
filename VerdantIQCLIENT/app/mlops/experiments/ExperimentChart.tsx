'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MetricPoint {
  time: string;
  variantAVal: number;
  variantBVal: number;
}

interface ExperimentChartProps {
  data: MetricPoint[];
}

export function ExperimentLineChart({ data }: ExperimentChartProps) {
  return (
    <div className="h-40 w-full bg-stone-50/50 p-2 rounded-xl border border-stone-200/80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
          <XAxis dataKey="time" stroke="#78716c" fontSize={10} />
          <YAxis stroke="#78716c" fontSize={10} />
          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', fontSize: '11px' }} />
          <Line type="monotone" dataKey="variantAVal" name="Variant A" stroke="#78716c" strokeWidth={2} />
          <Line type="monotone" dataKey="variantBVal" name="Variant B" stroke="#064E3B" strokeWidth={2.5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ExperimentChartSkeleton() {
  return <div className="h-40 w-full bg-stone-100 animate-pulse rounded-xl border border-stone-200" />;
}
