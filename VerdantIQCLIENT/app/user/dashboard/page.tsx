// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { QuickSummaryWidget } from '@/components/dashboard/QuickSummaryWidget';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatGauge } from '@/components/ui/StatGauge';
import { useAuth } from '@/context/AuthContext';
import {
  Leaf,
  Zap,
  Droplets,
  Car,
  Trash2,
  Activity,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Users,
  Lightbulb,
  Cpu,
} from 'lucide-react';

export default function UserDashboardPage() {
  const { user, notifications } = useAuth();
  const [alertFilter, setAlertFilter] = useState<'all' | 'peak' | 'solar' | 'carbon'>('all');

  const filteredAlerts = notifications.filter((n) => {
    if (alertFilter === 'peak') return n.title.toLowerCase().includes('peak') || n.title.toLowerCase().includes('grid');
    if (alertFilter === 'solar') return n.title.toLowerCase().includes('solar') || n.title.toLowerCase().includes('inverter');
    if (alertFilter === 'carbon') return n.title.toLowerCase().includes('carbon') || n.title.toLowerCase().includes('emission');
    return true;
  });

  // AI Personalized Recommendations Feed
  const aiRecommendations = [
    {
      id: 'rec_1',
      title: 'XGBoost Shift: Shift Heat Pump Reheat to 13:00 Solar Peak',
      category: 'HVAC Thermal Load',
      impact: '-18.4 kg CO2e / mo',
      savings: '$24.50 / mo',
      confidence: 96,
      reason: 'Predicted 3.8 kW solar PV surplus between 12:30 and 15:00 tomorrow based on 90-day irradiance model.',
    },
    {
      id: 'rec_2',
      title: 'Powerwall Dispatch: Enable Off-Peak Arbitrage Mode',
      category: 'Battery Storage',
      impact: '-12.1 kg CO2e / mo',
      savings: '$38.20 / mo',
      confidence: 98,
      reason: 'Peak grid tariff rises to $0.42/kWh at 16:00. Discharging 6.2 kWh battery reserve offsets full peak window.',
    },
    {
      id: 'rec_3',
      title: 'Peer Cohort Insight: Standby Power Reduction',
      category: 'Smart Plugs',
      impact: '-6.2 kg CO2e / mo',
      savings: '$8.10 / mo',
      confidence: 91,
      reason: 'Your household overnight idle power draw (180W) is +28% higher than top-quantile peer cohort in Green Valley.',
    },
  ];

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="stone" dot>Standard User</Badge>
              <span className="text-xs font-mono text-stone-500">Node ID: USR-8921-SF</span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Personal Eco Dashboard
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Live EcoScore breakdown, energy telemetry, activity highlights and real-time grid alerts.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 p-3 rounded-2xl">
            <ShieldCheck className="h-5 w-5 text-emerald-700 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-semibold text-emerald-950">Verified Household Node</div>
              <div className="text-emerald-700 font-mono text-[11px]">{user.name} • {user.department || 'Residential Zone 4'}</div>
            </div>
          </div>
        </div>

        {/* Dynamic Quick Summary Dashboard Widget */}
        <QuickSummaryWidget />

        {/* Top Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatGauge
            title="Overall EcoScore"
            value={84.5}
            target={100}
            unit="/ 100 Index"
            trend="up"
            changePercentage={6.2}
            status="optimal"
            subtitle="Top 12% in Green Valley District"
          />
          <StatGauge
            title="Personal Carbon Footprint"
            value={142.8}
            target={220.0}
            unit="gCO2e / kWh"
            trend="down"
            changePercentage={18.4}
            status="optimal"
            subtitle="Calculated from household telemetry"
          />
          <StatGauge
            title="Monthly Grid Energy Usage"
            value={328}
            target={450}
            unit="kWh Total"
            trend="down"
            changePercentage={12.1}
            status="optimal"
            subtitle="Solar PV offset: 42%"
          />
        </div>

        {/* EcoScore Breakdown Panel */}
        <Card className="border border-stone-200 bg-white/90 shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-stone-900">
                  <Leaf className="h-5 w-5 text-emerald-700" />
                  <span>EcoScore Rating Breakdown</span>
                </CardTitle>
                <CardDescription>Multi-vector sustainability index weighted across 4 key operational domains</CardDescription>
              </div>
              <Badge variant="emerald" dot>Real-time Calculation</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Energy Efficiency */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                    <Zap className="h-4 w-4 text-amber-600" /> Energy Efficiency
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-800">38/40 pts</span>
                </div>
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full w-[95%]" />
                </div>
                <p className="text-[11px] text-stone-500">Heat Pump & Solar Inverter running at 94% thermal efficiency.</p>
              </div>

              {/* Water Conservation */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                    <Droplets className="h-4 w-4 text-sky-600" /> Water Conservation
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-800">22/25 pts</span>
                </div>
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full w-[88%]" />
                </div>
                <p className="text-[11px] text-stone-500">Smart heater schedule reduced standby reheat cycles by 3.2 hrs/day.</p>
              </div>

              {/* Clean Mobility */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                    <Car className="h-4 w-4 text-emerald-600" /> Clean Mobility
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-800">18/20 pts</span>
                </div>
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full w-[90%]" />
                </div>
                <p className="text-[11px] text-stone-500">100% off-peak EV charging window compliance during July.</p>
              </div>

              {/* Waste & Circularity */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                    <Trash2 className="h-4 w-4 text-stone-600" /> Waste Reduction
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-800">11.5/15 pts</span>
                </div>
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-stone-600 rounded-full w-[76%]" />
                </div>
                <p className="text-[11px] text-stone-500">District composting active; 4.2 kg waste diverted this week.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personalized AI Recommendations & Peer Cohort Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Recommendation Feed (2 cols) */}
          <Card className="lg:col-span-2 border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-stone-900 text-base">
                  <Sparkles className="h-4 w-4 text-emerald-700" />
                  <span>Personalized AI Recommendation Feed</span>
                </CardTitle>
                <Badge variant="emerald" dot>Groq & Gemini Synthesized</Badge>
              </div>
              <CardDescription>Tailored dispatch suggestions based on 90-day history & twin parameters</CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              {aiRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200 hover:bg-stone-100/80 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-600 flex-shrink-0" />
                      <span className="text-xs font-bold text-stone-900">{rec.title}</span>
                      <Badge variant="stone" size="xs">{rec.category}</Badge>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <Badge variant="emerald">{rec.impact}</Badge>
                      <Badge variant="amber">{rec.savings}</Badge>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed pl-6">{rec.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Anonymized Peer Cohort Comparison (1 col) */}
          <Card className="border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="flex items-center gap-2 text-stone-900 text-base">
                <Users className="h-4 w-4 text-emerald-700" />
                <span>Peer Cohort Benchmark</span>
              </CardTitle>
              <CardDescription>Anonymized IsolationForest cohort scoring</CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-center">
                <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider block">Cohort Quantile Position</span>
                <span className="text-2xl font-bold font-editorial text-emerald-950">Top 12th Percentile</span>
                <span className="text-[11px] text-emerald-700 block font-mono">Peer Group: 2,200 sq ft Single Family Homes</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="text-stone-600">Daily kWh Load</span>
                    <span className="font-bold text-emerald-800">10.9 kWh (You) vs 15.4 kWh (Avg)</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[70%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="text-stone-600">Carbon Intensity</span>
                    <span className="font-bold text-emerald-800">142 gCO2e vs 210 gCO2e (Avg)</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[67%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="text-stone-600">Solar PV Self-Consumption</span>
                    <span className="font-bold text-amber-800">78% (You) vs 62% (Avg)</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[85%]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lower Grid: Recent Activity & SSE Alert Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity Summary */}
          <Card className="border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-stone-900 text-base">
                  <Activity className="h-4 w-4 text-emerald-700" />
                  <span>Recent Activity Summary</span>
                </CardTitle>
                <span className="text-xs text-stone-500">Last 7 Days</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {[].slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/80 flex items-start justify-between gap-3 hover:bg-stone-100/80 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{item.title}</span>
                      <Badge variant="stone" size="xs">{item.category}</Badge>
                    </div>
                    <p className="text-xs text-stone-600">{item.details}</p>
                    <span className="text-[10px] text-stone-400 font-mono">{item.timestamp}</span>
                  </div>
                  {item.pointsDelta && (
                    <span
                      className={`text-xs font-mono font-bold ${
                        item.pointsDelta > 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {item.pointsDelta > 0 ? `+${item.pointsDelta}` : item.pointsDelta} pts
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SSE-Style Alert Feed */}
          <Card className="border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-stone-900 text-base">
                  <Bell className="h-4 w-4 text-emerald-700" />
                  <span>SSE Live Grid Stream Feed</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                </CardTitle>

                {/* Filter Buttons */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-[10px]">
                  <button
                    onClick={() => setAlertFilter('all')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                      alertFilter === 'all' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setAlertFilter('peak')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                      alertFilter === 'peak' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Peak
                  </button>
                  <button
                    onClick={() => setAlertFilter('solar')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                      alertFilter === 'solar' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Solar
                  </button>
                  <button
                    onClick={() => setAlertFilter('carbon')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                      alertFilter === 'carbon' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Carbon
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3 max-h-[320px] overflow-y-auto">
              {filteredAlerts.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-500">
                  No alerts matching selected filter criteria.
                </div>
              ) : (
                filteredAlerts.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl border border-stone-200/90 bg-stone-50/50 flex items-start gap-3 hover:bg-stone-100/60 transition-colors"
                  >
                    <div className="mt-0.5">
                      {notif.severity === 'critical' ? (
                        <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                      ) : notif.severity === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{notif.title}</span>
                        <span className="text-[10px] font-mono text-stone-400">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-stone-600">{notif.description}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
