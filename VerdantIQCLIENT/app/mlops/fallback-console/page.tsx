'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Radio, Zap, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2, Play, RefreshCw, Terminal } from 'lucide-react';

export default function MlopsFallbackConsolePage() {
  const [testPayload, setTestPayload] = useState('Calculate optimal HVAC setpoint for Zone 3 under 38°C heatwave.');
  const [simulatedFailure, setSimulatedFailure] = useState<'NONE' | 'GROQ_503' | 'GEMINI_429' | 'NETWORK_OFFLINE'>('NONE');
  const [runningTest, setRunningTest] = useState(false);
  const [traceLogs, setTraceLogs] = useState<string[]>([]);

  const handleRunTest = () => {
    setRunningTest(true);
    setTraceLogs(['[0ms] Ingress proxy received payload request...', '[12ms] Evaluating gateway routing rules...']);

    setTimeout(() => {
      if (simulatedFailure === 'NONE') {
        setTraceLogs((prev) => [
          ...prev,
          '[42ms] Primary Route selected: Groq LPU (Llama-3 70B)',
          '[118ms] Response status: 200 OK',
          '[120ms] SUCCESS: Returned inference result to client via Groq primary route.',
        ]);
        setRunningTest(false);
      } else if (simulatedFailure === 'GROQ_503') {
        setTraceLogs((prev) => [
          ...prev,
          '[42ms] Primary Route selected: Groq LPU (Llama-3 70B)',
          '[210ms] Groq API returned HTTP 503 Service Unavailable!',
          '[212ms] CIRCUIT BREAKER TRIGGERED: Catching Groq failure...',
          '[215ms] Executing Fallback Route: Rerouting request to Gemini 3.5 Flash...',
          '[480ms] Gemini 3.5 Flash response received: 200 OK',
          '[485ms] SUCCESS: Seamless failover completed to Gemini fallback engine.',
        ]);
        setRunningTest(false);
      } else if (simulatedFailure === 'GEMINI_429') {
        setTraceLogs((prev) => [
          ...prev,
          '[42ms] Primary Route selected: Gemini 3.5 Flash',
          '[180ms] Gemini API returned HTTP 429 Too Many Requests (Rate Limit)!',
          '[182ms] CIRCUIT BREAKER TRIGGERED: Catching Gemini failure...',
          '[185ms] Executing Fallback Route: Rerouting request to Local Deterministic Heuristics Engine...',
          '[192ms] Local Rule Engine computed optimal setpoint (22.5°C)',
          '[195ms] SUCCESS: Seamless failover completed to Local Rule Engine.',
        ]);
        setRunningTest(false);
      } else if (simulatedFailure === 'NETWORK_OFFLINE') {
        setTraceLogs((prev) => [
          ...prev,
          '[42ms] Primary Route: Groq LPU (Network Timeout)',
          '[1000ms] Connection timed out!',
          '[1002ms] Fallback Route: Gemini 3.5 Flash (Network Timeout)',
          '[2000ms] Connection timed out!',
          '[2005ms] Executing Emergency Cache Fallback: Serving cached setpoint matrix (Redis TTL OK).',
          '[2010ms] SUCCESS: Emergency fallback served cached response.',
        ]);
        setRunningTest(false);
      }
    }, 1200);
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="h-5 w-5 text-amber-700" />
              <Badge variant="amber">Resilience & Failover Console</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Inference Circuit Breaker & Fallback Simulation Console
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Simulate cloud provider outages or API errors to test instant automatic failover to Gemini, Groq, or local rule engines.
            </p>
          </div>
        </div>

        {/* Live Traffic Topology Visualizer */}
        <Card className="p-6 bg-white/95 border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-editorial text-base font-bold text-stone-900">
              Ingress Traffic Failover Topology
            </h3>
            <Badge variant={simulatedFailure !== 'NONE' ? 'coral' : 'emerald'}>
              {simulatedFailure !== 'NONE' ? `FAILURE SIMULATED: ${simulatedFailure}` : 'CIRCUIT BREAKER: NORMAL'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {/* Step 1: User Request */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase font-mono block">Ingress Proxy</span>
              <span className="font-bold text-xs text-stone-900">100% User Requests</span>
              <p className="text-[10px] text-stone-500">Routing Layer</p>
            </div>

            {/* Step 2: Primary Route */}
            <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
              simulatedFailure === 'GROQ_503' || simulatedFailure === 'NETWORK_OFFLINE'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
                <Zap className="h-4 w-4" />
                <span>Primary: Groq LPU</span>
              </div>
              <span className="text-sm font-bold font-mono block">
                {simulatedFailure === 'GROQ_503' ? '503 Outage' : 'Active Traffic'}
              </span>
            </div>

            {/* Step 3: Fallback Gemini Route */}
            <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
              simulatedFailure !== 'NONE'
                ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}>
              <div className="flex items-center justify-center gap-1.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                <span>Fallback: Gemini 3.5 Engine</span>
              </div>
              <span className="text-sm font-bold font-mono block">
                {simulatedFailure !== 'NONE' ? '100% REROUTED' : 'Standby Mode'}
              </span>
            </div>
          </div>
        </Card>

        {/* Interactive Payload Tester Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
              Interactive Failover Test Sandbox
            </h3>

            <div className="space-y-2">
              <label className="font-semibold text-stone-700 block">Test Prompt Payload</label>
              <textarea
                rows={3}
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-stone-700 block">Inject Simulated Provider Failure Mode</label>
              <select
                value={simulatedFailure}
                onChange={(e) => setSimulatedFailure(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              >
                <option value="NONE">NONE (Normal Operation)</option>
                <option value="GROQ_503">GROQ_503 (Groq Service Outage)</option>
                <option value="GEMINI_429">GEMINI_429 (Gemini Rate Limit Exceeded)</option>
                <option value="NETWORK_OFFLINE">NETWORK_OFFLINE (Total Cloud Disconnect)</option>
              </select>
            </div>

            <Button variant="primary" size="sm" onClick={handleRunTest} disabled={runningTest} className="w-full">
              <Play className={`h-3.5 w-3.5 mr-1.5 ${runningTest ? 'animate-spin' : ''}`} />
              {runningTest ? 'Executing Failover Simulation...' : 'Execute Fallback Simulation'}
            </Button>
          </Card>

          {/* Execution Trace Output */}
          <Card className="p-5 bg-stone-900 text-stone-100 shadow-md space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Terminal className="h-4 w-4" /> Execution Trace Console
              </span>
              <Badge variant="stone">LOGS</Badge>
            </div>

            <div className="space-y-1 text-[11px] min-h-[160px]">
              {traceLogs.length === 0 ? (
                <p className="text-stone-500 italic">Click &quot;Execute Fallback Simulation&quot; to see real-time execution trace logs...</p>
              ) : (
                traceLogs.map((log, idx) => (
                  <p key={idx} className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('CIRCUIT') || log.includes('503') ? 'text-amber-400 font-bold' : 'text-stone-300'}>
                    {log}
                  </p>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
