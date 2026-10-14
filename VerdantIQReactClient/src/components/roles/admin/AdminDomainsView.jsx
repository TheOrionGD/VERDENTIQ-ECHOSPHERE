import React, { useState } from 'react';
import { Globe } from 'lucide-react';

export function AdminDomainsView() {
  const [disputes, setDisputes] = useState([
    {
      id: '#DOM-DISPUTE-882',
      domain: 'pacific.edu',
      claimantA: {
        name: 'Pacific State University Main Campus',
        studentBody: '28,400',
        registered: '2024',
        txtRecord: 'verdantiq-site-verification=psu_9921_verified',
        status: 'Primary DNS Owner',
      },
      claimantB: {
        name: 'Pacific Institute of Technology',
        studentBody: '6,100',
        registered: '2026',
        txtRecord: 'verdantiq-site-verification=pit_tech_pending',
        status: 'Subdomain Requested',
      },
      evidence: 'Pacific State holds verified TXT records. PIT requested sub-delegation.',
      status: 'Open Review',
    },
    {
      id: '#DOM-DISPUTE-883',
      domain: 'cascadia.org',
      claimantA: {
        name: 'Cascadia Regional Sustainability Council',
        studentBody: '14,200',
        registered: '2025',
        txtRecord: 'verdantiq-site-verification=cascadia_council_ok',
        status: 'Verified Registrar',
      },
      claimantB: {
        name: 'Cascadia Urban Green Lab',
        studentBody: '1,800',
        registered: '2026',
        txtRecord: 'verdantiq-site-verification=cascadia_lab_unverified',
        status: 'Unverified Claimant',
      },
      evidence: 'Registrar ownership matches primary council contact.',
      status: 'Resolved',
    },
  ]);

  const handleResolve = (id, resolution) => {
    setDisputes(prev =>
      prev.map(d => (d.id === id ? { ...d, status: resolution } : d))
    );
  };

  return (
    <div className="fluent-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Campus Domain Authority & DNS Conflict Management</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Resolves domain overlaps, TXT verification proofs, and subdomain delegations.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 border border-white/10 font-mono">
          {disputes.filter(d => d.status === 'Open Review').length} Active Conflicts
        </span>
      </div>

      <div className="space-y-3">
        {disputes.map(dispute => (
          <div key={dispute.id} className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-emerald-400 font-bold">{dispute.domain}</span>
                <span className="text-[10px] text-neutral-500 font-mono">{dispute.id}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                dispute.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {dispute.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-black/30 border border-white/5">
                <div className="text-[11px] text-neutral-400 font-medium">Claimant A (Registered Primary)</div>
                <div className="text-white font-medium">{dispute.claimantA.name}</div>
                <div className="text-[10px] text-neutral-400">Students: {dispute.claimantA.studentBody} · {dispute.claimantA.status}</div>
                <div className="text-[9px] text-neutral-500 font-mono truncate">{dispute.claimantA.txtRecord}</div>
              </div>

              <div className="p-2.5 rounded bg-black/30 border border-white/5">
                <div className="text-[11px] text-neutral-400 font-medium">Claimant B (Conflicting Party)</div>
                <div className="text-white font-medium">{dispute.claimantB.name}</div>
                <div className="text-[10px] text-neutral-400">Students: {dispute.claimantB.studentBody} · {dispute.claimantB.status}</div>
                <div className="text-[9px] text-neutral-500 font-mono truncate">{dispute.claimantB.txtRecord}</div>
              </div>
            </div>

            <div className="text-[11px] text-neutral-400 bg-neutral-950 p-2 rounded">
              <span className="font-medium text-neutral-300">Auditor Notes: </span>
              {dispute.evidence}
            </div>

            {dispute.status === 'Open Review' && (
              <div className="flex justify-end space-x-2 pt-1 text-xs">
                <button
                  onClick={() => handleResolve(dispute.id, 'Subdomain Sub-delegated')}
                  className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                >
                  Delegate Subdomain
                </button>
                <button
                  onClick={() => handleResolve(dispute.id, 'Resolved')}
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors cursor-pointer"
                >
                  Confirm Primary Registrar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
