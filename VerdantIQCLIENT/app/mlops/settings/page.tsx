// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FastApiConfig, RetrainSchedule } from '@/lib/services/mlopsService';
import { Settings, Save, CheckCircle2, Server, Clock, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

export default function MlopsSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [fastApiConfig, setFastApiConfig] = useState<FastApiConfig>(([] as any));
  const [retrainSchedule, setRetrainSchedule] = useState<RetrainSchedule>(([] as any));

  const handleSave = () => {
    ([] as any);
    ([] as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">ML Governance & FastAPI Settings</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Service-Level FastAPI & Automated Retrain Schedule Configuration
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Configure FastAPI uvicorn worker pool concurrency, cache TTLs, health endpoints, and automated retrain cron schedules.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save className="h-3.5 w-3.5 mr-1.5" /> Save All Configurations
          </Button>
        </div>

        {saved && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center gap-2 font-medium shadow-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" /> All FastAPI deployment and automated retrain parameters saved successfully.
          </div>
        )}

        {/* FastAPI Deployment Service-Level Config */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-800" />
              <h3 className="font-editorial text-base font-bold text-stone-900">
                FastAPI Uvicorn Inference Microservice Settings
              </h3>
            </div>
            <Badge variant="emerald">HEALTHY • 4 WORKERS</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block font-sans">Uvicorn Worker Count</label>
              <input
                type="number"
                value={fastApiConfig.workers}
                onChange={(e) => setFastApiConfig({ ...fastApiConfig, workers: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block font-sans">Max Concurrent Connections</label>
              <input
                type="number"
                value={fastApiConfig.maxConcurrency}
                onChange={(e) => setFastApiConfig({ ...fastApiConfig, maxConcurrency: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block font-sans">Execution Timeout (Seconds)</label>
              <input
                type="number"
                value={fastApiConfig.timeoutSeconds}
                onChange={(e) => setFastApiConfig({ ...fastApiConfig, timeoutSeconds: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block font-sans">Model Redis Cache TTL (Seconds)</label>
              <input
                type="number"
                value={fastApiConfig.cacheTtlSeconds}
                onChange={(e) => setFastApiConfig({ ...fastApiConfig, cacheTtlSeconds: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block font-sans">Health Check Path</label>
              <input
                type="text"
                value={fastApiConfig.healthEndpoint}
                onChange={(e) => setFastApiConfig({ ...fastApiConfig, healthEndpoint: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block font-sans">Log Verbosity Level</label>
              <select
                value={fastApiConfig.logLevel}
                onChange={(e) => setFastApiConfig({ ...fastApiConfig, logLevel: e.target.value as any })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              >
                <option value="INFO">INFO</option>
                <option value="DEBUG">DEBUG</option>
                <option value="WARN">WARN</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Automated Retrain Scheduling Settings */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-800" />
              <h3 className="font-editorial text-base font-bold text-stone-900">
                Automated Retrain Schedule & Webhook Triggers
              </h3>
            </div>
            <Badge variant="amber">CRON ACTIVE</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block font-sans">Cron Schedule Expression</label>
              <input
                type="text"
                value={retrainSchedule.cronSchedule}
                onChange={(e) => setRetrainSchedule({ ...retrainSchedule, cronSchedule: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
              <span className="text-[10px] text-stone-400 font-sans block">Default: `0 2 * * 0` (Every Sunday at 02:00 AM)</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block font-sans">Drift PSI Trigger Cutoff</label>
              <input
                type="number"
                step="0.01"
                value={retrainSchedule.driftThresholdPsi}
                onChange={(e) => setRetrainSchedule({ ...retrainSchedule, driftThresholdPsi: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
              <span className="text-[10px] text-stone-400 font-sans block">Triggers automatic retrain if PSI exceeds cutoff.</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block font-sans">Pending Escalations Count Trigger</label>
              <input
                type="number"
                value={retrainSchedule.escalationCountTrigger}
                onChange={(e) => setRetrainSchedule({ ...retrainSchedule, escalationCountTrigger: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block font-sans">Retrain Completion Webhook URL</label>
              <input
                type="text"
                value={retrainSchedule.webhookUrl}
                onChange={(e) => setRetrainSchedule({ ...retrainSchedule, webhookUrl: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
