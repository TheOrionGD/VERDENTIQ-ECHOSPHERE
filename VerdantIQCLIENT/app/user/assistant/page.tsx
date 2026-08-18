// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { OmnibarQueryResponse } from '@/lib/services/({ getInitialChat: () => [], queryOmnibar: async () => [] })';
import { Bot, Sparkles, Send, CheckCircle2, ArrowRight, Zap, ShieldCheck, Database, Cpu } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function UserAssistantPage() {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<OmnibarQueryResponse[]>([
    {
      query: 'What is my optimal battery dispatch schedule for today?',
      intent: 'MILP Energy Optimization',
      summary: 'Based on your 4.8 kW solar PV output and peak grid tariff (16:00-19:00), discharge 6.2 kWh from Tesla Powerwall starting at 16:15 to offset $3.80/day peak charges.',
      recommendedActions: [
        'Set Powerwall to Time-of-Use mode (16:00-19:00 discharge)',
        'Pre-cool living room using heat pump between 13:00-15:00 during peak solar surplus',
        'Shift dishwasher run to 13:30',
      ],
      dataMetrics: [
        { label: 'Est. Daily Savings', value: '$3.80 / day', delta: '-32%' },
        { label: 'Carbon Avoidance', value: '4.2 kgCO2e', delta: 'Optimal' },
        { label: 'Battery Reserve SOC', value: '20% min', delta: 'Safe' },
      ],
    },
  ]);

  const handleQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = await ({ getInitialChat: () => [], queryOmnibar: async () => [] }).queryOmnibar(query, 'user');
      setHistory((prev) => [res, ...prev]);
      setQuery('');
      toast.success('Omnibar Synthesis Complete', res.intent);
    } catch (err) {
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
              <Badge variant="emerald" dot>Grounded Omnibar AI Engine</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Household AI Assistant & Natural Language Omnibar
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Ask natural language queries over your digital twin parameters, forecast models, and MILP optimization trajectories.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-100 p-2.5 rounded-2xl border border-stone-200 text-xs">
            <div className="flex items-center gap-1.5 text-stone-700">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="font-medium">Groq (Fast Routing)</span>
            </div>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-1.5 text-stone-700">
              <Sparkles className="h-4 w-4 text-emerald-700" />
              <span className="font-medium">Gemini (Deep Context)</span>
            </div>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Grounded Fallback</span>
            </div>
          </div>
        </div>

        {/* Input Query Bar */}
        <Card className="p-4 bg-emerald-950/5 border-emerald-800/20">
          <form onSubmit={handleQuery} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about your energy usage, bill anomalies, or carbon savings (e.g. 'Why did my heat pump power draw spike yesterday?')..."
              className="flex-1 h-10 px-4 text-xs bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-700 font-sans shadow-2xs"
            />
            <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
              <Send className="h-4 w-4 mr-1" /> Query Omnibar
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-stone-500">
            <span className="font-semibold text-stone-700">Sample Queries:</span>
            <button
              type="button"
              onClick={() => setQuery('Why did my heat pump power draw spike yesterday?')}
              className="text-emerald-800 hover:underline cursor-pointer bg-emerald-100/60 px-2 py-0.5 rounded-md"
            >
              Heat Pump Anomaly
            </button>
            <button
              type="button"
              onClick={() => setQuery('How can I increase my EcoScore by 5 points this week?')}
              className="text-emerald-800 hover:underline cursor-pointer bg-emerald-100/60 px-2 py-0.5 rounded-md"
            >
              EcoScore Boost
            </button>
            <button
              type="button"
              onClick={() => setQuery('Cross-check my June electricity bill OCR against smart meter history')}
              className="text-emerald-800 hover:underline cursor-pointer bg-emerald-100/60 px-2 py-0.5 rounded-md"
            >
              Bill OCR Cross-Check
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
                  <Badge variant="emerald" dot>Grounded Local Context</Badge>
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
                        <div className="text-sm font-bold text-stone-900 font-mono mt-0.5">{m.value}</div>
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{m.delta}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <h4 className="text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-2">
                    Recommended Actions (MILP Priority Order)
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
