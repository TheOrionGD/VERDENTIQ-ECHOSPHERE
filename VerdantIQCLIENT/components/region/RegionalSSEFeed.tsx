// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { RegionalSSEEvent } from '@/lib/services/regionService';
import { Badge } from '@/components/ui/Badge';
import { Radio, Play, Pause, Trash2, Filter, AlertTriangle, CheckCircle2, Info, Zap } from 'lucide-react';

export const RegionalSSEFeed: React.FC = () => {
  const [events, setEvents] = useState<RegionalSSEEvent[]>(() => []);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'warning' | 'critical' | 'success'>('all');

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const mockEvents = [
        {
          type: 'BENCHMARK_UPDATE' as const,
          institutionName: 'Pacific State University',
          message: 'Real-time telemetry pulse received: EUI 112.1 kBtu/sqft.',
          severity: 'success' as const,
        },
        {
          type: 'FORECAST_DRIFT' as const,
          institutionName: 'West Coast Institute of Technology',
          message: 'HVAC load variance detected in Science Wing C (+4.2% error drift).',
          severity: 'warning' as const,
        },
        {
          type: 'SPRING_PROVISION' as const,
          institutionName: 'Cascade Maritime University',
          message: 'Spring Boot database index optimization task executed successfully.',
          severity: 'info' as const,
        },
      ];

      const chosen = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      const newEv = { ...chosen, id: Date.now().toString(), timestamp: new Date().toISOString() };
      setEvents((prev) => [newEv, ...prev.slice(0, 19)]);
    }, 6000);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredEvents = severityFilter === 'all'
    ? events
    : events.filter((e) => e.severity === severityFilter);

  const getSeverityIcon = (sev: RegionalSSEEvent['severity']) => {
    switch (sev) {
      case 'critical':
      case 'warning':
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />;
      default:
        return <Info className="h-3.5 w-3.5 text-stone-500 shrink-0" />;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio className="h-4 w-4 text-emerald-800" />
            {isLive && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
          </div>
          <div>
            <h3 className="font-editorial text-lg font-bold text-stone-900">
              Regional Server-Sent Events (SSE) Live Feed
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Live broadcast feed of campus benchmark updates, forecast drift alerts, and Spring Boot provisioning events.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1.5 rounded-xl font-medium border flex items-center gap-1.5 transition-all ${
              isLive
                ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                : 'bg-stone-100 text-stone-600 border-stone-300'
            }`}
          >
            {isLive ? <Pause className="h-3.5 w-3.5 text-emerald-700" /> : <Play className="h-3.5 w-3.5 text-stone-600" />}
            {isLive ? 'Live Streaming' : 'Paused'}
          </button>

          <button
            onClick={() => setEvents([])}
            className="p-1.5 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-100"
            title="Clear Stream"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-stone-500 font-medium">Filter Severity:</span>
        {(['all', 'warning', 'success'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-2.5 py-1 rounded-lg capitalize text-xs transition-all ${
              severityFilter === sev
                ? 'bg-[#064E3B] text-white font-semibold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Stream list */}
      <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-none pr-1">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-6 text-xs text-stone-400">No events matching severity filter</div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50/70 hover:bg-stone-100/80 transition-all flex items-start gap-2.5 text-xs"
            >
              <div className="mt-0.5">{getSeverityIcon(ev.severity)}</div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between font-semibold text-stone-900">
                  <span>{ev.institutionName || 'Regional System'}</span>
                  <span className="font-mono text-[10px] text-stone-400">{ev.timestamp}</span>
                </div>
                <p className="text-stone-600 leading-relaxed text-[11px]">{ev.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
