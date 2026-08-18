'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Lock, Key, CheckCircle2 } from 'lucide-react';

export default function FirebaseClaimsPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Key className="h-5 w-5 text-emerald-800" />
            <Badge variant="emerald">Security Spec</Badge>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
            Firebase ID Token Custom Claims
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Cryptographic identity token claims mapping users across VerdantIQ's 8 governance tiers.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="font-editorial text-lg font-bold text-stone-900">Custom Claim Payload Schema</h2>
          <div className="p-4 bg-stone-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
            <pre>{`{
  "uid": "usr_9921_tn_chennai",
  "email": "moderator@annauniv.edu",
  "role": "dept",
  "hierarchyLevel": 6,
  "tenantId": "tenant_annauniv_edu",
  "district": "tn-chennai",
  "institutionCode": "AU-ENG",
  "permissions": [
    "read:hvac_telemetry",
    "write:setpoint_tune",
    "submit:audit_report"
  ]
}`}</pre>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 font-mono">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Cryptographic Signature Verification</span>
            </div>
            <p className="text-xs text-stone-600">
              Tokens are signed using RSA256 private keys and verified at the Spring Boot Gateway on every REST request.
            </p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 font-mono">
              <Lock className="h-4 w-4 text-emerald-600" />
              <span>Zero Leakage Policy</span>
            </div>
            <p className="text-xs text-stone-600">
              Cross-tenant claim mismatches automatically trigger a HTTP 403 Forbidden alert to the Platform Admin audit queue.
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
