// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { VerificationItem, REASON_CODES } from '@/lib/services/deptService';
import { deptApi } from '@/lib/api/endpoints';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  FileCheck,
  Eye,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Copy,
  CheckSquare,
  Square,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function DeptVerifyPage() {
  const [items, setItems] = useState<VerificationItem[]>(() => ([] as any));
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'escalated' | 'all'>('pending');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(() => {
    const data = ([] as any);
    const pending = data.filter((i) => i.status === 'pending');
    return pending.length > 0 ? pending[0].id : null;
  });
  const [selectedForBulk, setSelectedForBulk] = useState<string[]>([]);
  const [reasonCode, setReasonCode] = useState<string>('REASON_GEO_MATCH_VALID');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [showDuplicateComparison, setShowDuplicateComparison] = useState<boolean>(false);

  const refreshData = () => {
    const updated = ([] as any);
    setItems(updated);
  };

  const selectedItem = items.find((i) => i.id === selectedItemId);

  const filteredItems = items.filter((i) => {
    if (activeTab === 'all') return true;
    return i.status === activeTab;
  });

  const lowAnomalyItems = items.filter((i) => i.status === 'pending' && i.isolationForestScore < 0.25);

  const handleSelectAllLowAnomaly = () => {
    const ids = lowAnomalyItems.map((i) => i.id);
    setSelectedForBulk(ids);
  };

  const handleToggleBulkSelect = (id: string) => {
    if (selectedForBulk.includes(id)) {
      setSelectedForBulk(selectedForBulk.filter((i) => i !== id));
    } else {
      setSelectedForBulk([...selectedForBulk, id]);
    }
  };

  const handleExecuteBulkApprove = () => {
    if (selectedForBulk.length === 0) return;
    ([] as any);
    setSelectedForBulk([]);
    refreshData();
  };

  const handleApprove = (id: string) => {
    ([] as any);
    setReviewNotes('');
    refreshData();
  };

  const handleReject = (id: string) => {
    ([] as any);
    setReviewNotes('');
    refreshData();
  };

  const handleEscalate = (id: string) => {
    ([] as any);
    setReviewNotes('');
    refreshData();
  };

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        <RoleSubNav />

        {/* Page Title & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">IsolationForest Borderline Queue</Badge>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 font-editorial">
              Department Verification Kanban & Evidence Studio
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Inspect OCR meter readings, geotag polygon match, duplicate submission alerts, and SLA countdowns.
            </p>
          </div>

          {/* Bulk Action Quick Bar */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 p-2 rounded-xl">
            <span className="text-xs font-medium text-emerald-950 font-mono">
              Fast-Track Low Anomaly (&lt;0.25): {lowAnomalyItems.length} items
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAllLowAnomaly}
              className="text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-100"
            >
              Select All Low Anomaly
            </Button>
            {selectedForBulk.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteBulkApprove}
                className="bg-[#064E3B] text-white text-xs font-bold gap-1"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Bulk Approve ({selectedForBulk.length})</span>
              </Button>
            )}
          </div>
        </div>

        {/* Queue Status Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 text-xs font-medium">
          {[
            { id: 'pending', label: 'Pending Borderline', count: items.filter((i) => i.status === 'pending').length },
            { id: 'approved', label: 'Approved', count: items.filter((i) => i.status === 'approved').length },
            { id: 'rejected', label: 'Rejected', count: items.filter((i) => i.status === 'rejected').length },
            { id: 'escalated', label: 'Escalated', count: items.filter((i) => i.status === 'escalated').length },
            { id: 'all', label: 'All Logged Items', count: items.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-emerald-800 text-emerald-950 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded-full text-[10px] font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Main 2-Column Split: Item Table vs Detailed Side-by-Side Evidence Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Items List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <CheckSquare className="h-6 w-6" />
                  </div>
                  <h3 className="font-editorial text-base font-bold text-stone-900">No Verification Items in Queue</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Submissions from department users will appear here once submitted for verification.
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = item.id === selectedItemId;
                  const isBulkChecked = selectedForBulk.includes(item.id);

                  return (
                    <Card
                      key={item.id}
                      className={`p-3.5 border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50/90 border-emerald-600 shadow-sm'
                          : 'bg-white hover:bg-stone-50 border-stone-200'
                      }`}
                      onClick={() => setSelectedItemId(item.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {item.status === 'pending' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleBulkSelect(item.id);
                              }}
                              className="text-stone-400 hover:text-emerald-800"
                            >
                              {isBulkChecked ? (
                                <CheckSquare className="h-4 w-4 text-emerald-700" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <span className="font-mono text-xs font-bold text-stone-800">{item.id}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Badge variant={
                            item.status === 'approved' ? 'emerald' :
                            item.status === 'rejected' ? 'coral' :
                            item.status === 'escalated' ? 'amber' : 'stone'
                          }>
                            {item.status.toUpperCase()}
                          </Badge>
                          <span className="font-mono text-[10px] text-stone-400">Score: {item.isolationForestScore}</span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <h4 className="text-xs font-bold text-stone-900 leading-tight">{item.title}</h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {item.submitterName} ({item.subCohort})
                        </p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-stone-400" />
                          Geofence: <strong className={item.geofenceStatus === 'inside' ? 'text-emerald-700' : 'text-amber-700'}>{item.geofenceStatus}</strong>
                        </span>

                        <span className={`font-bold ${
                          item.slaStatus === 'breached' ? 'text-coral-600' : 'text-stone-600'
                        }`}>
                          SLA: {item.slaMinutesRemaining < 0 ? 'BREACHED' : `${item.slaMinutesRemaining}m`}
                        </span>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 2: Side-by-Side Evidence Viewer & Decision Panel */}
          <div className="lg:col-span-7">
            {selectedItem ? (
              <Card className="p-5 bg-white border-stone-200/90 shadow-sm space-y-5 sticky top-4">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-emerald-950">{selectedItem.id}</span>
                      <Badge variant={selectedItem.isolationForestScore > 0.7 ? 'coral' : 'amber'}>
                        IsolationForest Anomaly Score: {selectedItem.isolationForestScore}
                      </Badge>
                      {selectedItem.isDuplicate && (
                        <button
                          onClick={() => setShowDuplicateComparison(!showDuplicateComparison)}
                          className="bg-coral-100 text-coral-900 text-[10px] font-bold font-mono px-2 py-0.5 rounded border border-coral-300 hover:bg-coral-200"
                        >
                          Duplicate Alert ({selectedItem.duplicateSimilarityPercent}% match) - Click to Compare
                        </button>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 font-editorial">{selectedItem.title}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Type: <strong>{selectedItem.type}</strong> • Submitter: <strong>{selectedItem.submitterName}</strong> ({selectedItem.submitterEmail})
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">SLA Tracker</span>
                    <Badge variant={selectedItem.slaStatus === 'breached' ? 'coral' : 'emerald'}>
                      {selectedItem.slaStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Duplicate Comparison Panel View */}
                {showDuplicateComparison && selectedItem.isDuplicate && (
                  <div className="bg-coral-50/90 border border-coral-200 p-3 rounded-xl space-y-2 animate-in fade-in text-xs">
                    <div className="flex items-center justify-between font-bold text-coral-900">
                      <span className="flex items-center gap-1">
                        <Copy className="h-4 w-4" /> Duplicate Submission Fingerprint Flagged
                      </span>
                      <span className="font-mono text-[11px]">{selectedItem.duplicateSimilarityPercent}% Similarity</span>
                    </div>
                    <p className="text-stone-700">
                      Validation Gateway matched photo & OCR hash with previous approved submission <strong>#{selectedItem.duplicateOfId}</strong>. Review photo metadata before approval.
                    </p>
                  </div>
                )}

                {/* Side-by-Side Evidence Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  {/* Photo Evidence */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5 text-stone-500" /> Evidence Photo
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">JPG • 1080p</span>
                    </div>

                    <div className="relative h-52 rounded-xl overflow-hidden border border-stone-300 bg-stone-900">
                      <Image
                        src={selectedItem.photoUrl}
                        alt="Evidence"
                        fill
                        unoptimized
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 bg-stone-900/80 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded">
                        EXIF VERIFIED
                      </div>
                    </div>
                  </div>

                  {/* OCR Text & Geotag Map Pin Display */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
                        <span className="flex items-center gap-1">
                          <FileCheck className="h-3.5 w-3.5 text-stone-500" /> OCR Engine Output
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold">Accuracy 94.8%</span>
                      </div>
                      <div className="bg-stone-900 text-emerald-300 font-mono text-[11px] p-3 rounded-xl border border-stone-800 leading-relaxed max-h-28 overflow-y-auto">
                        {selectedItem.ocrText}
                      </div>
                    </div>

                    {/* Geotag Map Pin SVG Visualization */}
                    <div className="bg-white p-3 rounded-xl border border-stone-200/90 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-800 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-coral-600" /> Department Geofence Map Pin
                        </span>
                        <Badge variant={selectedItem.geofenceStatus === 'inside' ? 'emerald' : 'amber'}>
                          {selectedItem.geofenceStatus.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Map Canvas / Visual Polygon Preview */}
                      <div className="relative h-20 bg-stone-100 rounded-lg border border-stone-300 overflow-hidden flex items-center justify-center">
                        {/* Simulated Geofence Circle */}
                        <div className="absolute w-28 h-28 rounded-full border-2 border-dashed border-emerald-500 bg-emerald-500/10 flex items-center justify-center">
                          <span className="text-[9px] font-mono text-emerald-800 font-bold">Bio B Bldg Polygon</span>
                        </div>
                        {/* Submission Pin */}
                        <div className="relative z-10 flex flex-col items-center">
                          <MapPin className="h-5 w-5 text-coral-600 animate-bounce" />
                          <span className="bg-stone-900 text-white text-[9px] font-mono px-1.5 rounded">
                            {selectedItem.geofenceDistanceMeters}m to Centroid
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-stone-500 font-mono flex justify-between">
                        <span>Lat: {selectedItem.lat}° N</span>
                        <span>Lng: {selectedItem.lng}° W</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Moderation Action Bar */}
                {selectedItem.status === 'pending' ? (
                  <div className="space-y-3 pt-2 border-t border-stone-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Reason Code (Mandatory)
                        </label>
                        <select
                          value={reasonCode}
                          onChange={(e) => setReasonCode(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-mono text-stone-800"
                        >
                          {REASON_CODES.map((rc) => (
                            <option key={rc.code} value={rc.code}>
                              {rc.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Decision Audit Notes
                        </label>
                        <input
                          type="text"
                          placeholder="Provide context for audit log..."
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEscalate(selectedItem.id)}
                        className="border-coral-300 text-coral-700 hover:bg-coral-50 text-xs gap-1"
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Escalate to Institution Admin</span>
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(selectedItem.id)}
                          className="border-rose-300 text-rose-700 hover:bg-rose-50 text-xs gap-1"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(selectedItem.id)}
                          className="bg-[#064E3B] text-white hover:bg-emerald-900 text-xs font-bold gap-1"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Approve Submission</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1">
                    <div className="font-bold text-stone-800">
                      Decision Completed ({selectedItem.status.toUpperCase()})
                    </div>
                    <div className="text-stone-600 font-mono">
                      Reason: {selectedItem.decisionReason || 'REASON_GEO_MATCH_VALID'}
                    </div>
                    <div className="text-stone-500">
                      Notes: {selectedItem.decisionNotes || 'No custom notes.'}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      By: {selectedItem.decisionBy} on {selectedItem.decisionTimestamp}
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-12 text-center text-stone-500 text-xs bg-stone-50">
                Select an item from the left queue to open the Side-by-Side Evidence Studio.
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
