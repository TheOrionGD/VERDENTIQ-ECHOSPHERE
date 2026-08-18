'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Database, Server, Layers, CheckCircle2 } from 'lucide-react';

export default function PostgresIsolationPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-5 w-5 text-emerald-800" />
            <Badge variant="emerald">Database Architecture</Badge>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
            Postgres Multi-Tenant Schema Isolation
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Strict schema-per-tenant architecture managed by Spring Boot microservices.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="font-editorial text-lg font-bold text-stone-900">Isolation Mechanics</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            When an institution tenant request is approved by the Regional Admin, VerdantIQ executes a Flyway migration script to instantiate an isolated PostgreSQL schema (e.g. `tenant_annauniv_edu`). Query execution is constrained to the active tenant schema using dynamic connection routing.
          </p>

          <div className="p-4 bg-stone-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
            <pre>{`-- Spring Boot Automated Tenant Schema Provisioning
CREATE SCHEMA IF NOT EXISTS "tenant_annauniv_edu";
SET search_path TO "tenant_annauniv_edu", public;

CREATE TABLE "tenant_annauniv_edu".hvac_sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id VARCHAR(64) NOT NULL,
  current_temp_c NUMERIC(4,1),
  setpoint_c NUMERIC(4,1),
  power_kw NUMERIC(6,2),
  xgboost_anomaly_score NUMERIC(3,2)
);`}</pre>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
