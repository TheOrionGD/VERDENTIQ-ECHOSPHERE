// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AppShell } from '@/components/shell/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
  Workflow,
  Sparkles,
  MapPin,
  FileCode,
  ShieldAlert,
  ArrowRight,
  Database,
} from 'lucide-react';
import { EscalationResolutionItem } from '@/lib/services/institutionService';

export default function EscalationResolutionConsolePage() {
  const [escalations, setEscalations] = useState<EscalationResolutionItem[]>(() => ([] as any));
  const [selectedEsc, setSelectedEsc] = useState<EscalationResolutionItem | null>(() => {
    const list = ([] as any);
    return list.length > 0 ? list[0] : null;
  });
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResolve = (action: 'TRUE_POSITIVE' | 'FALSE_POSITIVE' | 'ADJUSTED_THRESHOLD') => {
    if (!selectedEsc) return;
    const resolved = ([] as any);
    setEscalations(([] as any));
    setSelectedEsc(resolved);
    setSuccessMessage(`Escalation ${resolved.id} resolved with label ${action}. Labeled ground truth sent to ML Ops retraining buffer.`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const openCount = escalations.filter((e) => e.status === 'open').length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-5 w-5 text-rose-700" />
              <Badge variant="rose">ML Retraining Ground Truth Console</Badge>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-mono">IsolationForest Anomaly Triage</span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Escalation Resolution & Ground Truth Pipeline
            </h1>
            <p className="text-xs text-stone-500 mt-0.5 max-w-3xl">
              Inspect borderline or flagged department escalations. Provide authoritative labeled ground truth (True Positive / False Positive) to retrain the ML Ops IsolationForest model.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={openCount > 0 ? 'rose' : 'emerald'}>
              {openCount} Open Escalations
            </Badge>
          </div>
        </div>

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Escalations List Sidebar */}
          <div className="lg:col-span-5 bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center justify-between">
              <span>Escalated Evidence Packets</span>
              <span className="text-xs text-stone-400 font-mono">{escalations.length} Total</span>
            </h2>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {escalations.map((item) => {
                const isSelected = selectedEsc?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedEsc(item)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                        : 'border-stone-200/80 hover:border-stone-300 bg-stone-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-stone-500">{item.id}</span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={item.priority === 'CRITICAL' ? 'rose' : 'amber'}>
                          {item.priority}
                        </Badge>
                        <Badge variant={item.status === 'open' ? 'rose' : 'emerald'}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-stone-900 line-clamp-1">{item.title}</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {item.departmentName} • Submitter: {item.submitterName}
                    </p>

                    <div className="mt-2 pt-2 border-t border-stone-200/50 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                      <span>Anomaly Score: <strong className="text-rose-700">{item.anomalyScore}</strong></span>
                      {item.fedToMlPipeline && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                          <Workflow className="h-3 w-3" /> Fed to ML
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Evidence Packet Inspection & Resolution Panel */}
          {selectedEsc ? (
            <div className="lg:col-span-7 bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-5">
              <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-stone-500">{selectedEsc.id}</span>
                    <Badge variant={selectedEsc.priority === 'CRITICAL' ? 'rose' : 'amber'}>
                      {selectedEsc.priority} PRIORITY
                    </Badge>
                  </div>
                  <h2 className="text-base font-bold text-stone-900">{selectedEsc.title}</h2>
                  <p className="text-xs text-stone-500">
                    Escalated by <strong>{selectedEsc.escalatedBy}</strong> from {selectedEsc.departmentName} on {selectedEsc.escalatedAt}
                  </p>
                </div>
              </div>

              {/* Evidence Packet Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Image & OCR Evidence */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">Photographic Evidence</span>
                  <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 h-44">
                    <Image
                      src={selectedEsc.evidencePacket.photoUrl}
                      alt="Evidence"
                      fill
                      unoptimized
                      className="object-cover opacity-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-stone-900/90 backdrop-blur-xs p-2 rounded text-[10px] text-emerald-400 font-mono border border-stone-800">
                      GPS: {selectedEsc.evidencePacket.geotagCoords}
                    </div>
                  </div>
                </div>

                {/* OCR & Anomaly Feature Flags */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-stone-700 block">OCR Extracted Text & Features</span>
                  <div className="p-3 bg-stone-950 text-emerald-400 font-mono text-[11px] rounded-xl border border-stone-800 space-y-2">
                    <p className="text-stone-400 text-[10px] uppercase tracking-wider font-sans">OCR Text Extraction:</p>
                    <p className="text-white">{selectedEsc.evidencePacket.ocrText}</p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <span className="text-xs font-semibold text-stone-800 block">IsolationForest Anomaly Features:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedEsc.evidencePacket.isolationForestFeatures.map((feat, i) => (
                        <span key={i} className="text-[10px] bg-rose-100 text-rose-900 font-mono px-2 py-0.5 rounded">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Labeled Ground Truth Resolution Controls */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h3 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Workflow className="h-4 w-4 text-emerald-800" />
                  <span>Label Ground Truth for ML Retraining Pipeline</span>
                </h3>

                {selectedEsc.status === 'resolved' ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-950">
                    <div className="flex items-center justify-between font-bold">
                      <span>Status: RESOLVED & FED TO ML PIPELINE</span>
                      <Badge variant="emerald">{selectedEsc.groundTruthLabel}</Badge>
                    </div>
                    <p className="text-[11px] opacity-90">{selectedEsc.resolutionNotes}</p>
                    <p className="text-[10px] text-emerald-800 font-mono">
                      Resolved by {selectedEsc.resolvedBy} at {selectedEsc.resolvedAt}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      rows={2}
                      placeholder="Attach executive resolution notes or justification for model retraining..."
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-xl"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button
                        variant="emerald"
                        size="sm"
                        onClick={() => handleResolve('TRUE_POSITIVE')}
                        className="text-xs gap-1"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>True Positive (Valid)</span>
                      </Button>
                      <Button
                        variant="rose"
                        size="sm"
                        onClick={() => handleResolve('FALSE_POSITIVE')}
                        className="text-xs gap-1"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>False Positive (Glitch)</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolve('ADJUSTED_THRESHOLD')}
                        className="text-xs text-stone-800 gap-1"
                      >
                        <Sliders className="h-3.5 w-3.5" />
                        <span>Adjust Threshold</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-12 text-center">
              <Eye className="h-8 w-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-stone-700">Select an escalation from the left panel to inspect</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
