// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatGauge } from '@/components/ui/StatGauge';
import {
  FileText,
  Download,
  Calendar,
  Settings,
  Printer,
  CheckCircle2,
  Clock,
  Sparkles,
  Building,
  Sliders,
  Eye,
  Send,
} from 'lucide-react';
import { ExecutiveReportSchedule } from '@/lib/services/institutionService';

export default function ScheduledReportsPage() {
  const [schedules, setSchedules] = useState<ExecutiveReportSchedule[]>(() => ([] as any));
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [activeReportData, setActiveReportData] = useState<any>(null);
  const [generating, setGenerating] = useState<boolean>(false);

  // Parameter toggles for custom report run
  const [incMilp, setIncMilp] = useState(true);
  const [incHeatmap, setIncHeatmap] = useState(true);
  const [incAudit, setIncAudit] = useState(true);
  const [incFinancial, setIncFinancial] = useState(true);

  const handleGeneratePdf = (scheduleId: string) => {
    setGenerating(true);
    setTimeout(() => {
      const result = ([] as any);
      setSchedules(([] as any));
      setActiveReportData({
        reportId: result.reportId,
        generatedAt: result.generatedAt,
        institutionName: 'Pacific State University System',
        title: 'Executive ESG & Net-Zero Carbon Compliance Audit',
        author: 'Sophia Sterling (Institution Admin)',
        ecoScore: 94.2,
        totalCarbonOffsetKg: 114500,
        totalBudgetUsd: 680000,
        departmentsCount: 5,
        incMilp,
        incHeatmap,
        incAudit,
        incFinancial,
      });
      setGenerating(false);
      setShowPdfModal(true);
    }, 1200);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-5 w-5 text-blue-700" />
              <Badge variant="emerald">PDFBox Template Engine</Badge>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-mono">Automated Executive Export</span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Scheduled Executive Reports & PDF Generator
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Pulls aggregated MongoDB collections, MILP trade-off models, and IsolationForest anomaly outputs into a publication-ready PDF report for board trustees.
            </p>
          </div>

          <Button
            variant="emerald"
            size="sm"
            disabled={generating}
            onClick={() => handleGeneratePdf(schedules[0]?.id || 'REP-SCHED-01')}
            className="gap-1.5 text-xs"
          >
            {generating ? (
              <>
                <Clock className="h-3.5 w-3.5 animate-spin" />
                <span>Compiling PDFBox Report...</span>
              </>
            ) : (
              <>
                <FileText className="h-3.5 w-3.5" />
                <span>Run Immediate Executive Export</span>
              </>
            )}
          </Button>
        </div>

        {/* Report Parameter Customization Console */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Sliders className="h-4 w-4 text-emerald-800" />
            <span>PDFBox Templated Report Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer">
              <span>Include MILP Trade-off Frontier</span>
              <input
                type="checkbox"
                checked={incMilp}
                onChange={(e) => setIncMilp(e.target.checked)}
                className="accent-emerald-800"
              />
            </label>

            <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer">
              <span>Include Department Heatmap</span>
              <input
                type="checkbox"
                checked={incHeatmap}
                onChange={(e) => setIncHeatmap(e.target.checked)}
                className="accent-emerald-800"
              />
            </label>

            <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer">
              <span>Include Admin Audit Logs</span>
              <input
                type="checkbox"
                checked={incAudit}
                onChange={(e) => setIncAudit(e.target.checked)}
                className="accent-emerald-800"
              />
            </label>

            <label className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between cursor-pointer">
              <span>Include Budget vs Actuals</span>
              <input
                type="checkbox"
                checked={incFinancial}
                onChange={(e) => setIncFinancial(e.target.checked)}
                className="accent-emerald-800"
              />
            </label>
          </div>
        </div>

        {/* Scheduled Reports List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900">Scheduled Executive Recurrence Pipelines</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {item.frequency}
                      </span>
                      <h3 className="text-sm font-bold text-stone-900 mt-1">{item.title}</h3>
                      <p className="text-[11px] text-stone-500 mt-0.5">{item.templateName}</p>
                    </div>
                    <Badge variant={item.status === 'Completed' ? 'emerald' : 'amber'}>
                      {item.status}
                    </Badge>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 my-3 text-xs space-y-1">
                    <span className="text-[10px] text-stone-400 block font-sans">Board Recipients:</span>
                    <div className="flex flex-wrap gap-1 font-mono text-[11px] text-stone-700">
                      {item.recipients.map((r, i) => (
                        <span key={i} className="bg-white px-2 py-0.5 border rounded">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-500 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>Last Generated:</span>
                      <span className="text-stone-900 font-semibold">{item.lastGeneratedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Automated Run:</span>
                      <span className="text-emerald-800 font-semibold">{item.nextScheduledAt}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGeneratePdf(item.id)}
                    className="text-xs text-stone-800 gap-1"
                  >
                    <Eye className="h-3.5 w-3.5 text-stone-500" />
                    <span>Generate & Preview PDF</span>
                  </Button>
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => handleGeneratePdf(item.id)}
                    className="text-xs gap-1"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: PDF Executive Report Preview */}
        {showPdfModal && activeReportData && (
          <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto">
              {/* PDF Header Mock */}
              <div className="border-b border-stone-300 pb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest">
                      PDFBOX TEMPLATED REPORT
                    </span>
                    <Badge variant="emerald">{activeReportData.reportId}</Badge>
                  </div>
                  <h2 className="font-editorial text-2xl font-bold text-stone-900">
                    {activeReportData.title}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    {activeReportData.institutionName} • Generated at {activeReportData.generatedAt}
                  </p>
                </div>

                <button
                  onClick={() => setShowPdfModal(false)}
                  className="text-stone-400 hover:text-stone-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* PDF Document Body */}
              <div className="p-6 bg-stone-50 border border-stone-300 rounded-2xl space-y-6 text-stone-800 font-sans">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Executive Summary</h3>
                    <p className="text-xs text-stone-500">Author: {activeReportData.author}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-emerald-900 font-mono">{activeReportData.ecoScore}</span>
                    <span className="text-[10px] text-stone-500 block">Campus ESG Index</span>
                  </div>
                </div>

                {/* Section 1: Carbon & Financial Summary */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-white border rounded-xl">
                    <span className="text-stone-400 block font-sans text-[10px]">Net Carbon Offset</span>
                    <span className="text-base font-bold text-emerald-900">{activeReportData.totalCarbonOffsetKg.toLocaleString()} kg CO₂</span>
                  </div>
                  <div className="p-3 bg-white border rounded-xl">
                    <span className="text-stone-400 block font-sans text-[10px]">Annual Budget Allocated</span>
                    <span className="text-base font-bold text-stone-900">${activeReportData.totalBudgetUsd.toLocaleString()}</span>
                  </div>
                </div>

                {/* Optional Sections */}
                {activeReportData.incMilp && (
                  <div className="p-4 bg-white border rounded-xl text-xs space-y-1">
                    <h4 className="font-bold text-stone-900 font-sans">Portfolio MILP Trade-Off Analysis</h4>
                    <p className="text-stone-600 text-[11px]">
                      Optimal solver convergence reached in 1,420ms. Pareto frontier indicates maximum cost efficiency at 94.5% building coverage.
                    </p>
                  </div>
                )}

                {activeReportData.incHeatmap && (
                  <div className="p-4 bg-white border rounded-xl text-xs space-y-1">
                    <h4 className="font-bold text-stone-900 font-sans">Departmental Heatmap Audit</h4>
                    <p className="text-stone-600 text-[11px]">
                      Environmental Science leads with 96.8 EcoScore. Chemical Engineering under review due to minor HVAC schedule variance.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1 text-xs">
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Document</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowPdfModal(false)} className="text-xs">
                    Close Preview
                  </Button>
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => {
                      alert(`PDF Executive Report ${activeReportData.reportId} downloaded successfully!`);
                      setShowPdfModal(false);
                    }}
                    className="gap-1 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF File</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
