// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { EscalationRecord } from '@/lib/services/deptService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  AlertTriangle,
  Radio,
  FileText,
  ShieldCheck,
  Send,
  Eye,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function DeptEscalatePage() {
  const [escalations, setEscalations] = useState<EscalationRecord[]>(() => ([] as any));
  const [selectedEscalation, setSelectedEscalation] = useState<EscalationRecord | null>(() => {
    const list = ([] as any);
    return list.length > 0 ? list[0] : null;
  });
  const [sseFeed, setSseFeed] = useState<string[]>([]);

  useEffect(() => {
    const handleSse = (e: any) => {
      const detail = e.detail;
      setSseFeed((prev) => [
        `[${new Date().toLocaleTimeString()}] ${detail.type}: ${detail.message}`,
        ...prev,
      ]);
      setEscalations(([] as any));
    };

    window.addEventListener('verdantiq_sse_event', handleSse);
    return () => window.removeEventListener('verdantiq_sse_event', handleSse);
  });

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        <RoleSubNav />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-5 w-5 text-coral-600" />
              <Badge variant="coral">Escalation Dispatch & SSE Feed</Badge>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 font-editorial">
              Institution Admin Escalation Portal
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Auto-attached evidence packets, hazardous anomaly threshold escalations, & real-time status tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-stone-900 text-emerald-400 px-3 py-1.5 rounded-xl border border-stone-800 flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
              SSE Channel Active
            </span>
          </div>
        </div>

        {/* Live SSE Push Stream Box */}
        <Card className="p-4 bg-stone-950 border border-emerald-900/80 text-white font-mono text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-emerald-400 font-bold">
            <span className="flex items-center gap-2">
              <Radio className="h-4 w-4 animate-ping" /> Real-Time SSE Event Dispatch Feed
            </span>
            <span className="text-[10px] text-stone-400 font-normal">Pushing to Institution Admin WebSocket</span>
          </div>

          <div className="space-y-1 max-h-28 overflow-y-auto pr-1 text-[11px]">
            {sseFeed.length === 0 ? (
              <div className="text-stone-500 italic">No recent SSE escalation events. Listening for push triggers...</div>
            ) : (
              sseFeed.map((msg, i) => (
                <div key={i} className="text-emerald-300">
                  {msg}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Escalations List and Evidence Packet Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
              Escalation Records ({escalations.length})
            </h2>

            <div className="space-y-2">
              {escalations.map((esc) => (
                <Card
                  key={esc.id}
                  onClick={() => setSelectedEscalation(esc)}
                  className={`p-4 border transition-all cursor-pointer ${
                    selectedEscalation?.id === esc.id
                      ? 'bg-coral-50/80 border-coral-500 shadow-sm'
                      : 'bg-white hover:bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-coral-950">{esc.id}</span>
                    <Badge variant={esc.priority === 'CRITICAL' ? 'coral' : 'amber'}>
                      {esc.priority}
                    </Badge>
                  </div>

                  <h3 className="text-xs font-bold text-stone-900">{esc.title}</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Submitter: {esc.submitterName} • Escalated by {esc.escalatedBy}
                  </p>

                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                    <span>At: {esc.escalatedAt}</span>
                    <span className="text-emerald-700 font-bold uppercase">Status: {esc.institutionAdminStatus}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Evidence Packet Viewer */}
          <div className="lg:col-span-7">
            {selectedEscalation ? (
              <Card className="p-6 bg-white border-stone-200 shadow-sm space-y-5">
                <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-coral-900">{selectedEscalation.id}</span>
                      <Badge variant="coral">Priority: {selectedEscalation.priority}</Badge>
                      <Badge variant="stone">Item: {selectedEscalation.itemId}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 font-editorial">{selectedEscalation.title}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Reason: <strong>{selectedEscalation.reasonCode}</strong> • Escalated at {selectedEscalation.escalatedAt}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block">Institution Status</span>
                    <Badge variant="emerald">{selectedEscalation.institutionAdminStatus.toUpperCase()}</Badge>
                  </div>
                </div>

                {/* Evidence Packet Visual */}
                <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <div className="text-xs font-bold text-stone-800 flex items-center gap-1.5 border-b border-stone-200 pb-2">
                    <FileText className="h-4 w-4 text-emerald-800" />
                    Auto-Attached Evidence Packet Payload
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] font-semibold text-stone-600 block mb-1">Attached Photo</span>
                      <div className="relative h-36 rounded-lg overflow-hidden border border-stone-300">
                        <Image
                          src={selectedEscalation.evidencePacket.photoUrl}
                          alt="Evidence"
                          fill
                          unoptimized
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-[11px] font-semibold text-stone-600 block mb-1">OCR Extracted Data</span>
                        <div className="bg-stone-900 text-emerald-300 font-mono text-[10px] p-2 rounded-lg leading-relaxed">
                          {selectedEscalation.evidencePacket.ocrText}
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-stone-700 bg-white p-2 rounded-lg border border-stone-200">
                        <div><strong>Geotag Coords:</strong> {selectedEscalation.evidencePacket.geotagCoords}</div>
                        <div><strong>IsolationForest Anomaly Score:</strong> {selectedEscalation.evidencePacket.anomalyScore}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-stone-600 block mb-1">Key Anomaly Feature Contributors</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedEscalation.evidencePacket.isolationForestFeatures.map((f, i) => (
                        <span key={i} className="bg-amber-100 text-amber-900 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-200">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                  <span className="font-bold text-stone-800 block mb-1">Department Moderator Escalation Notes:</span>
                  <p className="text-stone-700 italic">&quot;{selectedEscalation.notes}&quot;</p>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center text-stone-500 text-xs bg-stone-50">
                Select an escalation record to view its attached evidence packet.
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
