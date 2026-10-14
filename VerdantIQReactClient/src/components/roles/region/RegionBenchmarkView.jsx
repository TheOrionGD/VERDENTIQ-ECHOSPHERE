import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders 
} from 'lucide-react';

export function RegionBenchmarkView() {
  const [targetCarbon, setTargetCarbon] = useState(200);
  const [targetEUI, setTargetEUI] = useState(110);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const institutions = [
    { id: 'inst-01', name: 'Verdia Central University', code: 'VCU', actualEui: 118, predictedEui: 114, mapePct: 3.5, accuracyPct: 96.5, carbonCapGPerKwh: 185, status: 'Model Verified' },
    { id: 'inst-02', name: 'Cascadia Polytechnic College', code: 'CPC', actualEui: 142, predictedEui: 132, mapePct: 7.0, accuracyPct: 93.0, carbonCapGPerKwh: 210, status: 'Model Verified' },
    { id: 'inst-03', name: 'Olympic Coastal Institute', code: 'OCI', actualEui: 168, predictedEui: 138, mapePct: 17.8, accuracyPct: 82.2, carbonCapGPerKwh: 245, status: 'High Variance (Flagged)' },
    { id: 'inst-04', name: 'Pacific North Technical Academy', code: 'PNTA', actualEui: 104, predictedEui: 102, mapePct: 1.9, accuracyPct: 98.1, carbonCapGPerKwh: 160, status: 'Model Verified' },
  ];

  const handleSaveAdvisoryTargets = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Regional Aggregate Benchmarking & ML Forecast-Accuracy Audit</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Cross-campus Energy Use Intensity (EUI) benchmarks, Holt-Winters prediction accuracy audits, and regional advisory caps.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Raw member telemetry isolated at campus boundaries</span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Advisory targets committed and dispatched to all district campus energy managers!</span>
        </div>
      )}

      {/* Advisory Regional Carbon & Budget Target Manager */}
      <div className="fluent-card p-5 space-y-4 text-xs">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Advisory Regional Energy Intensity & Carbon Cap Targets</span>
        </h3>

        <form onSubmit={handleSaveAdvisoryTargets} className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-neutral-300 mb-1">Regional Carbon Cap (gCO₂e / kWh)</label>
            <input
              type="number"
              value={targetCarbon}
              onChange={(e) => setTargetCarbon(Number(e.target.value))}
              className="w-full bg-neutral-900 border border-white/10 rounded px-3 py-2 text-white font-mono"
              required
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">Upper bound for regional clean energy credits</span>
          </div>

          <div>
            <label className="block text-neutral-300 mb-1">Regional Target EUI (kBtu / sq ft / yr)</label>
            <input
              type="number"
              value={targetEUI}
              onChange={(e) => setTargetEUI(Number(e.target.value))}
              className="w-full bg-neutral-900 border border-white/10 rounded px-3 py-2 text-white font-mono"
              required
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">Campus building energy baseline threshold</span>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
            >
              Update Advisory District Targets
            </button>
          </div>
        </form>
      </div>

      {/* Cross-Institution Accuracy Audit Table */}
      <div className="fluent-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">District Campus Forecast Accuracy & Model Variance Audit</h3>
          <span className="text-xs text-neutral-400 font-mono">Rolling 30-Day Evaluation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-white/10 text-neutral-400">
              <tr>
                <th className="py-2.5 px-3">Campus Name</th>
                <th className="py-2.5 px-3">Predicted EUI</th>
                <th className="py-2.5 px-3">Actual EUI</th>
                <th className="py-2.5 px-3">Error MAPE %</th>
                <th className="py-2.5 px-3">Accuracy Score</th>
                <th className="py-2.5 px-3">Grid Carbon Factor</th>
                <th className="py-2.5 px-3">Audit Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {institutions.map(inst => (
                <tr key={inst.id} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-semibold text-white">{inst.name}</span>
                    <span className="text-emerald-400 ml-1.5 font-mono">({inst.code})</span>
                  </td>
                  <td className="py-2.5 px-3 text-neutral-400">{inst.predictedEui} kBtu</td>
                  <td className="py-2.5 px-3 text-white font-bold">{inst.actualEui} kBtu</td>
                  <td className={`py-2.5 px-3 font-bold ${inst.mapePct > 15 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {inst.mapePct}%
                  </td>
                  <td className="py-2.5 px-3 text-teal-300">{inst.accuracyPct}%</td>
                  <td className="py-2.5 px-3 text-neutral-300">{inst.carbonCapGPerKwh} g/kWh</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                      inst.status.includes('Verified') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {inst.status}
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
