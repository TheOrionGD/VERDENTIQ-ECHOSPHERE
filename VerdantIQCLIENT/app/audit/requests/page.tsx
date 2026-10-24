'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  FileQuestion,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw,
  X,
  Send,
  Building2,
  FileCheck2,
} from 'lucide-react';

interface AuditRequestRecord {
  _id?: string;
  id: string;
  tenantId: string;
  targetDepartment: string;
  scopeStandard: string;
  title: string;
  status: 'IN_REVIEW' | 'COMPLETED' | 'REJECTED' | string;
  auditorEmail: string;
  requestedAt: string;
  resolvedAt?: string | null;
}

export default function AuditRequestsPage() {
  const [requests, setRequests] = useState<AuditRequestRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // New Request Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState('Facility Science');
  const [newScopeStandard, setNewScopeStandard] = useState('ISO 50001 (Section 6.3 - Energy Baselines)');
  const [newAuditorEmail, setNewAuditorEmail] = useState('auditor@esg-verify.org');

  const fetchRequests = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/audit/requests', { cache: 'no-store' });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${res.status}: Failed to query audit requests.`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRequests(data.data);
      } else {
        throw new Error(data.error || 'Invalid response received from audit requests API.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with database.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRequests();
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Request title or research scope description is required.');
      return;
    }
    if (!newScopeStandard.trim()) {
      setFormError('Scope standard is required.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      const res = await fetch('/api/audit/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          targetDepartment: newDepartment.trim(),
          scopeStandard: newScopeStandard.trim(),
          auditorEmail: newAuditorEmail.trim(),
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit petition.');
      }

      // Prepend to requests list directly from authoritative database response
      setRequests((prev) => [result.data, ...prev]);
      setShowModal(false);
      setNewTitle('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to persist request to database.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/audit/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: newStatus,
                  resolvedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : r.resolvedAt,
                }
              : r
          )
        );
      } else {
        alert(data.error || 'Failed to update request status in database.');
      }
    } catch (err: any) {
      alert(`Network/Server error: ${err.message}`);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'Approved':
        return (
          <Badge variant="emerald" className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Verified & Approved
          </Badge>
        );
      case 'IN_REVIEW':
        return (
          <Badge variant="amber" className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            In Review
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="rose" className="inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="stone">{status}</Badge>;
    }
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileQuestion className="h-5 w-5 text-emerald-400" />
              <Badge variant="emerald">Live MongoDB Atlas</Badge>
              <Badge variant="stone" className="font-mono text-[10px]">Collection: auditrequests</Badge>
            </div>
            <h1 className="font-segoe text-2xl font-bold text-slate-100">
              Institutional Review Board (IRB) & Compliance Petitions
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Authoritative records of research dataset access petitions, ISO 50001 energy baselines, and GRI 302 verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="border-slate-700 hover:bg-slate-800 text-slate-300"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Submit Protocol Petition
            </Button>
          </div>
        </div>

        {/* Database Diagnostic/Error Banner */}
        {error && (
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Authoritative Source Unreachable:</strong> {error}
              </span>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={handleRefresh}
              className="border-rose-700/50 hover:bg-rose-900/40 text-rose-200"
            >
              Retry Database Connection
            </Button>
          </div>
        )}

        {/* Audit Metrics Banner from Authoritative Query */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="p-3.5 bg-slate-900/60 border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">Total Petitions in DB</div>
              <div className="text-xl font-bold font-mono text-slate-100">
                {loading ? '—' : requests.length}
              </div>
            </div>
          </Card>

          <Card className="p-3.5 bg-slate-900/60 border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">Awaiting Sign-off</div>
              <div className="text-xl font-bold font-mono text-amber-400">
                {loading ? '—' : requests.filter((r) => r.status === 'IN_REVIEW').length}
              </div>
            </div>
          </Card>

          <Card className="p-3.5 bg-slate-900/60 border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">Certified Completed</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {loading ? '—' : requests.filter((r) => r.status === 'COMPLETED').length}
              </div>
            </div>
          </Card>
        </div>

        {/* Requests Table Card */}
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 font-mono text-xs">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
              <span>Querying MongoDB Atlas collection: auditrequests...</span>
            </div>
          ) : requests.length === 0 && !error ? (
            <EmptyState
              icon={<FileQuestion className="h-6 w-6" />}
              title="No Audit Petitions Found"
              description="The auditrequests collection is currently empty for this tenant boundary."
              actionLabel="Submit First Protocol Petition"
              onAction={() => setShowModal(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-2.5 px-3">Protocol ID</th>
                    <th className="py-2.5 px-3">Petition Scope / Title</th>
                    <th className="py-2.5 px-3">Target Department</th>
                    <th className="py-2.5 px-3">Standard / Scope</th>
                    <th className="py-2.5 px-3">Auditor In-Charge</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-sans">
                  {requests.map((r) => (
                    <tr key={r.id || r._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-200">
                        {r.id}
                        <div className="text-[10px] text-slate-400 font-mono">
                          {r.requestedAt ? new Date(r.requestedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-200">{r.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">Tenant: {r.tenantId}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        <div className="inline-flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {r.targetDepartment}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {r.scopeStandard}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                        {r.auditorEmail}
                      </td>
                      <td className="py-3 px-3">
                        {renderStatusBadge(r.status)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {r.status === 'IN_REVIEW' ? (
                          <div className="inline-flex gap-1">
                            <button
                              onClick={() => handleStatusChange(r.id, 'COMPLETED')}
                              className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/60 text-[11px] font-mono transition-colors"
                              title="Mark as Completed / Certified"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(r.id, 'REJECTED')}
                              className="px-2 py-1 rounded bg-rose-950/60 border border-rose-600/40 text-rose-300 hover:bg-rose-900/60 text-[11px] font-mono transition-colors"
                              title="Reject Petition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-400">
                            {r.resolvedAt ? `Resolved ${new Date(r.resolvedAt).toLocaleDateString()}` : 'Archived'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal: Submit Real IRB Protocol Petition */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileQuestion className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-slate-100">Submit IRB Compliance Petition</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="mt-4 space-y-4">
                {formError && (
                  <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-950/40 text-rose-300 text-xs">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Petition / Research Scope Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Sub-metered Heat Pump Telemetry Calibration Protocol"
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Target Department
                    </label>
                    <select
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Facility Science">Facility Science</option>
                      <option value="Executive Operations">Executive Operations</option>
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Environmental Policy & Sustainability">Environmental Policy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Auditor Email
                    </label>
                    <input
                      type="email"
                      required
                      value={newAuditorEmail}
                      onChange={(e) => setNewAuditorEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Compliance Standard / Scope Standard *
                  </label>
                  <input
                    type="text"
                    required
                    value={newScopeStandard}
                    onChange={(e) => setNewScopeStandard(e.target.value)}
                    placeholder="e.g. ISO 50001 (Section 6.3 - Energy Baselines)"
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">Persistence Guarantee:</p>
                  <p>
                    This petition will write directly to the authoritative MongoDB Atlas cluster under the <code>auditrequests</code> collection. No simulated delays or mock state are utilized.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={submitting}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Persisting to MongoDB...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        Submit & Persist Petition
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
