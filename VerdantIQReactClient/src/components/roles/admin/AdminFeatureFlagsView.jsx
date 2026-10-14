import React, { useState } from 'react';
import { 
  Sliders
} from 'lucide-react';

export function AdminFeatureFlagsView() {
  const [flags, setFlags] = useState([
    {
      id: 'pure_js_ml_engine',
      name: 'Pure JavaScript Holt-Winters & Pareto Optimizer',
      desc: 'Executes all time-series load forecasting and multi-objective Pareto schedules in Node.js memory without external Python dependencies.',
      category: 'Inference Engine',
      enabled: true,
      immutable: true
    },
    {
      id: 'gemini_fallback_ai',
      name: 'Google Gemini 2.5 Flash Fallback Provider',
      desc: 'Dynamic fallback when primary Groq LPU throughput encounters temporary congestion or prompt token saturation.',
      category: 'AI Gateway',
      enabled: true,
      immutable: false
    },
    {
      id: 'sha256_audit_chaining',
      name: 'Tamper-Evident SHA-256 Block Chaining',
      desc: 'Links consecutive audit entries with cryptographic parent hashes to ensure compliance with ISO 50001 audits.',
      category: 'Security & Compliance',
      enabled: true,
      immutable: true
    },
    {
      id: 'student_geotag_verification',
      name: 'High-Precision Geofence Verification',
      desc: 'Requires student EcoChallenge proofs to match verified campus GIS polygons before admitting to cohort leaderboard.',
      category: 'Community & Gamification',
      enabled: true,
      immutable: false
    },
    {
      id: 'strict_institution_meter_scoping',
      name: 'Strict Scope 2 Institutional Isolation',
      desc: 'Disallows departments from reporting fictitious sub-meter kWh; forces all utility accounting to reconcile at the campus primary meter.',
      category: 'Energy Physics',
      enabled: true,
      immutable: true
    },
    {
      id: 'minio_s3_continuous_replication',
      name: 'MinIO Continuous Cold-Storage Replication',
      desc: 'Mirrors raw billing documents and audit manifests to encrypted distributed object storage.',
      category: 'Storage Infrastructure',
      enabled: false,
      immutable: false
    }
  ]);

  const toggleFlag = (id) => {
    setFlags(prev => prev.map(f => {
      if (f.id === id && !f.immutable) {
        return { ...f, enabled: !f.enabled };
      }
      return f;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Platform Feature Flags & Runtime Engine Toggles</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time toggles for inference fallbacks, cryptographic chaining, and campus data validation policies.
          </p>
        </div>
      </div>

      {/* Flag List */}
      <div className="space-y-3">
        {flags.map((flag) => (
          <div key={flag.id} className="fluent-card p-4 flex items-center justify-between">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-white">{flag.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                  {flag.category}
                </span>
                {flag.immutable && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
                    CORE ARCHITECTURE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-300">{flag.desc}</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleFlag(flag.id)}
                disabled={flag.immutable}
                className={`px-3 py-1.5 rounded text-xs font-semibold uppercase transition-colors ${
                  flag.immutable
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : flag.enabled
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 cursor-pointer'
                }`}
              >
                {flag.enabled ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
