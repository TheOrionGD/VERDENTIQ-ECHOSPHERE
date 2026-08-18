'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileCheck, ShieldCheck, Cpu, Leaf, Sparkles } from 'lucide-react';

export default function AuditModelCardsPage() {
  const modelCards = [
    {
      name: 'VerdantIQ MILP Dispatch Solver v2.4',
      type: 'Mixed Integer Linear Programming / PyTorch',
      trainingDataset: '4.2M historical HVAC telemetry records (2022-2026)',
      trainingCarbonKg: '1.42 kg CO2e (Zero-Carbon Grid Trained)',
      biasMitigation: 'Equal thermal comfort bounds guaranteed across all dormitory buildings regardless of age',
      intendedUse: 'Campus HVAC dispatching and pre-cooling optimization',
    },
    {
      name: 'VerdantIQ Gemini Assistant Integration',
      type: 'LLM Multimodal Fine-Tune Interface',
      trainingDataset: 'Google Gemini 3.5 Flash Base + VerdantIQ ESG Knowledge Graph',
      trainingCarbonKg: 'API Inferred (Google Carbon-Neutral Infrastructure)',
      biasMitigation: 'Redacted user metadata before prompt construction',
      intendedUse: 'Conversational sustainability advising and natural language command execution',
    },
  ];

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="h-5 w-5 text-stone-700" />
              <Badge variant="stone">Model Transparency Standard</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              AI / ML Model Cards & Ethics Governance
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Public transparency documentation detailing model training carbon footprint, bias guardrails, and operational bounds.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {modelCards.map((card) => (
            <Card key={card.name} className="p-5 bg-white/95 border-stone-200 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{card.name}</h3>
                  <span className="text-[10px] text-stone-500 font-mono">{card.type}</span>
                </div>
                <Badge variant="emerald">GOVERNANCE AUDITED</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase font-mono block">Training Dataset Origin</span>
                  <p className="text-stone-800 font-medium">{card.trainingDataset}</p>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase font-mono block">Training Carbon Footprint</span>
                  <p className="text-emerald-950 font-bold font-mono">{card.trainingCarbonKg}</p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 md:col-span-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase font-mono block">Algorithmic Fairness & Bias Mitigation</span>
                  <p className="text-stone-800 font-medium">{card.biasMitigation}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
