'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileQuestion, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AuditRequestsPage() {
  const requestsList = [
    { id: 'irb_901', researcher: 'Prof. Helen Vance (MIT Climate Lab)', scope: 'De-identified 5-year campus thermal telemetry dataset', irbStatus: 'IRB Protocol #2026-881 Approved', date: '2026-07-20', status: 'Approved' },
    { id: 'irb_902', researcher: 'Dr. Aris Thorne', scope: 'Building B occupancy & air quality correlation matrix', irbStatus: 'Exempt Academic Review', date: '2026-06-15', status: 'Approved' },
  ];

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileQuestion className="h-5 w-5 text-stone-700" />
              <Badge variant="stone">IRB Compliance Log</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Institutional Review Board (IRB) Data Requests
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Review research data access petitions, institutional review protocols, and ethical governance signoffs.
            </p>
          </div>
        </div>

        <Card className="p-4 bg-white/95 border-stone-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Request ID</th>
                  <th className="py-2.5 px-3">Principal Investigator</th>
                  <th className="py-2.5 px-3">Requested Dataset Scope</th>
                  <th className="py-2.5 px-3">IRB Protocol Status</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {requestsList.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50">
                    <td className="py-3 px-3 font-mono font-bold text-stone-900">{r.id}</td>
                    <td className="py-3 px-3 font-semibold text-stone-800">{r.researcher}</td>
                    <td className="py-3 px-3 text-stone-700">{r.scope}</td>
                    <td className="py-3 px-3 font-mono text-stone-600">{r.irbStatus}</td>
                    <td className="py-3 px-3">
                      <Badge variant="emerald">{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
