'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { History, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export default function AuditTenantHistoryPage() {
  const events = [
    { date: '2026-07-30', tenant: 'West Coast District Board', event: 'Quota Expansion Approved (+500,000 kWh/mo)', actor: 'Platform Admin' },
    { date: '2026-05-14', tenant: 'Pacific State University', event: 'MILP Solver v2.4 Activated across 18 Dormitories', actor: 'MLOps Admin' },
    { date: '2025-09-01', tenant: 'Cascadia Environmental College', event: 'Initial Platform Onboarding & Domain Verification', actor: 'Regional Board' },
    { date: '2024-11-10', tenant: 'Life Sciences Building B', event: 'Department HVAC Schedule Overrides Enabled', actor: 'Dept Moderator' },
  ];

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="h-5 w-5 text-stone-700" />
              <Badge variant="stone">Lifecycle Audit History</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Tenant Lifecycle & Configuration History
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Historical ledger of tenant onboardings, quota changes, and compliance audit stamps over time.
            </p>
          </div>
        </div>

        <Card className="p-5 bg-white/95 border-stone-200 shadow-sm space-y-4">
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200">
            {events.map((ev, idx) => (
              <div key={idx} className="flex items-start gap-4 relative z-10 pl-2">
                <div className="h-4 w-4 rounded-full bg-[#064E3B] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex-1 text-xs space-y-0.5">
                  <div className="flex justify-between font-mono text-[10px] text-stone-400">
                    <span>{ev.date}</span>
                    <span>Actor: {ev.actor}</span>
                  </div>
                  <span className="font-bold text-stone-900 block">{ev.tenant}</span>
                  <p className="text-stone-700">{ev.event}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
