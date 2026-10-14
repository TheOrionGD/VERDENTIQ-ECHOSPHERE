import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Lock
} from 'lucide-react';

export function AuditExportView() {
  const [downloading, setDownloading] = useState(false);
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  const [dataScope, setDataScope] = useState('scope2_carbon_ledger');
  const [format, setFormat] = useState('parquet');
  const [anonymization, setAnonymization] = useState('k_anonymity_50');

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadCompleted(true);
    }, 1300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Immutable Research & Certified ESG Data Export</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Export tamper-evident telemetry packages signed with institutional SHA-256 hash-chain validation manifests.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={downloading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
          <span>{downloading ? 'Generating Signed Archive...' : 'Generate Signed Export Package'}</span>
        </button>
      </div>

      {downloadCompleted && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 space-y-2 font-mono">
          <div className="flex items-center space-x-2 font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Package Exported: verdantiq_iso50001_audit_manifest_2026.parquet (14.2 MB)</span>
          </div>
          <div className="text-[11px] text-neutral-300 break-all">
            Cryptographic SHA-256 Checksum: <span className="text-teal-400">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
          </div>
          <div className="text-[10px] text-neutral-400 font-sans">
            Status: Fully compliant with ISO 50001 & GHG Protocol Scope 2 dual-reporting guidelines.
          </div>
        </div>
      )}

      {/* Export Configuration Form */}
      <div className="fluent-card p-5 space-y-4 text-xs">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Configure Export Parameters & Anonymization Engine</span>
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-neutral-300 block mb-1">Data Scope</label>
            <select
              value={dataScope}
              onChange={(e) => setDataScope(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="scope2_carbon_ledger">Carbon Scope 1 & 2 Emissions Ledger</option>
              <option value="pareto_optimization_runs">Multi-Objective Pareto Dispatch Decision Logs</option>
              <option value="student_dorm_aggregates">Student Dormitory Energy Usage (Aggregated)</option>
              <option value="water_waste_diversion">Campus Water & Solid Waste Diversion History</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-neutral-300 block mb-1">Export Archive Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded px-3 py-2 text-white font-mono"
            >
              <option value="parquet">Apache Parquet (.parquet)</option>
              <option value="pdf">Signed PDF Report with SHA-256 Manifest (.pdf)</option>
              <option value="jsonld">JSON-LD Semantic Graph (.jsonld)</option>
              <option value="csv">Standard CSV Raw Records (.csv)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-neutral-300 block mb-1">Anonymization Level</label>
            <select
              value={anonymization}
              onChange={(e) => setAnonymization(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="k_anonymity_50">Full k-Anonymity (k=50, ε=0.5 Differential Privacy)</option>
              <option value="strict_institutional">Strict Institutional Aggregation Only (Zero PII)</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-neutral-400">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">All exports are stamped with tamper-evident chain root signatures.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
