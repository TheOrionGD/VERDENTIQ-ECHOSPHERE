'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  MapPin,
  Trophy,
  CheckCircle2,
  Clock,
  Award,
  Compass,
  Sparkles,
} from 'lucide-react';
import { GeofencedChallenge,  } from '@/lib/services/userDataService';

export default function UserCommunityPage() {
  const [challenges, setChallenges] = useState<GeofencedChallenge[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('Sector 4 - Green Valley Residential');

  const toggleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              joined: !c.joined,
              participantsCount: c.joined ? c.participantsCount - 1 : c.participantsCount + 1,
            }
          : c
      )
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
              <Badge variant="emerald">Geofenced District Hub</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Community Sustainability Challenges
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Participate in neighborhood & regional microgrid energy reduction sprints.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl text-xs text-emerald-950 font-medium">
            <MapPin className="h-4 w-4 text-emerald-700" />
            <span>Your Zone: <strong>Sector 4 - Green Valley</strong></span>
          </div>
        </div>

        {/* Geofenced Zone Map Mock Banner */}
        <Card className="border border-stone-200 bg-stone-900 text-white overflow-hidden relative shadow-md">
          <div className="absolute inset-0 bg-dark-grid-pattern opacity-30 pointer-events-none" />
          <CardContent className="p-6 relative z-10 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-widest block mb-1">
                  Interactive Geospatial Map Node
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="h-5 w-5 text-emerald-400" />
                  <span>Green Valley Sector 4 Microgrid Zone</span>
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-emerald-300">
                  Lat: 37.7749° N, Lng: 122.4194° W
                </span>
                <Badge variant="emerald" dot>Grid Load Normal</Badge>
              </div>
            </div>

            {/* Map Visual Simulation Grid */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-emerald-900/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400">Zone Active Households</div>
                <div className="text-lg font-bold font-mono text-emerald-400">1,240 Nodes</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400">Zone Solar Feed-In</div>
                <div className="text-lg font-bold font-mono text-amber-400">842 kW Peak</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400">Current Challenge Sprint</div>
                <div className="text-lg font-bold font-mono text-sky-400">Peak Shaving v4</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geofenced Challenge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((chal) => (
            <Card
              key={chal.id}
              className={`border transition-all bg-white/90 shadow-xs ${
                chal.joined ? 'border-emerald-300 ring-1 ring-emerald-300' : 'border-stone-200'
              }`}
            >
              <CardHeader className="border-b border-stone-100 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="stone" size="xs">{chal.scope.toUpperCase()}</Badge>
                      <span className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-emerald-700" />
                        {chal.zone}
                      </span>
                    </div>
                    <CardTitle className="text-base text-stone-900">{chal.title}</CardTitle>
                  </div>
                  <Badge variant={chal.joined ? 'emerald' : 'stone'}>
                    {chal.joined ? 'Joined' : 'Open'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed">{chal.description}</p>

                {/* Progress Bar */}
                <div className="space-y-1.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex justify-between text-xs font-semibold text-stone-700">
                    <span>Target: {chal.targetKwhSavings} kWh Savings</span>
                    <span className="font-mono text-emerald-800 font-bold">{chal.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${chal.progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-stone-500" /> {chal.participantsCount} participants
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-600" /> {chal.daysRemaining} days left
                    </span>
                  </div>
                </div>

                {/* Reward Badge & Join Action */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-800">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span>+{chal.rewardPoints} EcoPoints</span>
                    <span className="text-stone-400 font-normal">({chal.badgeName})</span>
                  </div>

                  <Button
                    onClick={() => toggleJoin(chal.id)}
                    variant={chal.joined ? 'outline' : 'primary'}
                    size="sm"
                    className="gap-1.5 cursor-pointer text-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{chal.joined ? 'Leave Sprint' : 'Join Challenge'}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
