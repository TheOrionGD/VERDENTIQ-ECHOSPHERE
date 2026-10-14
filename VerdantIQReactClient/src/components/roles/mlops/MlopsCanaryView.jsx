import React, { useState } from 'react';
import { Flame } from 'lucide-react';

export function MlopsCanaryView() {
  const [canaryAllocation, setCanaryAllocation] = useState(15);
  const [isPromoting, setIsPromoting] = useState(false);

  const handlePromote = () => {
    setIsPromoting(true);
    setTimeout(() => {
      setCanaryAllocation(100);
      setIsPromoting(false);
    }, 1000);
  };

  return (
    <div className="fluent-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>Canary Rollout & Zero-Downtime Deployment Console</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Progressively route live telemetry requests between current production baseline and candidate model revision.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-2">
          <div className="flex justify-between font-semibold text-white">
            <span>Primary Stable Baseline (90%)</span>
            <span className="text-emerald-400 font-mono">v2.4-purejs</span>
          </div>
          <div className="space-y-1 text-neutral-400">
            <div>Served Requests: <span className="font-mono text-white">14,290</span></div>
            <div>Error Rate: <span className="font-mono text-emerald-400">0.00%</span></div>
            <div>Avg Latency: <span className="font-mono text-white">12 ms</span></div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-neutral-900 border border-emerald-500/20 space-y-2">
          <div className="flex justify-between font-semibold text-emerald-300">
            <span>Canary Candidate ({canaryAllocation}%)</span>
            <span className="text-emerald-400 font-mono">v2.5-rc1</span>
          </div>
          <div className="space-y-1 text-neutral-400">
            <div>Served Requests: <span className="font-mono text-white">2,140</span></div>
            <div>Error Rate: <span className="font-mono text-emerald-400">0.00%</span></div>
            <div>Avg Latency: <span className="font-mono text-white">9 ms (-25%)</span></div>
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-4 text-xs">
        <div className="flex justify-between items-center text-neutral-300">
          <span>Canary Traffic Routing Percentage: <span className="font-mono text-emerald-400 font-bold">{canaryAllocation}%</span></span>
          <button
            onClick={handlePromote}
            disabled={isPromoting || canaryAllocation === 100}
            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
          >
            {isPromoting ? 'Promoting...' : canaryAllocation === 100 ? 'Promoted (100%)' : 'Promote Canary to 100%'}
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={canaryAllocation}
          onChange={(e) => setCanaryAllocation(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
      </div>
    </div>
  );
}
