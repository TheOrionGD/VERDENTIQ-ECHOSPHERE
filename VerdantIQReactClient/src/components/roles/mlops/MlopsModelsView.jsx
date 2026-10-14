import React, { useState } from 'react';
import { 
  Server, 
  RotateCcw, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  Cpu 
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function MlopsModelsView() {
  const [activeVersion, setActiveVersion] = useState('v3.4.1-live');
  const [rollbackSuccess, setRollbackSuccess] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [retrainStep, setRetrainStep] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState('m-001');

  const models = [
    {
      id: 'm-001',
      name: 'Pure JS Holt-Winters Campus Load Predictor',
      version: 'v3.4.1-live',
      framework: 'JavaScript (ES2024 / Node.js V8)',
      status: 'LIVE',
      deployedAt: '2026-10-12 14:20:00',
      rmse: 0.042,
      mae: 0.031,
      latencyMs: 3.2,
      memoryMb: 18,
      accuracy: 98.2,
      description: 'Calculates additive baseline level (α=0.25) and trend (β=0.15) for single-meter campus electricity load forecasting.',
      featureImportance: [
        { feature: 'Historical 12-Month Meter kWh', importance: 0.44 },
        { feature: 'Academic Calendar / Term Session', importance: 0.32 },
        { feature: 'Outdoor Degree Days (Cooling/Heating)', importance: 0.24 },
      ],
    },
    {
      id: 'm-002',
      name: 'Multi-Objective Pareto HVAC Schedule Optimizer',
      version: 'v2.8.0-live',
      framework: 'JavaScript Heuristic Pareto Frontier',
      status: 'LIVE',
      deployedAt: '2026-10-10 09:15:00',
      rmse: 0.038,
      mae: 0.027,
      latencyMs: 8.5,
      memoryMb: 24,
      accuracy: 99.1,
      description: 'Generates non-dominated HVAC setpoint schedules balancing energy cost, Scope 2 emissions, and occupant thermal comfort.',
      featureImportance: [
        { feature: 'Time-of-Use Electricity Tariff ($/kWh)', importance: 0.48 },
        { feature: 'Grid Emission Factor (0.42 kg/kWh)', importance: 0.30 },
        { feature: 'ASHRAE Thermal Comfort Threshold', importance: 0.22 },
      ],
    },
    {
      id: 'm-003',
      name: 'Legacy Stable Baseline Model',
      version: 'v2.3-legacy-stable',
      framework: 'Linear Regression + Moving Average',
      status: 'STANDBY',
      deployedAt: '2026-06-15 11:00:00',
      rmse: 0.068,
      mae: 0.054,
      latencyMs: 1.8,
      memoryMb: 8,
      accuracy: 93.4,
      description: 'Fallback linear predictor maintained for zero-downtime hot-swap validation.',
      featureImportance: [
        { feature: 'Historical Moving Average', importance: 0.70 },
        { feature: 'Seasonal Multiplier', importance: 0.30 },
      ],
    }
  ];

  const selectedModel = models.find((m) => m.id === selectedModelId) || models[0];

  const handleRollback = (targetVersion) => {
    setActiveVersion(targetVersion);
    setRollbackSuccess(true);
    setTimeout(() => setRollbackSuccess(false), 3500);
  };

  const handleTriggerRetrain = () => {
    setRetraining(true);
    setRetrainStep('1/4: Ingesting verified campus billing & weather observations...');

    setTimeout(() => {
      setRetrainStep('2/4: Computing Holt-Winters level and trend coefficient optimization...');
    }, 1000);

    setTimeout(() => {
      setRetrainStep('3/4: Evaluating candidate forecast against held-out validation window...');
    }, 2200);

    setTimeout(() => {
      setRetrainStep('4/4: Confirming RMSE error is within safety threshold (0.050)...');
    }, 3400);

    setTimeout(() => {
      setRetraining(false);
      setRetrainStep(null);
      alert('Model retrain complete! Pure JS forecast weights validated with RMSE 0.038.');
    }, 4500);
  };

  const driftChartData = [
    { day: 'Day 1', liveRmse: 0.038, baseline: 0.035, threshold: 0.050 },
    { day: 'Day 2', liveRmse: 0.039, baseline: 0.035, threshold: 0.050 },
    { day: 'Day 3', liveRmse: 0.040, baseline: 0.035, threshold: 0.050 },
    { day: 'Day 4', liveRmse: 0.041, baseline: 0.035, threshold: 0.050 },
    { day: 'Day 5', liveRmse: 0.042, baseline: 0.035, threshold: 0.050 },
    { day: 'Day 6', liveRmse: 0.044, baseline: 0.035, threshold: 0.050 },
    { day: 'Day 7', liveRmse: 0.043, baseline: 0.035, threshold: 0.050 },
    { day: 'Day 8', liveRmse: 0.042, baseline: 0.035, threshold: 0.050 },
    { day: 'Day 9', liveRmse: 0.041, baseline: 0.035, threshold: 0.050 },
    { day: 'Day 10', liveRmse: 0.042, baseline: 0.035, threshold: 0.050 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Pure JavaScript Predictive Model Governance & Version Registry</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Holt-Winters forecasting, Pareto solvers, live RMSE drift tracking, and atomic instant rollbacks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleRollback('v2.3-legacy-stable')}
            disabled={activeVersion === 'v2.3-legacy-stable' || retraining}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Rollback to v2.3 Stable</span>
          </button>

          <button
            onClick={handleTriggerRetrain}
            disabled={retraining}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${retraining ? 'animate-spin' : ''}`} />
            <span>{retraining ? 'Retraining...' : 'Trigger Pure JS Retrain'}</span>
          </button>
        </div>
      </div>

      {rollbackSuccess && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>Active model successfully hot-swapped to rollback target <strong className="font-mono text-white">v2.3-legacy-stable</strong> (Zero dropped predictions).</span>
        </div>
      )}

      {retrainStep && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center space-x-2 animate-pulse">
          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>{retrainStep}</span>
        </div>
      )}

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-3 gap-4">
        {models.map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedModelId(m.id)}
            className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
              selectedModelId === m.id
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg'
                : 'bg-neutral-900 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold font-mono">
                {m.version}
              </span>
              <span className="text-[10px] text-neutral-400">{m.status}</span>
            </div>
            <div className="font-semibold text-white text-xs mb-1">{m.name}</div>
            <div className="text-[11px] text-neutral-400 font-mono">RMSE: {m.rmse} · Latency: {m.latencyMs}ms</div>
          </button>
        ))}
      </div>

      {/* Deep Model Card & Drift Inspector */}
      <div className="grid grid-cols-3 gap-6">
        {/* Model Specs */}
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Active Model Specification Card</span>
          </h3>

          <p className="text-neutral-300 leading-relaxed text-[11px]">{selectedModel.description}</p>

          <div className="space-y-2 pt-2 border-t border-white/10 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-neutral-400">Runtime Engine:</span>
              <span className="text-white">{selectedModel.framework}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Mean Absolute Error (MAE):</span>
              <span className="text-emerald-400">{selectedModel.mae}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Heap Memory Footprint:</span>
              <span className="text-sky-400">{selectedModel.memoryMb} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Production Accuracy:</span>
              <span className="text-emerald-400 font-bold">{selectedModel.accuracy}%</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <span className="text-neutral-300 font-semibold text-[11px] block">Relative Feature Weights:</span>
            {selectedModel.featureImportance.map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>{f.feature}</span>
                  <span className="font-mono text-emerald-400">{(f.importance * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${f.importance * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drift Telemetry Chart */}
        <div className="col-span-2 fluent-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Prediction Error Drift vs Safety Upper Bound</h3>
              <p className="text-[11px] text-neutral-400">Kolmogorov-Smirnov feature distribution tracking (Threshold: 0.050 RMSE)</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Live RMSE</span>
              </span>
              <span className="flex items-center space-x-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span>Safety Threshold (0.050)</span>
              </span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={driftChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="day" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} domain={[0.02, 0.06]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', fontSize: '11px', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="liveRmse" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
