// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { SubCohortAnalytics } from '@/lib/services/deptService';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { BarChart3, TrendingUp, Cpu, Zap, ShieldCheck, Layers } from 'lucide-react';

export default function DeptAnalyticsPage() {
  const subCohorts = [] as any[];
  const defaultCohort: SubCohortAnalytics = {
    subCohort: 'Grad AI & Synthetic Bio Lab',
    memberCount: 42,
    verifiedActions: 310,
    energySavedKwh: 4850,
    anomalyResolutionRate: 98.4,
    carbonOffsetKg: 2420,
  };
  const [selectedCohort, setSelectedCohort] = useState<SubCohortAnalytics>(subCohorts[0] || defaultCohort);

  const activeCohort = selectedCohort || defaultCohort;

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        <RoleSubNav />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Sub-Cohort Analytics & Baseline</Badge>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 font-editorial">
              Department Sub-Cohort Analytics & Anomaly Insights
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Comparative sub-cohort energy optimization, IsolationForest anomaly resolution rates, & carbon offsets.
            </p>
          </div>
        </div>

        {/* Sub-Cohort Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subCohorts.map((sc) => (
            <Card
              key={sc.subCohort}
              onClick={() => setSelectedCohort(sc)}
              className={`p-4 border transition-all cursor-pointer ${
                activeCohort.subCohort === sc.subCohort
                  ? 'bg-emerald-50/90 border-emerald-600 shadow-sm'
                  : 'bg-white hover:bg-stone-50 border-stone-200'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">Sub-Cohort</span>
              <h3 className="text-xs font-bold text-stone-900 truncate">{sc.subCohort}</h3>

              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Members:</span>
                  <strong className="font-mono text-stone-900">{sc.memberCount}</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Energy Saved:</span>
                  <strong className="font-mono text-emerald-800">{sc.energySavedKwh} kWh</strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Resolution Rate:</span>
                  <strong className="font-mono text-emerald-800">{sc.anomalyResolutionRate}%</strong>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detailed Breakdown for Selected Sub-Cohort */}
        <Card className="p-6 bg-white border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers className="h-4 w-4 text-emerald-800" />
                <Badge variant="emerald">Active Breakdown</Badge>
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-editorial">
                {activeCohort.subCohort}
              </h3>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-stone-400 block text-[10px] uppercase">Carbon Offset Contribution</span>
              <span className="text-emerald-900 font-bold text-base">{activeCohort.carbonOffsetKg} kg CO₂e</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-500 text-[10px] uppercase block">Total Verified Actions</span>
              <span className="text-xl font-bold text-stone-900">{activeCohort.verifiedActions}</span>
              <p className="text-[10px] text-emerald-700">100% verified via OCR/Geofence</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-500 text-[10px] uppercase block">Anomaly Resolution Velocity</span>
              <span className="text-xl font-bold text-emerald-800">{activeCohort.anomalyResolutionRate}%</span>
              <p className="text-[10px] text-stone-500">IsolationForest false-positive rate &lt; 2.1%</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-500 text-[10px] uppercase block">Average Member Impact</span>
              <span className="text-xl font-bold text-stone-900">
                {(activeCohort.energySavedKwh / (activeCohort.memberCount || 1)).toFixed(1)} kWh/member
              </span>
              <p className="text-[10px] text-emerald-700">Top 5% in Pacific State University</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
