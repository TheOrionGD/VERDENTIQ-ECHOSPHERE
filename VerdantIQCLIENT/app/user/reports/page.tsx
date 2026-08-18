'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  Leaf,
  Sparkles,
} from 'lucide-react';

export default function UserReportsPage() {
  const handleDownloadReport = () => {
    alert('Exporting VerdantIQ Official ESG Certificate & Telemetry Audit (PDF)...');
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">ISO 14064 Compliance</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Personal ESG & Sustainability Reports
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Verified monthly carbon statements, building telemetry summaries, and downloadable ESG certificates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleDownloadReport} variant="outline" size="sm" className="gap-1.5 cursor-pointer text-xs">
              <Printer className="h-4 w-4" />
              <span>Print Certificate</span>
            </Button>
            <Button onClick={handleDownloadReport} variant="primary" size="sm" className="gap-1.5 cursor-pointer text-xs">
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

        {/* Certificate Preview Card */}
        <Card className="border-2 border-emerald-800/30 bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-950 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-dark-grid-pattern opacity-20 pointer-events-none" />
          <CardContent className="p-8 relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  <Leaf className="h-6 w-6 text-emerald-300" />
                </div>
                <div>
                  <h2 className="font-editorial text-xl font-bold text-white">VerdantIQ Verified ESG Certificate</h2>
                  <p className="text-xs text-emerald-300 font-mono">Certificate ID: ESG-2026-USR-8921</p>
                </div>
              </div>

              <Badge variant="emerald" dot>Immutable Verification Active</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="p-4 rounded-xl bg-stone-900/80 border border-emerald-900/50 space-y-1">
                <span className="text-[10px] text-stone-400">Total Carbon Avoided</span>
                <div className="text-2xl font-bold text-emerald-400">1,280 kg CO2e</div>
                <span className="text-[10px] text-stone-500">Jul 2025 - Jul 2026</span>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/80 border border-emerald-900/50 space-y-1">
                <span className="text-[10px] text-stone-400">Solar PV Self-Generation</span>
                <div className="text-2xl font-bold text-amber-400">2,450 kWh</div>
                <span className="text-[10px] text-stone-500">42% total energy offset</span>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/80 border border-emerald-900/50 space-y-1">
                <span className="text-[10px] text-stone-400">District EcoScore Rank</span>
                <div className="text-2xl font-bold text-sky-400">Top 12%</div>
                <span className="text-[10px] text-stone-500">Green Valley Sector 4</span>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-emerald-100/80 gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Audited via VerdantIQ Cryptographic Telemetry Ledger</span>
              </div>
              <span className="font-mono text-[10px]">Issued: Aug 1, 2026 • Valid through Aug 2027</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
