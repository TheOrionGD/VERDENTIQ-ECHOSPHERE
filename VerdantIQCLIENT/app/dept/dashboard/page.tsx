// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { QuickSummaryWidget } from '@/components/dashboard/QuickSummaryWidget';
import { useAuth } from '@/context/AuthContext';
import { VerificationItem, REASON_CODES } from '@/lib/services/deptService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Building,
  CheckCircle,
  AlertTriangle,
  Clock,
  Radio,
  FileCheck,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Zap,
  Users,
  Eye,
  Filter,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Send,
  XCircle,
  Check,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function DeptDashboardPage() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<VerificationItem[]>(() => ([] as any));
  const [selectedItem, setSelectedItem] = useState<VerificationItem | null>(() => {
    const pending = ([] as any);
    return pending.length > 0 ? pending[0] : null;
  });
  const [isSseActive, setIsSseActive] = useState<boolean>(true);
  const [sseLogs, setSseLogs] = useState<string[]>([]);
  const [reasonCode, setReasonCode] = useState<string>('REASON_GEO_MATCH_VALID');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [escalateModalOpen, setEscalateModalOpen] = useState<boolean>(false);
  const [escalatePriority, setEscalatePriority] = useState<'HIGH' | 'CRITICAL'>('HIGH');

  useEffect(() => {
    // Listen for custom SSE events
    const handleSse = (e: any) => {
      if (!isSseActive) return;
      const detail = e.detail;
      const logMsg = `[${new Date().toLocaleTimeString()}] ${detail.type}: ${detail.message}`;
      setSseLogs((prev) => [logMsg, ...prev.slice(0, 9)]);
      setQueue(([] as any));
    };

    window.addEventListener('verdantiq_sse_event', handleSse);
    return () => window.removeEventListener('verdantiq_sse_event', handleSse);
  }, [isSseActive]);

  const handleTriggerSimulatedSse = () => {
    ([] as any);
  };

  const handleApprove = (item: VerificationItem) => {
    ([] as any);
    setQueue(([] as any));
    const remaining = ([] as any);
    setSelectedItem(remaining.length > 0 ? remaining[0] : null);
    setReviewNotes('');
  };

  const handleReject = (item: VerificationItem) => {
    ([] as any);
    setQueue(([] as any));
    const remaining = ([] as any);
    setSelectedItem(remaining.length > 0 ? remaining[0] : null);
    setReviewNotes('');
  };

  const handleEscalateSubmit = () => {
    if (!selectedItem) return;
    ([] as any);
    setQueue(([] as any));
    setEscalateModalOpen(false);
    const remaining = ([] as any);
    setSelectedItem(remaining.length > 0 ? remaining[0] : null);
    setReviewNotes('');
  };

  const pendingItems = queue.filter((i) => i.status === 'pending');
  const escalatedItems = queue.filter((i) => i.status === 'escalated');
  const approvedItems = queue.filter((i) => i.status === 'approved');
  const totalCo2Saved = approvedItems.length * 125.4;

  const trends = ([] as any);

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        <RoleSubNav />

        {/* Dynamic Quick Summary Dashboard Widget */}
        <QuickSummaryWidget />

        {/* Top Header & SSE Live Status Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900 text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Building className="h-5 w-5 text-amber-400" />
              <Badge variant="amber">Department Moderator Workspace</Badge>
              <span className="text-xs font-mono text-stone-400">| MongoDB `department_id: dept-bio-eng`</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-editorial">
              Department Verification & Governance Center
            </h1>
            <p className="text-xs text-stone-300 mt-1">
              Validation Gateway & IsolationForest borderline submission triage, XGBoost baseline KPI validation, & escalation dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSseActive(!isSseActive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                isSseActive
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                  : 'bg-stone-800 text-stone-400 border border-stone-700'
              }`}
            >
              <Radio className={`h-3.5 w-3.5 ${isSseActive ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>SSE Stream: {isSseActive ? 'LIVE CONNECTED' : 'PAUSED'}</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleTriggerSimulatedSse}
              className="border-amber-500/50 text-amber-300 hover:bg-amber-950/40 text-xs gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Simulate SSE Arrival</span>
            </Button>
          </div>
        </div>

        {/* Real-Time SSE Log Ticker */}
        {sseLogs.length > 0 && (
          <div className="bg-stone-950 border border-emerald-900/60 p-3 rounded-xl font-mono text-[11px] text-emerald-400 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2 truncate">
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-ping flex-shrink-0" />
              <span className="text-stone-300 font-bold uppercase">SSE Push Event:</span>
              <span className="truncate text-emerald-200">{sseLogs[0]}</span>
            </div>
            <span className="text-[10px] text-stone-500 shrink-0 ml-2">{sseLogs.length} events buffered</span>
          </div>
        )}

        {/* KPI Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Borderline Review Queue</span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{pendingItems.length} items</div>
            <p className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 inline" />
              Filtered by IsolationForest (score &gt; 0.50)
            </p>
          </Card>

          <Card className="p-4 bg-white border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Review SLA On-Track</span>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-stone-900">94.2%</div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Avg Review Velocity: 3.2 min / submission
            </p>
          </Card>

          <Card className="p-4 bg-white border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Active Escalations</span>
              <AlertCircle className="h-4 w-4 text-coral-600" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{escalatedItems.length} open</div>
            <p className="text-[11px] text-stone-500 mt-1">
              Pushed to Institution Admin
            </p>
          </Card>

          <Card className="p-4 bg-white border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Verified Carbon Offset</span>
              <Zap className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-stone-900">{totalCo2Saved.toFixed(0)} kg CO₂e</div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              +18.4% vs Tenant XGBoost Baseline
            </p>
          </Card>
        </div>

        {/* Main 2-Column Split: Verification Spotlight & Trend Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Active Item Evidence Spotlight & Quick Moderation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200/90 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-800" />
                <h2 className="text-lg font-bold text-stone-900 font-editorial">
                  Borderline Verification Queue
                </h2>
                <Badge variant="emerald">{pendingItems.length} Pending</Badge>
              </div>

              <Link
                href="/dept/verify"
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold inline-flex items-center gap-1"
              >
                Full Kanban View <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {selectedItem ? (
              <Card className="p-5 bg-white border-stone-200/90 shadow-sm space-y-4">
                <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-stone-500">{selectedItem.id}</span>
                      <Badge variant={selectedItem.isolationForestScore > 0.7 ? 'coral' : 'amber'}>
                        IsolationForest Anomaly: {selectedItem.isolationForestScore}
                      </Badge>
                      {selectedItem.isDuplicate && <Badge variant="coral">Duplicate Fingerprint Alert</Badge>}
                    </div>
                    <h3 className="text-base font-bold text-stone-900">{selectedItem.title}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Submitted by <strong>{selectedItem.submitterName}</strong> ({selectedItem.subCohort}) • {selectedItem.timestamp}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">SLA Target</span>
                    <span className={`font-mono text-xs font-bold ${
                      selectedItem.slaStatus === 'breached' ? 'text-coral-600' : selectedItem.slaStatus === 'near_breach' ? 'text-amber-600' : 'text-emerald-700'
                    }`}>
                      {selectedItem.slaMinutesRemaining < 0
                        ? `BREACHED (${Math.abs(selectedItem.slaMinutesRemaining)}m overdue)`
                        : `${selectedItem.slaMinutesRemaining}m remaining`}
                    </span>
                  </div>
                </div>

                {/* Evidence Panel (Photo + OCR + Geotag Pin) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                  {/* Photo Preview */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-stone-500" /> Photo Evidence
                    </span>
                    <div className="relative h-44 rounded-lg overflow-hidden border border-stone-300 bg-stone-900">
                      <Image
                        src={selectedItem.photoUrl}
                        alt="Submission Evidence"
                        fill
                        unoptimized
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur">
                        CONFIDENCE: 92.4%
                      </div>
                    </div>
                  </div>

                  {/* OCR & Geotag Details */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-stone-600 flex items-center gap-1 mb-1">
                        <FileCheck className="h-3.5 w-3.5 text-stone-500" /> OCR Meter Output
                      </span>
                      <div className="bg-stone-900 text-emerald-400 font-mono text-[11px] p-2.5 rounded-lg border border-stone-800 leading-relaxed max-h-24 overflow-y-auto">
                        {selectedItem.ocrText}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-stone-600 flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-stone-500" /> Geofence Match
                        </span>
                        <span className={`text-[10px] font-bold uppercase font-mono ${
                          selectedItem.geofenceStatus === 'inside' ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {selectedItem.geofenceStatus} ({selectedItem.geofenceDistanceMeters}m from centroid)
                        </span>
                      </span>
                      <div className="bg-emerald-950/10 border border-emerald-200/80 p-2 rounded-lg text-[11px] text-stone-700 space-y-1 font-mono">
                        <div>GPS: {selectedItem.lat.toFixed(4)}° N, {selectedItem.lng.toFixed(4)}° W</div>
                        <div className="text-[10px] text-stone-500">Department Building Perimeter Match: VALID</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Decision Form */}
                <div className="space-y-3 pt-2 border-t border-stone-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Mandatory Decision Reason Code
                      </label>
                      <select
                        value={reasonCode}
                        onChange={(e) => setReasonCode(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      >
                        {REASON_CODES.map((rc) => (
                          <option key={rc.code} value={rc.code}>
                            {rc.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Moderator Decision Notes
                      </label>
                      <input
                        type="text"
                        placeholder="Add mandatory notes or evidence context..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEscalateModalOpen(true)}
                      className="border-coral-300 text-coral-700 hover:bg-coral-50 text-xs gap-1"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Escalate to Institution</span>
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(selectedItem)}
                        className="border-rose-300 text-rose-700 hover:bg-rose-50 text-xs gap-1"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(selectedItem)}
                        className="bg-[#064E3B] text-white hover:bg-emerald-900 text-xs gap-1 font-semibold"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Approve Submission</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center bg-stone-50 border-dashed border-stone-300">
                <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-base font-bold text-stone-800">Verification Queue Clear!</h3>
                <p className="text-xs text-stone-500 mt-1">
                  All IsolationForest borderline submissions for `dept-bio-eng` have been reviewed.
                </p>
              </Card>
            )}

            {/* Queue List Table Selectors */}
            <Card className="p-4 bg-white border-stone-200/90 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                All Items in Moderation Buffer
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {queue.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedItem?.id === item.id
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                        : 'bg-white hover:bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-stone-700">{item.id}</span>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 truncate max-w-[240px]">{item.title}</div>
                        <div className="text-[10px] text-stone-500">{item.submitterName} • {item.subCohort}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={
                        item.status === 'approved' ? 'emerald' :
                        item.status === 'rejected' ? 'coral' :
                        item.status === 'escalated' ? 'amber' : 'stone'
                      }>
                        {item.status.toUpperCase()}
                      </Badge>
                      <span className="font-mono text-[10px] text-stone-400">Score: {item.isolationForestScore}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Side: MongoDB Aggregate Trends & Sub-Cohort Quick Analytics */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-5 bg-white border-stone-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-800" />
                  <h3 className="text-sm font-bold text-stone-900 font-editorial">
                    MongoDB Aggregation Pipeline Trends
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-stone-400">Weekly Rollup</span>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                Aggregated departmental verification throughput, IsolationForest flag rate, and carbon offset kg trajectory.
              </p>

              {/* Trend Visual Stack Bars */}
              <div className="space-y-3 pt-2">
                {trends.map((t) => (
                  <div key={t.week} className="space-y-1">
                    <div className="flex justify-between text-xs text-stone-700 font-mono">
                      <span>{t.week}</span>
                      <span className="font-bold">{t.approved} Approved / {t.totalSubmissions} Total ({t.carbonOffsetKg} kg CO₂)</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${(t.approved / t.totalSubmissions) * 100}%` }}
                        className="bg-emerald-600 h-full"
                        title="Approved"
                      />
                      <div
                        style={{ width: `${(t.borderlineFlagged / t.totalSubmissions) * 100}%` }}
                        className="bg-amber-500 h-full"
                        title="Borderline Flagged"
                      />
                      <div
                        style={{ width: `${(t.rejected / t.totalSubmissions) * 100}%` }}
                        className="bg-rose-500 h-full"
                        title="Rejected"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Action Navigation Buttons */}
            <Card className="p-5 bg-gradient-to-br from-emerald-950 to-stone-900 text-white shadow-md space-y-3">
              <div className="flex items-center gap-2 text-emerald-300">
                <Sparkles className="h-4 w-4" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                  Moderator Workflows
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/dept/members"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2 font-medium"
                >
                  <Users className="h-4 w-4 text-emerald-300" />
                  <span>Member Roster</span>
                </Link>

                <Link
                  href="/dept/challenges/templates"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2 font-medium"
                >
                  <Zap className="h-4 w-4 text-amber-300" />
                  <span>Challenge Builder</span>
                </Link>

                <Link
                  href="/dept/onboarding-requests"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2 font-medium"
                >
                  <FileCheck className="h-4 w-4 text-emerald-300" />
                  <span>Domain Onboarding</span>
                </Link>

                <Link
                  href="/dept/reports"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2 font-medium"
                >
                  <ShieldCheck className="h-4 w-4 text-stone-300" />
                  <span>PDF Export & Audit</span>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Escalation Modal */}
        {escalateModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2 text-coral-600 font-bold">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Escalate Submission to Institution Admin</span>
                </div>
                <button
                  onClick={() => setEscalateModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1 font-mono">
                <div><strong>Item:</strong> {selectedItem.id} ({selectedItem.title})</div>
                <div><strong>Submitter:</strong> {selectedItem.submitterName}</div>
                <div><strong>IsolationForest Score:</strong> {selectedItem.isolationForestScore}</div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Escalation Priority Flag</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEscalatePriority('HIGH')}
                      className={`flex-1 p-2 rounded-xl font-bold font-mono text-xs border ${
                        escalatePriority === 'HIGH' ? 'bg-amber-100 border-amber-500 text-amber-900' : 'bg-stone-50 border-stone-200 text-stone-600'
                      }`}
                    >
                      HIGH PRIORITY
                    </button>
                    <button
                      type="button"
                      onClick={() => setEscalatePriority('CRITICAL')}
                      className={`flex-1 p-2 rounded-xl font-bold font-mono text-xs border ${
                        escalatePriority === 'CRITICAL' ? 'bg-rose-100 border-rose-600 text-rose-900' : 'bg-stone-50 border-stone-200 text-stone-600'
                      }`}
                    >
                      CRITICAL HAZARD
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Reason Code & Mandatory Notes</label>
                  <select
                    value={reasonCode}
                    onChange={(e) => setReasonCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs font-mono text-stone-800 mb-2"
                  >
                    {REASON_CODES.map((rc) => (
                      <option key={rc.code} value={rc.code}>{rc.label}</option>
                    ))}
                  </select>
                  <textarea
                    rows={3}
                    placeholder="Describe specific reasons for escalation (e.g. hazardous pressure valve reading, financial magnitude, ambiguous cross-department impact)..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-coral-500"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-900">
                  ⚡ Auto-Attaching Evidence Packet: Photo evidence, OCR extracted meter log, GPS geofence polygon match, and IsolationForest feature breakdown will be pushed automatically via SSE to Institution Admin.
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEscalateModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEscalateSubmit}
                  className="bg-coral-600 hover:bg-coral-700 text-white text-xs font-bold gap-1"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Push Escalation & SSE Event</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
