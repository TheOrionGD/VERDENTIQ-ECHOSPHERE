'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ParetoPoint {
  name: string;
  costDollars: number;
  thermalDiscomfort: number;
  active: boolean;
}

interface ParetoChartProps {
  paretoData: ParetoPoint[];
}

export function ParetoChart({ paretoData }: ParetoChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
          <XAxis type="number" dataKey="costDollars" name="Daily Energy Cost ($)" stroke="#78716c" fontSize={11} unit="$" />
          <YAxis type="number" dataKey="thermalDiscomfort" name="Discomfort (°C·hr)" stroke="#78716c" fontSize={11} unit="°C" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '11px' }} />
          <Scatter name="Operating Points" data={paretoData} fill="#064E3B">
            {paretoData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.active ? '#064E3B' : '#a8a29e'} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ParetoChartSkeleton() {
  return <div className="h-64 w-full bg-stone-100 animate-pulse rounded-xl" />;
}
