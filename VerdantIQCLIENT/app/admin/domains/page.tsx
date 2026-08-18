'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { EvidenceReviewPanel } from '@/components/shared/ConsistencyPatterns';
import { Globe, ShieldAlert, CheckCircle2, Split, Scale, FileText, Check, RefreshCw } from 'lucide-react';

interface DomainDispute {
  id: string;
  domain: string;
  claimantA: { name: string; studentBody: string; registered: string; txtRecord: string; status: string };
  claimantB: { name: string; studentBody: string; registered: string; txtRecord: string; status: string };
  evidence: string;
  resolution?: string;
}

export default function AdminDomainConflictsPage() {
  const [pendingDomainAction, setPendingDomainAction] = useState<{
    disputeId: string;
    domain: string;
    resolution: string;
    actionLabel: string;
    variant: 'danger' | 'warning' | 'info';
  } | null>(null);

  const [disputes, setDisputes] = useState<DomainDispute[]>([
    {
      id: '#DOM-DISPUTE-882',
      domain: 'pacific.edu',
      claimantA: {
        name: 'Pacific State University Main Campus',
        studentBody: '28,400',
        registered: '2024',
        txtRecord: 'verdantiq-site-verification=psu_9921_verified',
        status: 'Primary DNS Owner',
      },
      claimantB: {
        name: 'Pacific Institute of Technology',
        studentBody: '6,100',
        registered: '2026',
        txtRecord: 'verdantiq-site-verification=pit_tech_pending',
        status: 'Subdomain Requested',
      },
      evidence:
        'Pacific State University holds primary governance over pacific.edu. Pacific Institute of Technology operates under sub-allocated domain tech.pacific.edu.',
    },
    {
      id: '#DOM-DISPUTE-883',
      domain: 'cascadia.org',
      claimantA: {
        name: 'Cascadia Regional Sustainability Council',
        studentBody: '14,200',
        registered: '2025',
        txtRecord: 'verdantiq-site-verification=cascadia_council_ok',
        status: 'Verified Registrar',
      },
      claimantB: {
        name: 'Cascadia Community Energy Board',
        studentBody: '3,800',
        registered: '2026',
        txtRecord: 'verdantiq-site-verification=cascadia_board_pending',
        status: 'Pending Verification',
      },
      evidence:
        'US Dept of Education Directory verifies Cascadia Regional Council holds the main domain. Cascadia Energy Board operates under board.cascadia.org.',
    },
  ]);

  const handleResolve = (id: string, resolution: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, resolution } : d))
    );
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-5 w-5 text-rose-700" />
              <Badge variant="coral">Domain Conflict Triage</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Global Academic Domain Overlap & Conflict Resolution
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Resolve tenant domain ownership disputes, verify EduCause DNS TXT records, and enforce subdomain isolation.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {disputes.map((dispute) => (
            <Card key={dispute.id} className="p-5 bg-white/95 border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-900 font-bold font-mono">
                    {dispute.domain}
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm text-stone-900">Conflicting Claim on Root Domain</h2>
                    <p className="text-[11px] text-stone-500 font-mono">
                      Dispute ID: {dispute.id} • 2 Institutions Claim Ownership
                    </p>
                  </div>
                </div>

                <Badge variant={dispute.resolution ? 'emerald' : 'coral'}>
                  {dispute.resolution ? 'RESOLVED' : 'ACTION REQUIRED'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Claimant A */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">Claimant A</span>
                    <Badge variant="emerald">{dispute.claimantA.status}</Badge>
                  </div>
                  <div>
                    <h3 className="font-editorial text-base font-bold text-[#064E3B]">
                      {dispute.claimantA.name}
                    </h3>
                    <p className="text-xs text-stone-500">Student Body: {dispute.claimantA.studentBody} • Registered: {dispute.claimantA.registered}</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl text-xs font-mono space-y-1 border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase block">DNS TXT Record Verified</span>
                    <span className="text-stone-800 font-semibold text-[11px]">
                      {dispute.claimantA.txtRecord}
                    </span>
                  </div>
                </div>

                {/* Claimant B */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">Claimant B</span>
                    <Badge variant="amber">{dispute.claimantB.status}</Badge>
                  </div>
                  <div>
                    <h3 className="font-editorial text-base font-bold text-stone-800">
                      {dispute.claimantB.name}
                    </h3>
                    <p className="text-xs text-stone-500">Student Body: {dispute.claimantB.studentBody} • Registered: {dispute.claimantB.registered}</p>
                  </div>
                  <div className="p-2.5 bg-amber-50 rounded-xl text-xs font-mono space-y-1 border border-amber-200">
                    <span className="text-[10px] text-amber-900 uppercase block">DNS TXT Record Status</span>
                    <span className="text-amber-900 font-semibold text-[11px]">
                      {dispute.claimantB.txtRecord}
                    </span>
                  </div>
                </div>
              </div>

              {/* Registrar Evidence */}
              <div className="space-y-2 pt-1">
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider font-mono">
                  Registrar Verification Evidence
                </h3>
                <EvidenceReviewPanel
                  documentTitle={`US Dept of Education Directory Registry extract for ${dispute.domain}`}
                  sourceType="EduCause DNS Registry API"
                  snippet={dispute.evidence}
                  confidenceScore={98}
                  verificationBadge="Verified Registrar Record"
                />
              </div>

              {/* Conflict Resolution Actions */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-bold text-stone-900 block">Resolution Status</span>
                  <p className="text-stone-600 text-[11px]">
                    Current decision: {dispute.resolution ? <strong>{dispute.resolution}</strong> : 'Pending Platform Admin Decision'}
                  </p>
                </div>

                {!dispute.resolution ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPendingDomainAction({
                          disputeId: dispute.id,
                          domain: dispute.domain,
                          resolution: 'Escalated to Legal',
                          actionLabel: 'Escalate Domain Dispute to Legal',
                          variant: 'warning',
                        })
                      }
                      className="text-stone-700 text-xs"
                    >
                      <Scale className="h-3.5 w-3.5 mr-1" /> Escalate to Legal
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPendingDomainAction({
                          disputeId: dispute.id,
                          domain: dispute.domain,
                          resolution: `Approved Subdomain Split for Claimant B`,
                          actionLabel: 'Approve Subdomain Isolation Split',
                          variant: 'info',
                        })
                      }
                      className="text-xs"
                    >
                      <Split className="h-3.5 w-3.5 mr-1" /> Approve Subdomain Split
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        setPendingDomainAction({
                          disputeId: dispute.id,
                          domain: dispute.domain,
                          resolution: `Granted Exclusive Root Domain to ${dispute.claimantA.name}`,
                          actionLabel: `Grant Exclusive Root Domain to ${dispute.claimantA.name}`,
                          variant: 'danger',
                        })
                      }
                      className="text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Grant Exclusive Root
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setPendingDomainAction({
                        disputeId: dispute.id,
                        domain: dispute.domain,
                        resolution: '',
                        actionLabel: 'Reset & Reopen Domain Dispute Decision',
                        variant: 'warning',
                      })
                    }
                    className="text-xs text-stone-500"
                  >
                    Reset Decision
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Confirmation Dialog for Domain Dispute Resolution */}
        <ConfirmationDialog
          isOpen={Boolean(pendingDomainAction)}
          onClose={() => setPendingDomainAction(null)}
          onConfirm={() => {
            if (pendingDomainAction) {
              handleResolve(pendingDomainAction.disputeId, pendingDomainAction.resolution);
              setPendingDomainAction(null);
            }
          }}
          title={pendingDomainAction?.actionLabel || 'Confirm Domain Decision'}
          description={
            pendingDomainAction ? (
              <div className="space-y-2">
                <p>
                  You are about to execute a high-impact administrative decision for root domain{' '}
                  <strong className="font-mono text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                    {pendingDomainAction.domain}
                  </strong>
                  .
                </p>
                <div className="p-2.5 bg-stone-100 dark:bg-stone-950 rounded-xl font-mono text-[11px] text-stone-800 dark:text-stone-200">
                  Decision Outcome: {pendingDomainAction.resolution || 'Reset Decision to Pending Triage'}
                </div>
                <p className="text-[11px] opacity-80">
                  This change updates academic tenant routing tables, DNS TXT claim assertions, and subdomain isolation boundaries across all regional nodes.
                </p>
              </div>
            ) : ''
          }
          confirmText="Confirm Decision"
          cancelText="Back to Review"
          variant={pendingDomainAction?.variant || 'danger'}
          requireTypedConfirmation={pendingDomainAction?.variant === 'danger' ? pendingDomainAction.domain : undefined}
        />
      </div>
    </AppShell>
  );
}
