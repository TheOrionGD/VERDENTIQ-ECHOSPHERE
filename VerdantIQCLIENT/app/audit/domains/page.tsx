'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Globe, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';

export default function AuditDomainsPage() {
  const domainsList = [
    { domain: 'pacific.edu', institution: 'Pacific State University', status: 'DNS Verified (EduCause)', verifiedOn: '2024-03-12', sslExpire: '2027-03-12' },
    { domain: 'cascadia.edu', institution: 'Cascadia Environmental College', status: 'DNS Verified (EduCause)', verifiedOn: '2025-01-09', sslExpire: '2027-01-09' },
    { domain: 'northwest.org', institution: 'Northwest Higher Ed Federation', status: 'DNS Verified (TXT Record)', verifiedOn: '2025-09-22', sslExpire: '2026-09-22' },
  ];

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-5 w-5 text-stone-700" />
              <Badge variant="stone">Domain Compliance Registry</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Academic & Regional Domain Audit Trail
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Verify EduCause accreditation, DNS TXT ownership proofs, and TLS certificate renewal history.
            </p>
          </div>
        </div>

        <Card className="p-4 bg-white/95 border-stone-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Domain Name</th>
                  <th className="py-2.5 px-3">Registered Tenant</th>
                  <th className="py-2.5 px-3">DNS Verification Status</th>
                  <th className="py-2.5 px-3">Verified Date</th>
                  <th className="py-2.5 px-3">TLS Certificate Expiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {domainsList.map((d) => (
                  <tr key={d.domain} className="hover:bg-stone-50">
                    <td className="py-3 px-3 font-mono font-bold text-stone-900">{d.domain}</td>
                    <td className="py-3 px-3 font-medium text-stone-800">{d.institution}</td>
                    <td className="py-3 px-3">
                      <Badge variant="emerald">{d.status}</Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-500">{d.verifiedOn}</td>
                    <td className="py-3 px-3 font-mono text-stone-700">{d.sslExpire}</td>
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
