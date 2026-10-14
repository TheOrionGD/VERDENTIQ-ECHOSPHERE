import React, { } from 'react';
import { History, FileQuestion, FileCheck, Settings } from 'lucide-react';

export function AuditTenantHistoryView() {
  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <History className="w-4 h-4 text-emerald-400" />
        <span>Multi-Tenant Historical Provisioning & Compliance Ledger</span>
      </h2>
      <div className="space-y-2">
        <div className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
          <div>
            <div className="font-semibold text-white">Verdia Central University (`inst-verdia-central`)</div>
            <div className="text-[11px] text-neutral-400">Onboarded: 2026-01-10 · 18,500 Students · 120,000 m² Estate</div>
          </div>
          <span className="text-emerald-400 font-mono text-[11px]">100% Audit Compliance</span>
        </div>
        <div className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
          <div>
            <div className="font-semibold text-white">Pacific Technical University (`inst-ptu-2026`)</div>
            <div className="text-[11px] text-neutral-400">Onboarded: 2026-03-14 · 12,000 Students · 75,000 m² Estate</div>
          </div>
          <span className="text-emerald-400 font-mono text-[11px]">Active Tenant</span>
        </div>
      </div>
    </div>
  );
}

export function AuditRequestsView() {
  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <FileQuestion className="w-4 h-4 text-emerald-400" />
        <span>Academic Research & Compliance Data Access Requests</span>
      </h2>
      <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-1">
        <div className="flex justify-between font-semibold text-white">
          <span>Dr. Alistair Finch (Center for Environmental Energy Studies)</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">Approved</span>
        </div>
        <div className="text-[11px] text-neutral-400">Request: Anonymized 2025-2026 campus electricity load and water harvesting CSV.</div>
        <div className="text-[10px] text-neutral-500 font-mono pt-1">Grant Hash: SHA256:d812...390a</div>
      </div>
    </div>
  );
}

export function AuditModelCardsView() {
  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <FileCheck className="w-4 h-4 text-emerald-400" />
        <span>Environmental Model Cards & Mathematical Documentation</span>
      </h2>
      <div className="space-y-3">
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-1.5">
          <div className="font-semibold text-emerald-400">Model Card: Holt-Winters Pure JS Forecast Engine</div>
          <p className="text-neutral-300 text-[11px]">
            Additive formulation tracking Level (α) and Trend (β). Evaluated against historical 12-month campus billing with MAE and RMSE error bounds.
          </p>
          <div className="text-[10px] text-neutral-500 font-mono">Assumptions: Single total-campus electricity meter · Scope 2 grid emission factor 0.42 kg CO₂e/kWh.</div>
        </div>
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-1.5">
          <div className="font-semibold text-emerald-400">Model Card: Multi-Objective Pareto Optimizer</div>
          <p className="text-neutral-300 text-[11px]">
            Computes non-dominated candidate schedules balancing HVAC cost savings, carbon footprint reduction, and ASHRAE thermal comfort penalties.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuditSettingsView() {
  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <Settings className="w-4 h-4 text-emerald-400" />
        <span>Audit Retention Policies & Cryptographic Parameters</span>
      </h2>
      <div className="space-y-2">
        <div className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
          <div>
            <div className="font-semibold text-white">SHA-256 Hash Chain Minimum Retention</div>
            <div className="text-[11px] text-neutral-400">Guaranteed non-pruned tamper-evident audit storage</div>
          </div>
          <span className="font-mono text-emerald-400 font-bold">7 Years (ISO 50001)</span>
        </div>
        <div className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
          <div>
            <div className="font-semibold text-white">PII Redaction Engine</div>
            <div className="text-[11px] text-neutral-400">Automatic anonymization of student names on public compliance exports</div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-semibold">Enforced</span>
        </div>
      </div>
    </div>
  );
}
