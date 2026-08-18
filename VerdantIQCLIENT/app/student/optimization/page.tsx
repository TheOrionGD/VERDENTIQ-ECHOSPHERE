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
} from 'lucide-react';

export default function StudentOptimizationPage() {
  const [allowanceCap, setAllowanceCap] = useState<number>(150);
  const [carbonPriority, setCarbonPriority] = useState<number>(80);

  const studentActions = [
    {
      id: 'sopt_1',
      title: 'Auto Eco-Sleep Mode on Gaming PC / Rig',
      category: 'Electronics',
      rank: 1,
      carbonDeltaKg: -14.2,
      costDeltaUSD: -12.50,
      points: 80,
      desc: 'Automatically suspend GPU/CPU mining & background background renders during non-study hours (02:00 - 08:00).',
    },
    {
      id: 'sopt_2',
      title: 'Off-Peak Laundry & Smart Plug Schedule',
      category: 'Dorm Life',
      rank: 2,
      carbonDeltaKg: -8.5,
      costDeltaUSD: -8.00,
      points: 50,
      desc: 'Shift Founders Hall washer/dryer cycles to off-peak morning hours (06:00 - 09:00).',
    },
    {
      id: 'sopt_3',
      title: 'Cafeteria Meatless Monday Commitment',
      category: 'Dining',
      rank: 3,
      carbonDeltaKg: -18.0,
      costDeltaUSD: -15.00,
      points: 100,
      desc: 'Pledge 1 day per week plant-based dining at Student Union, reducing dietary scope 3 footprint.',
    },
  ];

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SlidersHorizontal className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Student MILP Simulator</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Dorm &amp; Campus &quot;What-If&quot; Simulator
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Optimize student monthly budget & carbon reduction actions with instant MILP trade-off calculations.
            </p>
          </div>
        </div>

        {/* Sliders Card */}
        <Card className="border border-stone-200 bg-white/90 shadow-xs">
          <CardHeader className="border-b border-stone-100 pb-3">
            <CardTitle className="text-base text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-emerald-700" />
              <span>Student Allowance & Carbon Preference Sliders</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-stone-900">
                <span>Monthly Student Budget / Cap</span>
                <span className="font-mono text-emerald-800">${allowanceCap} / mo</span>
              </div>
              <input
                type="range"
                min={0}
                max={500}
                step={25}
                value={allowanceCap}
                onChange={(e) => setAllowanceCap(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-stone-900">
                <span>Carbon Priority Weight</span>
                <span className="font-mono text-emerald-800">{carbonPriority}% Carbon Focus</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={carbonPriority}
                onChange={(e) => setCarbonPriority(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions List */}
        <Card className="border border-stone-200 bg-white/90 shadow-xs">
          <CardHeader className="border-b border-stone-100 pb-3">
            <CardTitle className="text-base text-stone-900">Recommended Student Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {studentActions.map((act) => (
              <div key={act.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{act.title}</span>
                    <Badge variant="stone" size="xs">{act.category}</Badge>
                  </div>
                  <p className="text-stone-600">{act.desc}</p>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <Badge variant="emerald">{act.carbonDeltaKg} kg CO2e</Badge>
                  <Badge variant="amber">${act.costDeltaUSD}/mo</Badge>
                  <Badge variant="stone">+{act.points} pts</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
