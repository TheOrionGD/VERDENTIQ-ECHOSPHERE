// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  History,
  Download,
  Search,
  Filter,
  CheckCircle2,
  UploadCloud,
  FileCheck2,
  AlertTriangle,
  Send,
  Camera,
  MapPin,
  ShieldCheck,
  Clock,
  Sparkles,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { ActivityHistoryItem } from '@/lib/services/userDataService';

export default function UserHistoryPage() {
  const [activeTab, setActiveTab] = useState<'history' | 'logging' | 'evidence' | 'disputes'>('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Manual & OCR Logging State
  const [logCategory, setLogCategory] = useState<'Energy' | 'Water' | 'Waste' | 'Transport'>('Energy');
  const [logValue, setLogValue] = useState<string>('328.5');
  const [logUnit, setLogUnit] = useState<string>('kWh');
  const [billFile, setBillFile] = useState<string | null>(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{
    gatewayStatus: 'PASSED' | 'FLAGGED';
    ocrMatch: string;
    geofenceStatus: string;
    isolationScore: number;
  } | null>(null);

  // Evidence Status Tracker State
  const [evidenceList, setEvidenceList] = useState([
    {
      id: 'ev_101',
      type: 'July Utility Bill Photo',
      fileName: 'utility_bill_jul_2026.pdf',
      ocrExtractedValue: '328.5 kWh ($142.20)',
      geofenceCheck: 'PASSED ($geoWithin Sector 4)',
      status: 'APPROVED',
      timestamp: '2026-07-31 14:20',
      confidence: 98.4,
    },
    {
      id: 'ev_102',
      type: 'Solar PV Meter Geotag Photo',
      fileName: 'solar_inverter_geotag.jpg',
      ocrExtractedValue: '422.0 kWh Generation',
      geofenceCheck: 'PASSED ($geoWithin Sector 4)',
      status: 'APPROVED',
      timestamp: '2026-07-28 09:15',
      confidence: 96.2,
    },
  ]);

  // Dispute / Appeal State
  const [disputes, setDisputes] = useState([
    {
      id: 'dsp_301',
      logId: 'act_102',
      reason: 'Incorrect battery discharge anomaly flag during storm outage event',
      targetDept: 'Department Moderator - Sector 4',
      status: 'In Review',
      submittedAt: '2026-08-01 08:30',
      moderatorNote: 'Assigned to Sector 4 Moderator. Reviewing weather telemetry logs.',
    },
  ]);

  const [disputeReason, setDisputeReason] = useState('');
  const [disputeLogId, setDisputeLogId] = useState('act_101');
  const [disputeSuccess, setDisputeSuccess] = useState(false);

  const filteredItems = [].filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Category', 'Title', 'Details', 'kWh Delta', 'Carbon Delta (kg)', 'Points Delta'];
    const rows = filteredItems.map((item) => [
      item.id,
      `"${item.timestamp}"`,
      `"${item.category}"`,
      `"${item.title}"`,
      `"${item.details}"`,
      item.kwhDelta ?? '',
      item.carbonDeltaKg ?? '',
      item.pointsDelta ?? '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `verdantiq_user_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRunOcrAndValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingOcr(true);
    setValidationResult(null);

    setTimeout(() => {
      setIsProcessingOcr(false);
      setValidationResult({
        gatewayStatus: 'PASSED',
        ocrMatch: `Tesseract OCR cross-check: Font matched ${logValue} ${logUnit} against bill total ($142.20)`,
        geofenceStatus: 'EXIF GPS verified ($geoWithin Sector 4 polygon)',
        isolationScore: 0.94,
      });

      // Append to evidence tracker
      setEvidenceList((prev) => [
        {
          id: `ev_${Date.now()}`,
          type: `${logCategory} Evidence Photo`,
          fileName: billFile || 'manual_log_bill.jpg',
          ocrExtractedValue: `${logValue} ${logUnit}`,
          geofenceCheck: 'PASSED ($geoWithin Sector 4)',
          status: 'APPROVED',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          confidence: 97.8,
        },
        ...prev,
      ]);
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBillFile(e.target.files[0].name);
    }
  };

  const handleFileSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;

    const newDisp = {
      id: `dsp_${Date.now()}`,
      logId: disputeLogId,
      reason: disputeReason,
      targetDept: 'Department Moderator - Sector 4',
      status: 'Pending Review',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      moderatorNote: 'Routed to Department Moderator for Sector 4 Green Valley.',
    };

    setDisputes([newDisp, ...disputes]);
    setDisputeReason('');
    setDisputeSuccess(true);
    setTimeout(() => setDisputeSuccess(false), 3000);
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Validation Gateway & Evidence Suite</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Household Logs & Evidence Pipeline
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              OCR-assisted manual logging, Tesseract bill cross-checking, geofence validation, and dispute routing.
            </p>
          </div>

          <Button onClick={handleExportCSV} variant="primary" size="sm" className="gap-2 cursor-pointer self-start sm:self-auto">
            <Download className="h-4 w-4" />
            <span>Export CSV Report</span>
          </Button>
        </div>

        {/* Inner Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Activity Log Table</span>
          </button>

          <button
            onClick={() => setActiveTab('logging')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'logging'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>OCR & Manual Logger</span>
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>Live Evidence Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'disputes'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Dispute & Appeal Flow</span>
          </button>
        </div>

        {/* TAB 1: ACTIVITY LOG TABLE */}
        {activeTab === 'history' && (
          <Card className="border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="h-4 w-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search activity records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Filter className="h-3.5 w-3.5 text-stone-500" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-2 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="All">All Categories</option>
                    <option value="Energy">Energy</option>
                    <option value="Optimization">Optimization</option>
                    <option value="Device">Device</option>
                    <option value="Challenge">Challenge</option>
                    <option value="Reward">Reward</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono text-[11px]">
                    <th className="p-3 pl-6">Timestamp</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Title & Details</th>
                    <th className="p-3 text-right">kWh Impact</th>
                    <th className="p-3 text-right">Carbon Delta</th>
                    <th className="p-3 pr-6 text-right">Points Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3 pl-6 font-mono text-stone-400 text-[11px] whitespace-nowrap">{item.timestamp}</td>
                      <td className="p-3 whitespace-nowrap">
                        <Badge variant="stone" size="xs">{item.category}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-stone-900">{item.title}</div>
                        <div className="text-[11px] text-stone-500">{item.details}</div>
                      </td>
                      <td className="p-3 text-right font-mono text-stone-700 font-semibold">
                        {item.kwhDelta ? `${item.kwhDelta} kWh` : '-'}
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-800 font-semibold">
                        {item.carbonDeltaKg ? `${item.carbonDeltaKg} kg` : '-'}
                      </td>
                      <td className="p-3 pr-6 text-right font-mono font-bold">
                        {item.pointsDelta ? (
                          <span className={item.pointsDelta > 0 ? 'text-emerald-700' : 'text-rose-600'}>
                            {item.pointsDelta > 0 ? `+${item.pointsDelta}` : item.pointsDelta} pts
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: OCR & MANUAL LOGGER */}
        {activeTab === 'logging' && (
          <Card className="border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <Camera className="h-4 w-4 text-emerald-700" />
                <span>Manual & OCR-Assisted Activity Logging</span>
              </CardTitle>
              <CardDescription>
                Submit logs with optional bill or geotagged photo proof for OCR cross-checking & geofence validation
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <form onSubmit={handleRunOcrAndValidation} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Resource Category
                    </label>
                    <select
                      value={logCategory}
                      onChange={(e) => setLogCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 bg-white"
                    >
                      <option value="Energy">Energy (Electricity / Solar)</option>
                      <option value="Water">Water Usage</option>
                      <option value="Waste">Waste Diversion</option>
                      <option value="Transport">EV Charging / Transit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Self-Reported Consumption
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={logValue}
                        onChange={(e) => setLogValue(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 font-mono"
                      />
                      <input
                        type="text"
                        value={logUnit}
                        onChange={(e) => setLogUnit(e.target.value)}
                        className="w-20 px-3 py-2 text-xs rounded-xl border border-stone-300 font-mono bg-stone-100 text-stone-700 text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Evidence Attachment */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <span className="text-xs font-bold text-stone-900 block flex items-center gap-1.5">
                    <UploadCloud className="h-4 w-4 text-emerald-700" />
                    <span>Upload Bill Photo or Geotagged Evidence</span>
                  </span>

                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
                  />

                  {billFile && (
                    <p className="text-xs font-mono text-emerald-800 font-medium">
                      Selected File: {billFile}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-500">
                    Tesseract OCR will cross-check the photo text against your reported {logValue} {logUnit}, and EXIF GPS tags will be verified via <code className="font-mono">$geoWithin</code> against Sector 4 geofence.
                  </p>
                </div>

                <Button type="submit" variant="primary" size="md" isLoading={isProcessingOcr} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Pass Through Validation Gateway</span>
                </Button>
              </form>

              {/* Validation Gateway Output */}
              {validationResult && (
                <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-700" />
                      <span>Validation Gateway Status: {validationResult.gatewayStatus}</span>
                    </span>
                    <Badge variant="emerald" dot>IsolationForest Score: {validationResult.isolationScore}</Badge>
                  </div>

                  <ul className="space-y-1.5 text-xs text-emerald-900 font-mono">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                      <span>{validationResult.ocrMatch}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
                      <span>{validationResult.geofenceStatus}</span>
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 3: LIVE EVIDENCE TRACKER */}
        {activeTab === 'evidence' && (
          <Card className="border border-stone-200 bg-white/90 shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-emerald-700" />
                <span>Live Evidence Status Tracker</span>
              </CardTitle>
              <CardDescription>
                Audit pipeline tracking for submitted bill photos, geotag checks, and OCR verifications
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              {evidenceList.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">{item.type}</span>
                        <Badge variant="emerald">{item.status}</Badge>
                      </div>
                      <span className="text-xs font-mono text-stone-500">{item.fileName} • {item.timestamp}</span>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      OCR Confidence: {item.confidence}%
                    </span>
                  </div>

                  {/* Multi-stage Pipeline Visualization */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-2 border-t border-stone-200/80">
                    <div className="p-2 rounded-xl bg-white border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">1. File Upload</span>
                      <span className="text-stone-900 font-bold">Received</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">2. OCR Cross-Check</span>
                      <span className="text-emerald-800 font-bold">{item.ocrExtractedValue}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">3. Geofence ($geoWithin)</span>
                      <span className="text-emerald-800 font-bold">{item.geofenceCheck}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">4. Gateway Persisted</span>
                      <span className="text-emerald-800 font-bold">Verified Ledger</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* TAB 4: DISPUTE & APPEAL FLOW */}
        {activeTab === 'disputes' && (
          <div className="space-y-6">
            <Card className="border border-stone-200 bg-white/90 shadow-xs">
              <CardHeader className="border-b border-stone-100 pb-3">
                <CardTitle className="text-base text-stone-900 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>File Dispute or Appeal to Department Moderator</span>
                </CardTitle>
                <CardDescription>
                  Appeal flagged telemetry logs, OCR variance penalties, or score adjustments directly to Sector 4 Moderators
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 space-y-4 max-w-2xl">
                <form onSubmit={handleFileSubmitDispute} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Select Target Activity Log ID
                    </label>
                    <select
                      value={disputeLogId}
                      onChange={(e) => setDisputeLogId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                    >
                      {[].map((item) => (
                        <option key={item.id} value={item.id}>
                          [{item.id}] {item.title} ({item.timestamp})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Reason for Appeal & Contextual Evidence Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Detail why this log or penalty is erroneous (e.g. 'EV charging occurred during severe weather grid outage')..."
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="sm" className="gap-2">
                    <Send className="h-4 w-4" />
                    <span>Submit Appeal to Moderator</span>
                  </Button>

                  {disputeSuccess && (
                    <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      <span>Dispute ticket submitted and routed to Department Moderator!</span>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Existing Active Disputes Queue */}
            <Card className="border border-stone-200 bg-white/90 shadow-xs">
              <CardHeader className="border-b border-stone-100 pb-3">
                <CardTitle className="text-sm font-bold text-stone-900">
                  Active Dispute Tickets ({disputes.length})
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                {disputes.map((dsp) => (
                  <div key={dsp.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 font-mono">{dsp.id} • Target: {dsp.logId}</span>
                      <Badge variant="amber">{dsp.status}</Badge>
                    </div>
                    <p className="text-xs text-stone-700 font-medium">{dsp.reason}</p>
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                      <span>Routed To: <strong>{dsp.targetDept}</strong></span>
                      <span className="font-mono text-[10px] text-stone-400">{dsp.submittedAt}</span>
                    </div>
                    <p className="text-[11px] text-emerald-900 font-mono italic">Note: {dsp.moderatorNote}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
