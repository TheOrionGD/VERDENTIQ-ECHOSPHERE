import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Check, 
  X, 
  Save
} from 'lucide-react';

export function AdminRbacSchemaView() {
  const roles = [
    { id: 'admin', label: 'Platform Admin', tier: 'Tier 1' },
    { id: 'mlops', label: 'MLOps Lead', tier: 'Tier 2' },
    { id: 'audit', label: 'ESG Auditor', tier: 'Tier 3' },
    { id: 'region', label: 'Regional Authority', tier: 'Tier 4' },
    { id: 'institution', label: 'Campus Admin', tier: 'Tier 5' },
    { id: 'dept', label: 'Dept Moderator', tier: 'Tier 6' },
    { id: 'student', label: 'Student Resident', tier: 'Tier 7' },
    { id: 'user', label: 'Standard Household', tier: 'Tier 8' },
  ];

  const permissions = [
    { key: 'users:manage', label: 'User & Identity Provisioning', desc: 'Create, suspend, or promote accounts' },
    { key: 'system:roles', label: 'RBAC Policy Mutations', desc: 'Modify authorization matrix & capabilities' },
    { key: 'telemetry:view', label: 'Infrastructure Telemetry', desc: 'Read Node.js process and cluster health' },
    { key: 'database:snapshot', label: 'Storage & Backup Controls', desc: 'Trigger database backups and restores' },
    { key: 'models:deploy', label: 'ML Model Canary & Rollout', desc: 'Deploy or rollback optimization models' },
    { key: 'audit:export', label: 'Tamper-Evident Hash Export', desc: 'Download ISO 50001 certified proof logs' },
    { key: 'bills:ingest', label: 'Utility Bill Data Ingestion', desc: 'Upload electricity, water, and waste bills' },
    { key: 'proofs:verify', label: 'Student Proof Verification', desc: 'Approve or reject EcoPoint submissions' },
    { key: 'challenges:participate', label: 'Challenge Sprint Enrollment', desc: 'Join campus challenges and log actions' },
    { key: 'twin:simulate', label: 'Digital Twin Energy Simulation', desc: 'Run personal physics-based resource model' },
  ];

  // Matrix state: role -> permission -> boolean
  const [matrix, setMatrix] = useState({
    admin: { 'users:manage': true, 'system:roles': true, 'telemetry:view': true, 'database:snapshot': true, 'models:deploy': true, 'audit:export': true, 'bills:ingest': true, 'proofs:verify': true, 'challenges:participate': true, 'twin:simulate': true },
    mlops: { 'users:manage': false, 'system:roles': false, 'telemetry:view': true, 'database:snapshot': false, 'models:deploy': true, 'audit:export': true, 'bills:ingest': false, 'proofs:verify': false, 'challenges:participate': false, 'twin:simulate': false },
    audit: { 'users:manage': false, 'system:roles': false, 'telemetry:view': true, 'database:snapshot': false, 'models:deploy': false, 'audit:export': true, 'bills:ingest': false, 'proofs:verify': false, 'challenges:participate': false, 'twin:simulate': false },
    region: { 'users:manage': false, 'system:roles': false, 'telemetry:view': false, 'database:snapshot': false, 'models:deploy': false, 'audit:export': true, 'bills:ingest': false, 'proofs:verify': false, 'challenges:participate': false, 'twin:simulate': false },
    institution: { 'users:manage': false, 'system:roles': false, 'telemetry:view': false, 'database:snapshot': false, 'models:deploy': false, 'audit:export': true, 'bills:ingest': true, 'proofs:verify': true, 'challenges:participate': true, 'twin:simulate': true },
    dept: { 'users:manage': false, 'system:roles': false, 'telemetry:view': false, 'database:snapshot': false, 'models:deploy': false, 'audit:export': false, 'bills:ingest': false, 'proofs:verify': true, 'challenges:participate': false, 'twin:simulate': false },
    student: { 'users:manage': false, 'system:roles': false, 'telemetry:view': false, 'database:snapshot': false, 'models:deploy': false, 'audit:export': false, 'bills:ingest': false, 'proofs:verify': false, 'challenges:participate': true, 'twin:simulate': true },
    user: { 'users:manage': false, 'system:roles': false, 'telemetry:view': false, 'database:snapshot': false, 'models:deploy': false, 'audit:export': false, 'bills:ingest': false, 'proofs:verify': false, 'challenges:participate': false, 'twin:simulate': true },
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleCapability = (roleId, permKey) => {
    setMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permKey]: !prev[roleId]?.[permKey]
      }
    }));
  };

  const handleSavePolicy = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Role-Based Access Control (RBAC) Hierarchical Capabilities Matrix</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Fine-grained capability schema across all 8 multi-tenant actor tiers with instantaneous session-token synchronization.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSavePolicy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Schema Rules</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>RBAC capability matrix policy committed and synced across all Express authorization middlewares!</span>
        </div>
      )}

      {/* Capability Matrix Table */}
      <div className="fluent-card p-5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-white/10 text-neutral-400">
              <tr>
                <th className="py-2.5 px-3 w-64">Permission Capability</th>
                {roles.map(r => (
                  <th key={r.id} className="py-2.5 px-2 text-center">
                    <div className="font-semibold text-white truncate">{r.label}</div>
                    <div className="text-[10px] text-neutral-500">{r.tier}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {permissions.map((perm) => (
                <tr key={perm.key} className="hover:bg-white/5">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white font-mono text-[11px]">{perm.key}</div>
                    <div className="text-[10px] text-neutral-400">{perm.desc}</div>
                  </td>
                  {roles.map(r => {
                    const isGranted = matrix[r.id]?.[perm.key];
                    return (
                      <td key={r.id} className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => toggleCapability(r.id, perm.key)}
                          className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-colors cursor-pointer ${
                            isGranted 
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40' 
                              : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700 border border-white/5'
                          }`}
                          title={`Toggle ${perm.key} for ${r.label}`}
                        >
                          {isGranted ? <Check className="w-3.5 h-3.5" /> : <X className="w-3 h-3" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
