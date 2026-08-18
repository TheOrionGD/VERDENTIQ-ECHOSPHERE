// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { OmnibarQueryResponse } from '@/lib/services/assistantService';
import { Bot, Sparkles, Send, CheckCircle2, Trophy, GraduationCap, Zap, ShieldCheck, Database, Cpu } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function StudentAssistantPage() {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<OmnibarQueryResponse[]>([
    {
      query: 'How can Founders Hall Room 304 reach #1 in the Inter-Dorm Sustainability Cup?',
      intent: 'Campus Dorm Optimization',
      summary: 'To gain +6.0 EcoScore points and overtake Room 412, activate Eco-Sleep mode on your 650W Gaming PC during non-study hours (01:00-07:00) and shift laundry cycles to morning off-peak hours.',
      recommendedActions: [
        'Enable smart plug auto-sleep on Custom Gaming PC (Saves ~14.2 kWh/mo)',
        'Pledge Cafeteria Meatless Monday (+100 Green Credits)',
        'Join the CS-101 Algorithmic Efficiency Challenge (+250 points)',
      ],
      dataMetrics: [
        { label: 'Est. Monthly Savings', value: '18.5 kWh', delta: '-14.2%' },
        { label: 'Rank Potential', value: '#1 Founders Hall', delta: '+2 Ranks' },
        { label: 'Green Credits Delta', value: '+350 Points', delta: '+25%' },
      ],
    },
  ]);

  const handleQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = await ([] as any);
      setHistory((prev) => [res, ...prev]);
      setQuery('');
      toast.success('Omnibar Synthesis Complete', res.intent);
    } catch {
      toast.error('Synthesis Error', 'Failed to generate response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bot className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald" dot>Campus Omnibar AI Assistant</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Student AI Assistant & Campus Natural Language Omnibar
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Ask natural language queries over your dorm room digital twin, class challenge standings, faculty research links, and cafeteria credits.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-100 p-2.5 rounded-2xl border border-stone-200 text-xs">
            <div className="flex items-center gap-1.5 text-stone-700">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="font-medium">Groq (Fast)</span>
            </div>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-1.5 text-stone-700">
              <Sparkles className="h-4 w-4 text-emerald-700" />
              <span className="font-medium">Gemini (Deep Context)</span>
            </div>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Grounded Student Context</span>
            </div>
          </div>
        </div>

        {/* Input Query Bar */}
        <Card className="p-4 bg-emerald-950/5 border-emerald-800/20 shadow-xs">
          <form onSubmit={handleQuery} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about dorm power savings, inter-dorm cup rank, or research endorsement (e.g. 'How do I claim my campus cafeteria credit?')..."
              className="flex-1 h-10 px-4 text-xs bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-700 font-sans shadow-2xs"
            />
            <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="cursor-pointer">
              <Send className="h-4 w-4 mr-1" /> Query Student Omnibar
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-stone-500">
            <span className="font-semibold text-stone-700">Student Sample Queries:</span>
            <button
              type="button"
              onClick={() => setQuery('How can Founders Hall Room 304 climb the Inter-Dorm Cup leaderboard?')}
              className="text-emerald-800 hover:underline cursor-pointer bg-emerald-100/60 px-2 py-0.5 rounded-md"
            >
              Inter-Dorm Strategy
            </button>
            <button
              type="button"
              onClick={() => setQuery('What is the status of my academic project endorsement with Dr. Aris Thorne?')}
              className="text-emerald-800 hover:underline cursor-pointer bg-emerald-100/60 px-2 py-0.5 rounded-md"
            >
              Faculty Mentor Status
            </button>
            <button
              type="button"
              onClick={() => setQuery('How many Green Credits do I need for 500 pages of campus printing?')}
              className="text-emerald-800 hover:underline cursor-pointer bg-emerald-100/60 px-2 py-0.5 rounded-md"
            >
              Printing Voucher Cost
            </button>
          </div>
        </Card>

        {/* Query History Stack */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-emerald-800" />
            <span>Response Feed & Synthesis Results</span>
          </h2>

          {history.map((item, idx) => (
            <Card key={idx} className="border border-stone-200/90 shadow-xs bg-white overflow-hidden">
              <CardHeader className="bg-stone-50/80 border-b border-stone-200/80 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-700" />
                    <span className="text-xs font-bold text-stone-900">{item.intent}</span>
                  </div>
                  <Badge variant="emerald" dot>Grounded Campus Context</Badge>
                </div>
                <div className="text-xs font-mono text-stone-600 mt-1">
                  Query: &quot;{item.query}&quot;
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                <p className="text-xs text-stone-700 leading-relaxed bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                  {item.summary}
                </p>

                {item.dataMetrics && item.dataMetrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {item.dataMetrics.map((m, mIdx) => (
                      <div key={mIdx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                        <div className="text-[11px] text-stone-500 font-medium">{m.label}</div>
                        <div className="text-xs font-bold text-stone-900 font-mono mt-0.5">{m.value}</div>
                        <div className="text-[10px] text-emerald-700 font-mono mt-0.5">{m.delta}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <h4 className="text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-2">
                    Recommended Student Actions
                  </h4>
                  <ul className="space-y-1.5">
                    {item.recommendedActions.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
