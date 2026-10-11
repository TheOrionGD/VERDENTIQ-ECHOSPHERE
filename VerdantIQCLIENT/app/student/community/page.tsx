'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Trophy,
  Award,
  Medal,
  GraduationCap,
  Sparkles,
  UserPlus,
  BookOpen,
  CheckCircle2,
  Globe,
} from 'lucide-react';

export default function StudentCommunityPage() {
  const [activeTab, setActiveTab] = useState<'dorm' | 'cohort' | 'department'>('dorm');

  const dormLeaderboard = [
    { rank: 1, name: 'Founders Hall Room 412', members: 'Marcus C. & Alex K.', score: 94.2, carbonKg: -45.8, badge: 'Gold Microgrid' },
    { rank: 2, name: 'Science Quad Dorm B', members: 'Elena R. & Priya S.', score: 91.0, carbonKg: -38.2, badge: 'Silver Solar' },
    { rank: 3, name: 'Founders Hall Room 304 (You)', members: 'Marcus Chen', score: 88.2, carbonKg: -32.5, badge: 'Bronze Vanguard' },
    { rank: 4, name: 'West Tower Room 108', members: 'David L. & Tom H.', score: 82.5, carbonKg: -28.0, badge: 'Green Node' },
    { rank: 5, name: 'International House Quad', members: 'Chen W. & Fatima A.', score: 79.1, carbonKg: -24.3, badge: 'Green Node' },
  ];

  const clubsAndGroups = [
    {
      id: 'club_1',
      name: 'CS Green Compute & AI Optimization Club',
      department: 'Computer Science',
      membersCount: 42,
      mentor: 'Dr. Aris Thorne',
      description: 'Focusing on energy-efficient neural network inference, GPU power capping, and carbon-aware batch job scheduling.',
      joined: true,
    },
    {
      id: 'club_2',
      name: 'Campus Microgrid & Solar Study Group',
      department: 'Electrical Engineering',
      membersCount: 28,
      mentor: 'Prof. Elena Vance',
      description: 'Hands-on analysis of Founders Hall solar inverter telemetry and battery discharge modeling.',
      joined: false,
    },
    {
      id: 'club_3',
      name: 'Inter-Dorm Eco-Ambassadors Quad',
      department: 'Campus Sustainability',
      membersCount: 65,
      mentor: 'Sophia Sterling',
      description: 'Organizing zero-waste dining drives, inter-dorm cup energy audits, and cafeteria compost tracking.',
      joined: false,
    },
  ];

  const [clubsState, setClubsState] = useState(clubsAndGroups);

  const toggleJoinClub = (id: string) => {
    setClubsState((prev) =>
      prev.map((c) => (c.id === id ? { ...c, joined: !c.joined } : c))
    );
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Cohort & Club Discovery</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Student Cohort Leaderboard & Green Clubs
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Compare inter-dorm standings, departmental rankings, and connect with peer study groups & green tech clubs.
            </p>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('dorm')}
              className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-all ${
                activeTab === 'dorm' ? 'bg-[#064E3B] text-white font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              Inter-Dorm Cup
            </button>
            <button
              onClick={() => setActiveTab('cohort')}
              className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-all ${
                activeTab === 'cohort' ? 'bg-[#064E3B] text-white font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              Class of &apos;26
            </button>
            <button
              onClick={() => setActiveTab('department')}
              className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-all ${
                activeTab === 'department' ? 'bg-[#064E3B] text-white font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              CS Dept
            </button>
          </div>
        </div>

        {/* Leaderboard Table Card */}
        <Card className="border border-stone-200 bg-white/90 shadow-xs">
          <CardHeader className="border-b border-stone-100 pb-3">
            <CardTitle className="text-base text-stone-900 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-600" />
              <span>Campus Standings ({activeTab.toUpperCase()})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono text-[11px]">
                  <th className="p-3 pl-6">Rank</th>
                  <th className="p-3">Dorm / Student Team</th>
                  <th className="p-3">Occupants</th>
                  <th className="p-3 text-right">EcoScore</th>
                  <th className="p-3 text-right">Carbon Avoided</th>
                  <th className="p-3 pr-6 text-right">Badge Honor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {dormLeaderboard.map((row) => (
                  <tr
                    key={row.rank}
                    className={`transition-colors ${
                      row.name.includes('(You)') ? 'bg-emerald-50/80 font-bold text-emerald-950' : 'hover:bg-stone-50'
                    }`}
                  >
                    <td className="p-3 pl-6 font-mono font-bold">
                      {row.rank === 1 ? '🥇 #1' : row.rank === 2 ? '🥈 #2' : row.rank === 3 ? '🥉 #3' : `#${row.rank}`}
                    </td>
                    <td className="p-3">{row.name}</td>
                    <td className="p-3 text-stone-500 font-mono">{row.members}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-800">{row.score}</td>
                    <td className="p-3 text-right font-mono text-stone-700">{row.carbonKg} kg</td>
                    <td className="p-3 pr-6 text-right">
                      <Badge variant={row.rank <= 3 ? 'emerald' : 'stone'} size="xs">{row.badge}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Peer Study Groups & Club Discovery */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
            <BookOpen className="h-4 w-4 text-emerald-800" />
            <h2 className="text-sm font-bold text-stone-900">Peer Study-Group & Campus Club Discovery</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clubsState.map((club) => (
              <Card key={club.id} className="border border-stone-200 bg-white/90 shadow-xs flex flex-col justify-between">
                <CardHeader className="border-b border-stone-100 pb-3">
                  <Badge variant="stone" size="xs">{club.department}</Badge>
                  <CardTitle className="text-sm font-bold text-stone-900 mt-1">{club.name}</CardTitle>
                </CardHeader>

                <CardContent className="pt-3 space-y-3 flex-1 flex flex-col justify-between text-xs">
                  <p className="text-stone-600 leading-relaxed">{club.description}</p>

                  <div className="pt-2 border-t border-stone-100 space-y-1 font-mono text-[11px] text-stone-500">
                    <div>Faculty Mentor: <strong className="text-emerald-900">{club.mentor}</strong></div>
                    <div>Active Members: <strong className="text-stone-800">{club.membersCount} students</strong></div>
                  </div>

                  <Button
                    onClick={() => toggleJoinClub(club.id)}
                    variant={club.joined ? 'outline' : 'primary'}
                    size="sm"
                    className="w-full gap-1.5 text-xs cursor-pointer"
                  >
                    {club.joined ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Member Enrolled</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>Join Club / Request Invite</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
