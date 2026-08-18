// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatGauge } from '@/components/ui/StatGauge';
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Trophy,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { StudentRosterItem, OnboardingFunnelData,  } from '@/lib/services/institutionService';

export default function StudentRosterOversightPage() {
  const [students, setStudents] = useState<StudentRosterItem[]>(() => ([] as any));
  const [funnel, setFunnel] = useState<OnboardingFunnelData[]>(() => ([] as any));
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Flagged' : 'Active';
    ([] as any);
    setStudents(([] as any));
  };

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.subCohort.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="h-5 w-5 text-teal-700" />
              <Badge variant="emerald">Student Oversight</Badge>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-mono">Tenant Roster & Funnel</span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Institution-Wide Student Roster Oversight
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Monitor student onboarding funnel conversions, department sub-cohort affiliations, and verified carbon offset achievements.
            </p>
          </div>
        </div>

        {/* Member Onboarding Funnel View */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <UserCheck className="h-4 w-4 text-emerald-800" />
            <span>Member Onboarding Funnel Conversions</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {funnel.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-stone-600">{step.step}</span>
                  <span className="text-xs font-mono font-bold text-emerald-900">
                    {step.conversionPercent}%
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-stone-900">
                  {step.userCount.toLocaleString()}
                </div>
                {step.dropOffCount > 0 && (
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    Drop-off: {step.dropOffCount} accounts
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search students, emails, sub-cohorts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
            >
              <option value="ALL">All Departments</option>
              <option value="Bioengineering">Bioengineering</option>
              <option value="Computer Science & AI">Computer Science & AI</option>
              <option value="Environmental Science">Environmental Science</option>
            </select>
          </div>

          <div className="text-xs text-stone-500">
            Showing <strong>{filtered.length}</strong> of <strong>{students.length}</strong> Students
          </div>
        </div>

        {/* Roster Table */}
        <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50/80 border-b border-stone-200 font-semibold text-stone-800">
                <tr>
                  <th className="p-3.5">Rank</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Department & Sub-Cohort</th>
                  <th className="p-3.5">Verified Actions</th>
                  <th className="p-3.5">Carbon Offset</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-stone-500">
                      #{s.ecoRank}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-stone-900">{s.name}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{s.email}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-stone-800">{s.department}</div>
                      <div className="text-[10px] text-stone-400">{s.subCohort}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-900">
                      {s.verifiedActions} Claims
                    </td>
                    <td className="p-3.5 font-mono font-bold text-stone-800">
                      {s.carbonOffsetKg} kg CO₂
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          s.status === 'Active'
                            ? 'emerald'
                            : s.status === 'Flagged'
                            ? 'rose'
                            : 'amber'
                        }
                      >
                        {s.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(s.id, s.status)}
                        className="text-[11px] py-1"
                      >
                        {s.status === 'Active' ? 'Flag Account' : 'Reactivate'}
                      </Button>
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
