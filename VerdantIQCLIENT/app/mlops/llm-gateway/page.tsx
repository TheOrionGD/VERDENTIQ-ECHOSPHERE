// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatGauge } from '@/components/ui/StatGauge';
import { RoutingRule } from '@/lib/services/mlopsService';
import {
  Zap,
  Cpu,
  DollarSign,
  Activity,
  BarChart3,
  Radio,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function MlopsLlmGatewayPage() {
  const [rules, setRules] = useState<RoutingRule[]>(([] as any));
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    condition: '',
    primaryProvider: 'Groq LPU' as const,
    fallbackProvider: 'Gemini 3.5 Flash' as const,
    maxLatencyMs: 300,
    maxCostCapDollars: 0.002,
  });

  const handleToggle = (id: string) => {
    ([] as any);
    setRules([...([] as any)]);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name || !newRule.condition) return;

    ([] as any);
    setRules([...([] as any)]);
    setShowAddModal(false);
    setNewRule({
      name: '',
      condition: '',
      primaryProvider: 'Groq LPU',
      fallbackProvider: 'Gemini 3.5 Flash',
      maxLatencyMs: 300,
      maxCostCapDollars: 0.002,
    });
  };

  // Recent Live Ingress Telemetry Stream
  const liveTelemetry = [
    { time: '12:44:02', intent: 'Assistant Q&A', provider: 'Groq LPU', latency: '118ms', cost: '$0.00008', status: '200 OK' },
    { time: '12:43:58', intent: 'Thermal Vision Analysis', provider: 'Gemini 3.5 Flash', latency: '272ms', cost: '$0.00032', status: '200 OK' },
    { time: '12:43:45', intent: 'Set Point Optimization Explainability', provider: 'Gemini 3.5 Flash', latency: '310ms', cost: '$0.00041', status: '200 OK' },
    { time: '12:43:30', intent: 'HVAC Status Query', provider: 'Groq LPU', latency: '124ms', cost: '$0.00008', status: '200 OK' },
    { time: '12:43:12', intent: 'Groq Timeout Fallback', provider: 'Gemini 3.5 Flash', latency: '290ms', cost: '$0.00035', status: 'REROUTED (FALLBACK)' },
  ];

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-5 w-5 text-amber-700" />
              <Badge variant="amber">LLM Gateway & Economics</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Groq LPU vs Gemini LLM Traffic Gateway Router
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage dynamic model routing rules, cost/latency budgets, fallback behavior, and real-time inference telemetry.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Routing Rule
          </Button>
        </div>

        {/* Global LLM Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatGauge
            title="Avg Groq LPU Latency"
            value={120}
            target={150}
            unit="ms TTFT"
            trend="down"
            changePercentage={-18.5}
            status="optimal"
            subtitle="Llama-3 70B Ultra-Fast"
          />
          <StatGauge
            title="Avg Gemini 3.5 Latency"
            value={280}
            target={350}
            unit="ms response"
            trend="neutral"
            changePercentage={0}
            status="optimal"
            subtitle="Multimodal Reasoning Engine"
          />
          <StatGauge
            title="Total Daily LLM Spend"
            value={84.20}
            target={150.00}
            unit="$ USD / day"
            trend="down"
            changePercentage={-12.4}
            status="optimal"
            subtitle="Budget Limit: $200.00/day"
          />
          <StatGauge
            title="Fallback Failover Count"
            value={4}
            target={20}
            unit="events / 24h"
            trend="down"
            changePercentage={-50.0}
            status="optimal"
            subtitle="Auto rerouted seamlessly"
          />
        </div>

        {/* Side-by-Side Model Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Groq Card */}
          <Card className="p-5 bg-white/95 border-amber-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold font-mono">
                  Groq
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Groq LPU (Llama-3 70B)</h3>
                  <span className="text-[10px] text-stone-500 font-mono">Sub-150ms Speed & Low-Cost Route</span>
                </div>
              </div>
              <Badge variant="amber">75% TRAFFIC SPLIT</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">Cost / 1M Tokens</span>
                <span className="text-base font-bold text-stone-900">$0.59</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">Avg TTFT Latency</span>
                <span className="text-base font-bold text-emerald-800">120ms</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">Error Rate</span>
                <span className="text-base font-bold text-stone-800">0.08%</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">Daily Inferences</span>
                <span className="text-base font-bold text-stone-900">142,800</span>
              </div>
            </div>
          </Card>

          {/* Gemini Card */}
          <Card className="p-5 bg-white/95 border-emerald-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 font-bold font-mono">
                  Gemini
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Gemini 3.5 Flash</h3>
                  <span className="text-[10px] text-stone-500 font-mono">Primary Reasoning & Vision Engine</span>
                </div>
              </div>
              <Badge variant="emerald">25% TRAFFIC SPLIT</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">Cost / 1M Tokens</span>
                <span className="text-base font-bold text-emerald-800">$0.075</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">Avg Latency</span>
                <span className="text-base font-bold text-stone-900">280ms</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">Error Rate</span>
                <span className="text-base font-bold text-emerald-800">0.01%</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">Daily Inferences</span>
                <span className="text-base font-bold text-stone-900">47,600</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Routing Rules Table */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-editorial text-base font-bold text-stone-900">
                Active Gateway Routing Rules Editor
              </h3>
              <p className="text-[11px] text-stone-500">
                Evaluate incoming prompt requests against condition filters to pick primary and fallback providers.
              </p>
            </div>
            <Badge variant="emerald">{rules.filter((r) => r.enabled).length} Rules Enabled</Badge>
          </div>

          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[10px] uppercase">
                  <th className="py-2 px-3">Rule Name</th>
                  <th className="py-2 px-3">Condition Filter</th>
                  <th className="py-2 px-3">Primary Route</th>
                  <th className="py-2 px-3">Fallback Route</th>
                  <th className="py-2 px-3">Max Latency Target</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-stone-50">
                    <td className="py-3 px-3 font-bold text-stone-900">{rule.name}</td>
                    <td className="py-3 px-3 text-emerald-900 bg-emerald-50/50 rounded-md">{rule.condition}</td>
                    <td className="py-3 px-3 font-bold text-amber-900">{rule.primaryProvider}</td>
                    <td className="py-3 px-3 text-stone-600">{rule.fallbackProvider}</td>
                    <td className="py-3 px-3">{rule.maxLatencyMs}ms</td>
                    <td className="py-3 px-3">
                      <Badge variant={rule.enabled ? 'emerald' : 'stone'}>
                        {rule.enabled ? 'ENABLED' : 'DISABLED'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggle(rule.id)}
                        className="text-[11px] h-7"
                      >
                        {rule.enabled ? 'Disable' : 'Enable'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Live Ingress Request Telemetry Stream */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <h3 className="font-editorial text-base font-bold text-stone-900 flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-700 animate-pulse" /> Live Ingress Call Telemetry Feed
            </h3>
            <Badge variant="stone">Realtime Stream</Badge>
          </div>

          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 text-[10px] uppercase">
                  <th className="py-2 px-2">Time</th>
                  <th className="py-2 px-2">Prompt Intent</th>
                  <th className="py-2 px-2">Provider Assigned</th>
                  <th className="py-2 px-2">Latency</th>
                  <th className="py-2 px-2">Cost</th>
                  <th className="py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {liveTelemetry.map((t, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-2.5 px-2 text-stone-500">{t.time}</td>
                    <td className="py-2.5 px-2 font-bold text-stone-900">{t.intent}</td>
                    <td className="py-2.5 px-2 font-bold text-amber-800">{t.provider}</td>
                    <td className="py-2.5 px-2">{t.latency}</td>
                    <td className="py-2.5 px-2 text-emerald-800">{t.cost}</td>
                    <td className="py-2.5 px-2">
                      <Badge variant={t.status.includes('FALLBACK') ? 'coral' : 'emerald'}>
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Rule Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <Card className="p-5 max-w-lg w-full bg-white space-y-4 shadow-xl">
              <h3 className="font-editorial text-lg font-bold text-stone-900">Add LLM Routing Rule</h3>

              <form onSubmit={handleAddRule} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Rule Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Low Latency Real-time Assistant"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Condition Filter Expression</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prompt Tokens < 1000 && Intent == 'chat'"
                    value={newRule.condition}
                    onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Primary Route</label>
                    <select
                      value={newRule.primaryProvider}
                      onChange={(e) => setNewRule({ ...newRule, primaryProvider: e.target.value as any })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      <option value="Groq LPU">Groq LPU</option>
                      <option value="Gemini 3.5 Flash">Gemini 3.5 Flash</option>
                      <option value="Local Rule Engine">Local Rule Engine</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Fallback Route</label>
                    <select
                      value={newRule.fallbackProvider}
                      onChange={(e) => setNewRule({ ...newRule, fallbackProvider: e.target.value as any })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      <option value="Gemini 3.5 Flash">Gemini 3.5 Flash</option>
                      <option value="Groq LPU">Groq LPU</option>
                      <option value="Local Rule Engine">Local Rule Engine</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Max Latency (ms)</label>
                    <input
                      type="number"
                      value={newRule.maxLatencyMs}
                      onChange={(e) => setNewRule({ ...newRule, maxLatencyMs: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Cost Cap ($ / Call)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={newRule.maxCostCapDollars}
                      onChange={(e) => setNewRule({ ...newRule, maxCostCapDollars: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Rule
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
