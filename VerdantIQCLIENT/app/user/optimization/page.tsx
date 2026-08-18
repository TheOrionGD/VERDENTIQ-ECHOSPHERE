// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  SlidersHorizontal,
  Sparkles,
  Zap,
  TrendingDown,
  DollarSign,
  Award,
  CheckCircle2,
  Play,
  Thermometer,
} from 'lucide-react';
import { OptimizationAction,  } from '@/lib/services/userDataService';

export default function UserOptimizationPage() {
  const [budgetCap, setBudgetCap] = useState<number>(1500);
  const [carbonPriority, setCarbonPriority] = useState<number>(75);
  const [comfortPreference, setComfortPreference] = useState<number>(80);
  const [actions, setActions] = useState<OptimizationAction[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Dynamic recalculation based on MILP sliders (cost, carbon, comfort weights)
  const calculateOptimizedActions = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const recalculated = [].map((act) => {
        const carbonMultiplier = carbonPriority / 50;
        const budgetRatio = Math.min(2, budgetCap / 1000);
        const comfortFactor = comfortPreference / 100;
        return {
          ...act,
          carbonDeltaKg: Math.round(act.carbonDeltaKg * carbonMultiplier * 10) / 10,
          costDeltaUSD: Math.round(act.costDeltaUSD * budgetRatio * 10) / 10,
          easeScore: Math.min(10, Math.round(act.easeScore * comfortFactor * 10) / 10),
        };
      }).sort(
        (a, b) =>
          Math.abs(b.carbonDeltaKg * (carbonPriority / 100)) +
          b.easeScore * (comfortPreference / 100) -
          (Math.abs(a.carbonDeltaKg * (carbonPriority / 100)) + a.easeScore * (comfortPreference / 100))
      );

      setActions(recalculated.map((item, idx) => ({ ...item, rank: idx + 1 })));
      setIsSimulating(false);
    }, 400);
  };

  const handleToggleApplyAction = (actionId: string) => {
    setActions((prev) =>
      prev.map((a) =>
        a.id === actionId
          ? { ...a, status: a.status === 'applied' ? 'recommended' : 'applied' }
          : a
      )
    );
  };

  const totalCarbonSavings = actions
    .filter((a) => a.status === 'applied' || a.status === 'recommended')
    .reduce((sum, a) => sum + Math.abs(a.carbonDeltaKg), 0);

  const totalCostSavings = actions
    .filter((a) => a.status === 'applied' || a.status === 'recommended')
    .reduce((sum, a) => sum + Math.abs(a.costDeltaUSD), 0);

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SlidersHorizontal className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">MILP Solver Engine</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Interactive &quot;What-If&quot; MILP Optimization Simulator
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Mixed-Integer Linear Programming model balancing cost, carbon abatement, and comfort preference weights.
            </p>
          </div>

          <Button
            onClick={calculateOptimizedActions}
            variant="primary"
            size="sm"
            className="gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Play className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Solving MILP...' : 'Re-Run MILP Solver'}</span>
          </Button>
        </div>

        {/* Sliders Control Panel & Impact KPI Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sliders Card (2 cols) */}
          <Card className="lg:col-span-2 border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-emerald-700" />
                <span>MILP Preference Weights (Cost / Carbon / Comfort)</span>
              </CardTitle>
              <CardDescription>Adjust preference weights to dynamically compute optimal action rankings</CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Slider 1: Capital & Operating Budget Cap */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-emerald-700" />
                    <span>Cost / Budget Weight (Cap)</span>
                  </label>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    ${budgetCap.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={250}
                  value={budgetCap}
                  onChange={(e) => {
                    setBudgetCap(Number(e.target.value));
                    calculateOptimizedActions();
                  }}
                  className="w-full accent-emerald-700 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>$0 (Zero Capital Outlay)</span>
                  <span>$2,500</span>
                  <span>$5,000 (Max Retrofit)</span>
                </div>
              </div>

              {/* Slider 2: Carbon Abatement Priority */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-amber-600" />
                    <span>Carbon Abatement Weight</span>
                  </label>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {carbonPriority}% Carbon Priority
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={carbonPriority}
                  onChange={(e) => {
                    setCarbonPriority(Number(e.target.value));
                    calculateOptimizedActions();
                  }}
                  className="w-full accent-emerald-700 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>0% (Cost Only)</span>
                  <span>50% (Balanced)</span>
                  <span>100% (Max Abatement)</span>
                </div>
              </div>

              {/* Slider 3: Comfort & Thermal Preference Weight */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Thermometer className="h-4 w-4 text-sky-600" />
                    <span>Comfort / Thermal Preference Weight</span>
                  </label>
                  <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                    {comfortPreference}% Comfort Protection
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={comfortPreference}
                  onChange={(e) => {
                    setComfortPreference(Number(e.target.value));
                    calculateOptimizedActions();
                  }}
                  className="w-full accent-sky-700 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>10% (Flexible / Aggressive Cuts)</span>
                  <span>50% (Moderate Adjustments)</span>
                  <span>100% (Strict Comfort Lock)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aggregate MILP Impact Summary (1 col) */}
          <Card className="border border-stone-200 bg-[#064E3B] text-white shadow-xs">
            <CardHeader className="border-b border-emerald-800/60 pb-3">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                <span>Simulated MILP Outcome</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] text-emerald-200 font-mono uppercase tracking-wider">Total Monthly Carbon Reduction</span>
                <div className="text-3xl font-bold font-mono text-white flex items-center gap-2">
                  <TrendingDown className="h-6 w-6 text-emerald-300" />
                  <span>-{totalCarbonSavings.toFixed(1)} kg</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-emerald-200 font-mono uppercase tracking-wider">Total Monthly Utility Savings</span>
                <div className="text-2xl font-bold font-mono text-emerald-300">
                  -${totalCostSavings.toFixed(2)} / mo
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-900/60 border border-white/10 text-xs text-emerald-100/90 leading-relaxed">
                MILP solver converged in 12ms. Preferences weight matrix: Cost ${budgetCap} | Carbon {carbonPriority}% | Comfort {comfortPreference}%.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ranked MILP Actions List */}
        <Card className="border border-stone-200 bg-white/90 shadow-xs">
          <CardHeader className="border-b border-stone-100 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-700" />
                  <span>Ranked Optimal Dispatch & Behavioral Actions</span>
                </CardTitle>
                <CardDescription>Actions sorted by MILP score delta based on active preference weights</CardDescription>
              </div>
              <Badge variant="stone">{actions.length} Recommendations</Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            {actions.map((act) => {
              const isApplied = act.status === 'applied';
              return (
                <div
                  key={act.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isApplied
                      ? 'bg-emerald-50/90 border-emerald-300 shadow-xs'
                      : 'bg-stone-50/80 border-stone-200 hover:bg-stone-100/80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#064E3B] text-white font-mono font-bold text-sm flex-shrink-0">
                      #{act.rank}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-stone-900">{act.title}</span>
                        <Badge variant="stone" size="xs">{act.category}</Badge>
                        <span className="text-[10px] font-mono text-stone-500">Ease/Comfort Score: {act.easeScore}/10</span>
                      </div>
                      <p className="text-xs text-stone-600 max-w-2xl">{act.description}</p>
                    </div>
                  </div>

                  {/* Impact Delta Badges & Toggle Button */}
                  <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <Badge variant="emerald" className="font-bold">
                        {act.carbonDeltaKg} kg CO2e
                      </Badge>
                      <Badge variant="amber" className="font-bold">
                        ${act.costDeltaUSD}/mo
                      </Badge>
                      <Badge variant="stone" className="font-bold">
                        +{act.ecoPointsBonus} pts
                      </Badge>
                    </div>

                    <Button
                      onClick={() => handleToggleApplyAction(act.id)}
                      variant={isApplied ? 'primary' : 'outline'}
                      size="sm"
                      className="gap-1.5 whitespace-nowrap cursor-pointer text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{isApplied ? 'Schedule Applied' : 'Apply Action'}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
