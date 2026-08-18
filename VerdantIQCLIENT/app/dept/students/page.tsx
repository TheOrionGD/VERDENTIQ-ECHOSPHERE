// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { StudentRecord } from '@/lib/services/deptService';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Trophy, GraduationCap, Flame, Zap, CheckCircle, Search } from 'lucide-react';

export default function DeptStudentsPage() {
  const [students, setStudents] = useState<StudentRecord[]>(() => ([] as any));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCohort, setSelectedCohort] = useState<string>('ALL');

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCohort = selectedCohort === 'ALL' || s.subCohort === selectedCohort;
    return matchesSearch && matchesCohort;
  });

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        <RoleSubNav />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-5 w-5 text-amber-500" />
              <Badge variant="amber">Department Leaderboard & Directory</Badge>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 font-editorial">
              Student Sustainability Leaderboard & Roster
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Rankings based on verified actions, carbon offset kg, and active streak days.
            </p>
          </div>
        </div>

        {/* Search & Cohort Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-stone-600">Sub-Cohort:</span>
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800"
            >
              <option value="ALL">All Sub-Cohorts</option>
              <option value="Grad AI & Synthetic Bio Lab">Grad AI & Synthetic Bio Lab</option>
              <option value="Undergrad Bio Lab A">Undergrad Bio Lab A</option>
              <option value="Faculty Research Labs">Faculty Research Labs</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Table */}
        <Card className="p-0 bg-white border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 font-mono text-[11px] text-stone-500 uppercase">
                <tr>
                  <th className="p-3.5">Rank</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Sub-Cohort</th>
                  <th className="p-3.5">Verified Actions</th>
                  <th className="p-3.5">CO₂ Offset (kg)</th>
                  <th className="p-3.5">Streak</th>
                  <th className="p-3.5">Points</th>
                  <th className="p-3.5">Domain Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-stone-700">
                      {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                    </td>
                    <td className="p-3.5 font-bold text-stone-900">
                      <div>{s.name}</div>
                      <div className="text-[10px] font-mono text-stone-400 font-normal">{s.email}</div>
                    </td>
                    <td className="p-3.5 text-stone-600 font-medium">
                      {s.subCohort}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-800">
                      {s.verifiedActionsCount}
                    </td>
                    <td className="p-3.5 font-mono text-stone-800">
                      {s.carbonOffsetKg} kg
                    </td>
                    <td className="p-3.5 font-mono text-amber-700 font-bold">
                      <span className="inline-flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5 text-amber-500 inline" />
                        {s.streakDays}d
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-950">
                      {s.points} pts
                    </td>
                    <td className="p-3.5">
                      <Badge variant={s.domainStatus === 'matched' ? 'emerald' : 'amber'}>
                        {s.domainStatus.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
