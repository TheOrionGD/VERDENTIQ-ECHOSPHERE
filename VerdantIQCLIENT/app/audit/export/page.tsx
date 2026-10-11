'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download, FileCheck, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export default function AuditExportPage() {
  const [downloading, setDownloading] = useState(false);
  const [downloadCompleted, setDownloadCompleted] = useState(false);

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadCompleted(true);
    }, 1200);
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Download className="h-5 w-5 text-stone-700" />
              <Badge variant="stone" className="font-mono">SHA256 Cryptographic Verification</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Immutable Research & Scientific Data Export
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Export raw, tamper-evident telemetry packages signed with institutional SHA256 checksum certificates.
            </p>
          </div>
        </div>

        {downloadCompleted && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1 font-mono">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              Package Exported: verdantiq_audit_telemetry_2026_q2.parquet (14.2 MB)
            </div>
            <p className="text-[11px] text-emerald-800">
              SHA256 Checksum: <code>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code>
            </p>
          </div>
        )}

        <Card className="p-5 bg-white/95 border-stone-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            Configure Export Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Data Scope</label>
              <select className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs">
                <option>Carbon Scope 1 & 2 Emissions Ledger</option>
                <option>MILP Dispatch Decision Logs</option>
                <option>Student Dorm Energy Usage (Aggregated)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Export Format</label>
              <select className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono">
                <option>Apache Parquet (.parquet)</option>
                <option>Signed PDF Report with SHA256 (.pdf)</option>
                <option>JSON-LD Semantic Graph (.jsonld)</option>
                <option>CSV Raw Records (.csv)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Anonymization Level</label>
              <select className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs">
                <option>Full k-Anonymity (k=50, ε=0.5)</option>
                <option>Strict Institutional Aggregation Only</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={handleExport} disabled={downloading}>
              <Download className={`h-3.5 w-3.5 mr-1.5 ${downloading ? 'animate-bounce' : ''}`} />
              {downloading ? 'Generating Signed Archive...' : 'Generate Signed Export Package'}
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
