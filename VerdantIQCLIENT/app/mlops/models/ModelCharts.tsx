'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
} from 'recharts';

interface DriftPoint {
  day: string;
  liveRmse: number;
  trainingBaseline: number;
  threshold: number;
}

interface FeatureImportancePoint {
  feature: string;
  importance: number;
}

interface ModelChartsProps {
  driftChartData: DriftPoint[];
  featureImportance: FeatureImportancePoint[];
  modelName: string;
}

export function ModelCharts({ driftChartData, featureImportance, modelName }: ModelChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Live Prediction Drift Chart */}
      <div className="p-5 bg-white/95 border border-stone-200 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <div>
            <h3 className="font-editorial text-base font-bold text-stone-900">
              Prediction Drift vs Baseline Threshold
            </h3>
            <p className="text-[11px] text-stone-500">
              Comparing 14-day rolling live prediction RMSE error against training-time baseline.
            </p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={driftChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="day" stroke="#78716c" fontSize={11} tickLine={false} />
              <YAxis domain={[0.02, 0.06]} stroke="#78716c" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <ReferenceLine y={0.050} label={{ value: 'Retrain Threshold (0.05)', fill: '#b91c1c', fontSize: 10 }} stroke="#b91c1c" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="liveRmse" name="Rolling Live RMSE Error (°C)" stroke="#064E3B" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="trainingBaseline" name="Training Baseline (0.035)" stroke="#78716c" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Importance Viewer */}
      <div className="p-5 bg-white/95 border border-stone-200 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <div>
            <h3 className="font-editorial text-base font-bold text-stone-900">
              SHAP Feature Importance (Forecast Explainability)
            </h3>
            <p className="text-[11px] text-stone-500">
              Normalized relative influence of input features for {modelName}.
            </p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureImportance} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e7e5e4" />
              <XAxis type="number" stroke="#78716c" fontSize={11} domain={[0, 0.5]} />
              <YAxis dataKey="feature" type="category" stroke="#78716c" fontSize={10} width={130} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '11px' }} />
              <Bar dataKey="importance" name="SHAP Importance Weight" fill="#064E3B" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function ModelChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="h-80 bg-white/95 border border-stone-200 rounded-2xl animate-pulse" />
      <div className="h-80 bg-white/95 border border-stone-200 rounded-2xl animate-pulse" />
    </div>
  );
}
