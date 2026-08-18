// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatGauge } from '@/components/ui/StatGauge';
import {
  BarChart3,
  Sliders,
  TrendingUp,
  Building,
  AlertTriangle,
  DollarSign,
  Sparkles,
  Trophy,
  Activity,
  Layers,
  ArrowRight,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { MilpScenario, HeatmapDataPoint, XGBoostKPIAutoSuggestion, AnomalyTrendPoint, DepartmentItem,  } from '@/lib/services/institutionService';

export default function TenantAnalyticsAndOptimizationPage() {
  const [milpScenarios, setMilpScenarios] = useState<MilpScenario[]>(() => ([] as any));
  const [heatmap, setHeatmap] = useState<HeatmapDataPoint[]>(() => ([] as any));
  const [xgboostSuggestions, setXgboostSuggestions] = useState<XGBoostKPIAutoSuggestion[]>(() => ([] as any));
  const [anomalyTrend, setAnomalyTrend] = useState<AnomalyTrendPoint[]>(() => ([] as any));
  const [departments, setDepartments] = useState<DepartmentItem[]>(() => ([] as any));

  // MILP Solver Parameters
  const [costWeight, setCostWeight] = useState<number>(0.4);
  const [carbonWeight, setCarbonWeight] = useState<number>(0.4);
  const [coverageWeight, setCoverageWeight] = useState<number>(0.2);
  const [scenarioName, setScenarioName] = useState<string>('Custom MILP Solver Scenario');
  const [isSolving, setIsSolving] = useState<boolean>(false);

  const handleRunSolver = () => {
    setIsSolving(true);
    setTimeout(() => {
      ([] as any);
      setMilpScenarios(([] as any));
      setIsSolving(false);
    }, 1000);
  };

  const activeScenario = milpScenarios[0] || {
    totalCostUsd: 312500,
    totalCarbonOffsetKg: 114500,
    coveragePercent: 94.5,
    solverStatus: 'Optimal',
    recommendedAction: 'Deploy solar microgrid battery storage shift + lab HVAC night resets',
  };

  const sortedLeaderboard = [...departments].sort((a, b) => b.ecoScore - a.ecoScore);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">MILP & ML Analytics Engine</Badge>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-mono">XGBoost & MILP Solver</span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Tenant-Wide MILP Optimization & Analytics Center
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Portfolio-level cost/carbon/coverage trade-off optimization, cross-department heatmaps, XGBoost KPI baseline suggestions, and anomaly trend analysis.
            </p>
          </div>
        </div>

        {/* 1. Tenant-Wide MILP Optimization Dashboard */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-800" />
                <span>Tenant-Wide MILP Portfolio Optimization Solver</span>
              </h2>
              <p className="text-xs text-stone-500">
                Aggregates all department & building energy forecasts into an institution-level cost/carbon/coverage trade-off frontier.
              </p>
            </div>
            <Badge variant="emerald">MILP Solver Engine Ready</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Weights Sliders Controls */}
            <div className="lg:col-span-5 bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
              <h3 className="text-xs font-bold text-stone-900">Configure Objective Weights</h3>

              <div>
                <label className="text-[11px] text-stone-600 block mb-1">
                  Scenario Name
                </label>
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-medium text-stone-700 mb-1">
                    <span>Fiscal Cost Minimization Weight</span>
                    <span className="font-mono font-bold">{Math.round(costWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={costWeight}
                    onChange={(e) => setCostWeight(parseFloat(e.target.value))}
                    className="w-full accent-emerald-800 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-medium text-stone-700 mb-1">
                    <span>Carbon Reduction Yield Weight</span>
                    <span className="font-mono font-bold">{Math.round(carbonWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={carbonWeight}
                    onChange={(e) => setCarbonWeight(parseFloat(e.target.value))}
                    className="w-full accent-teal-800 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-medium text-stone-700 mb-1">
                    <span>Building Coverage Weight</span>
                    <span className="font-mono font-bold">{Math.round(coverageWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={coverageWeight}
                    onChange={(e) => setCoverageWeight(parseFloat(e.target.value))}
                    className="w-full accent-stone-800 cursor-pointer"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                disabled={isSolving}
                onClick={handleRunSolver}
                className="w-full text-xs gap-1.5"
              >
                {isSolving ? (
                  <>
                    <Cpu className="h-3.5 w-3.5 animate-spin" />
                    <span>Executing MILP Solver...</span>
                  </>
                ) : (
                  <>
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Run MILP Optimization Solver</span>
                  </>
                )}
              </Button>
            </div>

            {/* Solver Output Results */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">Projected Portfolio Spend</span>
                  <span className="text-lg font-bold text-stone-900 font-mono">
                    ${activeScenario.totalCostUsd?.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-800 block mt-0.5">Optimal Capital Allocation</span>
                </div>

                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-900 block font-sans">Net Carbon Reduction</span>
                  <span className="text-lg font-bold text-emerald-950 font-mono">
                    {activeScenario.totalCarbonOffsetKg?.toLocaleString()} kg
                  </span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">CO₂ Offset Potential</span>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">Building Coverage</span>
                  <span className="text-lg font-bold text-stone-900 font-mono">
                    {activeScenario.coveragePercent}%
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">Across 5 Faculties</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-900 text-white rounded-xl shadow-xs space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest">
                  SOLVER RECOMMENDATION ({activeScenario.solverStatus || 'Optimal'})
                </span>
                <p className="text-xs font-semibold">{activeScenario.recommendedAction}</p>
              </div>

              {/* MILP Scenarios History List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 block">Saved MILP Solver Scenarios</span>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {milpScenarios.map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-stone-900 block">{s.name}</span>
                        <span className="text-[10px] text-stone-500">
                          Cost Wt: {s.costWeight} • Carbon Wt: {s.carbonWeight} • Coverage Wt: {s.coverageWeight}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-emerald-800 block">
                          {s.totalCarbonOffsetKg?.toLocaleString()} kg
                        </span>
                        <span className="text-[10px] text-stone-500">${s.totalCostUsd?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Department Comparison Heatmap */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Building className="h-4 w-4 text-emerald-800" />
                <span>Department Comparison Heatmap Matrix</span>
              </h2>
              <p className="text-xs text-stone-500">
                Multi-metric heatmap grid assessing energy, carbon, verification accuracy, budget variance, and anomaly rates.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-800">
                <tr>
                  <th className="p-3">Department</th>
                  <th className="p-3">Energy Saved (kWh)</th>
                  <th className="p-3">Carbon Reduced (kg)</th>
                  <th className="p-3">Pass Rate (%)</th>
                  <th className="p-3">Budget Variance</th>
                  <th className="p-3">Anomaly Rate</th>
                  <th className="p-3 text-right">Overall EcoScore</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {heatmap.map((row) => (
                  <tr key={row.departmentId} className="hover:bg-stone-50/50">
                    <td className="p-3 font-sans font-bold text-stone-900">{row.departmentName}</td>
                    <td className="p-3 font-semibold text-emerald-900">{row.energySavedKwh.toLocaleString()} kWh</td>
                    <td className="p-3 font-semibold text-teal-800">{row.carbonReducedKg.toLocaleString()} kg</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 font-bold">
                        {row.verificationPassRate}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={row.budgetVariancePercent > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                        {row.budgetVariancePercent > 0 ? `+${row.budgetVariancePercent}%` : `${row.budgetVariancePercent}%`}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-amber-700">{row.anomalyRatePercent}%</td>
                    <td className="p-3 text-right font-sans font-bold text-emerald-950 text-sm">
                      {row.overallEcoScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. XGBoost Baseline & Auto-Suggestions + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* XGBoost Auto-Suggestions */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
              <Sparkles className="h-4 w-4 text-purple-700" />
              <span>XGBoost KPI Auto-Suggestions</span>
            </h2>

            <div className="space-y-3">
              {xgboostSuggestions.map((sug) => (
                <div key={sug.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">{sug.metricName}</span>
                    <Badge variant="emerald">{sug.modelConfidencePercent}% Model Conf</Badge>
                  </div>
                  <p className="text-[11px] text-stone-500 font-mono">
                    Baseline: {sug.currentBaselineValue} {sug.unit} • Scope: {sug.departmentScope}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-2 border-t border-stone-200/50">
                    <div className="p-2 bg-white rounded border">
                      <span className="text-[9px] text-stone-400 block font-sans">Conservative</span>
                      <span className="font-bold text-stone-800">{sug.suggestedTargetConservative}</span>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                      <span className="text-[9px] text-emerald-800 block font-sans font-bold">Recommended</span>
                      <span className="font-bold text-emerald-950">{sug.suggestedTargetRecommended}</span>
                    </div>
                    <div className="p-2 bg-white rounded border">
                      <span className="text-[9px] text-stone-400 block font-sans">Stretch Goal</span>
                      <span className="font-bold text-stone-800">{sug.suggestedTargetStretch}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Department Leaderboard */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
              <Trophy className="h-4 w-4 text-amber-600" />
              <span>Cross-Department EcoScore Leaderboard</span>
            </h2>

            <div className="space-y-2.5">
              {sortedLeaderboard.map((dept, idx) => (
                <div
                  key={dept.id}
                  className="p-3 bg-stone-50/80 rounded-xl border border-stone-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-7 w-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950'
                          : idx === 1
                          ? 'bg-stone-300 text-stone-900'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">{dept.name}</span>
                      <span className="text-[10px] text-stone-500">
                        Mod: {dept.moderatorName} • {dept.memberCount} members
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-emerald-900">{dept.ecoScore}</span>
                    <span className="text-[10px] text-stone-400 block">EcoScore</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
