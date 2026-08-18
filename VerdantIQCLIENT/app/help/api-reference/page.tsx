'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Terminal, Code, Server, CheckCircle2 } from 'lucide-react';

export default function ApiReferencePage() {
  const apiEndpoints = [
    { method: 'GET', path: '/api/notifications', desc: 'Fetch user notifications, system alerts, and telemetry updates' },
    { method: 'POST', path: '/api/auth/verify-otp', desc: 'Verify OTP credentials and claim tokens for tenant access' },
    { method: 'POST', path: '/api/assistant/synthesize', desc: 'Synthesize thermal metrics using Gemini AI models' },
    { method: 'GET', path: '/api/institutions', desc: 'List active campus institutions across Regional Districts' },
    { method: 'GET', path: '/api/activity', desc: 'Query immutable audit logs and system event streams' },
    { method: 'POST', path: '/api/tenant-privacy/check', desc: 'Enforce tenant isolation privacy checks' },
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="h-5 w-5 text-emerald-800" />
            <Badge variant="emerald">API Reference</Badge>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
            VerdantIQ REST & Microservices API Reference
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Production system endpoints for BACnet telemetry ingestion, Spring Boot tenant provisioning, and Firebase ID Token verification.
          </p>
        </div>

        <div className="space-y-4">
          {apiEndpoints.map((ep, idx) => (
            <Card key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${ep.method === 'GET' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-blue-100 text-blue-950 border border-blue-300'}`}>
                    {ep.method}
                  </span>
                  <span className="font-bold text-stone-900 text-sm">{ep.path}</span>
                </div>
                <p className="text-stone-600 font-sans text-xs">{ep.desc}</p>
              </div>
              <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px] self-start sm:self-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>200 OK Active</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
