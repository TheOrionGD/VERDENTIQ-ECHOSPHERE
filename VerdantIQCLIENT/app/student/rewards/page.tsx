'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Gift,
  Award,
  Sparkles,
  GraduationCap,
  Coffee,
  Printer,
  Bike,
  BookOpen,
} from 'lucide-react';
import { RewardItem } from '@/lib/services/userDataService';

export default function StudentRewardsPage() {
  const [pointsBalance, setPointsBalance] = useState<number>(450);
  const [rewards, setRewards] = useState<RewardItem[]>([]);

  const handleClaim = (reward: RewardItem) => {
    if (pointsBalance < reward.pointsCost) {
      alert(`Insufficient Green Credits! You need ${reward.pointsCost} points.`);
      return;
    }

    const claimCode = 'CAMPUS-' + String(reward.id).toUpperCase() + '-9821';
    setPointsBalance((prev) => prev - reward.pointsCost);
    setRewards((prev) =>
      prev.map((r) => (r.id === reward.id ? { ...r, claimed: true, code: claimCode } : r))
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
              <Gift className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Campus Eco-Credits</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Campus Student Rewards & Perks
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Exchange dorm energy savings for campus cafeteria meal passes, library printing credits, and bookstore vouchers.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#064E3B] text-white shadow-md flex items-center gap-3">
            <Award className="h-6 w-6 text-emerald-300" />
            <div>
              <span className="text-[10px] text-emerald-200 font-mono uppercase tracking-wider block">Campus Credits</span>
              <span className="text-xl font-bold font-mono text-white">{pointsBalance} Green Credits</span>
            </div>
          </div>
        </div>

        {/* Campus Rewards Catalog */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((rew) => (
            <Card key={rew.id} className="border border-stone-200 bg-white/90 shadow-xs flex flex-col justify-between">
              <CardHeader className="border-b border-stone-100 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="stone" size="xs">{rew.category}</Badge>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {rew.pointsCost} Credits
                  </span>
                </div>
                <CardTitle className="text-sm font-bold text-stone-900 mt-2">{rew.title}</CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600">{rew.valueDescription}</p>

                {rew.claimed ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1 text-center">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Campus ID Voucher Code</span>
                    <span className="font-mono text-sm font-bold text-emerald-950 select-all">{rew.code}</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleClaim(rew)}
                    disabled={pointsBalance < rew.pointsCost}
                    variant="primary"
                    size="sm"
                    className="w-full gap-1.5 cursor-pointer text-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Claim Voucher ({rew.pointsCost} pts)</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
