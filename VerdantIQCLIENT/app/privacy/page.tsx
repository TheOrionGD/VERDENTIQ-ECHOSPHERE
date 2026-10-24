'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/shell/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  FileText,
  UserCheck,
  CheckCircle2,
  Cpu,
  Globe,
  ArrowLeft,
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 24, 2026';

  const principles = [
    {
      icon: Eye,
      title: 'Zero Surveillance Telemetry',
      description:
        'All campus HVAC, power grid, and occupancy data are strictly aggregated into spatial cluster bins. No identifiable room-level camera or microphone data is ever captured.',
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description:
        'Sensor telemetry in-transit and at-rest is secured using AES-256 and TLS 1.3 cryptographic protocols with dedicated hardware enclave verification.',
    },
    {
      icon: Database,
      title: 'Auditor-Certified Governance',
      description:
        'Third-party academic researchers and ESG auditors only access anonymized, k-anonymity (k>=5) and differential privacy redacted datasets.',
    },
    {
      icon: UserCheck,
      title: 'Student & Resident Data Rights',
      description:
        'Campus dorm residents and household participants have the right to inspect, export in CSV/JSON, or delete their energy profiles at any time.',
    },
  ];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 select-none font-segoe pb-8">
        {/* Top Breadcrumb & Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                  Privacy Policy & Data Ethics Charter
                </h1>
                <Badge variant="emerald">FERPA / GDPR Verified</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                VerdantIQ Environmental Sustainability Intelligence Platform • Last Updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl win11-acrylic-surface border border-slate-800 space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-8">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Policy Sections */}
        <div className="space-y-4">
          <Card className="p-5 bg-slate-900/60 border-slate-800 text-xs text-slate-300 space-y-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              1. Information Collection and Telemetry Scope
            </h2>
            <p className="leading-relaxed text-slate-400">
              VerdantIQ ingests spatial temperature readings, kWh energy consumption, HVAC chiller operational metrics, and solar inverter output. We do not gather biometric information, continuous location trails, or personal browsing activities.
            </p>
          </Card>

          <Card className="p-5 bg-slate-900/60 border-slate-800 text-xs text-slate-300 space-y-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-teal-400" />
              2. Artificial Intelligence and ML Optimization
            </h2>
            <p className="leading-relaxed text-slate-400">
              Predictions produced by our MILP (Mixed-Integer Linear Programming) solvers and AI models execute strictly against aggregate facility models. Machine learning models do not profile individual residents and operate under strict model fairness constraints.
            </p>
          </Card>

          <Card className="p-5 bg-slate-900/60 border-slate-800 text-xs text-slate-300 space-y-3">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-400" />
              3. Data Retention and Institutional Governance
            </h2>
            <p className="leading-relaxed text-slate-400">
              Telemetry older than 36 months is irreversibly summarized into quarterly energy intensity indices according to GHG Protocol Corporate Standard compliance guidelines, with high-frequency micro-logs pruned automatically.
            </p>
          </Card>
        </div>

        {/* Footer Contact */}
        <div className="p-4 rounded-xl win11-acrylic-surface border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            Questions regarding our ethical privacy architecture? Contact the Data Protection Officer at{' '}
            <strong className="text-emerald-400">privacy@verdantiq.io</strong>
          </span>
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors inline-flex items-center gap-1.5 font-medium whitespace-nowrap"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
