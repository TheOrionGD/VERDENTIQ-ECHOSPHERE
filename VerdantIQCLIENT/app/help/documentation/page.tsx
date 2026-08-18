'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, Server, ShieldCheck, Cpu, Database, Layers, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DocumentationPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-emerald-800" />
            <Badge variant="emerald">Technical Docs</Badge>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
            VerdantIQ Architecture & Platform Documentation
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Official system manuals for Regional District Governance, Spring Boot multi-tenant isolation, XGBoost HVAC inference, and MILP energy optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card className="p-5 space-y-3 hover:border-emerald-600 transition-colors">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-950 flex items-center justify-center">
              <Server className="h-5 w-5" />
            </div>
            <h2 className="font-editorial text-lg font-bold text-stone-900">
              Spring Boot Tenant Provisioning
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Automated multi-tenant database schema isolation (`tenant_name`) with dedicated OAuth credentials, automated migration triggers, and cross-tenant privacy boundaries.
            </p>
            <Link href="/admin/database" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline pt-2">
              <span>View Database Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>

          <Card className="p-5 space-y-3 hover:border-emerald-600 transition-colors">
            <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-950 flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <h2 className="font-editorial text-lg font-bold text-stone-900">
              XGBoost & Isolation Forest Engine
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Real-time thermal drift detection in campus buildings, predictive EUI forecasting, and Isolation Forest evidence packet generation with geotagged OCR validation.
            </p>
            <Link href="/mlops/models" className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:underline pt-2">
              <span>View MLOps Models</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>

          <Card className="p-5 space-y-3 hover:border-emerald-600 transition-colors">
            <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-950 flex items-center justify-center">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="font-editorial text-lg font-bold text-stone-900">
              Regional District Grid
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Regional grid carbon intensity tracking (gCO2e/kWh), renewable energy shares, and district-level carbon capping rules across dynamically configured regional districts.
            </p>
            <Link href="/region/domains" className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:underline pt-2">
              <span>View District Domains</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        </div>

        <Card className="p-6 space-y-4 bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">8-Tier Security Standard</span>
          </div>
          <h2 className="font-editorial text-xl font-bold">Role Hierarchy & RBAC Governance</h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            VerdantIQ strictly enforces role-based access control from Tier 1 (Platform Admin) through Tier 4 (Regional District Admin) down to Tier 8 (Citizen Household). Custom Firebase token claims guarantee that data access is restricted to authorized scopes.
          </p>
          <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-stone-800 text-emerald-300 border border-stone-700">Firebase Claims</span>
            <span className="px-2.5 py-1 rounded bg-stone-800 text-emerald-300 border border-stone-700">AES-256 Encryption</span>
            <span className="px-2.5 py-1 rounded bg-stone-800 text-emerald-300 border border-stone-700">Postgres Schemas</span>
            <span className="px-2.5 py-1 rounded bg-stone-800 text-emerald-300 border border-stone-700">SHA-256 Audit Trails</span>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
