// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';

import { Badge } from '@/components/ui/Badge';
import { Globe, ShieldCheck, CheckCircle2, AlertTriangle, Lock, Search } from 'lucide-react';

export default function RegionalDomainsPage() {
  const domainRecords = ([] as any);
  const [search, setSearch] = useState('');

  const filtered = domainRecords.filter(
    (d) =>
      d.institutionName.toLowerCase().includes(search.toLowerCase()) ||
      d.domainName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Domain Registry (Audit Only)</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Cross-Institution Domain & SSL Oversight
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Audit institutional domain mappings, SSL wildcard expiration days, and CNAME delegation health across all onboarded campuses.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-stone-200/90 shadow-xs flex items-center justify-between gap-3 text-xs">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search domain name or campus..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
            />
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Total Monitored Domains: <strong className="text-stone-900">{domainRecords.length}</strong>
          </div>
        </div>

        {/* Domains Table */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold">
                <th className="p-3">Campus Name</th>
                <th className="p-3">Primary Domain</th>
                <th className="p-3">Primary MX</th>
                <th className="p-3">SSL Certificate</th>
                <th className="p-3">DNS & CNAME Status</th>
                <th className="p-3">Last Audited</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filtered.map((dom) => (
                <tr key={dom.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-3 font-bold text-stone-900">{dom.institutionName}</td>
                  <td className="p-3 font-mono text-emerald-800 font-semibold">{dom.domainName}</td>
                  <td className="p-3 font-mono text-stone-500">{dom.primaryMX}</td>
                  <td className="p-3">
                    <Badge variant={dom.sslStatus === 'valid' ? 'emerald' : 'amber'}>
                      <Lock className="h-3 w-3 mr-1 inline" />
                      {dom.sslStatus === 'valid' ? `Valid (${dom.sslExpiryDays}d remaining)` : 'Expiring Soon'}
                    </Badge>
                  </td>
                  <td className="p-3 text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> CNAME & DNS Verified
                  </td>
                  <td className="p-3 text-stone-400 font-mono text-[11px]">{dom.lastAudited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
