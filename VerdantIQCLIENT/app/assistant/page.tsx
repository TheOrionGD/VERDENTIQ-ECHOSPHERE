'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { OmnibarQueryResponse } from '@/lib/services/assistantService';
import { GoogleTasksReminderWidget } from '@/components/shared/GoogleTasksReminderWidget';
import { Bot, Send, CheckCircle2, Cpu, Database, MapPin, CloudSun } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';

export default function AssistantPage() {
  const toast = useToast();
  const { viewMode } = useAuth();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<OmnibarQueryResponse[]>([]);

  const isGroqRole = ['region', 'institution', 'dept', 'student'].includes(viewMode);

  const handleQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = await ({ getInitialChat: () => [], queryOmnibar: async (...args: any[]) => ({} as any) }).queryOmnibar(query, viewMode, location);
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
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald" dot>AI Decision Engine</Badge>
              <Badge variant="outline" className="text-[10px] font-mono">
                Role: {viewMode.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">AI Engine:</span>
              <Badge variant={isGroqRole ? 'amber' : 'emerald'} className="text-[10px]">
                <Cpu className="h-3 w-3 mr-1" />
                {isGroqRole ? 'Groq AI (Region/Inst/Dept/Student)' : 'Gemini AI (Admin/MLOps/Audit/User)'}
              </Badge>
            </div>
          </div>
          <h1 className="font-editorial text-2xl font-bold text-stone-900">
            VerdantIQ Full Omnibar AI Synthesizer
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Grounded decision support engine querying MongoDB database records, OpenStreetMap geocoding, and Open-Meteo live weather telemetry.
          </p>
        </div>

        {/* Location & Input Query Bar */}
        <Card className="p-4 bg-emerald-950/5 border-emerald-800/20 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-700 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Target Location (e.g. 'San Francisco, CA', 'District 1', 'Oakland')..."
              className="w-full sm:w-72 h-8 px-3 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-700"
            />
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              (Fetches OpenStreetMap coordinates & Open-Meteo weather)
            </span>
          </div>

          <form onSubmit={handleQuery} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Ask ${isGroqRole ? 'Groq AI' : 'Gemini AI'} about environmental telemetry, HVAC, or campus carbon...`}
              className="flex-1 h-10 px-4 text-xs bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-700 font-sans"
            />
            <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
              <Send className="h-4 w-4 mr-1" /> Synthesize
            </Button>
          </form>

          <div className="flex items-center gap-2 text-[11px] text-stone-500 flex-wrap">
            <span className="font-semibold text-stone-700">Preset Sample Prompts:</span>
            <button
              onClick={() => {
                setQuery('Analyze Life Sciences B HVAC anomaly');
              }}
              className="text-emerald-800 hover:underline cursor-pointer"
            >
              HVAC Anomaly
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setQuery('Compare Scope 2 emissions vs Q2 target');
              }}
              className="text-emerald-800 hover:underline cursor-pointer"
            >
              Scope 2 Carbon
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setQuery('Check ML Ops model latency & drift status');
              }}
              className="text-emerald-800 hover:underline cursor-pointer"
            >
              ML Telemetry
            </button>
          </div>
        </Card>

        {/* Google Tasks Reminder Launcher Card */}
        <GoogleTasksReminderWidget
          initialTitle="Follow up on AI Decision Synthesis Recommendations"
          initialNotes="Google Tasks reminder created from VerdantIQ Omnibar AI Decision Synthesizer."
        />

        {/* Query History Stack */}
        <div className="space-y-4">
          {history.length === 0 ? (
            <Card className="p-8 text-center text-stone-500 text-xs">
              No query history in this session. Type a prompt above or click one of the preset chips.
            </Card>
          ) : (
            history.map((res, idx) => (
              <Card key={idx} className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="emerald" dot>{res.intent}</Badge>
                    {res.aiEngine && (
                      <Badge variant="outline" className="text-[10px] font-mono">
                        <Cpu className="h-3 w-3 mr-1" /> {res.aiEngine}
                      </Badge>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">Query: &quot;{res.query}&quot;</span>
                </div>

                {/* Real-time telemetry banner if present */}
                {res.realtimeData && (
                  <div className="flex items-center gap-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/60 text-[11px] text-emerald-950 flex-wrap">
                    <div className="flex items-center gap-1 font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                      <span>{res.realtimeData.location}</span>
                    </div>
                    {res.realtimeData.weather && (
                      <div className="flex items-center gap-1 text-emerald-800">
                        <CloudSun className="h-3.5 w-3.5 text-amber-600" />
                        <span>
                          {res.realtimeData.weather.temperatureC}°C | {res.realtimeData.weather.humidityPct}% RH | Wind {res.realtimeData.weather.windSpeedKmh} km/h
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-emerald-800 ml-auto font-mono text-[10px]">
                      <Database className="h-3 w-3 text-emerald-700" />
                      <span>MongoDB Grounded</span>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 leading-relaxed font-medium">
                  {res.summary}
                </div>

                {res.dataMetrics && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {res.dataMetrics.map((m, i) => (
                      <div key={i} className="p-3 rounded-lg border border-stone-200 bg-white">
                        <div className="text-[10px] text-stone-500">{m.label}</div>
                        <div className="text-sm font-bold text-stone-900 mt-0.5">{m.value}</div>
                        <div className="text-[10px] font-semibold text-emerald-800 mt-0.5">{m.delta}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-stone-700 block">Recommended System Actions:</span>
                  <ul className="space-y-1">
                    {res.recommendedActions.map((act, i) => (
                      <li key={i} className="flex items-center gap-2 text-stone-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}

