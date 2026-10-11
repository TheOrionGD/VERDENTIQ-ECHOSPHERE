'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatGauge } from '@/components/ui/StatGauge';
import { Scale, HeartHandshake, CheckCircle2, Award } from 'lucide-react';

export default function AuditFairnessReportsPage() {
  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">Environmental Justice Index</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Energy Allocation Equity & Algorithmic Fairness Audit
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Verify fair HVAC thermal setpoints, equal energy budget distribution, and Gini coefficient metrics.
            </p>
          </div>
        </div>

        {/* Equity Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatGauge
            title="Dormitory vs Faculty Equity Ratio"
            value={0.98}
            target={1.0}
            unit="Parity Score (1.0 = Equal)"
            trend="neutral"
            changePercentage={0}
            status="optimal"
            subtitle="Equal thermal comfort bounds"
          />
          <StatGauge
            title="Gini Coefficient (Energy Disparity)"
            value={0.12}
            target={0.15}
            unit="Gini Index (Lower is fairer)"
            trend="down"
            changePercentage={-14}
            status="optimal"
            subtitle="Highly equitable distribution"
          />
          <StatGauge
            title="Historical Building Age Bias Score"
            value={0.02}
            target={0.05}
            unit="Disparity index"
            trend="neutral"
            changePercentage={0}
            status="optimal"
            subtitle="Insulation bias compensated"
          />
        </div>

        <Card className="p-5 bg-white/95 border-stone-200 shadow-sm space-y-3 text-xs">
          <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            Equity Audit Summary Certification
          </h3>
          <p className="text-stone-700 leading-relaxed">
            The VerdantIQ MILP Dispatch Algorithm strictly enforces equal thermal bounds (21.0 °C to 23.5 °C) across all dormitories regardless of building construction year, preventing historical infrastructure disadvantage.
          </p>
          <div className="flex items-center gap-2 text-emerald-800 font-bold pt-1 font-mono">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            Certified Compliant with ISO 26000 Social Responsibility Guidelines
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
