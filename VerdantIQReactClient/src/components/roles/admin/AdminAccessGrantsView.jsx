import React, { useState, useEffect } from 'react';
import { Clock, Plus } from 'lucide-react';

export function AdminAccessGrantsView() {
  const [grants, setGrants] = useState([
    {
      id: 'grant_771',
      grantee: 'Kenji Takahashi (MLOps Engineer)',
      roleGranted: 'Platform Admin (Temporary Incident Break-Glass)',
      reason: 'Urgent hotfix for Groq inference failover & circuit breaker calibration.',
      expiresInSeconds: 13320,
      approvedBy: 'Amara Okafor (Platform Governance)',
      status: 'active',
    },
    {
      id: 'grant_770',
      grantee: 'Claire Beauchamp (Senior Auditor)',
      roleGranted: 'Cross-Tenant Read-Only Exporter',
      reason: 'Annual ESG institutional audit and GHG verification dataset dump.',
      expiresInSeconds: 3600,
      approvedBy: 'Amara Okafor (Platform Governance)',
      status: 'active',
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [granteeInput, setGranteeInput] = useState('');
  const [roleInput, setRoleInput] = useState('Platform Admin (Temporary Incident Break-Glass)');
  const [reasonInput, setReasonInput] = useState('');
  const [durationMins, setDurationMins] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setGrants(prev =>
        prev.map(g =>
          g.status === 'active' && g.expiresInSeconds > 0
            ? { ...g, expiresInSeconds: g.expiresInSeconds - 1 }
            : g
        )
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}h ${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleRevoke = (id) => {
    setGrants(prev =>
      prev.map(g => (g.id === id ? { ...g, status: 'revoked', expiresInSeconds: 0 } : g))
    );
  };

  const handleCreateGrant = (e) => {
    e.preventDefault();
    if (!granteeInput || !reasonInput) return;

    const newGrant = {
      id: `grant_${Date.now().toString(36)}`,
      grantee: granteeInput,
      roleGranted: roleInput,
      reason: reasonInput,
      expiresInSeconds: Number(durationMins) * 60,
      approvedBy: 'Current Platform Administrator',
      status: 'active',
    };

    setGrants(prev => [newGrant, ...prev]);
    setGranteeInput('');
    setReasonInput('');
    setModalOpen(false);
  };

  return (
    <div className="fluent-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Time-Bounded Elevated Access Grants (Break-Glass Console)</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Emergency administrative privileges automatically expire via cryptographically sealed timers.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Issue Temporary Grant</span>
        </button>
      </div>

      <div className="space-y-3">
        {grants.map(grant => (
          <div key={grant.id} className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-white">{grant.grantee}</span>
                <span className="text-neutral-500 font-mono ml-2">({grant.id})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                  grant.status === 'active' && grant.expiresInSeconds > 0
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {grant.status === 'active' && grant.expiresInSeconds > 0 ? 'Active Grant' : 'Revoked / Expired'}
                </span>
                {grant.status === 'active' && (
                  <button
                    onClick={() => handleRevoke(grant.id)}
                    className="text-red-400 hover:text-red-300 text-[11px] underline cursor-pointer"
                  >
                    Revoke Now
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded">
              <div>
                <span className="text-neutral-500">Privilege: </span>
                <span className="text-emerald-400 font-medium">{grant.roleGranted}</span>
              </div>
              <div>
                <span className="text-neutral-500">Time Remaining: </span>
                <span className="font-mono text-white font-bold">{formatTime(grant.expiresInSeconds)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-500">Justification: </span>
                <span className="text-neutral-300">{grant.reason}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="fluent-mica p-6 rounded-xl max-w-md w-full shadow-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-semibold text-white">Issue Elevated Access Grant</h3>
            <form onSubmit={handleCreateGrant} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1">Grantee Name & Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Elena Ramos (Operations Lead)"
                  value={granteeInput}
                  onChange={(e) => setGranteeInput(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Privilege Tier</label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                >
                  <option>Platform Admin (Temporary Incident Break-Glass)</option>
                  <option>Cross-Tenant Read-Only Exporter</option>
                  <option>MLOps Emergency Pipeline Access</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={durationMins}
                  onChange={(e) => setDurationMins(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Mandatory Justification / Ticket #</label>
                <textarea
                  rows="2"
                  placeholder="e.g. INC-4091: Immediate remediation of database replication lag"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Grant Privilege
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
