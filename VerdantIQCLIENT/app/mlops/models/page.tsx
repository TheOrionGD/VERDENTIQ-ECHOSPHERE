// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ModelVersion } from '@/lib/services/mlopsService';
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
import {
  Server,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  Activity,
  GitBranch,
  Layers,
  Sparkles,
  AlertTriangle,
  Play,
  Cpu,
  BarChart2,
  ShieldCheck,
} from 'lucide-react';

export default function MlopsModelsPage() {
  const [activeVersion, setActiveVersion] = useState<string>(([] as any));
  const [rollbackSuccess, setRollbackSuccess] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [retrainStep, setRetrainStep] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>('m-001');

  const models = ([] as any) || [];
  const defaultModel: ModelVersion = {
    id: 'm-001',
    name: 'HVAC Thermal Load Predictor',
    version: '3.4.1',
    framework: 'PyTorch v2.2 + XGBoost',
    status: 'LIVE',
    deployedAt: '2026-07-28 14:20:00',
    rmse: 0.042,
    mae: 0.031,
    latencyMs: 14,
    memoryMb: 180,
    accuracy: 98.2,
    description: 'Predicts chilled water & zone cooling demand from weather and occupancy sensor telemetry.',
    featureImportance: [
      { feature: 'Ambient Outdoor Temperature (°C)', importance: 0.38 },
      { feature: 'Occupancy Sensor Density', importance: 0.28 },
    ],
  };
  const selectedModel = models.find((m) => m.id === selectedModelId) || models[0] || defaultModel;

  const handleRollback = (targetVersion: string) => {
    ([] as any);
    setActiveVersion(targetVersion);
    setRollbackSuccess(true);
    setTimeout(() => setRollbackSuccess(false), 4000);
  };

  const handleTriggerRetrain = () => {
    setRetraining(true);
    setRetrainStep('1/4: Pulling anonymized telemetry features & labeled escalation resolutions...');

    setTimeout(() => {
      setRetrainStep('2/4: Computing Kolmogorov-Smirnov distribution shifts & outlier filtering...');
    }, 1200);

    setTimeout(() => {
      setRetrainStep('3/4: Fine-tuning PyTorch model weights on latest 30-day window...');
    }, 2500);

    setTimeout(() => {
      setRetrainStep('4/4: Validating RMSE error against safety threshold (0.05)...');
    }, 3800);

    setTimeout(() => {
      setRetraining(false);
      setRetrainStep(null);
      alert('Model retraining completed! Candidate artifact staged in registry with RMSE 0.039 °C.');
    }, 4800);
  };

  // Mock Drift Telemetry Data over 14 days
  const driftChartData = [
    { day: 'Jul 21', liveRmse: 0.038, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Jul 22', liveRmse: 0.039, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Jul 23', liveRmse: 0.040, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Jul 24', liveRmse: 0.041, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Jul 25', liveRmse: 0.042, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Jul 26', liveRmse: 0.044, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Jul 27', liveRmse: 0.043, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Jul 28', liveRmse: 0.042, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Jul 29', liveRmse: 0.045, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Jul 30', liveRmse: 0.047, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Jul 31', liveRmse: 0.048, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Aug 01', liveRmse: 0.049, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Aug 02', liveRmse: 0.051, trainingBaseline: 0.035, threshold: 0.050 },
    { day: 'Aug 03', liveRmse: 0.042, trainingBaseline: 0.035, threshold: 0.050 },
  ];

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Server className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">Model Governance & Registry</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Predictive Model Governance & Version Registry
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Inspect model versions, monitor prediction drift against baselines, view SHAP feature importances, and trigger one-click rollbacks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRollback('v2.3-legacy-stable')}
              disabled={activeVersion === 'v2.3-legacy-stable' || retraining}
              className="text-rose-700 border-rose-200 hover:bg-rose-50"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Rollback to v2.3 Stable
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleTriggerRetrain}
              disabled={retraining}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${retraining ? 'animate-spin' : ''}`} />
              {retraining ? 'Retraining Pipeline Running...' : 'Trigger One-Click Retrain'}
            </Button>
          </div>
        </div>

        {/* Notifications & Progress Bar */}
        {rollbackSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              Successfully rolled back production inference pointer to <strong>v2.3-legacy-stable</strong> with zero downtime.
            </span>
            <Button variant="ghost" size="sm" onClick={() => setRollbackSuccess(false)}>
              Dismiss
            </Button>
          </div>
        )}

        {retraining && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2 text-xs text-amber-950 shadow-xs animate-pulse">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-amber-700 animate-spin" />
                Automated Retrain Pipeline in Progress
              </span>
              <span className="font-mono text-[11px] text-amber-800 font-bold">STAGE ACTIVE</span>
            </div>
            <p className="font-mono text-[11px] text-amber-900 bg-amber-100/80 p-2 rounded-xl border border-amber-200">
              {retrainStep}
            </p>
          </div>
        )}

        {/* Top Cards: Selected Model & Registry Quick Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1 p-4 bg-white/95 border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-emerald-800" /> Model Registry Artifacts
              </h3>
              <Badge variant="stone">{models.length} Registered</Badge>
            </div>

            <div className="space-y-2">
              {models.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedModelId === m.id
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-stone-900">{m.name}</span>
                    <Badge variant={m.status === 'LIVE' ? 'emerald' : m.status === 'STAGING' ? 'amber' : 'stone'}>
                      {m.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                    <span>{m.version}</span>
                    <span>RMSE: <strong className="text-stone-800">{m.rmse} °C</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Model Spec Overview */}
          <Card className="lg:col-span-2 p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-base font-bold text-stone-900">{selectedModel.name}</h3>
                  <Badge variant={selectedModel.version === activeVersion ? 'emerald' : 'amber'}>
                    {selectedModel.version === activeVersion ? 'ACTIVE INFERENCE POINTER' : selectedModel.version}
                  </Badge>
                </div>
                <p className="text-xs text-stone-600 mt-1">{selectedModel.description}</p>
              </div>

              {selectedModel.version !== activeVersion && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleRollback(selectedModel.version)}
                  className="whitespace-nowrap"
                >
                  <Play className="h-3.5 w-3.5 mr-1" /> Promote to Live Pointer
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">RMSE Error</span>
                <span className="text-base font-bold text-stone-900">{selectedModel.rmse} °C</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">MAE Accuracy</span>
                <span className="text-base font-bold text-emerald-800">{selectedModel.accuracy}%</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">Inference Latency</span>
                <span className="text-base font-bold text-stone-900">{selectedModel.latencyMs}ms</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">RAM Footprint</span>
                <span className="text-base font-bold text-stone-900">{selectedModel.memoryMb} MB</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono pt-1">
              <span>Framework: <strong>{selectedModel.framework}</strong></span>
              <span>Deployed: <strong>{selectedModel.deployedAt}</strong></span>
            </div>
          </Card>
        </div>

        {/* Drift Chart & Feature Importance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Live Prediction Drift Chart */}
          <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div>
                <h3 className="font-editorial text-base font-bold text-stone-900">
                  Prediction Drift vs Baseline Threshold
                </h3>
                <p className="text-[11px] text-stone-500">
                  Comparing 14-day rolling live prediction RMSE error against training-time baseline.
                </p>
              </div>
              <Badge variant="amber">KS-Test Drift Threshold = 0.050</Badge>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={driftChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="day" stroke="#78716c" fontSize={11} tickLine={false} />
                  <YAxis domain={[0.02, 0.06]} stroke="#78716c" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <ReferenceLine y={0.050} label={{ value: 'Retrain Threshold (0.05)', fill: '#b91c1c', fontSize: 10 }} stroke="#b91c1c" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="liveRmse" name="Rolling Live RMSE Error (°C)" stroke="#064E3B" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="trainingBaseline" name="Training Baseline (0.035)" stroke="#78716c" strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Feature Importance Viewer */}
          <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div>
                <h3 className="font-editorial text-base font-bold text-stone-900">
                  SHAP Feature Importance (Forecast Explainability)
                </h3>
                <p className="text-[11px] text-stone-500">
                  Normalized relative influence of input features for {selectedModel.name}.
                </p>
              </div>
              <Badge variant="emerald">Permutation SHAP</Badge>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedModel.featureImportance} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e7e5e4" />
                  <XAxis type="number" stroke="#78716c" fontSize={11} domain={[0, 0.5]} />
                  <YAxis dataKey="feature" type="category" stroke="#78716c" fontSize={10} width={130} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '11px' }} />
                  <Bar dataKey="importance" name="SHAP Importance Weight" fill="#064E3B" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
