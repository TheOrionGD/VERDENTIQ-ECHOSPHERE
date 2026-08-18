// @ts-nocheck
'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

import { Activity, Clock, User, ShieldCheck } from 'lucide-react';

export default function MyActivityPage() {
  const logs = [] as any[];

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-5 w-5 text-emerald-800" />
            <Badge variant="emerald">Audit Trail</Badge>
          </div>
          <h1 className="font-editorial text-2xl font-bold text-stone-900">
            My Activity & System Audit Trail
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Immutable log of system actions, HVAC setpoint overrides, policy approvals, and auditor sign-offs.
          </p>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <Card key={log.id} className="p-4 flex items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">{log.action}</span>
                  <Badge variant="emerald">{log.module}</Badge>
                </div>
                <p className="text-stone-600 leading-relaxed">{log.details}</p>
                <div className="flex items-center gap-3 text-[10px] text-stone-400 font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {log.user} ({log.role})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {log.timestamp}
                  </span>
                </div>
              </div>

              <Badge
                variant={
                  log.status === 'completed'
                    ? 'emerald'
                    : log.status === 'flagged'
                    ? 'coral'
                    : 'amber'
                }
              >
                {log.status}
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
