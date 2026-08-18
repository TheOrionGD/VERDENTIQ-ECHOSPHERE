// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { StatGauge } from '@/components/ui/StatGauge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
  Shield,
  CheckCircle2,
  MapPin,
  Building,
  Trophy,
  AlertTriangle,
  FileText,
  Globe,
  GraduationCap,
  BarChart3,
  Settings,
  TrendingUp,
  Zap,
  ArrowRight,
  Sparkles,
  Sliders,
  DollarSign,
  Activity,
  Check,
} from 'lucide-react';
import { DepartmentItem, MilpScenario, EscalationResolutionItem } from '@/lib/services/institutionService';
import { institutionApi } from '@/lib/api/endpoints';

export default function InstitutionDashboard() {
  const { user, roleConfig } = useAuth();
  const [departments, setDepartments] = useState<DepartmentItem[]>(() => ([] as any));
  const [milpScenarios, setMilpScenarios] = useState<MilpScenario[]>(() => ([] as any));
  const [escalations, setEscalations] = useState<EscalationResolutionItem[]>(() => ([] as any).filter((e) => e.status === 'open'));

  const totalBudget = departments.reduce((acc, d) => acc + d.budgetAnnualUsd, 0);
  const totalSpent = departments.reduce((acc, d) => acc + d.budgetSpentUsd, 0);
  const totalCarbonTarget = departments.reduce((acc, d) => acc + d.carbonTargetKg, 0);
  const totalCarbonActual = departments.reduce((acc, d) => acc + d.carbonActualKg, 0);

  const activeScenario = milpScenarios[0] || {
    totalCostUsd: 312500,
    totalCarbonOffsetKg: 114500,
    coveragePercent: 94.5,
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Role Group: Institution Admin</Badge>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-mono">Pacific State University System</span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Institution Admin Executive Center
            </h1>
            <p className="text-xs text-stone-500 mt-0.5 max-w-3xl">
              Campus-wide ESG reporting, department resource allocation, geofence boundary enforcement, portfolio-level MILP optimization, and AI anomaly escalation oversight.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/institution/reports">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <FileText className="h-3.5 w-3.5 text-emerald-700" />
                <span>Executive Reports</span>
              </Button>
            </Link>
            <Link href="/institution/analytics">
              <Button variant="emerald" size="sm" className="gap-1.5 text-xs">
                <Sliders className="h-3.5 w-3.5" />
                <span>MILP Optimization</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Navigation Cards (10 Pages Shortcuts) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {[
            { label: 'Geofence', href: '/institution/geofence', icon: MapPin, color: 'text-emerald-700' },
            { label: 'Depts', href: '/institution/departments', icon: Building, color: 'text-amber-700' },
            { label: 'Challenges', href: '/institution/challenges', icon: Trophy, color: 'text-purple-700' },
            { label: 'Escalations', href: '/institution/verify', icon: AlertTriangle, color: 'text-rose-700', badge: escalations.length },
            { label: 'Reports', href: '/institution/reports', icon: FileText, color: 'text-blue-700' },
            { label: 'Domains', href: '/institution/domains', icon: Globe, color: 'text-indigo-700' },
            { label: 'Students', href: '/institution/students', icon: GraduationCap, color: 'text-teal-700' },
            { label: 'Analytics', href: '/institution/analytics', icon: BarChart3, color: 'text-emerald-800' },
            { label: 'Settings', href: '/institution/settings', icon: Settings, color: 'text-stone-700' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="p-3 bg-white border border-stone-200/80 rounded-xl hover:border-emerald-500 hover:shadow-xs transition-all flex flex-col items-center text-center group relative"
              >
                {item.badge ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
                <Icon className={`h-4 w-4 ${item.color} mb-1.5 group-hover:scale-110 transition-transform`} />
                <span className="text-[11px] font-medium text-stone-700 group-hover:text-emerald-900">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Top Executive Key Performance Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatGauge
            title="Campus ESG Compliance Score"
            value={94.2}
            target={90.0}
            unit="/ 100 ESG Index"
            trend="up"
            changePercentage={4.2}
            status="optimal"
            subtitle="Pacific State University System"
          />
          <StatGauge
            title="On-site Solar Self-Consumption"
            value={38.6}
            target={50.0}
            unit="% of total load"
            trend="up"
            changePercentage={8.3}
            status="optimal"
            subtitle="Rooftop Array Alpha & Beta"
          />
          <StatGauge
            title="Net Carbon Offset"
            value={Math.round(totalCarbonActual / 1000)}
            target={Math.round(totalCarbonTarget / 1000)}
            unit="Metric Tons CO₂e"
            trend="up"
            changePercentage={12.4}
            status="optimal"
            subtitle="YTD Across 5 Departments"
          />
          <StatGauge
            title="Annual Budget Utilization"
            value={Number(((totalSpent / totalBudget) * 100).toFixed(1))}
            target={100}
            unit="% ($497.5k / $680k)"
            trend="neutral"
            changePercentage={0.0}
            status="normal"
            subtitle="On track with Q3 forecast"
          />
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Performance Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                <div>
                  <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Building className="h-4 w-4 text-emerald-800" />
                    <span>Department ESG Performance & Budget Status</span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    Oversight across 5 faculties, total annual budget allocated: ${totalBudget.toLocaleString()}
                  </p>
                </div>
                <Link href="/institution/departments">
                  <Button variant="ghost" size="sm" className="text-xs text-emerald-800 hover:text-emerald-950 gap-1">
                    <span>Manage Depts</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {departments.length === 0 ? (
                  <div className="p-8 text-center bg-stone-50/50 border border-stone-200/80 rounded-xl space-y-2">
                    <Building className="h-8 w-8 text-stone-300 mx-auto" />
                    <p className="font-semibold text-stone-800 text-xs">No Departments Configured</p>
                    <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                      Create your institution's departments and faculties to start tracking budget allocations and carbon targets.
                    </p>
                    <Link href="/institution/departments">
                      <Button variant="emerald" size="sm" className="mt-2 text-xs">
                        Add First Department
                      </Button>
                    </Link>
                  </div>
                ) : (
                  departments.map((dept) => {
                  const budgetPercent = Math.min(100, (dept.budgetSpentUsd / dept.budgetAnnualUsd) * 100);
                  const carbonPercent = Math.min(100, (dept.carbonActualKg / dept.carbonTargetKg) * 100);

                  return (
                    <div
                      key={dept.id}
                      className="p-3.5 rounded-xl border border-stone-200/80 hover:border-emerald-300 transition-all bg-stone-50/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-stone-900">{dept.name}</span>
                            <Badge variant={dept.status === 'Active' ? 'emerald' : 'amber'}>
                              {dept.status}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-stone-500">
                            Mod: <strong>{dept.moderatorName}</strong> ({dept.moderatorEmail}) • {dept.locationBuilding}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-900">{dept.ecoScore}</span>
                            <span className="text-[10px] text-stone-400 block">EcoScore</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-medium text-stone-800">
                              {dept.memberCount} / {dept.headCount}
                            </span>
                            <span className="text-[10px] text-stone-400 block">Members</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bars */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1 border-t border-stone-200/50">
                        <div>
                          <div className="flex justify-between text-stone-600 mb-1">
                            <span>Budget Spent: ${dept.budgetSpentUsd.toLocaleString()}</span>
                            <span className="font-mono">{budgetPercent.toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${budgetPercent > 90 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                              style={{ width: `${budgetPercent}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-stone-600 mb-1">
                            <span>Carbon Offset: {dept.carbonActualKg.toLocaleString()} kg</span>
                            <span className="font-mono">{carbonPercent.toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-600 rounded-full"
                              style={{ width: `${carbonPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }))}
              </div>
            </div>

            {/* Portfolio MILP Optimization Summary */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-800" />
                  <h2 className="text-base font-bold text-stone-900">Tenant-Wide MILP Optimization Scenario</h2>
                </div>
                <Link href="/institution/analytics">
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <span>Full MILP Simulator</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <span className="text-[11px] text-stone-500 block">Total Portfolio Cost</span>
                  <span className="text-base font-bold text-stone-900 font-mono">
                    ${activeScenario.totalCostUsd?.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">Optimal Solver Run</span>
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80">
                  <span className="text-[11px] text-emerald-900 block">Carbon Offset Yield</span>
                  <span className="text-base font-bold text-emerald-950 font-mono">
                    {activeScenario.totalCarbonOffsetKg?.toLocaleString()} kg
                  </span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">CO₂ Equivalent</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <span className="text-[11px] text-stone-500 block">Building Coverage</span>
                  <span className="text-base font-bold text-stone-900 font-mono">
                    {activeScenario.coveragePercent}%
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">All 5 Faculties</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Urgent Escalations */}
          <div className="space-y-6">
            {/* Urgent Escalations Console Callout */}
            <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-stone-900">Pending Escalation Triage</h3>
                </div>
                <Badge variant="rose">{escalations.length} Open</Badge>
              </div>

              {escalations.length > 0 ? (
                <div className="space-y-3">
                  {escalations.map((esc) => (
                    <div key={esc.id} className="p-3 bg-rose-50/50 border border-rose-200/80 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-rose-950">{esc.title}</span>
                        <Badge variant="rose">{esc.priority}</Badge>
                      </div>
                      <p className="text-[11px] text-stone-600 mb-2">
                        {esc.departmentName} • Anomaly Score: <span className="font-mono font-bold text-rose-700">{esc.anomalyScore}</span>
                      </p>
                      <Link href="/institution/verify">
                        <Button variant="rose" size="sm" className="w-full text-xs">
                          Inspect Evidence & Label Ground Truth
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center bg-stone-50 rounded-xl border border-stone-200">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-stone-800">All Escalations Resolved</p>
                  <p className="text-[10px] text-stone-500">ML retraining pipeline buffer is up to date.</p>
                </div>
              )}
            </div>

            {/* Quick Geofence & Domain Status */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-800" />
                <span>Geofence & Domain Registry</span>
              </h3>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Geofence Status:</span>
                  <span className="font-semibold text-emerald-800">2dsphere Polygon ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Main Campus Area:</span>
                  <span className="font-mono">485,000 m² (48.5 Ha)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Containment Check:</span>
                  <span className="font-mono font-medium">$geoWithin enabled</span>
                </div>
                <div className="pt-2">
                  <Link href="/institution/geofence">
                    <Button variant="outline" size="sm" className="w-full text-xs text-emerald-800">
                      Edit Spatial Geofence Polygon
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Accepted Domains:</span>
                  <span className="font-semibold text-stone-900">5 Registered</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Auto-verify Active:</span>
                  <span className="font-mono text-emerald-800">@psu.edu, @bioeng.edu</span>
                </div>
                <div className="pt-2">
                  <Link href="/institution/domains">
                    <Button variant="outline" size="sm" className="w-full text-xs text-stone-800">
                      Manage Domain Registry
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Executive Report Generator Banner */}
            <div className="p-4 bg-gradient-to-br from-emerald-900 to-stone-900 text-white rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-300" />
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Executive PDF Generator</span>
              </div>
              <h4 className="text-sm font-bold">PDFBox Templated Board Report</h4>
              <p className="text-xs text-emerald-100/80">
                Pulls aggregated MongoDB collections, MILP solver outputs, and ML drift metrics into printable executive PDF reports.
              </p>
              <Link href="/institution/reports" className="block pt-1">
                <Button variant="emerald" size="sm" className="w-full text-xs">
                  Generate PDF Executive Report
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
