// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { SharedChallengeTemplate } from '@/lib/services/regionService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BarChart3, Trophy, Plus, TrendingUp, Users, Sparkles, Share2 } from 'lucide-react';

export default function RegionalAnalyticsPage() {
  const growthTrend = ([] as any);
  const [templates, setTemplates] = useState<SharedChallengeTemplate[]>(() => ([] as any));
  const [isCreatingTpl, setIsCreatingTpl] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Energy' | 'Waste' | 'Water' | 'HVAC'>('Energy');
  const [newMetric, setNewMetric] = useState('15% kWh reduction');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateTemplate = () => {
    if (!newTitle) return;
    const created = ([] as any);
    setTemplates(([] as any));
    setIsCreatingTpl(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Macro Analytics & Templates</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Regional Growth Trends & Challenge Template Hub
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Historical district growth, cumulative carbon offset trajectory, and inter-campus eco-challenge template distribution.
            </p>
          </div>

          <Button
            onClick={() => setIsCreatingTpl(true)}
            className="bg-[#064E3B] hover:bg-emerald-800 text-white text-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Shared Challenge Template
          </Button>
        </div>

        {/* Historical Region Growth Trend */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Historical Region Growth Trend (2023 - 2026)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Onboarded campus expansion, student population scaling, and cumulative carbon tons offset.
              </p>
            </div>
            <Badge variant="emerald">District Growth Data</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {growthTrend.map((pt) => (
              <div key={pt.yearQuarter} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>{pt.yearQuarter}</span>
                  <Badge variant="emerald">{pt.activeInstitutions} Campuses</Badge>
                </div>
                <div className="text-stone-600">Students: <strong>{pt.totalStudents.toLocaleString()}</strong></div>
                <div className="text-emerald-800 font-bold">CO2 Offset: {pt.aggregateCarbonOffsetTons.toLocaleString()} Tons</div>
                <div className="text-[11px] text-stone-500">Avg Accuracy: {pt.avgForecastAccuracy}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Institution Challenge Template Sharing Hub */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900">
                  Cross-Institution Challenge Template Sharing Hub
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Publish standardized eco-challenges to member institutions to drive inter-campus student gamification.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((tpl) => (
              <div key={tpl.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="emerald">{tpl.category}</Badge>
                    <span className="text-[11px] text-stone-400 font-mono">{tpl.durationDays} Days</span>
                  </div>
                  <h4 className="font-editorial text-base font-bold text-stone-900">{tpl.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{tpl.description}</p>
                </div>

                <div className="pt-2 border-t border-stone-200 text-xs flex items-center justify-between text-stone-600">
                  <span>Active on <strong>{tpl.activeInstitutions.length} Campuses</strong></span>
                  <span className="font-bold text-emerald-800">{tpl.targetMetric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Template Modal */}
        {isCreatingTpl && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-5 space-y-4">
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Publish New Cross-Campus Challenge Template
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Challenge Title *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Inter-Dorm Water Reduction Sprint"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Energy">Energy</option>
                    <option value="Waste">Waste</option>
                    <option value="Water">Water</option>
                    <option value="HVAC">HVAC</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Reduction Metric</label>
                  <input
                    type="text"
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    placeholder="e.g. 12% Water Conservation"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsCreatingTpl(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate} className="bg-[#064E3B] hover:bg-emerald-800 text-white">
                  Publish to All Campuses
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
