'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileCheck, ShieldCheck, Hash, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AuditHashesPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Hash className="h-5 w-5 text-emerald-800" />
            <Badge variant="emerald">Audit Trail</Badge>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
            SHA-256 Cryptographic Audit Hashes
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Immutable log verification guaranteeing non-repudiation of campus thermal setpoint modifications and regional carbon cap actions.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="font-editorial text-lg font-bold text-stone-900">Hash Chain Integrity</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every audit event logged by moderators, region admins, or automated XGBoost HVAC agents is chained cryptographically with the previous record's SHA-256 hash digest.
          </p>

          <div className="p-4 bg-stone-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto space-y-2">
            <div><strong>Block #1842 Hash:</strong> e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
            <div><strong>Block #1843 Hash:</strong> 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4</div>
            <div className="text-stone-400 text-[11px] pt-1">Chained & Timestamped by VerdantIQ SHA-256 Ledger • ISO 50001 Compliant</div>
          </div>

          <div className="pt-2">
            <Link href="/audit/logs" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline">
              <span>Inspect Live Audit Trail Logs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
