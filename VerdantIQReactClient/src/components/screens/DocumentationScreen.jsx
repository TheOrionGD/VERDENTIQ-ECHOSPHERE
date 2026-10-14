import React from 'react';
import { 
  BookOpen, 
  Server, 
  Cpu, 
  Database, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  Code
} from 'lucide-react';
import { BackgroundVideo } from '../common/BackgroundVideo';

export function DocumentationScreen({ onBack, onNavigateScreen }) {
  const docs = [
    {
      title: 'Spring Boot Tenant Provisioning',
      icon: Server,
      color: 'text-emerald-400',
      badge: 'Microservices & DB Isolation',
      desc: 'Automated PostgreSQL schema isolation (tenant_name) with dedicated OAuth token claims, automated schema migrations, and strict cross-tenant privacy boundaries.',
      actionLabel: 'Launch Platform Admin',
      target: 'admin'
    },
    {
      title: 'XGBoost & Isolation Forest Engine',
      icon: Cpu,
      color: 'text-sky-400',
      badge: 'MLOps Pipeline',
      desc: 'Real-time building thermal drift detection, predictive EUI forecasting, setpoint optimization, and Isolation Forest evidence packet generation with geotagged audit logs.',
      actionLabel: 'Launch MLOps Console',
      target: 'mlops'
    },
    {
      title: 'Regional District Grid Governance',
      icon: Database,
      color: 'text-amber-400',
      badge: 'District Carbon Caps',
      desc: 'Dynamic grid carbon intensity tracking (gCO2e/kWh), renewable solar export tariffs, and district-level carbon capping rules across dynamically configured state districts.',
      actionLabel: 'Launch Region Dashboard',
      target: 'region'
    },
    {
      title: 'Cryptographic SHA-256 Audit Trail',
      icon: ShieldCheck,
      color: 'text-emerald-300',
      badge: 'Immutable Verification',
      desc: 'Every thermal modification, tenant onboarding event, and sensor calibration is chained cryptographically with the previous block hash digest guaranteeing tamper-proof non-repudiation.',
      actionLabel: 'Launch Audit Logs',
      target: 'audit'
    }
  ];

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
              <span className="font-bold text-lg text-white block leading-tight">VerdantIQ Documentation</span>
              <span className="text-[10px] font-mono text-emerald-400">Technical Manuals & System Architecture</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateScreen && onNavigateScreen('api-reference')}
              className="liquid-btn hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/80 hover:bg-emerald-500 text-white border border-emerald-400/30 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
              <span>API Reference</span>
            </button>
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="liquid-glass-panel liquid-shimmer rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>VerdantIQ Core Technical Specification v4.2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Architecture & Platform Documentation
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Official system specifications for Regional District Governance, Spring Boot multi-tenant isolation, XGBoost thermal setpoint inference, and SHA-256 audit log ledgers.
          </p>
        </div>

        {/* Documentation Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {docs.map((doc, idx) => {
            const Icon = doc.icon;
            return (
              <div 
                key={idx}
                className="liquid-glass-panel liquid-shimmer rounded-2xl p-6 border border-white/15 space-y-4 shadow-xl hover:border-emerald-400/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${doc.color}`} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                    {doc.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white">{doc.title}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {doc.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400">Pure JavaScript + REST Ready</span>
                  <button
                    onClick={() => onNavigateScreen && onNavigateScreen(doc.target)}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{doc.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Standard Card */}
        <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/15 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              8-Tier RBAC & Tenant Isolation Governance
            </h2>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            VerdantIQ strictly enforces role-based access control from Tier 1 (Platform Admin) down through Regional Districts (Tier 4) to Citizen Households (Tier 8). Token claims guarantee that queries, setpoint controls, and energy ledger inspections are verified cryptographically on every request.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-emerald-300">Database JWT Claims</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-emerald-300">AES-256 Column Encryption</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-emerald-300">PostgreSQL Schema Isolation</span>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-emerald-300">SHA-256 Cryptographic Hashes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentationScreen;
