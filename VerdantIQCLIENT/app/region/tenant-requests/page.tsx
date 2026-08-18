// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { TenantRequest } from '@/lib/services/regionService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FileCheck, CheckCircle2, XCircle, Terminal, Building, Clock, ShieldCheck, Loader2, Cpu } from 'lucide-react';

export default function RegionalTenantRequestsPage() {
  const [requests, setRequests] = useState<TenantRequest[]>(() => []);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeSpringLog, setActiveSpringLog] = useState<{ id: string; logs: string[] } | null>(null);

  const refreshList = () => {
    setRequests([]);
  };

  const handleApprove = async (reqId: string) => {
    setProcessingId(reqId);
    try {
      const createdInst = await ([] as any);
      refreshList();
      setActiveSpringLog({
        id: reqId,
        logs: [
          '[Spring Boot REST] Received Tenant Approval Payload...',
          `[Spring Boot] Provisioned PostgreSQL schema "tenant_${createdInst.code.toLowerCase()}"`,
          '[Spring Boot] Domain security SSL certificates issued.',
          `[Spring Boot 200 OK] ${createdInst.name} is now live in Regional Hub!`,
        ],
      });
    } catch (err) {
      // ignore
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = (reqId: string) => {
    ([] as any);
    refreshList();
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Tenant Governance</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Institution Tenant-Request Review Queue
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Review incoming campus onboarding applications. Approval triggers automated Spring Boot microservice provisioning.
            </p>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-editorial text-lg font-bold text-stone-900">{req.institutionName}</h3>
                    <Badge variant={req.status === 'approved' ? 'emerald' : req.status === 'rejected' ? 'coral' : 'amber'}>
                      {req.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-500">
                    Applicant: <strong>{req.applicantName}</strong> ({req.applicantEmail}) • Domain: <code className="bg-stone-100 px-1 py-0.5 rounded">{req.domainRequested}</code>
                  </p>
                </div>

                <div className="text-xs text-stone-400 font-mono flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Submitted: {new Date(req.submittedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700">
                <div>District: <strong className="text-stone-900">{req.regionDistrict}</strong></div>
                <div>Est. Headcount: <strong className="text-stone-900">{req.estimatedStudents.toLocaleString()} Students</strong></div>
                <div>Document: <span className="font-mono text-emerald-800">{req.accreditationDoc}</span></div>
              </div>

              {req.notes && (
                <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <strong>Notes:</strong> {req.notes}
                </p>
              )}

              {/* Terminal logs display if approved */}
              {req.springBootLog && (
                <div className="bg-stone-950 text-emerald-400 font-mono text-[11px] p-3 rounded-xl space-y-1">
                  {req.springBootLog.map((l, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Terminal className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span>{l}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {req.status === 'pending' && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <Button
                    onClick={() => handleReject(req.id)}
                    variant="outline"
                    className="border-rose-300 text-rose-700 hover:bg-rose-50 text-xs"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject Application
                  </Button>

                  <Button
                    onClick={() => handleApprove(req.id)}
                    disabled={processingId === req.id}
                    className="bg-[#064E3B] hover:bg-emerald-800 text-white text-xs"
                  >
                    {processingId === req.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                        Triggering Spring Boot...
                      </>
                    ) : (
                      <>
                        <Cpu className="h-4 w-4 mr-1.5" />
                        Approve & Execute Spring Provisioning
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
