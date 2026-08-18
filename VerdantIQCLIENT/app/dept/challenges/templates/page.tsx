// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { ChallengeTemplate } from '@/lib/services/deptService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Trophy, Cpu, Zap, Plus, Sparkles, CheckCircle, ArrowRight, Layers } from 'lucide-react';

export default function DeptChallengeTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>(() => []);
  const initialTmpl = templates[0] || null;
  const [selectedTemplate, setSelectedTemplate] = useState<ChallengeTemplate | null>(initialTmpl);
  const [title, setTitle] = useState(initialTmpl?.title || '');
  const [description, setDescription] = useState(initialTmpl?.description || '');
  const [durationDays, setDurationDays] = useState(initialTmpl?.defaultDurationDays || 14);
  const [targetReduction, setTargetReduction] = useState(initialTmpl?.recommendedReductionPercent || 15);
  const [xgboostData, setXgboostData] = useState<any>(null);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handleSelectTemplate = (tmpl: ChallengeTemplate) => {
    setSelectedTemplate(tmpl);
    setTitle(tmpl.title);
    setDescription(tmpl.description);
    setDurationDays(tmpl.defaultDurationDays);
    setTargetReduction(tmpl.recommendedReductionPercent);
  };

  const handleQueryXGBoost = () => {
    const data = null as any;
    setXgboostData(data);
  };

  const handlePublishChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    setPublishedSuccess(true);
    setTimeout(() => setPublishedSuccess(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        <RoleSubNav />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-5 w-5 text-amber-500" />
              <Badge variant="amber">Challenge Templates & Builder</Badge>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 font-editorial">
              Draft Challenge Builder & Template Library
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Instantiate challenge templates and query department XGBoost tenant baseline for AI-recommended KPI targets.
            </p>
          </div>
        </div>

        {/* 2-Column Split: Template Cards vs Challenge Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Templates Library */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-emerald-800" /> Reusable Challenge Templates ({templates.length})
            </h2>

            <div className="space-y-3">
              {templates.map((tmpl) => (
                <Card
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`p-4 border transition-all cursor-pointer ${
                    selectedTemplate?.id === tmpl.id
                      ? 'bg-amber-50/80 border-amber-500 shadow-sm'
                      : 'bg-white hover:bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-amber-950">{tmpl.id}</span>
                    <Badge variant="amber">{tmpl.category}</Badge>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900">{tmpl.title}</h3>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">{tmpl.description}</p>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span>Rec. Reduction: <strong>-{tmpl.recommendedReductionPercent}%</strong></span>
                    <span>Reward: <strong>+{tmpl.pointsReward} pts</strong></span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Builder with XGBoost Baseline Query */}
          <div className="lg:col-span-7">
            <Card className="p-6 bg-white border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-editorial">
                    Draft Challenge Configurator
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Configure target KPIs, duration, and baseline rules.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQueryXGBoost}
                  className="border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-mono gap-1"
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Query XGBoost Baseline</span>
                </Button>
              </div>

              {/* XGBoost Baseline Output Panel */}
              {xgboostData && (
                <div className="bg-emerald-950 text-emerald-100 p-4 rounded-xl space-y-3 font-mono text-xs border border-emerald-800">
                  <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-300">
                      <Sparkles className="h-4 w-4" /> Department XGBoost Baseline Model
                    </span>
                    <span className="text-[10px] text-emerald-400">Confidence: {xgboostData.modelConfidencePercent}%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>Daily Base Energy: <strong>{xgboostData.dailyHVACBaseKwh} kWh/day</strong></div>
                    <div>Predicted Peak: <strong>{xgboostData.predictedNextQuarterPeakKwh} kWh</strong></div>
                  </div>

                  <div>
                    <span className="block font-bold text-emerald-300 mb-1 text-[11px]">Suggested KPI Reduction Targets:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {xgboostData.suggestedKPITargets.map((tgt: any, i: number) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => {
                            setTargetReduction(i === 0 ? 10 : i === 1 ? 15 : 25);
                          }}
                          className="bg-emerald-900/80 hover:bg-emerald-800 p-2 rounded-lg border border-emerald-700 text-left cursor-pointer transition-all"
                        >
                          <div className="text-[10px] text-emerald-300 font-bold">{tgt.label}</div>
                          <div className="text-xs text-white font-bold">{tgt.targetKwhDay} kWh/day</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handlePublishChallenge} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Challenge Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Description & Rules</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Target Reduction %</label>
                    <input
                      type="number"
                      value={targetReduction}
                      onChange={(e) => setTargetReduction(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800 font-mono"
                    />
                  </div>
                </div>

                {publishedSuccess && (
                  <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-700" />
                    Challenge published & broadcast to department student cohort!
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    className="bg-[#064E3B] text-white hover:bg-emerald-900 text-xs font-bold gap-1.5"
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Publish Department Challenge</span>
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
