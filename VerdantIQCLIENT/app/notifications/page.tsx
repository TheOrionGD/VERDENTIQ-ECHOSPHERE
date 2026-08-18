// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { NotificationItem } from '@/lib/services/notificationsService';
import { Bell, AlertTriangle, AlertCircle, CheckCircle2, Info, Trash2, Pause, Play, Plus, SlidersHorizontal, Cpu } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, clearNotifications } = useAuth();
  const toast = useToast();

  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'unread'>('all');
  const [isolationScoreFilter, setIsolationScoreFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [isPaused, setIsPaused] = useState(false);

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'critical' && n.severity !== 'critical') return false;
    if (filter === 'warning' && n.severity !== 'warning') return false;

    const score = n.isolationForestScore ?? 0.75;
    if (isolationScoreFilter === 'high' && score <= 0.9) return false;
    if (isolationScoreFilter === 'mid' && (score < 0.7 || score > 0.9)) return false;
    if (isolationScoreFilter === 'low' && score >= 0.7) return false;

    return true;
  });

  const triggerManualNotification = () => {
    const fake = null as any;
    toast.info(`New SSE Event: ${fake.title}`, fake.description);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald" dot>Real-time Mock SSE Feed</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Environmental Telemetry & Alert Stream
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Simulated real-time Server-Sent Events (SSE) feed. Appends new telemetry warnings and optimization recommendations dynamically.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={triggerManualNotification}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Inject Event
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-3.5 w-3.5 mr-1" /> : <Pause className="h-3.5 w-3.5 mr-1" />}
              {isPaused ? 'Resume SSE' : 'Pause SSE'}
            </Button>
          </div>
        </div>

        {/* Filter Bar / Alert List Header */}
        <div className="alert-list-header flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-stone-200/90 rounded-xl shadow-xs">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-emerald-950 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-emerald-950 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Unread ({notifications.filter((n) => !n.read).length})
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filter === 'critical'
                    ? 'bg-rose-700 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setFilter('warning')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  filter === 'warning'
                    ? 'bg-amber-600 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Warnings
              </button>
            </div>

            {/* IsolationForest Confidence Score Dropdown Filter */}
            <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/90 font-mono text-xs">
              <Cpu className="h-3.5 w-3.5 text-emerald-800" />
              <span className="text-stone-500 font-sans font-semibold text-[11px]">IsolationForest Score:</span>
              <select
                value={isolationScoreFilter}
                onChange={(e) => setIsolationScoreFilter(e.target.value as any)}
                className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">All Scores</option>
                <option value="high">High (&gt; 0.90)</option>
                <option value="mid">Moderate (0.70 - 0.90)</option>
                <option value="low">Low (&lt; 0.70)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              clearNotifications();
              toast.info('Feed Cleared', 'All notifications cleared');
            }}
            className="text-stone-400 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear All
          </button>
        </div>

        {/* Feed Stream List */}
        <div className="space-y-3">
          {filteredNotifs.length === 0 ? (
            <Card className="p-8 text-center text-stone-500 text-xs">
              No notifications matching current filter criteria.
            </Card>
          ) : (
            filteredNotifs.map((n) => {
              const score = n.isolationForestScore ?? 0.75;
              const isHigh = score > 0.9;
              const isMid = score >= 0.7 && score <= 0.9;

              return (
                <Card
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-4 transition-all cursor-pointer ${
                    !n.read ? 'border-l-4 border-l-emerald-600 bg-emerald-50/20' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {n.severity === 'critical' && <AlertCircle className="h-5 w-5 text-rose-600" />}
                        {n.severity === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                        {n.severity === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                        {n.severity === 'info' && <Info className="h-5 w-5 text-emerald-800" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-xs text-stone-900">{n.title}</h3>
                          <Badge
                            variant={
                              n.severity === 'critical'
                                ? 'coral'
                                : n.severity === 'warning'
                                ? 'amber'
                                : 'emerald'
                            }
                          >
                            {n.source}
                          </Badge>

                          {/* IsolationForest Score Badge */}
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                              isHigh
                                ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                                : isMid
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            }`}
                            title="IsolationForest Anomaly Confidence Score"
                          >
                            <Cpu className="h-2.5 w-2.5" /> IF Score: {score.toFixed(2)}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 leading-relaxed">{n.description}</p>

                        {n.location && (
                          <span className="text-[10px] font-mono text-stone-400 block pt-1">
                            Location: {n.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-stone-400 whitespace-nowrap">
                      {n.timestamp}
                    </span>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
