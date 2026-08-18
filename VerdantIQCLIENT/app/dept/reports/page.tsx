// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { DecisionAuditLog } from '@/lib/services/deptService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileText, Download, Printer, ShieldCheck, History, CheckCircle2, Building, Sparkles } from 'lucide-react';

export default function DeptReportsPage() {
  const [auditLogs, setAuditLogs] = useState<DecisionAuditLog[]>(() => ([] as any));
  const [reportTitle, setReportTitle] = useState('Department of Bioengineering Q3 Sustainability & Moderation Audit');
  const [dateRange, setDateRange] = useState('July 1 - August 1, 2026');
  const [includeAuditTrail, setIncludeAuditTrail] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        <div className="print:hidden">
          <RoleSubNav />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4 print:hidden">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">PDF Export & Audit Trail</Badge>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 font-editorial">
              Department Governance & PDF Report Export
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Generate printable department compliance reports and inspect moderator personal decision audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              className="bg-[#064E3B] text-white hover:bg-emerald-900 text-xs font-bold gap-1.5"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Export PDF</span>
            </Button>
          </div>
        </div>

        {/* PDF Preview Document Container */}
        <Card className="p-8 bg-white border-stone-200 shadow-sm space-y-6 print:shadow-none print:border-none print:p-0">
          {/* Document Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-stone-900 pb-4">
            <div>
              <div className="flex items-center gap-2 text-stone-900 font-bold font-editorial text-xl">
                <Building className="h-6 w-6 text-emerald-800" />
                <span>Verdantiq Platform • Departmental Audit</span>
              </div>
              <p className="text-xs text-stone-600 font-mono mt-1">
                Tenant: Pacific State University | MongoDB `department_id: dept-bio-eng`
              </p>
            </div>

            <div className="text-right font-mono text-xs">
              <Badge variant="emerald">VERIFIED COMPLIANT</Badge>
              <div className="text-[10px] text-stone-500 mt-1">Generated: {new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Report Config Form (Hidden on print) */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3 text-xs print:hidden">
            <span className="font-bold text-stone-800 flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-emerald-700" /> Custom Report Parameters
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 font-medium mb-1">Report Title</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Reporting Period</label>
                <input
                  type="text"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs text-stone-800 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Printable Report Body */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-stone-900 font-editorial">{reportTitle}</h2>
            <p className="text-xs text-stone-600">Reporting Period: <strong>{dateRange}</strong></p>

            {/* KPI Summary Block */}
            <div className="grid grid-cols-3 gap-4 border border-stone-200 p-4 rounded-xl text-xs font-mono bg-stone-50/50">
              <div>
                <span className="text-[10px] text-stone-500 block uppercase">Verified Actions</span>
                <span className="text-lg font-bold text-stone-900">184 submissions</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 block uppercase">Carbon Offset Total</span>
                <span className="text-lg font-bold text-emerald-800">3,360 kg CO₂e</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 block uppercase">IsolationForest Accuracy</span>
                <span className="text-lg font-bold text-stone-900">97.8%</span>
              </div>
            </div>

            {/* Personal Decision Audit Trail */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-stone-900 font-editorial flex items-center gap-1.5 border-b border-stone-200 pb-2">
                <History className="h-4 w-4 text-emerald-800" />
                Personal Moderation Decision Audit Trail (Dr. Aris Thorne)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 font-mono text-[10px] text-stone-600 uppercase border-b border-stone-300">
                    <tr>
                      <th className="p-2">Timestamp</th>
                      <th className="p-2">Item ID</th>
                      <th className="p-2">Action Taken</th>
                      <th className="p-2">Reason Code</th>
                      <th className="p-2">Anomaly Score</th>
                      <th className="p-2">Moderator Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="font-mono text-[11px]">
                        <td className="p-2 text-stone-500">{log.timestamp}</td>
                        <td className="p-2 font-bold text-stone-900">{log.itemId}</td>
                        <td className="p-2">
                          <span className={`font-bold ${
                            log.action === 'Approve' ? 'text-emerald-700' :
                            log.action === 'Reject' ? 'text-rose-700' : 'text-amber-700'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-2 text-stone-700">{log.reasonCode}</td>
                        <td className="p-2 text-stone-600">{log.anomalyScore}</td>
                        <td className="p-2 text-stone-600 italic font-sans">{log.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signatures Footer */}
            <div className="pt-8 border-t border-stone-300 flex justify-between text-xs font-mono text-stone-600">
              <div>
                <div className="border-b border-stone-400 w-48 mb-1"></div>
                <div>Dr. Aris Thorne</div>
                <div className="text-[10px] text-stone-400">Department Moderator Signature</div>
              </div>

              <div>
                <div className="border-b border-stone-400 w-48 mb-1"></div>
                <div>Sophia Sterling</div>
                <div className="text-[10px] text-stone-400">Institution Admin Authorization</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
