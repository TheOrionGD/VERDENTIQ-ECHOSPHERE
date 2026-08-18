// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { SupportTicket } from '@/lib/services/regionService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { HelpCircle, AlertTriangle, CheckCircle2, MessageSquare, Flag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegionalSupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => []);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [recommendationText, setRecommendationText] = useState('');

  const refreshTickets = () => {
    setTickets([]);
  };

  const handleSendRecommendation = () => {
    if (!activeTicket || !recommendationText) return;
    ([] as any);
    refreshTickets();
    setActiveTicket(null);
    setRecommendationText('');
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Support Triage & Advisory</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Regional Support-Ticket Triage & Recommendations
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Review campus facility support requests and send advisory recommendations without overriding local controls.
            </p>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.map((tkt) => (
            <div
              key={tkt.id}
              className="p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-editorial text-lg font-bold text-stone-900">{tkt.title}</h3>
                    <Badge variant={tkt.severity === 'high' || tkt.severity === 'critical' ? 'coral' : 'amber'}>
                      {tkt.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-500">
                    Campus: <strong>{tkt.institutionName}</strong> • Category: <strong>{tkt.category}</strong>
                  </p>
                </div>

                <Badge variant={tkt.status === 'recommendation_sent' ? 'emerald' : 'stone'}>
                  {tkt.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200 leading-relaxed">
                {tkt.description}
              </p>

              {tkt.regionalRecommendation && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-emerald-800">
                    <Flag className="h-3.5 w-3.5 text-emerald-700" /> Sent Regional Recommendation:
                  </span>
                  <p>{tkt.regionalRecommendation}</p>
                </div>
              )}

              {tkt.status !== 'recommendation_sent' && (
                <div className="flex items-center justify-end pt-2">
                  <Button
                    onClick={() => {
                      setActiveTicket(tkt);
                      setRecommendationText(tkt.regionalRecommendation || '');
                    }}
                    className="bg-[#064E3B] hover:bg-emerald-800 text-white text-xs"
                  >
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    Attach Regional Recommendation
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        {activeTicket && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-lg w-full p-5 space-y-4">
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Send Regional Advisory Recommendation
              </h3>
              <p className="text-xs text-stone-600">
                Advisory notes are transmitted to <strong>{activeTicket.institutionName}</strong> facility leads to guide HVAC calibration and sensor maintenance.
              </p>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Advisory Note *</label>
                <textarea
                  rows={4}
                  value={recommendationText}
                  onChange={(e) => setRecommendationText(e.target.value)}
                  placeholder="e.g. Recommend checking local RS-485 repeater node and rebooting gateway before re-syncing ML model..."
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setActiveTicket(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSendRecommendation} className="bg-[#064E3B] hover:bg-emerald-800 text-white">
                  Send Advisory Note & Flag
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
