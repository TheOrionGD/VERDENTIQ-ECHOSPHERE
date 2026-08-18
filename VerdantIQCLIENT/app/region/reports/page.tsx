'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RegionalPDFReportModal } from '@/components/region/RegionalPDFReportModal';
import { FileText, Download, Printer, Filter, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RegionalReportsPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const benchmarks = { institutionCount: 0, totalStudents: 0, avgEUI: 0, avgTargetEUI: 0, avgCarbon: 0, avgTargetCarbon: 0, avgAccuracy: 0, privacyPolicyNotice: "" };

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Compliance & Reporting</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Rolled-Up Regional PDFBox Report Generator
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Compile official multi-campus compliance documentation with custom district parameters and digital signatures.
            </p>
          </div>

          <Button
            onClick={() => setIsReportModalOpen(true)}
            className="bg-[#064E3B] hover:bg-emerald-800 text-white text-xs"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Launch Report Builder & PDFBox Generator
          </Button>
        </div>

        {/* Report Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Standard Report Stream</span>
            <h3 className="font-editorial text-lg font-bold text-stone-900">Quarterly ESG Compliance Rollup</h3>
            <p className="text-xs text-stone-600">
              Covers Scope 1 & 2 carbon intensity, campus EUI benchmarks, and district compliance alignment for state board submission.
            </p>
            <Button onClick={() => setIsReportModalOpen(true)} variant="outline" className="w-full text-xs mt-2">
              Generate 2026-Q3 Report
            </Button>
          </div>

          <div className="p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Specialized Audit</span>
            <h3 className="font-editorial text-lg font-bold text-stone-900">Cross-Campus Forecast Accuracy</h3>
            <p className="text-xs text-stone-600">
              Detailed breakdown of ML model prediction errors (MAPE), chiller anomalies, and support triage recommendations.
            </p>
            <Button onClick={() => setIsReportModalOpen(true)} variant="outline" className="w-full text-xs mt-2">
              Generate Audit Report
            </Button>
          </div>

          <div className="p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Student Engagement</span>
            <h3 className="font-editorial text-lg font-bold text-stone-900">Demographics & Challenge Impact</h3>
            <p className="text-xs text-stone-600">
              Anonymized student population stats, inter-campus dorm challenge participation, and total tons CO2 offset.
            </p>
            <Button onClick={() => setIsReportModalOpen(true)} variant="outline" className="w-full text-xs mt-2">
              Generate Impact Report
            </Button>
          </div>
        </div>

        {/* Modal */}
        <RegionalPDFReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      </div>
    </AppShell>
  );
}
