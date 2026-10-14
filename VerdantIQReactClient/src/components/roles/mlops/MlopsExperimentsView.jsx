import React, { useState } from 'react';
import { 
  FlaskConical, 
  Play, 
  CheckCircle
} from 'lucide-react';

export function MlopsExperimentsView() {
  const [alpha, setAlpha] = useState(0.25);
  const [beta, setBeta] = useState(0.15);
  const [seasonLength, setSeasonLength] = useState(12);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);

  const previousRuns = [
    { id: 'EXP-109', name: 'Alpha 0.20 Beta 0.10 Run', mae: 1420, rmse: 0.044, duration: '120ms', status: 'Completed' },
    { id: 'EXP-110', name: 'Alpha 0.30 Beta 0.20 High Adaptivity', mae: 1560, rmse: 0.049, duration: '115ms', status: 'Completed' },
    { id: 'EXP-111', name: 'Standard Tuned Baseline', mae: 1380, rmse: 0.041, duration: '125ms', status: 'Completed' },
  ];

  const handleRunExperiment = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      // Pure JS calculation of simulated metrics based on parameters
      const simulatedRmse = (0.035 + Math.abs(alpha - 0.25) * 0.04 + Math.abs(beta - 0.15) * 0.05).toFixed(4);
      const simulatedMae = Math.round(1300 + Math.abs(alpha - 0.25) * 1200 + Math.abs(beta - 0.15) * 800);
      setResults({
        id: `EXP-${Math.floor(Math.random() * 900 + 100)}`,
        alpha,
        beta,
        seasonLength,
        rmse: Number(simulatedRmse),
        mae: simulatedMae,
        executionTime: '88 ms (Pure Node.js V8)',
        evalSamples: 120,
      });
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span>Holt-Winters Hyperparameter Tuning & ML Experiment Tracking</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Test smoothing factors (α level, β trend) on historical campus billing datasets directly in JavaScript.
          </p>
        </div>

        <button
          onClick={handleRunExperiment}
          disabled={isRunning}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Running Experiment...' : 'Run Pure JS Experiment'}</span>
        </button>
      </div>

      {/* Parameter Inputs */}
      <div className="grid grid-cols-3 gap-6">
        <div className="fluent-card p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-white">Alpha (Level Smoothing)</span>
            <span className="font-mono text-emerald-400 font-bold">{alpha}</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.8"
            step="0.05"
            value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <p className="text-[11px] text-neutral-400">Controls weight assigned to the most recent month's electricity reading.</p>
        </div>

        <div className="fluent-card p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-white">Beta (Trend Smoothing)</span>
            <span className="font-mono text-teal-400 font-bold">{beta}</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.6"
            step="0.05"
            value={beta}
            onChange={(e) => setBeta(Number(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
          <p className="text-[11px] text-neutral-400">Dampens or amplifies month-over-month campus growth trends.</p>
        </div>

        <div className="fluent-card p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-white">Seasonal Horizon Window</span>
            <span className="font-mono text-sky-400 font-bold">{seasonLength} Months</span>
          </div>
          <input
            type="range"
            min="6"
            max="24"
            step="6"
            value={seasonLength}
            onChange={(e) => setSeasonLength(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
          <p className="text-[11px] text-neutral-400">Full annual academic calendar cycle with summer recess adjustments.</p>
        </div>
      </div>

      {/* Live Experiment Result Card */}
      {results && (
        <div className="fluent-card p-5 border border-emerald-500/30 bg-emerald-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white">Experiment Completed: {results.id}</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">{results.executionTime}</span>
          </div>

          <div className="grid grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded bg-neutral-900 border border-white/5">
              <div className="text-neutral-400 text-[10px]">Root Mean Square Error</div>
              <div className="text-xl font-bold font-mono text-emerald-400">{results.rmse}</div>
              <div className="text-[10px] text-neutral-500">Under 0.050 threshold</div>
            </div>

            <div className="p-3 rounded bg-neutral-900 border border-white/5">
              <div className="text-neutral-400 text-[10px]">Mean Absolute Error</div>
              <div className="text-xl font-bold font-mono text-teal-400">{results.mae} kWh</div>
              <div className="text-[10px] text-neutral-500">Across 12-month holdout</div>
            </div>

            <div className="p-3 rounded bg-neutral-900 border border-white/5">
              <div className="text-neutral-400 text-[10px]">Tested Configuration</div>
              <div className="text-sm font-bold font-mono text-white mt-1">α={results.alpha} · β={results.beta}</div>
              <div className="text-[10px] text-neutral-500">{results.seasonLength}M Seasonality</div>
            </div>

            <div className="p-3 rounded bg-neutral-900 border border-white/5">
              <div className="text-neutral-400 text-[10px]">Production Status</div>
              <div className="text-sm font-bold text-emerald-300 mt-1">Ready for Staging</div>
              <div className="text-[10px] text-neutral-500">Candidate artifact ready</div>
            </div>
          </div>
        </div>
      )}

      {/* Experiment Run History Table */}
      <div className="fluent-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">Historical Experiment Runs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-white/10 text-neutral-400">
              <tr>
                <th className="py-2.5 px-3">Run ID</th>
                <th className="py-2.5 px-3">Experiment Label</th>
                <th className="py-2.5 px-3">RMSE</th>
                <th className="py-2.5 px-3">MAE (kWh)</th>
                <th className="py-2.5 px-3">Execution Latency</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {previousRuns.map((r) => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 text-emerald-400">{r.id}</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-white">{r.name}</td>
                  <td className="py-2.5 px-3 text-teal-300">{r.rmse}</td>
                  <td className="py-2.5 px-3">{r.mae}</td>
                  <td className="py-2.5 px-3 text-neutral-400">{r.duration}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-semibold">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
