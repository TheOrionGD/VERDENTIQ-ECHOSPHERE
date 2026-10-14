import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Database, 
  Hash, 
  CheckCircle2, 
  ArrowLeft,
  Server,
  Copy,
  Check
} from 'lucide-react';
import { BackgroundVideo } from '../common/BackgroundVideo';

export function SecurityOverviewScreen({ onBack, initialTab = 'db-claims' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [copied, setCopied] = useState(false);

  const jwtPayload = `{
  "uid": "usr_9921_tn_chennai",
  "email": "moderator@annauniv.edu",
  "role": "dept",
  "hierarchyLevel": 6,
  "tenantId": "tenant_annauniv_edu",
  "district": "tn-chennai",
  "institutionCode": "AU-ENG",
  "permissions": [
    "read:hvac_telemetry",
    "write:setpoint_tune",
    "submit:audit_report"
  ]
}`;

  const sqlSchema = `-- Spring Boot Automated Schema Isolation
CREATE SCHEMA IF NOT EXISTS "tenant_verdia_edu";
SET search_path TO "tenant_verdia_edu", public;

CREATE TABLE "tenant_verdia_edu".hvac_sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id VARCHAR(64) NOT NULL,
  current_temp_c NUMERIC(4,1),
  setpoint_c NUMERIC(4,1),
  power_kw NUMERIC(6,2),
  xgboost_anomaly_score NUMERIC(3,2)
);`;

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans p-4 sm:p-8 relative selection:bg-emerald-500 selection:text-black">
      <BackgroundVideo overlayClassName="bg-slate-950/85 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between liquid-glass-panel liquid-shimmer p-4 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer"
              title="Return"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-emerald-400/40 text-white shadow-md overflow-hidden p-1 flex items-center justify-center animate-liquid-pulse">
              <img src="/icon.png" alt="VerdantIQ" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-lg text-white block leading-tight">VerdantIQ Security Specifications</span>
              <span className="text-[10px] font-mono text-emerald-400">Enterprise Cryptography & Schema Isolation</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Back
          </button>
        </div>

        {/* Hero Section */}
        <div className="liquid-glass-panel liquid-shimmer rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Trust Enterprise Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Security & Tenant Encryption Architecture
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            VerdantIQ delivers bank-grade cryptographic isolation across campus databases, IoT ingestion gateways, and user authorization sessions.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 p-1.5 liquid-glass-panel rounded-2xl border border-white/10">
          {[
            { id: 'db-claims', label: 'Database Claims', icon: Key },
            { id: 'tenant-encryption', label: 'AES-256 Encryption', icon: Lock },
            { id: 'postgres-isolation', label: 'Postgres Isolation', icon: Database },
            { id: 'audit-hashes', label: 'SHA-256 Audit Trail', icon: Hash },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/40 scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Database Claims */}
        {activeTab === 'db-claims' && (
          <div className="liquid-glass-panel rounded-2xl p-6 shadow-xl border border-white/15 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Database JWT Token Custom Claims Schema</h2>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Database-issued cryptographic JWT claims directly embed tenant identifier, governance role hierarchy level (1–8), and granular permissions into signed payload tokens.
            </p>

            <div className="relative">
              <div className="flex items-center justify-between bg-black/60 px-3 py-1.5 rounded-t-xl border-x border-t border-white/10 text-[10px] font-mono text-neutral-400">
                <span>Verified Token Payload</span>
                <button
                  onClick={() => handleCopyCode(jwtPayload)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-neutral-950 text-emerald-300 font-mono text-xs rounded-b-xl border border-white/10 overflow-x-auto">
                {jwtPayload}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: AES-256 Encryption */}
        {activeTab === 'tenant-encryption' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-300">
            <div className="liquid-glass-panel rounded-2xl p-6 border border-white/15 space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">At-Rest Column Encryption</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                All sensitive campus credentials, building IoT access tokens, and living lab location records are encrypted using AES-256-GCM with per-tenant master keys.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AES-256-GCM Verified</span>
              </div>
            </div>

            <div className="liquid-glass-panel rounded-2xl p-6 border border-white/15 space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
                <Server className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="text-base font-bold text-white">In-Transit TLS 1.3</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                All BACnet telemetry ingest streams and REST communications require TLS 1.3 with Perfect Forward Secrecy and HSTS headers.
              </p>
              <div className="pt-2 text-[11px] font-mono text-sky-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>TLS 1.3 Enforced</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Postgres Isolation */}
        {activeTab === 'postgres-isolation' && (
          <div className="liquid-glass-panel rounded-2xl p-6 shadow-xl border border-white/15 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">PostgreSQL Multi-Tenant Schema Isolation</h2>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              When an organization tenant application is approved, VerdantIQ automatically generates an isolated PostgreSQL schema (e.g. tenant_verdia_edu) with strict row-level security and connection bounds.
            </p>

            <div className="relative">
              <pre className="p-4 bg-neutral-950 text-emerald-300 font-mono text-xs rounded-xl border border-white/10 overflow-x-auto">
                {sqlSchema}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: SHA-256 Audit Hashes */}
        {activeTab === 'audit-hashes' && (
          <div className="liquid-glass-panel rounded-2xl p-6 shadow-xl border border-white/15 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">SHA-256 Cryptographic Audit Hashes</h2>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Every audit record logged by building moderators, regional authorities, or automated XGBoost agents is chained cryptographically with the preceding entry hash digest.
            </p>

            <div className="p-4 bg-neutral-950/90 text-emerald-300 font-mono text-xs rounded-xl border border-white/10 space-y-2">
              <div><strong>Block #1842 Hash:</strong> e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
              <div><strong>Block #1843 Hash:</strong> 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4</div>
              <div className="text-neutral-400 text-[11px] pt-1 border-t border-white/10">
                Chained & Timestamped by VerdantIQ SHA-256 Ledger • ISO 50001 Certified
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SecurityOverviewScreen;
