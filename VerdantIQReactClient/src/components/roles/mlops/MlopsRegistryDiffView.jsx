import React, { useState } from 'react';
import { GitCompare, CheckCircle2 } from 'lucide-react';

export function MlopsRegistryDiffView() {
  const [selectedModel, setSelectedModel] = useState('Holt-Winters');

  const diffData = {
    'Holt-Winters': {
      vOld: { version: 'v2.3', alpha: 0.35, beta: 0.15, mae: 4890, rmse: 5900, status: 'Deprecated' },
      vNew: { version: 'v2.4-purejs', alpha: 0.40, beta: 0.20, mae: 4210, rmse: 5120, status: 'Active Production' },
      improvements: ['-13.9% reduction in MAE deviation', 'Integrated pure JS seasonal smoothing (no Python bridge)'],
    },
    'Pareto Solver': {
      vOld: { version: 'v3.0', resolutionSteps: 5, comfortWeight: 0.3, solveTimeMs: 14, status: 'Archived' },
      vNew: { version: 'v3.1-purejs', resolutionSteps: 9, comfortWeight: 0.45, solveTimeMs: 8, status: 'Active Production' },
      improvements: ['42% faster matrix evaluation in Node.js crypto/math engine', 'Expanded thermal setpoint resolution from Δ-2°C to +2°C at 0.5° intervals'],
    },
  };

  const curr = diffData[selectedModel] || diffData['Holt-Winters'];

  return (
    <div className="fluent-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <GitCompare className="w-4 h-4 text-emerald-400" />
            <span>Model Version Registry Diff & Parameter Comparator</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Side-by-side parameter audit comparing deployed models against candidate staging versions.
          </p>
        </div>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-neutral-900 border border-white/10 rounded px-3 py-1.5 text-xs text-white"
        >
          <option value="Holt-Winters">Holt-Winters Forecast Model</option>
          <option value="Pareto Solver">HVAC Pareto Optimizer</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        {/* Old Version */}
        <div className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white">Baseline Version ({curr.vOld.version})</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 uppercase font-semibold">
              {curr.vOld.status}
            </span>
          </div>
          <div className="space-y-1.5 text-neutral-300">
            {Object.entries(curr.vOld).filter(([k]) => k !== 'status' && k !== 'version').map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/5 py-1">
                <span className="capitalize">{k}:</span>
                <span className="font-mono text-neutral-400">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* New Version */}
        <div className="p-4 rounded-lg bg-neutral-900 border border-emerald-500/20 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-emerald-300">Target Production ({curr.vNew.version})</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-semibold">
              {curr.vNew.status}
            </span>
          </div>
          <div className="space-y-1.5 text-neutral-300">
            {Object.entries(curr.vNew).filter(([k]) => k !== 'status' && k !== 'version').map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/5 py-1">
                <span className="capitalize">{k}:</span>
                <span className="font-mono text-emerald-400 font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 rounded bg-neutral-950 border border-white/5 text-xs text-neutral-300 space-y-1">
        <div className="text-[11px] font-semibold text-white">Validated Enhancements & Audit Lineage:</div>
        {curr.improvements.map((imp, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{imp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
