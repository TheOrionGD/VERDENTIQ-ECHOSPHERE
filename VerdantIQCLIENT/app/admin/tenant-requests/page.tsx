'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Globe,
  Plus,
  UserPlus,
  Building,
  Key,
} from 'lucide-react';

interface TenantRequest {
  id: string;
  regionName: string;
  requesterName: string;
  requesterEmail: string;
  requestType: string;
  details: string;
  requestedQuota: string;
  status: 'pending' | 'approved' | 'rejected';
  dateSubmitted: string;
  assignedAdminEmail?: string;
}

export default function AdminTenantRequestsPage() {
  const [requests, setRequests] = useState<TenantRequest[]>([
    {
      id: 'treq_101',
      regionName: 'West Coast District Board',
      requesterName: 'David Vance',
      requesterEmail: 'david.vance@westcoast-edu.org',
      requestType: 'Create New Region & Provision Regional Admin',
      details: 'Requesting creation of West Coast Region and provisioning of +500,000 kWh monthly telemetry quota for 4 newly onboarded community college campuses.',
      requestedQuota: '1.2M kWh/mo',
      status: 'pending',
      dateSubmitted: '2026-07-30',
    },
    {
      id: 'treq_102',
      regionName: 'Northwest Higher Ed Federation',
      requesterName: 'Dr. Sarah Jenkins',
      requesterEmail: 's.jenkins@nwhef.org',
      requestType: 'Dedicated LLM Inference Instance',
      details: 'Requesting dedicated Groq LPU pipeline isolate for strict privacy compliance on student research data.',
      requestedQuota: 'Dedicated LPU Node',
      status: 'pending',
      dateSubmitted: '2026-07-28',
    },
    {
      id: 'treq_103',
      regionName: 'Cascadia Sustainability Alliance',
      requesterName: 'Michael Chang',
      requesterEmail: 'mchang@cascadia.org',
      requestType: 'Regional Data Federation',
      details: 'Cross-tenant aggregation permission for regional ESG benchmarking dashboard.',
      requestedQuota: 'Read-Only Regional Aggregation',
      status: 'approved',
      assignedAdminEmail: 'mchang@cascadia.org',
      dateSubmitted: '2026-07-15',
    },
  ]);

  const [activeApproveModal, setActiveApproveModal] = useState<TenantRequest | null>(null);
  const [requestToReject, setRequestToReject] = useState<TenantRequest | null>(null);
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [quotaInput, setQuotaInput] = useState('');
  const [provisionSuccessMsg, setProvisionSuccessMsg] = useState<string | null>(null);

  const openApproveModal = (req: TenantRequest) => {
    setActiveApproveModal(req);
    setAdminEmailInput(req.requesterEmail);
    setQuotaInput(req.requestedQuota);
  };

  const handleConfirmProvision = () => {
    if (!activeApproveModal) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === activeApproveModal.id
          ? {
              ...r,
              status: 'approved',
              assignedAdminEmail: adminEmailInput,
              requestedQuota: quotaInput,
            }
          : r
      )
    );

    setProvisionSuccessMsg(
      `Region "${activeApproveModal.regionName}" created successfully! Regional Admin account provisioned for ${adminEmailInput} with ${quotaInput} quota.`
    );
    setActiveApproveModal(null);
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">Platform Admin Governance</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Regional Tenant Provisioning & Admin Creation
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Review regional requests, approve region tenant creation, assign Regional Admin roles & set initial quotas.
            </p>
          </div>
        </div>

        {provisionSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
              {provisionSuccessMsg}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setProvisionSuccessMsg(null)} className="text-emerald-800 text-xs">
              Dismiss
            </Button>
          </div>
        )}

        {/* Approval Modal */}
        {activeApproveModal && (
          <Card className="p-5 bg-white border-emerald-300 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#064E3B]" />
                <h3 className="font-editorial text-base font-bold text-stone-900">
                  Provision Region & Create Regional Admin
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveApproveModal(null)} className="text-xs">
                Cancel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Target Region Name</label>
                <input
                  type="text"
                  readOnly
                  value={activeApproveModal.regionName}
                  className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl font-semibold text-stone-800"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Assign Regional Admin Email</label>
                <input
                  type="email"
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Allocated Telemetry Quota</label>
                <input
                  type="text"
                  value={quotaInput}
                  onChange={(e) => setQuotaInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Initial Auth Credentials</label>
                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200 text-[11px] font-mono text-emerald-800 flex items-center justify-between">
                  <span>Welcome Magic-Link + Temporary Token</span>
                  <Key className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <Button variant="outline" size="sm" onClick={() => setActiveApproveModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmProvision}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Confirm Region & Admin Provisioning
              </Button>
            </div>
          </Card>
        )}

        {/* Request Cards */}
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} className="p-5 bg-white/95 border-stone-200/90 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-stone-900">{req.regionName}</h3>
                    <p className="text-[11px] text-stone-500 font-mono">
                      Requester: {req.requesterName} ({req.requesterEmail}) • Submitted: {req.dateSubmitted}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={
                    req.status === 'approved'
                      ? 'emerald'
                      : req.status === 'rejected'
                      ? 'coral'
                      : 'amber'
                  }
                >
                  {req.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="md:col-span-2 p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    {req.requestType}
                  </span>
                  <p className="text-stone-700 leading-relaxed">{req.details}</p>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                      Target Capacity / Quota
                    </span>
                    <span className="text-sm font-bold text-emerald-950 font-mono">{req.requestedQuota}</span>
                    {req.assignedAdminEmail && (
                      <span className="text-[10px] text-stone-500 block font-mono mt-1">
                        Regional Admin: {req.assignedAdminEmail}
                      </span>
                    )}
                  </div>

                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-emerald-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRequestToReject(req)}
                        className="text-rose-700 border-rose-200 hover:bg-rose-50 text-xs w-full"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openApproveModal(req)}
                        className="text-xs w-full"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve & Provision
                      </Button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-stone-500 font-medium italic mt-2">
                      Decision Recorded & Provisioned
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Confirmation Dialog for Rejecting Tenant Request */}
        <ConfirmationDialog
          isOpen={Boolean(requestToReject)}
          onClose={() => setRequestToReject(null)}
          onConfirm={() => {
            if (requestToReject) {
              handleReject(requestToReject.id);
              setRequestToReject(null);
            }
          }}
          title="Reject Regional Tenant Request?"
          description={
            requestToReject ? (
              <div className="space-y-2">
                <p>
                  You are about to reject the regional tenant request for{' '}
                  <strong className="text-rose-950 dark:text-rose-100 font-bold">{requestToReject.regionName}</strong>.
                </p>
                <div className="p-2 bg-rose-100/60 dark:bg-rose-950/60 rounded-xl font-mono text-[11px] text-rose-900 dark:text-rose-200">
                  Requester: {requestToReject.requesterName} ({requestToReject.requesterEmail})
                </div>
                <p className="text-[11px] opacity-80">
                  The requester will receive notification that the regional admin creation request was declined.
                </p>
              </div>
            ) : ''
          }
          confirmText="Reject Request"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </AppShell>
  );
}
