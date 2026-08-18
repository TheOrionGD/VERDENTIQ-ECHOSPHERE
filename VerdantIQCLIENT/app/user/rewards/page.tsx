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
  CheckCircle2,
  Sparkles,
  Ticket,
  Trees,
  Zap,
  Bus,
  Coffee,
  Printer,
} from 'lucide-react';
import { RewardItem } from '@/lib/services/userDataService';

export default function UserRewardsPage() {
  const [pointsBalance, setPointsBalance] = useState<number>(850);
  const [rewards, setRewards] = useState<RewardItem[]>([]);

  const handleClaimReward = (reward: RewardItem) => {
    if (pointsBalance < reward.pointsCost) {
      alert(`Insufficient Green Points! You need ${reward.pointsCost} points but have ${pointsBalance}.`);
      return;
    }

    const claimCode = 'VERDANT-' + String(reward.id).toUpperCase() + '-8810';
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
              <Badge variant="emerald">Eco-Incentive Marketplace</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Green Points & Redemption Catalog
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Redeem accumulated carbon reduction points for public transit discounts, smart hardware, and campus credits.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#064E3B] text-white shadow-md flex items-center gap-3">
            <Award className="h-6 w-6 text-emerald-300" />
            <div>
              <span className="text-[10px] text-emerald-200 font-mono uppercase tracking-wider block">Available Balance</span>
              <span className="text-xl font-bold font-mono text-white">{pointsBalance} Green Points</span>
            </div>
          </div>
        </div>

        {/* Rewards Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((rew) => (
            <Card key={rew.id} className="border border-stone-200 bg-white/90 shadow-xs flex flex-col justify-between">
              <CardHeader className="border-b border-stone-100 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="stone" size="xs">{rew.category}</Badge>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {rew.pointsCost} Points
                  </span>
                </div>
                <CardTitle className="text-sm font-bold text-stone-900 mt-2">{rew.title}</CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600">{rew.valueDescription}</p>

                {rew.claimed ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1 text-center">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Claimed Voucher Code</span>
                    <span className="font-mono text-sm font-bold text-emerald-950 select-all">{rew.code}</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleClaimReward(rew)}
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
