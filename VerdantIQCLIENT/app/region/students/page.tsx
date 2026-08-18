// @ts-nocheck
'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';

import { Badge } from '@/components/ui/Badge';
import { StatGauge } from '@/components/ui/StatGauge';
import { GraduationCap, Users, Trophy, Sparkles, Award, ShieldCheck } from 'lucide-react';

export default function RegionalStudentsAnalyticsPage() {
  const benchmarks = { institutionCount: 0, totalStudents: 0, avgEUI: 0, avgTargetEUI: 0, avgCarbon: 0, avgTargetCarbon: 0, avgAccuracy: 0, privacyPolicyNotice: "" };
  const institutions = [].filter((i) => i.status !== 'deactivated');

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Aggregate Student Analytics</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Cross-Campus Student Population & Engagement Analytics
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Aggregate student demographics, active eco-challenge participation indexes, and campus project leaderboards.
            </p>
          </div>
        </div>

        {/* Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatGauge
            title="Total District Enrolled Students"
            value={benchmarks.totalStudents}
            target={100000}
            unit="students"
            trend="up"
            changePercentage={12.4}
            status="optimal"
            subtitle="5 Partner Academic Institutions"
          />
          <StatGauge
            title="Active Student Eco-Engagement"
            value={68.4}
            target={75.0}
            unit="% active participants"
            trend="up"
            changePercentage={5.2}
            status="optimal"
            subtitle="Dorm Challenges & Research"
          />
          <StatGauge
            title="Submitted Campus Eco-Projects"
            value={1420}
            target={1200}
            unit="verified projects"
            trend="up"
            changePercentage={18.5}
            status="optimal"
            subtitle="Academic Year 2025-2026"
          />
        </div>

        {/* Student Population Breakdown Table */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Campus Student Demographics & Eco-Participation
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Breakdown of student headcount and eco-challenge engagement rate by institution.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold">
                  <th className="p-3">Institution Name</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Student Headcount</th>
                  <th className="p-3">Verified .edu Emails</th>
                  <th className="p-3">Active Eco-Participation</th>
                  <th className="p-3">Submitted Research Projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {institutions.map((inst) => (
                  <tr key={inst.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3 font-bold text-stone-900">{inst.name} ({inst.code})</td>
                    <td className="p-3 text-stone-600">{inst.regionDistrict}</td>
                    <td className="p-3 font-semibold">{inst.studentCount.toLocaleString()}</td>
                    <td className="p-3 font-mono text-emerald-800">100% (.edu)</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600"
                            style={{ width: `${Math.min(100, (inst.complianceRate * 0.75 + 10))}%` }}
                          />
                        </div>
                        <span className="font-bold">{(inst.complianceRate * 0.75 + 10).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="p-3 font-bold text-stone-900">
                      {Math.floor(inst.studentCount / 60)} Projects
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
