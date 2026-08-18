// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { OnboardingRequest } from '@/lib/services/deptService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileCheck, CheckCircle2, XCircle, Globe, ShieldAlert, Sparkles } from 'lucide-react';

export default function DeptOnboardingRequestsPage() {
  const [requests, setRequests] = useState<OnboardingRequest[]>(() => ([] as any));
  const [rejectReason, setRejectReason] = useState<string>('REASON_DOMAIN_MISMATCH');

  const handleReview = (id: string, action: 'approved' | 'rejected') => {
    ([] as any);
    setRequests(([] as any));
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        <RoleSubNav />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Ambiguous Domain Verification Queue</Badge>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 font-editorial">
              Manual Domain Match Approvals
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Review student registrations where email domains need department approval (e.g. `@bioeng-synthetic.org`).
            </p>
          </div>
        </div>

        {/* Pending Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingRequests.length === 0 ? (
            <Card className="col-span-2 p-8 text-center text-stone-500 text-xs bg-stone-50 border-dashed">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              No pending domain match onboarding requests!
            </Card>
          ) : (
            pendingRequests.map((req) => (
              <Card key={req.id} className="p-5 bg-white border-stone-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-stone-500">{req.id}</span>
                      <Badge variant="amber">Confidence: {req.domainMatchConfidence}%</Badge>
                    </div>
                    <h3 className="text-base font-bold text-stone-900">{req.studentName}</h3>
                    <p className="text-xs text-stone-500 font-mono mt-0.5">{req.email}</p>
                  </div>
                  <Globe className="h-5 w-5 text-emerald-700 shrink-0" />
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1 font-mono">
                  <div><strong>Requested Dept:</strong> {req.requestedDepartment}</div>
                  <div><strong>Sub-Cohort:</strong> {req.subCohort}</div>
                  <div><strong>Domain Name:</strong> {req.domainName}</div>
                  <div className="text-[10px] text-stone-400">Submitted: {req.submittedAt}</div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReview(req.id, 'rejected')}
                    className="border-rose-300 text-rose-700 hover:bg-rose-50 text-xs gap-1"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Reject Match</span>
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleReview(req.id, 'approved')}
                    className="bg-[#064E3B] text-white hover:bg-emerald-900 text-xs font-bold gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approve & Assign Department</span>
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Processed Requests History */}
        <Card className="p-4 bg-white border-stone-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Reviewed Request History
          </h3>
          <div className="space-y-2">
            {requests.filter((r) => r.status !== 'pending').map((req) => (
              <div key={req.id} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl text-xs border border-stone-200">
                <div>
                  <span className="font-bold text-stone-900">{req.studentName}</span>
                  <span className="text-stone-500 font-mono ml-2">({req.email})</span>
                </div>
                <Badge variant={req.status === 'approved' ? 'emerald' : 'coral'}>
                  {req.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
