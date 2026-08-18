'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Layers } from 'lucide-react';
import {
  CrossRoleLineageTable,
  TenantPrivacyEnforcementPanel,
} from '@/components/shared/ConsistencyPatterns';

export default function AuditDataFlowPage() {
  const nodes = [
    { title: '1. Utility Bill Slips & DISCOM App Logs', detail: 'Monthly Energy Bill Slips & Government Smart Meter App Manual Logs', privacy: 'Verified Bill Statements' },
    { title: '2. Local Edge Gateways', detail: 'MQTT Protocol Ingress', privacy: 'Local Encryption' },
    { title: '3. Differential Privacy Shield', detail: 'k-Anonymity (k=50) + Noise Injection', privacy: 'PII Stripped Here' },
    { title: '4. Encrypted MongoDB Cluster', detail: 'MongoDB Query Projection Layer Enforcement', privacy: 'At-Rest AES-256' },
    { title: '5. MILP Optimization Engine', detail: 'C++ & PyTorch Integer Solvers', privacy: 'Anonymized Inferences' },
    { title: '6. Immutable Audit Trail', detail: 'Append-Only Ledger', privacy: 'Public Cryptographic Proof' },
  ];

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-5 w-5 text-stone-700" />
              <Badge variant="stone">Privacy & Lineage Architecture</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Cross-Role Data Lineage & Tenant Privacy Architecture
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Trace telemetry data from role inputs through models to presentation surfaces, with strict MongoDB query & Firebase custom-claims tenant isolation.
            </p>
          </div>
        </div>

        {/* Node Flow Overview */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
          <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            System Data Pipeline Pipeline Stages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nodes.map((node, i) => (
              <div key={node.title} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 relative">
                <span className="font-bold text-xs text-stone-900 block">{node.title}</span>
                <p className="text-[11px] text-stone-600 font-mono">{node.detail}</p>
                <div className="pt-2 border-t border-stone-200">
                  <Badge variant={i === 2 || i === 3 ? 'emerald' : 'stone'}>{node.privacy}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Interactive Cross-Role Input-Output Lineage Registry Table */}
        <CrossRoleLineageTable />

        {/* MongoDB Query & Firebase Custom Claims Enforcement Sandbox */}
        <TenantPrivacyEnforcementPanel />
      </div>
    </AppShell>
  );
}
