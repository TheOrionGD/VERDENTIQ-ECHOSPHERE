'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  TestTube,
  CheckCircle2,
  Trophy,
  Sparkles,
  AlertCircle,
  Plus,
  BarChart2,
  Sliders,
  Play,
  ArrowRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Experiment {
  id: string;
  title: string;
  hypothesis: string;
  variantA: string;
  variantB: string;
  trafficSplit: string;
  confidenceScore: number;
  status: 'running' | 'concluded' | 'draft';
  winner?: string;
  metricComparison: { time: string; variantAVal: number; variantBVal: number }[];
}

interface SweepTrial {
  trialId: string;
  learningRate: number;
  batchSize: number;
  optimizer: string;
  valLoss: number;
  accuracy: number;
  status: 'COMPLETED' | 'RUNNING' | 'FAILED';
}

export default function MlopsExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([
    {
      id: 'exp_001',
      title: 'Dormitory Pre-Cooling MILP Algorithm Test',
      hypothesis: 'Pre-cooling dorm rooms 45 mins prior to peak energy pricing window reduces HVAC electricity cost by 14%.',
      variantA: 'Baseline Static Schedule',
      variantB: 'Dynamic Weather-Aware MILP',
      trafficSplit: '50% / 50%',
      confidenceScore: 97.4,
      status: 'running',
      metricComparison: [
        { time: 'Day 1', variantAVal: 480, variantBVal: 420 },
        { time: 'Day 2', variantAVal: 495, variantBVal: 415 },
        { time: 'Day 3', variantAVal: 510, variantBVal: 405 },
        { time: 'Day 4', variantAVal: 475, variantBVal: 390 },
        { time: 'Day 5', variantAVal: 505, variantBVal: 385 },
      ],
    },
    {
      id: 'exp_002',
      title: 'LLM Prompt Compression for Assistant Router',
      hypothesis: 'Compressing system prompt tokens by 30% reduces TTFT latency without degradation in student Q&A accuracy.',
      variantA: 'Full System Prompt (1.2k tokens)',
      variantB: 'Compressed Prompt (800 tokens)',
      trafficSplit: '30% / 70%',
      confidenceScore: 99.1,
      status: 'concluded',
      winner: 'Variant B (Compressed Prompt)',
      metricComparison: [
        { time: 'Day 1', variantAVal: 340, variantBVal: 210 },
        { time: 'Day 2', variantAVal: 350, variantBVal: 195 },
        { time: 'Day 3', variantAVal: 335, variantBVal: 180 },
        { time: 'Day 4', variantAVal: 360, variantBVal: 185 },
      ],
    },
  ]);

  const sweepTrials: SweepTrial[] = [
    { trialId: 'trial_101', learningRate: 0.0001, batchSize: 32, optimizer: 'AdamW', valLoss: 0.042, accuracy: 98.4, status: 'COMPLETED' },
    { trialId: 'trial_102', learningRate: 0.0005, batchSize: 64, optimizer: 'AdamW', valLoss: 0.048, accuracy: 97.8, status: 'COMPLETED' },
    { trialId: 'trial_103', learningRate: 0.0010, batchSize: 128, optimizer: 'SGD+Nesterov', valLoss: 0.065, accuracy: 95.2, status: 'COMPLETED' },
    { trialId: 'trial_104', learningRate: 0.00035, batchSize: 32, optimizer: 'AdamW', valLoss: 0.038, accuracy: 98.9, status: 'RUNNING' },
  ];

  const declareWinner = (id: string, winnerName: string) => {
    setExperiments((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'concluded', winner: winnerName } : e
      )
    );
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TestTube className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">Inference Experimentation & Sweeps</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              A/B Testing & Hyperparameter Sweep Experimentation
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Run statistical hypothesis tests comparing HVAC dispatch heuristics, prompt compression models, and hyperparameter sweeps.
            </p>
          </div>
        </div>

        {/* Active A/B Testing Experiments */}
        <div className="space-y-4">
          <h2 className="font-editorial text-base font-bold text-stone-900 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-emerald-800" /> Active Model A/B Experiments
          </h2>

          {experiments.map((exp) => (
            <Card key={exp.id} className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-semibold text-sm text-stone-900">{exp.title}</h3>
                  <p className="text-xs text-stone-600 mt-0.5">{exp.hypothesis}</p>
                </div>
                <Badge variant={exp.status === 'running' ? 'amber' : 'emerald'}>
                  {exp.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold text-stone-500 uppercase font-mono block">Variant A (Control)</span>
                  <p className="font-semibold text-stone-800">{exp.variantA}</p>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase font-mono block">Variant B (Challenger)</span>
                  <p className="font-semibold text-emerald-950">{exp.variantB}</p>
                </div>
              </div>

              {/* Metric Chart */}
              <div className="h-40 w-full bg-stone-50/50 p-2 rounded-xl border border-stone-200/80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={exp.metricComparison} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis dataKey="time" stroke="#78716c" fontSize={10} />
                    <YAxis stroke="#78716c" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="variantAVal" name="Variant A" stroke="#78716c" strokeWidth={2} />
                    <Line type="monotone" dataKey="variantBVal" name="Variant B" stroke="#064E3B" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                <div className="flex items-center gap-3 font-mono">
                  <span>Traffic Split: <strong>{exp.trafficSplit}</strong></span>
                  <span>p-Value Confidence: <strong className="text-emerald-800">{exp.confidenceScore}%</strong></span>
                </div>

                {exp.status === 'running' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => declareWinner(exp.id, `Variant B (${exp.variantB})`)}
                    className="text-xs"
                  >
                    <Trophy className="h-3.5 w-3.5 mr-1" /> Promote Variant B as Winner
                  </Button>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold font-mono">
                    <Trophy className="h-4 w-4 text-emerald-600" /> Winner Declared: {exp.winner}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Hyperparameter Sweep Tracking */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-editorial text-base font-bold text-stone-900">
                Hyperparameter Sweep Runs (Optuna / Ray Tune)
              </h3>
              <p className="text-[11px] text-stone-500">
                Automated grid search for learning rate, batch size, and loss regularization parameters.
              </p>
            </div>
            <Badge variant="emerald">4 Sweeps Run</Badge>
          </div>

          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Trial ID</th>
                  <th className="py-2.5 px-3">Learning Rate</th>
                  <th className="py-2.5 px-3">Batch Size</th>
                  <th className="py-2.5 px-3">Optimizer</th>
                  <th className="py-2.5 px-3">Validation Loss</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sweepTrials.map((trial) => (
                  <tr key={trial.trialId} className="hover:bg-stone-50">
                    <td className="py-3 px-3 font-bold text-stone-900">{trial.trialId}</td>
                    <td className="py-3 px-3">{trial.learningRate}</td>
                    <td className="py-3 px-3">{trial.batchSize}</td>
                    <td className="py-3 px-3">{trial.optimizer}</td>
                    <td className="py-3 px-3 font-bold text-emerald-800">{trial.valLoss}</td>
                    <td className="py-3 px-3 font-bold text-stone-900">{trial.accuracy}%</td>
                    <td className="py-3 px-3">
                      <Badge variant={trial.status === 'COMPLETED' ? 'emerald' : 'amber'}>
                        {trial.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
