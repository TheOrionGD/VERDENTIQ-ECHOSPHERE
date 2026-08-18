'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GitCompare, ArrowRight, FileCode, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function MlopsRegistryDiffPage() {
  const [versionA, setVersionA] = useState('v2.3-legacy-stable');
  const [versionB, setVersionB] = useState('v2.4-production');

  const diffData = [
    { key: 'learning_rate', v23: '0.001', v24: '0.00035', status: 'modified' },
    { key: 'milp_solver_backend', v23: 'Scipy Linprog (Python)', v24: 'C++ CBC High-Perf Native', status: 'modified' },
    { key: 'comfort_weight_penalty', v23: '12.5', v24: '18.0', status: 'modified' },
    { key: 'max_iterations', v23: '1000', v24: '2500', status: 'modified' },
    { key: 'enable_geofence_constraint', v23: 'false', v24: 'true', status: 'added' },
    { key: 'training_dataset_hash', v23: 'sha256:8f4a1...', v24: 'sha256:c91b3...', status: 'modified' },
    { key: 'labeled_escalations_merged', v23: '1,200 records', v24: '2,690 records', status: 'modified' },
  ];

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitCompare className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">Hyperparameter Registry Diff</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Model Artifact & Hyperparameter Version Diff Viewer
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Side-by-side comparison of hyperparameter configurations, loss weights, solver backends, and dataset hashes.
            </p>
          </div>
        </div>

        {/* Version Pickers */}
        <Card className="p-4 bg-white/95 border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">Baseline (Left):</span>
            <select
              value={versionA}
              onChange={(e) => setVersionA(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl"
            >
              <option value="v2.3-legacy-stable">v2.3-legacy-stable</option>
              <option value="v1.8-thermal-candidate">v1.8-thermal-candidate</option>
            </select>
          </div>

          <ArrowRight className="h-4 w-4 text-stone-400 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">Target (Right):</span>
            <select
              value={versionB}
              onChange={(e) => setVersionB(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-emerald-900"
            >
              <option value="v2.4-production">v2.4-production</option>
              <option value="v2.5-candidate">v2.5-candidate (Staging)</option>
            </select>
          </div>
        </Card>

        {/* Side-by-Side Diff Table */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <span className="font-mono text-xs font-bold text-stone-800">
              Comparing: <strong className="text-rose-800">{versionA}</strong> <ArrowRight className="h-3 w-3 inline mx-1" /> <strong className="text-emerald-800">{versionB}</strong>
            </span>
            <Badge variant="emerald">{diffData.length} Diff Keys Found</Badge>
          </div>

          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Hyperparameter Key</th>
                  <th className="py-2.5 px-3 text-rose-700">{versionA} Value (Baseline)</th>
                  <th className="py-2.5 px-3 text-emerald-700">{versionB} Value (Target Release)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {diffData.map((row) => (
                  <tr key={row.key} className="hover:bg-stone-50">
                    <td className="py-3 px-3 font-bold text-stone-900">{row.key}</td>
                    <td className="py-3 px-3 text-rose-800 bg-rose-50/50">{row.v23}</td>
                    <td className="py-3 px-3 text-emerald-900 bg-emerald-50/50 font-bold">{row.v24}</td>
                    <td className="py-3 px-3">
                      <Badge variant={row.status === 'added' ? 'emerald' : 'amber'}>
                        {row.status.toUpperCase()}
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
