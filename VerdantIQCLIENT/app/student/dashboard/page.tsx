// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { QuickSummaryWidget } from '@/components/dashboard/QuickSummaryWidget';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatGauge } from '@/components/ui/StatGauge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  Trophy,
  Activity,
  Bell,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Leaf,
  Users,
  Target,
  Clock,
  Plus,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user, notifications } = useAuth();

  // Personal Goals State
  const [goals, setGoals] = useState([
    { id: 'g1', title: 'Cap Founders Hall monthly dorm power to 130 kWh', target: 130, current: 128, unit: 'kWh', completed: true },
    { id: 'g2', title: 'Enroll in 2 campus green computing sprints', target: 2, current: 2, unit: 'sprints', completed: true },
    { id: 'g3', title: 'Submit 1 faculty-mentored research paper', target: 1, current: 1, unit: 'papers', completed: true },
    { id: 'g4', title: 'Pledge 4 Cafeteria Meatless Mondays', target: 4, current: 3, unit: 'days', completed: false },
  ]);

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    setGoals((prev) => [
      ...prev,
      {
        id: `g_${Date.now()}`,
        title: newGoalTitle,
        target: 100,
        current: 10,
        unit: 'pts',
        completed: false,
      },
    ]);
    setNewGoalTitle('');
    setIsAddGoalOpen(false);
  };

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald" dot>Verified Student</Badge>
              <span className="text-xs font-mono text-stone-500">Pacific State University</span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Campus &amp; Dorm Eco Dashboard
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Founders Hall Room 304 energy telemetry, inter-dorm standings, and campus research alerts.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs">
            <GraduationCap className="h-5 w-5 text-emerald-700 flex-shrink-0" />
            <div>
              <div className="font-semibold text-emerald-950">{user.name}</div>
              <div className="text-emerald-700 font-mono text-[11px]">Computer Science Dept • Class of &apos;26</div>
            </div>
          </div>
        </div>

        {/* Dynamic Quick Summary Dashboard Widget */}
        <QuickSummaryWidget />

        {/* Core Campus Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatGauge
            title="Dorm EcoScore"
            value={88.2}
            target={100}
            unit="Index"
            trend="up"
            changePercentage={8.4}
            status="optimal"
            subtitle="Rank #3 among 18 Campus Dorm Halls"
          />
          <StatGauge
            title="Monthly Room Electricity"
            value={128}
            target={180}
            unit="kWh Total"
            trend="down"
            changePercentage={15.2}
            status="optimal"
            subtitle="Smart plug eco-mode active"
          />
          <StatGauge
            title="Campus Research Credits"
            value={450}
            target={500}
            unit="Points"
            trend="up"
            changePercentage={22.0}
            status="optimal"
            subtitle="Under Dr. Aris Thorne"
          />
        </div>

        {/* Inter-Dorm Leaderboard Banner */}
        <Card className="border border-stone-200 bg-[#064E3B] text-white shadow-md">
          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xl flex-shrink-0 border border-emerald-700">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-emerald-300 font-mono uppercase tracking-wider block">
                  Inter-Dorm Sustainability Cup Standings
                </span>
                <h3 className="text-lg font-bold text-white">Founders Hall Room 304 is in 3rd Place!</h3>
                <p className="text-xs text-emerald-100/80">32.5 kg CO2e monthly room footprint (-24% vs campus dorm average)</p>
              </div>
            </div>

            <Badge variant="emerald" className="self-start sm:self-auto font-mono text-xs">
              Top 5% Campus Per-Capita
            </Badge>
          </CardContent>
        </Card>

        {/* Personal Goal Tracking Widget & Deadline Push Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Goals Widget */}
          <Card className="lg:col-span-2 border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-700" />
                <span>Personal Eco &amp; Academic Goals</span>
              </CardTitle>
              <Button onClick={() => setIsAddGoalOpen(!isAddGoalOpen)} variant="outline" size="sm" className="gap-1 text-xs cursor-pointer">
                <Plus className="h-3.5 w-3.5" /> Add Goal
              </Button>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              {isAddGoalOpen && (
                <form onSubmit={handleAddGoal} className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="New personal sustainability goal..."
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-300"
                  />
                  <Button type="submit" variant="primary" size="sm" className="cursor-pointer">Save Goal</Button>
                </form>
              )}

              <div className="space-y-2">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      g.completed ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium' : 'bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${g.completed ? 'text-emerald-700' : 'text-stone-300'}`} />
                      <span className={g.completed ? 'line-through text-stone-500' : 'font-semibold'}>{g.title}</span>
                    </div>
                    <Badge variant={g.completed ? 'emerald' : 'stone'} size="xs">
                      {g.current}/{g.target} {g.unit}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Class & Department Challenge Deadline Push Alerts */}
          <Card className="border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <Bell className="h-4 w-4 text-emerald-700" />
                <span>Deadline Push Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-950">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-amber-700" /> CS Green Coding Deadline
                  </span>
                  <Badge variant="amber" size="xs">Ends in 4 hrs</Badge>
                </div>
                <p className="text-amber-900">
                  Submit model training energy benchmarks for Dr. Aris Thorne&apos;s CS-101 challenge.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <span>Inter-Dorm Cup Weekly Sync</span>
                  <Badge variant="emerald" size="xs">Tonight 23:59</Badge>
                </div>
                <p className="text-emerald-900">
                  Founders Hall Room 304 smart plug energy logs auto-syncing at midnight.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity & Campus Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-700" />
                <span>Recent Dorm &amp; Campus Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {[].slice(0, 4).map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-stone-900">{item.title}</div>
                    <div className="text-stone-600">{item.details}</div>
                    <span className="text-[10px] text-stone-400 font-mono">{item.timestamp}</span>
                  </div>
                  {item.pointsDelta && (
                    <span className="font-mono font-bold text-emerald-700">+{item.pointsDelta} pts</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <Bell className="h-4 w-4 text-emerald-700" />
                <span>Campus Grid &amp; Stream</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {notifications.slice(0, 4).map((notif) => (
                <div key={notif.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-stone-900">
                    <span>{notif.title}</span>
                    <span className="text-[10px] font-mono text-stone-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-stone-600">{notif.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
