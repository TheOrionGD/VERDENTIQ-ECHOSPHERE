'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download, FileCheck, CheckCircle2, ShieldCheck, Lock, AlertTriangle, RefreshCw } from 'lucide-react';

interface ExportResultMeta {
  collection: string;
  recordCount: number;
  sha256Checksum: string;
  byteSize: number;
  format: string;
  generatedAt: string;
  anonymizationLevel: string;
}

export default function AuditExportPage() {
  const [downloading, setDownloading] = useState(false);
  const [exportMeta, setExportMeta] = useState<ExportResultMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [scope, setScope] = useState('redacted_logs');
  const [format, setFormat] = useState('JSON');
  const [anonymizationLevel, setAnonymizationLevel] = useState('Full k-Anonymity (k=50, ε=0.5)');

  const handleExport = async () => {
    try {
      setDownloading(true);
      setError(null);
      setExportMeta(null);

      const res = await fetch('/api/audit/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope, format, anonymizationLevel }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to export records from database.');
      }

      setExportMeta(data.meta);

      // Trigger authentic browser file download
      const mime = format === 'CSV' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8';
      const blob = new Blob([data.exportContent], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename || `verdantiq_export.${format === 'CSV' ? 'csv' : 'json'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Error occurred during data export generation.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Download className="h-5 w-5 text-stone-700" />
              <Badge variant="stone" className="font-mono">Live MongoDB Database Export</Badge>
              <Badge variant="emerald" className="font-mono text-[10px]">Authoritative SHA-256 Signoff</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Immutable Research & Scientific Data Export
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Export raw, tamper-evident telemetry packages signed with institutional SHA-256 checksum certificates.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Export Failed:</strong> {error}
            </span>
          </div>
        )}

        {exportMeta && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-2 font-mono">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              Package Exported: {exportMeta.recordCount} Genuine Records from MongoDB ({exportMeta.byteSize} bytes)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-800 pt-1 border-t border-emerald-200">
              <div>
                <span className="font-semibold text-emerald-950">Source Collection: </span>
                <code>{exportMeta.collection}</code>
              </div>
              <div>
                <span className="font-semibold text-emerald-950">Timestamp: </span>
                {new Date(exportMeta.generatedAt).toLocaleString()}
              </div>
              <div className="sm:col-span-2 break-all">
                <span className="font-semibold text-emerald-950">Authoritative SHA256 Checksum: </span>
                <code className="bg-emerald-100/80 px-1.5 py-0.5 rounded text-[10px]">
                  {exportMeta.sha256Checksum}
                </code>
              </div>
            </div>
          </div>
        )}

        <Card className="p-5 bg-white/95 border-stone-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            Configure Export Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Authoritative Data Scope</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              >
                <option value="redacted_logs">Sanitized Audit Logs (redactedauditlogs)</option>
                <option value="audit_requests">IRB Protocol Petitions (auditrequests)</option>
                <option value="carbon_inventory">Campus Carbon Emissions (carbon_inventory)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Export Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
              >
                <option value="JSON">Raw JSON Package (.json)</option>
                <option value="CSV">Comma-Separated Values (.csv)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Anonymization Level</label>
              <select
                value={anonymizationLevel}
                onChange={(e) => setAnonymizationLevel(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              >
                <option value="Full k-Anonymity (k=50, ε=0.5)">Full k-Anonymity (k=50, ε=0.5)</option>
                <option value="Strict Institutional Aggregation Only">Strict Institutional Aggregation Only</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-stone-100">
            <span className="text-[11px] text-stone-500 font-mono">
              Direct streaming from MongoDB Atlas cluster. Zero fake records.
            </span>
            <Button variant="primary" size="sm" onClick={handleExport} disabled={downloading}>
              <Download className={`h-3.5 w-3.5 mr-1.5 ${downloading ? 'animate-spin' : ''}`} />
              {downloading ? 'Extracting & Signing Records...' : 'Generate Signed Export Package'}
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
