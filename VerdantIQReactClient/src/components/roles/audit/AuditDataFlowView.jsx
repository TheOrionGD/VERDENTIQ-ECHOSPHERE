import React, { useState } from 'react';
import { Layers } from 'lucide-react';

export function AuditDataFlowView() {
  const [pipelineNodes] = useState([
    { step: 1, name: 'Campus Smart Meter / Utility Bill', schema: 'Raw Consumption Record', hash: 'SHA256:091a...c4e1', transform: 'Format & Range Integrity Validation' },
    { step: 2, name: 'Regional Emission Factor Mapper', schema: 'Scope 2 Factor Applied (0.42 kg/kWh)', hash: 'SHA256:8b2d...19fe', transform: 'GHG Protocol Geographic Grid Model' },
    { step: 3, name: 'Cryptographic Audit Hash Chainer', schema: 'Immutable Hash-Linked Journal', hash: 'SHA256:e33f...991a', transform: 'Merkle & Chain Sequence Sealing' },
    { step: 4, name: 'Research Export Gateway', schema: 'Redacted Anonymized CSV/JSON', hash: 'SHA256:7c11...88b2', transform: 'PII Removal & Differential Privacy Filter' },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Environmental Data Lineage & Provenance Flow</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Traces the complete lifecycle of campus environmental records from intake to compliance certification.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {pipelineNodes.map(node => (
          <div key={node.step} className="p-3.5 rounded-lg bg-neutral-900 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold font-mono flex items-center justify-center text-[10px]">
                  {node.step}
                </span>
                <span className="font-semibold text-white">{node.name}</span>
              </div>
              <span className="font-mono text-[10px] text-teal-400">{node.hash}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-950 p-2 rounded text-neutral-400">
              <div><span className="text-neutral-500">Output Schema: </span><span className="text-white">{node.schema}</span></div>
              <div><span className="text-neutral-500">Verification: </span><span className="text-neutral-300">{node.transform}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
