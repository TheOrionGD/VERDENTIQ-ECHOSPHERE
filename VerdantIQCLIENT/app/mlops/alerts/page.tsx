// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnomalyFlagExplanation } from '@/components/shared/ConsistencyPatterns';
import { AlertHotspotsWidget } from '@/components/mlops/AlertHotspotsWidget';
import { AlertRule } from '@/lib/services/mlopsService';
import {
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Activity,
  Zap,
  Plus,
  SlidersHorizontal,
  BellRing,
  Trash2,
  Cpu,
} from 'lucide-react';

export default function MlopsAlertsPage() {
  const [retrainState, setRetrainState] = useState(false);
  const [anomalyThreshold, setAnomalyThreshold] = useState<number>(0.85);
  const [ifScoreFilter, setIfScoreFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [rules, setRules] = useState<AlertRule[]>(([] as any));
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRule, setNewRule] = useState({
    modelName: 'verdantiq-hvac-opt',
    metric: 'RMSE' as const,
    operator: '>' as const,
    threshold: 0.05,
    duration: '15m',
    channel: 'Slack' as const,
  });

  const handleRetrain = () => {
    setRetrainState(true);
    setTimeout(() => {
      setRetrainState(false);
      alert('Model retrain pipeline triggered! Data pipeline pulling 30-day feature window.');
    }, 2000);
  };

  const handleToggleRule = (id: string) => {
    ([] as any);
    setRules([...([] as any)]);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    ([] as any);
    setRules([...([] as any)]);
    setShowAddModal(false);
  };

  // Recalculate Precision vs Recall based on Anomaly Threshold Slider
  const calculatedPrecision = Math.min(99, Math.round(75 + anomalyThreshold * 24));
  const calculatedRecall = Math.max(60, Math.round(99 - (anomalyThreshold - 0.5) * 60));
  const estimatedAlertsPerDay = Math.round(18 * (1 - anomalyThreshold * 0.7));

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
              <Badge variant="amber">Model Monitoring Telemetry</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Drift Monitoring & Anomaly Alert Builder Console
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Tune anomaly detection threshold sliders, configure custom performance alerts, and triage active feature drift incidents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Alert Rule
            </Button>

            <Button variant="primary" size="sm" onClick={handleRetrain} disabled={retrainState}>
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${retrainState ? 'animate-spin' : ''}`} />
              {retrainState ? 'Triggering Retrain Pipeline...' : 'Trigger Immediate Model Retrain'}
            </Button>
          </div>
        </div>

        {/* Drift Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <Card className="p-4 bg-white/95 border-stone-200 space-y-2">
            <span className="text-[10px] text-stone-400 block font-sans uppercase font-semibold">KS-Test Drift Score (Temperature Feature)</span>
            <span className="text-xl font-bold text-amber-800">p = 0.0142</span>
            <span className="text-[10px] text-stone-500 font-sans block">Statistically significant distribution shift detected.</span>
          </Card>
          <Card className="p-4 bg-white/95 border-stone-200 space-y-2">
            <span className="text-[10px] text-stone-400 block font-sans uppercase font-semibold">Population Stability Index (PSI)</span>
            <span className="text-xl font-bold text-emerald-800">PSI = 0.082</span>
            <span className="text-[10px] text-stone-500 font-sans block">Below 0.10 threshold (Minor distribution drift).</span>
          </Card>
        </div>

        {/* Spatial Alert Hotspots Heatmap Matrix */}
        <AlertHotspotsWidget />

        {/* Anomaly Threshold Tuning with Tradeoff Slider */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-editorial text-base font-bold text-stone-900">
                Isolation Forest Anomaly Cutoff Slider (Precision vs Recall)
              </h3>
              <p className="text-[11px] text-stone-500">
                Adjust sensitivity cutoff to balance false positive alerts against missed thermal load anomalies.
              </p>
            </div>
            <Badge variant="emerald">Cutoff Score = {anomalyThreshold}</Badge>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex justify-between font-mono text-xs font-bold text-stone-800">
              <span>0.50 (High Recall / More Alerts)</span>
              <span className="text-emerald-800 text-sm font-bold">Cutoff Threshold: {anomalyThreshold}</span>
              <span>0.99 (High Precision / Fewer Alerts)</span>
            </div>
            <input
              type="range"
              min="0.50"
              max="0.99"
              step="0.01"
              value={anomalyThreshold}
              onChange={(e) => setAnomalyThreshold(parseFloat(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />

            <div className="grid grid-cols-3 gap-3 pt-2 text-center font-mono text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">Precision Score</span>
                <span className="font-bold text-emerald-800">{calculatedPrecision}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">Recall Score</span>
                <span className="font-bold text-amber-800">{calculatedRecall}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-sans">Estimated Alerts / Day</span>
                <span className="font-bold text-stone-900">{estimatedAlertsPerDay} alerts/day</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Custom Model Performance Alert Rules List */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-editorial text-base font-bold text-stone-900">
                Configured Model Alert Trigger Rules
              </h3>
              <p className="text-[11px] text-stone-500">
                Automated webhook and messaging alerts fired when telemetry breaches performance guardrails.
              </p>
            </div>
            <Badge variant="emerald">{rules.filter((r) => r.enabled).length} Rules Active</Badge>
          </div>

          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-3">Metric</th>
                  <th className="py-2.5 px-3">Condition</th>
                  <th className="py-2.5 px-3">Window</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-stone-50">
                    <td className="py-3 px-3 font-bold text-stone-900">{rule.modelName}</td>
                    <td className="py-3 px-3">{rule.metric}</td>
                    <td className="py-3 px-3 font-bold text-rose-800 bg-rose-50/50 rounded-md">
                      {rule.operator} {rule.threshold}
                    </td>
                    <td className="py-3 px-3">{rule.duration}</td>
                    <td className="py-3 px-3">{rule.channel}</td>
                    <td className="py-3 px-3">
                      <Badge variant={rule.enabled ? 'emerald' : 'stone'}>
                        {rule.enabled ? 'ACTIVE' : 'MUTED'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleRule(rule.id)}
                        className="text-[11px] h-7"
                      >
                        {rule.enabled ? 'Mute' : 'Enable'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Anomaly Explanations */}
        <div className="space-y-3">
          <div className="alert-list-header flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-stone-200/90 rounded-xl shadow-xs">
            <h3 className="font-editorial text-base font-bold text-stone-900">
              Active Anomaly Triage Incidents
            </h3>

            {/* IsolationForest Confidence Score Dropdown Filter */}
            <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/90 font-mono text-xs">
              <Cpu className="h-3.5 w-3.5 text-emerald-800" />
              <span className="text-stone-500 font-sans font-semibold text-[11px]">IsolationForest Confidence:</span>
              <select
                value={ifScoreFilter}
                onChange={(e) => setIfScoreFilter(e.target.value as any)}
                className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">All Confidence Scores</option>
                <option value="high">High (&gt; 0.90 / High Priority)</option>
                <option value="mid">Moderate (0.70 - 0.90)</option>
                <option value="low">Low (&lt; 0.70)</option>
              </select>
            </div>
          </div>

          {(ifScoreFilter === 'all' || ifScoreFilter === 'high') && (
            <AnomalyFlagExplanation
              title="Building B Sensor #4 Temperature Drift"
              detectedAt="2026-08-01 07:42:10"
              rootCausePrediction="Refrigerant pressure degradation or sensor calibration slip"
              sensorConfidence={92}
              impactScore="+$48/day energy inefficiency"
              severity="high"
            />
          )}

          {(ifScoreFilter === 'all' || ifScoreFilter === 'mid') && (
            <AnomalyFlagExplanation
              title="Dormitory Block C Sudden Thermal Load Spike"
              detectedAt="2026-08-01 06:15:00"
              rootCausePrediction="Unscheduled student occupancy event or open window heat loss"
              sensorConfidence={88}
              impactScore="+14% carbon budget drawdown"
              severity="medium"
            />
          )}
        </div>

        {/* Create Rule Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <Card className="p-5 max-w-md w-full bg-white space-y-4 shadow-xl">
              <h3 className="font-editorial text-lg font-bold text-stone-900">Create Model Alert Rule</h3>

              <form onSubmit={handleAddRule} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Target Model</label>
                  <select
                    value={newRule.modelName}
                    onChange={(e) => setNewRule({ ...newRule, modelName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="verdantiq-hvac-opt">verdantiq-hvac-opt</option>
                    <option value="verdantiq-thermal-forecaster">verdantiq-thermal-forecaster</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Metric</label>
                    <select
                      value={newRule.metric}
                      onChange={(e) => setNewRule({ ...newRule, metric: e.target.value as any })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      <option value="RMSE">RMSE Error</option>
                      <option value="Latency P99">Latency P99</option>
                      <option value="Drift PSI">Drift PSI</option>
                      <option value="Error Rate">Error Rate</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Threshold</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newRule.threshold}
                      onChange={(e) => setNewRule({ ...newRule, threshold: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Time Window</label>
                    <input
                      type="text"
                      value={newRule.duration}
                      onChange={(e) => setNewRule({ ...newRule, duration: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Notification Channel</label>
                    <select
                      value={newRule.channel}
                      onChange={(e) => setNewRule({ ...newRule, channel: e.target.value as any })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      <option value="Slack">Slack #mlops-alerts</option>
                      <option value="Email">Email Admin</option>
                      <option value="PagerDuty">PagerDuty Critical</option>
                      <option value="Webhook">Webhook Endpoint</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Alert Rule
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
