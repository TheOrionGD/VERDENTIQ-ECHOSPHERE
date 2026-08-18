'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatGauge } from '@/components/ui/StatGauge';
import { Eye, ShieldCheck, BarChart3, Globe, Layers, Scale } from 'lucide-react';

export default function AuditOverviewPage() {
  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-5 w-5 text-stone-700" />
              <Badge variant="stone" className="font-mono">Differential Privacy Activated (ε = 0.5)</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Anonymized Regional Aggregate Research Dashboard
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Strictly macro-level environmental metrics with k-anonymity (k ≥ 50) and zero PII or individual-level data.
            </p>
          </div>
        </div>

        {/* Notice Card confirming strict privacy */}
        <div className="p-3 bg-stone-100 border border-stone-300 rounded-2xl text-xs text-stone-800 flex items-center gap-2 font-mono">
          <ShieldCheck className="h-4 w-4 text-emerald-800 flex-shrink-0" />
          <span>
            <strong>Auditor Privacy Guarantee:</strong> Individual user, dorm room, or personal device telemetry widgets are strictly suppressed on this view.
          </span>
        </div>

        {/* Macro Regional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatGauge
            title="Macro Regional Carbon Abatement"
            value={1420}
            target={2000}
            unit="Metric Tons CO2e"
            trend="up"
            changePercentage={14.2}
            status="optimal"
            subtitle="Aggregated across 8 Institutions"
          />
          <StatGauge
            title="Combined Energy Optimized"
            value={18.4}
            target={25.0}
            unit="GWh Total Clean Energy"
            trend="up"
            changePercentage={8.9}
            status="optimal"
            subtitle="Regional Grid Load Shift"
          />
          <StatGauge
            title="Mean Academic Cohort Efficiency"
            value={94.2}
            target={90.0}
            unit="% Efficiency Index"
            trend="up"
            changePercentage={3.1}
            status="optimal"
            subtitle="k-Anonymized Group Average"
          />
        </div>

        {/* Aggregated Macro Bar Summaries */}
        <Card className="p-5 bg-white/95 border-stone-200 shadow-sm space-y-4">
          <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            Aggregated Regional Efficiency Benchmarks by Sector
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span>Higher Education Campuses (Aggregated N=14)</span>
                <span className="font-bold text-emerald-800">92.4% Optimal</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#064E3B] h-full rounded-full" style={{ width: '92.4%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span>Research Facilities & Labs (Aggregated N=6)</span>
                <span className="font-bold text-emerald-800">88.1% Optimal</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#064E3B] h-full rounded-full" style={{ width: '88.1%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
