'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { Clock, ShieldAlert, Plus, CheckCircle2, UserCheck, X } from 'lucide-react';
import { TenantPrivacyEnforcementPanel } from '@/components/shared/ConsistencyPatterns';

interface AccessGrant {
  id: string;
  grantee: string;
  roleGranted: string;
  reason: string;
  expiresInSeconds: number;
  approvedBy: string;
  status: 'active' | 'revoked';
}

export default function AdminAccessGrantsPage() {
  const [grants, setGrants] = useState<AccessGrant[]>([
    {
      id: 'grant_771',
      grantee: 'Kenji Takahashi (MLOps)',
      roleGranted: 'Platform Admin (Temporary Emergency)',
      reason: 'Urgent hotfix for Groq LLM latency spike and circuit breaker recalibration.',
      expiresInSeconds: 13338, // ~3h 42m
      approvedBy: 'Amara Okafor',
      status: 'active',
    },
    {
      id: 'grant_770',
      grantee: 'Claire Beauchamp (Audit)',
      roleGranted: 'Full Telemetry Exporter',
      reason: 'ISO 50001 quarterly compliance raw data pull.',
      expiresInSeconds: 1800, // 30 mins
      approvedBy: 'Amara Okafor',
      status: 'active',
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [grantToRevoke, setGrantToRevoke] = useState<AccessGrant | null>(null);
  const [granteeInput, setGranteeInput] = useState('');
  const [roleInput, setRoleInput] = useState('Platform Admin (Temporary Emergency)');
  const [reasonInput, setReasonInput] = useState('');
  const [durationMins, setDurationMins] = useState(60);

  // Countdown timer hook
  useEffect(() => {
    const timer = setInterval(() => {
      setGrants((prev) =>
        prev.map((g) =>
          g.status === 'active' && g.expiresInSeconds > 0
            ? { ...g, expiresInSeconds: g.expiresInSeconds - 1 }
            : g
        )
      );
    }, 1000);
    return () => clearInterval(timer);
  });

  const formatCountdown = (secs: number) => {
    if (secs <= 0) return 'EXPIRED';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const handleRevoke = (id: string) => {
    setGrants((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: 'revoked', expiresInSeconds: 0 } : g))
    );
  };

  const handleExtend = (id: string) => {
    setGrants((prev) =>
      prev.map((g) => (g.id === id ? { ...g, expiresInSeconds: g.expiresInSeconds + 3600 } : g))
    );
  };

  const handleIssueGrant = () => {
    if (granteeInput.trim() && reasonInput.trim()) {
      const newG: AccessGrant = {
        id: `grant_${Date.now().toString().slice(-4)}`,
        grantee: granteeInput.trim(),
        roleGranted: roleInput,
        reason: reasonInput.trim(),
        expiresInSeconds: durationMins * 60,
        approvedBy: 'Amara Okafor (Platform Admin)',
        status: 'active',
      };
      setGrants([newG, ...grants]);
      setGranteeInput('');
      setReasonInput('');
      setModalOpen(false);
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
              <Clock className="h-5 w-5 text-amber-700" />
              <Badge variant="amber">Just-In-Time Elevation</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Time-Boxed Emergency Access Grant Issuer
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Issue and manage temporary privilege escalations with real-time countdown timers and automatic revocation.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Issue Temporary Grant
          </Button>
        </div>

        {/* Issue Grant Modal */}
        {modalOpen && (
          <Card className="p-5 bg-white border-amber-300 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-700" />
                <h3 className="font-editorial text-base font-bold text-stone-900">
                  Issue Time-Boxed Privilege Elevation
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Grantee User & Email</label>
                <input
                  type="text"
                  placeholder="e.g. User Name (user@verdantiq.org)"
                  value={granteeInput}
                  onChange={(e) => setGranteeInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Elevation Role Scope</label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <option value="Platform Admin (Temporary Emergency)">Platform Admin (Temporary Emergency)</option>
                  <option value="Full Telemetry Exporter">Full Telemetry Exporter</option>
                  <option value="Database Root Operator">Database Root Operator</option>
                  <option value="MLOps Retrain Master">MLOps Retrain Master</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Time-Box Duration</label>
                <select
                  value={durationMins}
                  onChange={(e) => setDurationMins(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>1 Hour</option>
                  <option value={240}>4 Hours</option>
                  <option value={480}>8 Hours (Shift Max)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Emergency Justification / Incident ID</label>
                <input
                  type="text"
                  placeholder="e.g. INC-8820: Critical database migration debugging"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleIssueGrant}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Issue Temporary Grant
              </Button>
            </div>
          </Card>
        )}

        {/* Grants Cards */}
        <div className="space-y-4">
          {grants.map((grant) => (
            <Card key={grant.id} className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold">
                    <ShieldAlert className="h-4 w-4 text-amber-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-stone-900">{grant.grantee}</h3>
                    <p className="text-[11px] text-amber-900 font-mono font-semibold">
                      Role Granted: {grant.roleGranted}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-stone-900 text-emerald-400 font-mono font-bold text-xs rounded-xl border border-stone-700 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 animate-spin" />
                    <span>{formatCountdown(grant.expiresInSeconds)}</span>
                  </div>
                  <Badge variant={grant.status === 'active' ? 'amber' : 'stone'}>
                    {grant.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Justification / Incident ID
                </span>
                <p className="text-stone-800 font-medium">{grant.reason}</p>
                <span className="text-[10px] text-stone-500 font-mono block pt-1">
                  Approved By: {grant.approvedBy}
                </span>
              </div>

              {grant.status === 'active' && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => handleExtend(grant.id)} className="text-xs">
                    +1 Hour Extension
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setGrantToRevoke(grant)} className="text-rose-700 border-rose-200 hover:bg-rose-50 text-xs">
                    Immediate Revoke
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Confirmation Dialog for Immediate Revoke */}
        <ConfirmationDialog
          isOpen={Boolean(grantToRevoke)}
          onClose={() => setGrantToRevoke(null)}
          onConfirm={() => {
            if (grantToRevoke) {
              handleRevoke(grantToRevoke.id);
              setGrantToRevoke(null);
            }
          }}
          title="Revoke Emergency Access Grant?"
          description={
            grantToRevoke ? (
              <div className="space-y-1.5">
                <p>
                  You are about to immediately terminate temporary privilege elevation for{' '}
                  <strong className="text-rose-950 dark:text-rose-100 font-bold">{grantToRevoke.grantee}</strong>.
                </p>
                <div className="p-2 bg-rose-100/60 dark:bg-rose-950/60 rounded-xl font-mono text-[11px] text-rose-900 dark:text-rose-200">
                  Role: {grantToRevoke.roleGranted}
                </div>
                <p className="text-[11px] opacity-80">
                  This user will immediately lose access to elevated platform permissions and active tokens will be invalidated.
                </p>
              </div>
            ) : ''
          }
          confirmText="Revoke Access"
          cancelText="Keep Active"
          variant="danger"
          requireTypedConfirmation="REVOKE"
        />

        {/* Tenant Privacy Enforcement Panel */}
        <TenantPrivacyEnforcementPanel />
      </div>
    </AppShell>
  );
}
