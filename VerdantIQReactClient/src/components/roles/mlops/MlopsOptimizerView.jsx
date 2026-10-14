import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  CheckCircle, 
  Scale, 
  Thermometer, 
  DollarSign, 
  Leaf
} from 'lucide-react';

export function MlopsOptimizerView() {
  const [costWeight, setCostWeight] = useState(0.40);
  const [carbonWeight, setCarbonWeight] = useState(0.35);
  const [comfortWeight, setComfortWeight] = useState(0.25);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Pareto Frontier candidate schedules
  const paretoPoints = [
    { name: 'Aggressive Conservation', costSavings: 28.5, carbonReduction: 31.0, comfortPenalty: 12.0 },
    { name: 'Balanced ASHRAE Std', costSavings: 22.0, carbonReduction: 24.5, comfortPenalty: 4.2 },
    { name: 'Comfort Priority', costSavings: 11.2, carbonReduction: 14.0, comfortPenalty: 0.8 },
    { name: 'Night Pre-Cooling Shift', costSavings: 26.4, carbonReduction: 19.8, comfortPenalty: 3.5 },
    { name: 'Demand Response Peak Cut', costSavings: 34.0, carbonReduction: 28.2, comfortPenalty: 9.6 },
  ];

  const handleSaveWeights = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    setCostWeight(0.40);
    setCarbonWeight(0.35);
    setComfortWeight(0.25);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Multi-Objective Pareto Solver & Objective Weights</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Calibrate trade-offs between energy expenditure, Scope 2 emissions, and occupant thermal comfort.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
          <button
            onClick={handleSaveWeights}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Commit Solver Weights</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>New objective weights broadcast to all campus HVAC schedule optimization solvers!</span>
        </div>
      )}

      {/* Weight Sliders */}
      <div className="grid grid-cols-3 gap-6">
        <div className="fluent-card p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-white flex items-center space-x-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Electricity Cost Weight</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">{(costWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.05"
            value={costWeight}
            onChange={(e) => setCostWeight(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <p className="text-[11px] text-neutral-400">
            Penalizes peak-hour consumption and high time-of-use utility rates.
          </p>
        </div>

        <div className="fluent-card p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-white flex items-center space-x-1.5">
              <Leaf className="w-4 h-4 text-teal-400" />
              <span>Carbon (Scope 2) Weight</span>
            </span>
            <span className="font-mono text-teal-400 font-bold">{(carbonWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.05"
            value={carbonWeight}
            onChange={(e) => setCarbonWeight(Number(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
          <p className="text-[11px] text-neutral-400">
            Minimizes marginal grid emissions using real-time regional factor (0.42 kg/kWh).
          </p>
        </div>

        <div className="fluent-card p-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-white flex items-center space-x-1.5">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>Thermal Comfort Weight</span>
            </span>
            <span className="font-mono text-amber-400 font-bold">{(comfortWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.05"
            value={comfortWeight}
            onChange={(e) => setComfortWeight(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <p className="text-[11px] text-neutral-400">
            Enforces strict ASHRAE 55 indoor temperature & humidity compliance.
          </p>
        </div>
      </div>

      {/* Candidate Solutions Table */}
      <div className="fluent-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">Evaluated Pareto-Optimal Candidates</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-white/10 text-neutral-400">
              <tr>
                <th className="py-2.5 px-3">Candidate Schedule</th>
                <th className="py-2.5 px-3">Cost Savings (%)</th>
                <th className="py-2.5 px-3">GHG Reduction (%)</th>
                <th className="py-2.5 px-3">Thermal Discomfort Index</th>
                <th className="py-2.5 px-3">Frontier Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {paretoPoints.map((pt, i) => (
                <tr key={i} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">{pt.name}</td>
                  <td className="py-2.5 px-3 text-emerald-400">+{pt.costSavings}%</td>
                  <td className="py-2.5 px-3 text-teal-400">-{pt.carbonReduction}%</td>
                  <td className="py-2.5 px-3 text-amber-400">{pt.comfortPenalty} PMV units</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-semibold">
                      Non-Dominated
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
