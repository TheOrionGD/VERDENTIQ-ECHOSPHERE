import React, { useState } from 'react';
import { Settings } from 'lucide-react';

export function MlopsSettingsView() {
  const [retentionDays, setRetentionDays] = useState(90);
  const [differentialPrivacy, setDifferentialPrivacy] = useState(true);
  const [reproducibleSeeds, setReproducibleSeeds] = useState(true);

  return (
    <div className="fluent-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>MLOps Governance, Privacy & Reproducibility Settings</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Define strict computational auditing, synthetic noise addition, and model checkpoint retention parameters.
          </p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-white">Deterministic Random Seed (Reproducible Solvers)</div>
            <div className="text-[11px] text-neutral-400">Pins RNG seeds for OLS regression and Pareto solvers to guarantee peer-review reproducibility.</div>
          </div>
          <input
            type="checkbox"
            checked={reproducibleSeeds}
            onChange={(e) => setReproducibleSeeds(e.target.checked)}
            className="accent-emerald-500 w-4 h-4 cursor-pointer"
          />
        </div>

        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-white">Differential Privacy Noise (Student Data Protection)</div>
            <div className="text-[11px] text-neutral-400">Injects Laplace perturbation on student cohort participation metrics before training.</div>
          </div>
          <input
            type="checkbox"
            checked={differentialPrivacy}
            onChange={(e) => setDifferentialPrivacy(e.target.checked)}
            className="accent-emerald-500 w-4 h-4 cursor-pointer"
          />
        </div>

        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-white">Inference Artifact Retention Period (Days)</div>
            <div className="text-[11px] text-neutral-400">Duration raw prediction traces are preserved before archival.</div>
          </div>
          <input
            type="number"
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
            className="bg-neutral-950 border border-white/10 rounded px-2.5 py-1 text-white font-mono w-24 text-right"
          />
        </div>
      </div>
    </div>
  );
}
