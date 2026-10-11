'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Lock, Shield, Server, CheckCircle2 } from 'lucide-react';

export default function TenantEncryptionPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-5 w-5 text-emerald-800" />
            <Badge variant="emerald">Encryption Standard</Badge>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
            AES-256 Tenant Data Encryption
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            At-rest and in-transit encryption standards isolating campus telemetry and user credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="p-5 space-y-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-950 flex items-center justify-center font-bold">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="font-editorial text-lg font-bold text-stone-900">At-Rest Column Encryption</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              All sensitive columns in Postgres tenant schemas (student identities, building BACnet passwords, OCR verification records) are encrypted using AES-256-GCM with per-tenant encryption keys.
            </p>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-950 flex items-center justify-center font-bold">
              <Server className="h-5 w-5" />
            </div>
            <h2 className="font-editorial text-lg font-bold text-stone-900">In-Transit TLS 1.3</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              All BACnet IoT gateway connections and REST API traffic are enforced via TLS 1.3 encryption with strict HTTP Strict Transport Security (HSTS) headers.
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
