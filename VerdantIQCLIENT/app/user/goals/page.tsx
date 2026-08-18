'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Target,
  Edit2,
  CheckCircle2,
  Zap,
  Leaf,
  Sun,
  Plus,
  CheckSquare,
  ExternalLink,
} from 'lucide-react';

export default function UserGoalsPage() {
  const [goals, setGoals] = useState([
    {
      id: 'g1',
      title: 'Monthly Energy Consumption Cap',
      current: 328,
      target: 400,
      unit: 'kWh',
      percentage: 82,
      color: '#065f46',
      icon: Zap,
    },
    {
      id: 'g2',
      title: 'Annual Carbon Intensity Reduction',
      current: 18.4,
      target: 25.0,
      unit: '% Reduced',
      percentage: 74,
      color: '#10b981',
      icon: Leaf,
    },
    {
      id: 'g3',
      title: 'Solar PV Self-Consumption Ratio',
      current: 78,
      target: 85,
      unit: '% On-Site',
      percentage: 91,
      color: '#f59e0b',
      icon: Sun,
    },
  ]);

  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [newTargetValue, setNewTargetValue] = useState<number>(0);

  const handleOpenEdit = (goal: typeof goals[0]) => {
    setEditingGoalId(goal.id);
    setNewTargetValue(goal.target);
  };

  const handleSaveGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const pct = Math.min(100, Math.round((g.current / newTargetValue) * 100));
          return { ...g, target: newTargetValue, percentage: pct };
        }
        return g;
      })
    );
    setEditingGoalId(null);
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">SVG Progress Rings</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Personal Sustainability Goals
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Set custom target thresholds for monthly kWh caps, carbon reduction, and renewable self-consumption.
            </p>
          </div>
        </div>

        {/* Goals Grid with SVG Progress Rings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const strokeDasharray = 2 * Math.PI * 40;
            const strokeDashoffset = strokeDasharray - (strokeDasharray * goal.percentage) / 100;
            const isEditing = editingGoalId === goal.id;

            return (
              <Card key={goal.id} className="border border-stone-200 bg-white/90 shadow-xs">
                <CardHeader className="border-b border-stone-100 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-emerald-700" />
                      <span>{goal.title}</span>
                    </CardTitle>
                    <button
                      onClick={() => handleOpenEdit(goal)}
                      className="p-1 text-stone-400 hover:text-stone-900 rounded-lg cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-4 text-center">
                  {/* SVG Progress Ring */}
                  <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#e7e5e4"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={goal.color}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold font-mono text-stone-900">{goal.percentage}%</span>
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Progress</span>
                    </div>
                  </div>

                  {/* Goal Numerical Breakdown */}
                  {isEditing ? (
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-left">
                      <label className="block text-xs font-semibold text-stone-700">Set New Target ({goal.unit})</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={newTargetValue}
                          onChange={(e) => setNewTargetValue(Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border rounded-lg font-mono bg-white"
                        />
                        <Button onClick={() => handleSaveGoal(goal.id)} variant="primary" size="sm" className="text-xs">
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs font-mono">
                        <span>Current: <strong>{goal.current} {goal.unit}</strong></span>
                        <span className="text-emerald-800 font-bold">Target: {goal.target} {goal.unit}</span>
                      </div>
                      <Button
                        onClick={() => {
                          const text = `VerdantIQ Goal: ${goal.title} (Target: ${goal.target} ${goal.unit})`;
                          navigator.clipboard.writeText(text);
                          window.open('https://tasks.google.com', '_blank', 'noopener,noreferrer');
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs text-blue-700 border-blue-200 hover:bg-blue-50 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckSquare className="h-3.5 w-3.5 text-blue-600" />
                        <span>Google Tasks Reminder</span>
                        <ExternalLink className="h-3 w-3 ml-auto opacity-70" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
