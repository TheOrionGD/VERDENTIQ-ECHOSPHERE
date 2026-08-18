// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MilpWhatIfSimulator } from '@/components/shared/ConsistencyPatterns';
import { MilpWeights } from '@/lib/services/mlopsService';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { SlidersHorizontal, Cpu, Zap, Activity, Save, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';

export default function MlopsOptimizerPage() {
  const [weights, setWeights] = useState<MilpWeights>(([] as any));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    ([] as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const applyPreset = (presetName: string) => {
    if (presetName === 'MAX_SAVINGS') {
      setWeights({ energyCost: 70, thermalComfort: 15, equipmentWear: 10, carbonEmissions: 5 });
    } else if (presetName === 'MAX_COMFORT') {
      setWeights({ energyCost: 20, thermalComfort: 70, equipmentWear: 5, carbonEmissions: 5 });
    } else if (presetName === 'BALANCED_GREEN') {
      setWeights({ energyCost: 35, thermalComfort: 35, equipmentWear: 15, carbonEmissions: 15 });
    }
  };

  // Pareto Frontier Tradeoff Simulation Data
  const paretoData = [
    { name: 'Max Cost Savings', costDollars: 180, thermalDiscomfort: 4.8, active: weights.energyCost > 60 },
    { name: 'Current Weights', costDollars: 240, thermalDiscomfort: 2.1, active: true },
    { name: 'Balanced Green', costDollars: 290, thermalDiscomfort: 1.4, active: weights.carbonEmissions > 10 },
    { name: 'Max Comfort', costDollars: 410, thermalDiscomfort: 0.4, active: weights.thermalComfort > 60 },
  ];

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SlidersHorizontal className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">MILP Solver Tuner</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              MILP Constraint-Weight & Pareto Optimization Console
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Tune objective loss parameters between occupant comfort, energy cost, equipment wear, and carbon limits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={handleSave}>
              <Save className="h-3.5 w-3.5 mr-1.5" /> Save Objective Weights
            </Button>
          </div>
        </div>

        {saved && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center gap-2 font-medium shadow-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" /> MILP Solver constraint weights updated. Fast-C++ solver re-initialized with new penalty matrix.
          </div>
        )}

        {/* Preset Selector */}
        <Card className="p-4 bg-white/95 border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-800" />
            <span className="font-bold text-stone-800">Quick Objective Weight Presets:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => applyPreset('MAX_SAVINGS')}>
              ⚡ Max Energy Savings
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('BALANCED_GREEN')}>
              🌿 Balanced Green Eco
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset('MAX_COMFORT')}>
              🌡️ Maximum Comfort
            </Button>
          </div>
        </Card>

        {/* MILP Weight Sliders & Live Pareto Curve */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-4">
            <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
              Objective Function Weight Sliders
            </h3>

            <div className="space-y-4 font-mono text-xs">
              {/* Weight 1: Energy Cost Minimization */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>Energy Cost Penalty Weight (W1)</span>
                  <span className="text-emerald-800">{weights.energyCost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.energyCost}
                  onChange={(e) => setWeights({ ...weights, energyCost: parseInt(e.target.value) })}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
              </div>

              {/* Weight 2: Thermal Comfort Discomfort Penalty */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>Occupant Discomfort Penalty (W2)</span>
                  <span className="text-emerald-800">{weights.thermalComfort}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.thermalComfort}
                  onChange={(e) => setWeights({ ...weights, thermalComfort: parseInt(e.target.value) })}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
              </div>

              {/* Weight 3: Equipment Wear & Cycling */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>Compressor Wear & Cycling Cost (W3)</span>
                  <span className="text-emerald-800">{weights.equipmentWear}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.equipmentWear}
                  onChange={(e) => setWeights({ ...weights, equipmentWear: parseInt(e.target.value) })}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
              </div>

              {/* Weight 4: Carbon Emissions Cap */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>Grid Carbon Emission Penalty (W4)</span>
                  <span className="text-emerald-800">{weights.carbonEmissions}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.carbonEmissions}
                  onChange={(e) => setWeights({ ...weights, carbonEmissions: parseInt(e.target.value) })}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* Pareto Frontier Scatter Chart */}
          <Card className="p-5 bg-white/95 border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div>
                <h3 className="font-editorial text-base font-bold text-stone-900">
                  Pareto Optimal Frontier (Cost vs Thermal Discomfort)
                </h3>
                <p className="text-[11px] text-stone-500">
                  Simulated multi-objective Pareto trade-off curve across operating points.
                </p>
              </div>
              <Badge variant="emerald">C++ CBC Solver</Badge>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis type="number" dataKey="costDollars" name="Daily Energy Cost ($)" stroke="#78716c" fontSize={11} unit="$" />
                  <YAxis type="number" dataKey="thermalDiscomfort" name="Discomfort (°C·hr)" stroke="#78716c" fontSize={11} unit="°C" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '11px' }} />
                  <Scatter name="Operating Points" data={paretoData} fill="#064E3B">
                    {paretoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.active ? '#064E3B' : '#a8a29e'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* MILP What-If Interactive Simulator */}
        <MilpWhatIfSimulator title="Real-Time Setpoint What-If Impact Simulator" />
      </div>
    </AppShell>
  );
}
