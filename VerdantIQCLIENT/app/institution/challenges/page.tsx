// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Plus,
  Zap,
  Calendar,
  Sparkles,
  Building,
  Target,
  ArrowRight,
} from 'lucide-react';
import { ChallengeApprovalItem } from '@/lib/services/institutionService';

export default function TenantChallengesApprovalPage() {
  const [challenges, setChallenges] = useState<ChallengeApprovalItem[]>(() => ([] as any));
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'all'>('pending');

  const handleReview = (id: string, action: 'Approved' | 'Rejected') => {
    ([] as any);
    setChallenges(([] as any));
  };

  const filtered = challenges.filter((c) => {
    if (activeTab === 'pending') return c.status === 'Pending Approval';
    if (activeTab === 'active') return c.status === 'Active Campaign' || c.status === 'Approved';
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-5 w-5 text-purple-700" />
              <Badge variant="emerald">Tenant Challenge Workflow</Badge>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-mono">Tenant-wide Campaigns</span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Tenant Challenge Approval & Campaign Console
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Review department-proposed sustainability initiatives, validate carbon saving baselines, and approve tenant-wide campaigns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="emerald" size="sm" className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>New Institution Campaign</span>
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200/80 pb-3">
          {[
            { id: 'pending', label: 'Pending Approval', count: challenges.filter((c) => c.status === 'Pending Approval').length },
            { id: 'active', label: 'Active Campaigns', count: challenges.filter((c) => c.status === 'Active Campaign' || c.status === 'Approved').length },
            { id: 'all', label: 'All Challenges', count: challenges.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className="bg-stone-200/50 px-1.5 py-0.5 rounded-full text-[10px] font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1">{item.title}</h3>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <Building className="h-3 w-3 text-stone-400" />
                      {item.departmentName} (Proposed by {item.proposedBy})
                    </p>
                  </div>
                  <Badge
                    variant={
                      item.status === 'Active Campaign' || item.status === 'Approved'
                        ? 'emerald'
                        : item.status === 'Pending Approval'
                        ? 'amber'
                        : 'rose'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 my-2">{item.description}</p>

                <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-sans">Target Carbon Save</span>
                    <span className="font-bold text-emerald-900">{item.targetCarbonSavingKg.toLocaleString()} kg CO₂</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-sans">Reward Pool</span>
                    <span className="font-bold text-purple-900">{item.rewardPoints} Points</span>
                  </div>
                </div>
              </div>

              {item.status === 'Pending Approval' ? (
                <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReview(item.id, 'Rejected')}
                    className="w-1/2 text-xs text-rose-700 hover:bg-rose-50 border-rose-200 gap-1"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Reject Proposal</span>
                  </Button>
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => handleReview(item.id, 'Approved')}
                    className="w-1/2 text-xs gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approve & Publish</span>
                  </Button>
                </div>
              ) : (
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-stone-400" />
                    {item.startDate} to {item.endDate}
                  </span>
                  <span className="text-emerald-800 font-semibold text-[11px]">Published Tenant Campaign</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white border border-stone-200 rounded-2xl">
            <Trophy className="h-8 w-8 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-800">No Challenges Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              There are currently no proposals matching the selected status filter.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
