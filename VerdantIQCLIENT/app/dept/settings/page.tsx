// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { TriggerSettings } from '@/lib/services/deptService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Settings, MapPin, Sliders, Clock, ShieldAlert, CheckCircle2, Save, Zap, AlertTriangle, ArrowUpRight, Play } from 'lucide-react';

export default function DeptSettingsPage() {
  const [lat, setLat] = useState('37.7749');
  const [lng, setLng] = useState('-122.4194');
  const [radiusMeters, setRadiusMeters] = useState('50');
  const [isolationThreshold, setIsolationThreshold] = useState('0.50');
  const [fastTrackThreshold, setFastTrackThreshold] = useState('0.25');
  const [slaHours, setSlaHours] = useState('24');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Trigger settings state
  const [triggerSettings, setTriggerSettings] = useState<TriggerSettings>(() => {
    const loaded = ([] as any);
    return loaded || {
      autoEscalateEnabled: true,
      slaWindowThresholdPercent: 50,
      lowConfidenceScoreThreshold: 0.50,
      targetAdminRole: 'Institution Admin Security & Compliance Board',
      escalationPriority: 'HIGH',
      notifyInstitutionAdminOnTrigger: true,
      lastAutoTriggerRunTime: '2026-08-01 10:30:00',
      autoEscalatedCountTotal: 2,
    };
  });

  const [triggerRunResult, setTriggerRunResult] = useState<{ count: number; message: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    ([] as any);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestTriggerRun = () => {
    // Ensure current settings saved first
    ([] as any);
    const result = ([] as any);
    setTriggerRunResult({
      count: result.count,
      message: result.count > 0
        ? `Trigger active! Escalated ${result.count} low-confidence submission(s) exceeding ${triggerSettings.slaWindowThresholdPercent}% SLA window directly to Institution Admin.`
        : `Trigger check complete. No pending low-confidence items currently exceed the ${triggerSettings.slaWindowThresholdPercent}% SLA threshold.`,
    });
    setTriggerSettings(([] as any));
    setTimeout(() => setTriggerRunResult(null), 5000);
  };

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        <RoleSubNav />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Department Configuration</Badge>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 font-editorial">
              Department Moderation, Geofence & Automated Triggers
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Configure geofence centroid coordinates, IsolationForest anomaly thresholds, and automated SLA breach escalation rules.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
          {/* Automated Triggers Section */}
          <Card className="p-6 bg-amber-50/40 border-amber-300 shadow-xs space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Zap className="h-28 w-28 text-amber-700" />
            </div>

            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-700 border border-amber-300">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900 font-editorial">
                      Automated Triggers: Low-Confidence 50% SLA Escalation
                    </h3>
                    <Badge variant="amber">SYSTEM TRIGGER</Badge>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Automatically escalate low-confidence verification queue items to the Institution Admin if unaddressed beyond 50% of the SLA window.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={triggerSettings.autoEscalateEnabled}
                    onChange={(e) =>
                      setTriggerSettings({ ...triggerSettings, autoEscalateEnabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
                </label>
                <span className="text-xs font-mono font-bold text-stone-700">
                  {triggerSettings.autoEscalateEnabled ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono relative z-10">
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5">
                <label className="block text-stone-800 font-bold">
                  SLA Window Escalation Threshold (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={10}
                    max={90}
                    value={triggerSettings.slaWindowThresholdPercent}
                    onChange={(e) =>
                      setTriggerSettings({
                        ...triggerSettings,
                        slaWindowThresholdPercent: Number(e.target.value),
                      })
                    }
                    className="w-24 bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-bold text-stone-900"
                  />
                  <span className="text-[11px] text-stone-500 font-sans">
                    Trigger fires when item is in queue &gt;<strong>{triggerSettings.slaWindowThresholdPercent}%</strong> of SLA time window (2h out of 4h).
                  </span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5">
                <label className="block text-stone-800 font-bold">
                  Low-Confidence Anomaly Cutoff (0.0 - 1.0)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step={0.05}
                    min={0.1}
                    max={0.95}
                    value={triggerSettings.lowConfidenceScoreThreshold}
                    onChange={(e) =>
                      setTriggerSettings({
                        ...triggerSettings,
                        lowConfidenceScoreThreshold: Number(e.target.value),
                      })
                    }
                    className="w-24 bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-bold text-stone-900"
                  />
                  <span className="text-[11px] text-stone-500 font-sans">
                    Flag items with IsolationForest score &ge;<strong>{triggerSettings.lowConfidenceScoreThreshold}</strong> as low-confidence.
                  </span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5">
                <label className="block text-stone-800 font-bold">Target Institution Admin Body</label>
                <input
                  type="text"
                  value={triggerSettings.targetAdminRole}
                  onChange={(e) =>
                    setTriggerSettings({ ...triggerSettings, targetAdminRole: e.target.value })
                  }
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 font-sans"
                />
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5">
                <label className="block text-stone-800 font-bold">Escalation Priority & Alert</label>
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={triggerSettings.escalationPriority}
                    onChange={(e) =>
                      setTriggerSettings({
                        ...triggerSettings,
                        escalationPriority: e.target.value as 'HIGH' | 'CRITICAL',
                      })
                    }
                    className="bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-bold text-stone-900"
                  >
                    <option value="HIGH">HIGH Priority</option>
                    <option value="CRITICAL">CRITICAL Priority</option>
                  </select>

                  <div className="text-[10px] text-stone-500 font-sans text-right">
                    Total Auto-Escalated to Date: <strong className="text-amber-800 font-mono text-xs">{triggerSettings.autoEscalatedCountTotal}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Run Trigger Controller */}
            <div className="pt-2 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div className="text-[11px] font-mono text-stone-500">
                Last Trigger Engine Run: <strong>{triggerSettings.lastAutoTriggerRunTime || 'Never'}</strong>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestTriggerRun}
                className="border-amber-600 text-amber-900 hover:bg-amber-100 text-xs font-bold gap-1.5"
              >
                <Play className="h-3.5 w-3.5 text-amber-600 fill-amber-600" />
                <span>Test & Run Trigger Engine Now</span>
              </Button>
            </div>

            {triggerRunResult && (
              <div
                className={`p-3.5 rounded-xl text-xs font-bold border flex items-center gap-2 relative z-10 ${
                  triggerRunResult.count > 0
                    ? 'bg-amber-100 text-amber-950 border-amber-400'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                }`}
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>{triggerRunResult.message}</span>
              </div>
            )}
          </Card>

          {/* Geofence Configuration */}
          <Card className="p-6 bg-white border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <MapPin className="h-5 w-5 text-coral-600" />
              <div>
                <h3 className="text-base font-bold text-stone-900 font-editorial">
                  Department Geofence Boundary Polygon
                </h3>
                <p className="text-xs text-stone-500">
                  Submissions outside this centroid radius will be flagged as `REASON_GEO_OUT_OF_BOUNDS`.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Centroid Latitude (°N)</label>
                <input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Centroid Longitude (°W)</label>
                <input
                  type="text"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Allowed Radius (Meters)</label>
                <input
                  type="text"
                  value={radiusMeters}
                  onChange={(e) => setRadiusMeters(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                />
              </div>
            </div>
          </Card>

          {/* Anomaly Thresholds */}
          <Card className="p-6 bg-white border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Sliders className="h-5 w-5 text-amber-600" />
              <div>
                <h3 className="text-base font-bold text-stone-900 font-editorial">
                  IsolationForest Anomaly Thresholds
                </h3>
                <p className="text-xs text-stone-500">
                  Control which submissions land in the Borderline Review Queue or Fast-Track bulk approval tool.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Borderline Queue Threshold (0.0 - 1.0)
                </label>
                <input
                  type="text"
                  value={isolationThreshold}
                  onChange={(e) => setIsolationThreshold(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                />
                <p className="text-[10px] text-stone-400 mt-1">Items above this score require manual moderator review.</p>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Fast-Track Bulk Approve Limit (0.0 - 1.0)
                </label>
                <input
                  type="text"
                  value={fastTrackThreshold}
                  onChange={(e) => setFastTrackThreshold(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                />
                <p className="text-[10px] text-stone-400 mt-1">Items below this score are eligible for 1-click bulk approval.</p>
              </div>
            </div>
          </Card>

          {/* SLA Settings */}
          <Card className="p-6 bg-white border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Clock className="h-5 w-5 text-emerald-800" />
              <div>
                <h3 className="text-base font-bold text-stone-900 font-editorial">
                  Review SLA Target
                </h3>
                <p className="text-xs text-stone-500">
                  Set target time window for resolving incoming borderline submissions.
                </p>
              </div>
            </div>

            <div className="max-w-xs text-xs font-mono">
              <label className="block text-stone-700 font-bold mb-1">SLA Limit (Hours)</label>
              <input
                type="text"
                value={slaHours}
                onChange={(e) => setSlaHours(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
              />
            </div>
          </Card>

          {savedSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              Department Settings & Automated Trigger Rules saved successfully!
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="sm"
              type="submit"
              className="bg-[#064E3B] text-white hover:bg-emerald-900 text-xs font-bold gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

