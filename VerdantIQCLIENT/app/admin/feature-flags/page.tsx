'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { Sliders, CheckCircle2, ToggleLeft, ToggleRight, Plus, X } from 'lucide-react';

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetRoles: string[];
}

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([
    {
      id: 'ff_1',
      name: 'MILP Optimization Solver v2',
      key: 'enable_milp_solver_v2',
      description: 'Enables high-performance multi-objective integer solver for campus HVAC dispatching.',
      enabled: true,
      rolloutPercentage: 100,
      targetRoles: ['dept', 'institution', 'mlops'],
    },
    {
      id: 'ff_2',
      name: 'Groq Ultra-Fast Fallback Mode',
      key: 'groq_fallback_mode',
      description: 'Automatic failover from Groq LPU to Gemini 3.5 Flash on latency spikes exceeding 300ms.',
      enabled: true,
      rolloutPercentage: 80,
      targetRoles: ['user', 'student', 'admin'],
    },
    {
      id: 'ff_3',
      name: 'Student Dorm Digital Twin v3',
      key: 'student_dorm_twin_v3',
      description: '3D interactive dorm room thermal model & real-time smartplug control canvas.',
      enabled: false,
      rolloutPercentage: 25,
      targetRoles: ['student'],
    },
    {
      id: 'ff_4',
      name: 'Geofenced Campus Attendance Enforcement',
      key: 'geofence_enforcement_strict',
      description: 'Strict GPS bounding-box verification for eco-challenge checkins.',
      enabled: true,
      rolloutPercentage: 50,
      targetRoles: ['student', 'institution'],
    },
  ]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [flagToDisable, setFlagToDisable] = useState<FeatureFlag | null>(null);
  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const toggleFlag = (id: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const handleToggleClick = (flag: FeatureFlag) => {
    if (flag.enabled) {
      // Prompt confirmation before disabling active feature
      setFlagToDisable(flag);
    } else {
      toggleFlag(flag.id);
    }
  };

  const updateRollout = (id: string, val: number) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, rolloutPercentage: val } : f))
    );
  };

  const handleCreateFlag = () => {
    if (newName.trim() && newKey.trim()) {
      const newF: FeatureFlag = {
        id: `ff_${Date.now()}`,
        name: newName,
        key: newKey.toLowerCase().replace(/\s+/g, '_'),
        description: newDesc || 'Custom feature flag created by admin.',
        enabled: true,
        rolloutPercentage: 10,
        targetRoles: ['admin', 'mlops'],
      };
      setFlags([newF, ...flags]);
      setNewName('');
      setNewKey('');
      setNewDesc('');
      setCreateModalOpen(false);
    }
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">Platform Config</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Global Feature Flags & Staged Rollouts
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Dynamically toggle platform features, control audience rollouts, and configure role overrides.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Feature Flag
          </Button>
        </div>

        {/* Create Modal */}
        {createModalOpen && (
          <Card className="p-5 bg-white border-emerald-300 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-editorial text-base font-bold text-stone-900">
                Register New Feature Flag
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Flag Label / Name</label>
                <input
                  type="text"
                  placeholder="e.g. Real-Time WebSocket Telemetry"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Config Key Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. enable_ws_telemetry"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the target behavior and scope..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateFlag}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Save & Enable Flag
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {flags.map((flag) => (
            <Card key={flag.id} className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-stone-900">{flag.name}</h3>
                    <code className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {flag.key}
                    </code>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">{flag.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={flag.enabled ? 'emerald' : 'stone'}>
                    {flag.enabled ? 'ENABLED' : 'DISABLED'}
                  </Badge>
                  <button
                    onClick={() => handleToggleClick(flag)}
                    className="cursor-pointer text-emerald-900 hover:text-emerald-950 transition-colors"
                    title={flag.enabled ? 'Disable Feature Flag' : 'Enable Feature Flag'}
                  >
                    {flag.enabled ? (
                      <ToggleRight className="h-8 w-8 text-[#064E3B]" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-stone-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex justify-between font-semibold text-stone-700">
                    <span>Target Audience Rollout</span>
                    <span className="font-mono text-emerald-800">{flag.rolloutPercentage}% Users</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={flag.rolloutPercentage}
                    onChange={(e) => updateRollout(flag.id, parseInt(e.target.value))}
                    disabled={!flag.enabled}
                    className="w-full accent-emerald-800 cursor-pointer disabled:opacity-40"
                  />
                  <span className="text-[10px] text-stone-400 font-mono block">
                    Gradual traffic exposure threshold
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    Target Role Permissions
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {flag.targetRoles.map((r) => (
                      <Badge key={r} variant="stone">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Confirmation Dialog for Disabling Active Feature Flag */}
        <ConfirmationDialog
          isOpen={Boolean(flagToDisable)}
          onClose={() => setFlagToDisable(null)}
          onConfirm={() => {
            if (flagToDisable) {
              toggleFlag(flagToDisable.id);
              setFlagToDisable(null);
            }
          }}
          title="Disable Active Feature Flag?"
          description={
            flagToDisable ? (
              <div className="space-y-2">
                <p>
                  You are about to turn off feature flag{' '}
                  <strong className="text-amber-950 dark:text-amber-100 font-bold">&quot;{flagToDisable.name}&quot;</strong> (
                  <code className="font-mono">{flagToDisable.key}</code>) in production.
                </p>
                <p className="text-[11px] opacity-80">
                  This will immediately disable functionality for {flagToDisable.rolloutPercentage}% of active users assigned to roles: {flagToDisable.targetRoles.join(', ')}.
                </p>
              </div>
            ) : ''
          }
          confirmText="Disable Feature"
          cancelText="Keep Enabled"
          variant="warning"
        />
      </div>
    </AppShell>
  );
}
