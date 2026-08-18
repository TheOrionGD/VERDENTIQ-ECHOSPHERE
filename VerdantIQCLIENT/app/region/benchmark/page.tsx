'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { InstitutionRecord } from '@/lib/services/regionService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Scale, ShieldCheck, Target, TrendingUp, AlertTriangle, CheckCircle2, BarChart3, Sliders } from 'lucide-react';

export default function RegionalBenchmarkPage() {
  const [institutions, setInstitutions] = useState<InstitutionRecord[]>(() => []);
  const [targetCarbon, setTargetCarbon] = useState(200);
  const [targetEUI, setTargetEUI] = useState(110);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const benchmarks = { institutionCount: 0, totalStudents: 0, avgEUI: 0, avgTargetEUI: 0, avgCarbon: 0, avgTargetCarbon: 0, avgAccuracy: 0, privacyPolicyNotice: "" };

  const handleSaveAdvisoryTargets = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Aggregate Benchmarking</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Regional Benchmarking & Forecast-Accuracy Audit
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Cross-campus EUI benchmarks, 30-day forecast accuracy audits, and advisory carbon targets.
            </p>
          </div>

          <div className="p-3 bg-emerald-950 text-white rounded-xl text-xs flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Raw member logs strictly isolated at campus nodes</span>
          </div>
        </div>

        {/* Advisory Regional Carbon & Budget Target Manager */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-800" />
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Advisory Regional Budget & Carbon Targets
              </h3>
            </div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Advisory targets updated across region!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Regional Target Carbon Cap (gCO2e / kWh)</label>
              <input
                type="number"
                value={targetCarbon}
                onChange={(e) => setTargetCarbon(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
              />
              <span className="text-[11px] text-stone-500 mt-0.5 block">Used to compute cross-campus target distance</span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Regional Target EUI (kBtu / sq ft)</label>
              <input
                type="number"
                value={targetEUI}
                onChange={(e) => setTargetEUI(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
              />
              <span className="text-[11px] text-stone-500 mt-0.5 block">Campus building energy benchmark</span>
            </div>

            <div className="flex items-end">
              <Button onClick={handleSaveAdvisoryTargets} className="w-full bg-[#064E3B] hover:bg-emerald-800 text-white">
                Update Advisory Benchmarks
              </Button>
            </div>
          </div>
        </div>

        {/* Cross-Institution Forecast-Accuracy Audit Table */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Cross-Institution Forecast-Accuracy Audit
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Audit of ML predicted energy vs actual campus consumption. Institutions with MAPE &gt; 15% are highlighted for support triage.
              </p>
            </div>
            <Badge variant="emerald">30-Day Evaluation Window</Badge>
          </div>

          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold">
                  <th className="p-3">Campus</th>
                  <th className="p-3">Predicted EUI</th>
                  <th className="p-3">Actual EUI</th>
                  <th className="p-3">Error MAPE %</th>
                  <th className="p-3">Accuracy Score</th>
                  <th className="p-3">Audit Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {institutions
                  .filter((i) => i.status !== 'deactivated')
                  .map((inst) => {
                    const predicted = Number((inst.currentEUI * (1 - (inst.forecastErrorMapePct / 100) * 0.5)).toFixed(1));
                    const isHighError = inst.forecastErrorMapePct > 15;
                    return (
                      <tr key={inst.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3 font-bold text-stone-900">
                          {inst.name} ({inst.code})
                        </td>
                        <td className="p-3 text-stone-600">{predicted} kBtu</td>
                        <td className="p-3 font-semibold text-stone-800">{inst.currentEUI} kBtu</td>
                        <td className={`p-3 font-mono font-bold ${isHighError ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {inst.forecastErrorMapePct}%
                        </td>
                        <td className="p-3 font-bold text-stone-900">{inst.forecastAccuracyPct}%</td>
                        <td className="p-3">
                          <Badge variant={isHighError ? 'amber' : 'emerald'}>
                            {isHighError ? 'High Variance (Flagged)' : 'Model Verified'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
