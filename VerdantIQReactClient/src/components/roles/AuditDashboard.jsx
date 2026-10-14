import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Hash 
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

import { useAuth } from '../../lib/useAuth';
import { AuditOverviewView } from './audit/AuditOverviewView';
import { AuditDataFlowView } from './audit/AuditDataFlowView';
import { AuditFairnessReportsView } from './audit/AuditFairnessReportsView';
import { AuditExportView } from './audit/AuditExportView';
import { 
  AuditTenantHistoryView, 
  AuditRequestsView, 
  AuditModelCardsView, 
  AuditSettingsView 
} from './audit/AuditSupplementaryViews';

export function AuditDashboard() {
  const { activeScreen } = useAuth();
  const [logs, setLogs] = useState([]);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const [logsRes, verifyRes] = await Promise.all([
          apiRequest('/api/audit/logs'),
          apiRequest('/api/audit/verify'),
        ]);
        if (isMounted) {
          setLogs(logsRes);
          setVerification(verifyRes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleVerifyChain = async () => {
    try {
      setVerifying(true);
      const res = await apiRequest('/api/audit/verify');
      setVerification(res);
    } catch (err) {
      alert(`Verification error: ${err.message}`);
    } finally {
      setVerifying(false);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/audit/export?format=csv&institutionId=inst-verdia-central', '_blank');
  };

  const handleExportJson = () => {
    window.open('/api/audit/export?format=json&institutionId=inst-verdia-central', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span>Auditor & Researcher Compliance Terminal</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Independent Cryptographic Verification · Tamper-Evident SHA-256 Hash Chain · Scope 2 Exportable Records
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white text-xs border border-white/10 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white text-xs border border-white/10 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleVerifyChain}
            disabled={verifying}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            <span>Verify Hash Chain</span>
          </button>
        </div>
      </div>

      {/* Screen 1: Dashboard Overview */}
      {(activeScreen === 'audit-dashboard' || activeScreen === 'dashboard') && (
        <>
          {loading && !verification && (
            <div className="fluent-card p-6 text-center text-xs text-neutral-400 animate-pulse">
              Verifying cryptographic hash chain across immutable audit ledger...
            </div>
          )}
          {/* Verification Status Banner */}
          {verification && (
            <div className={`p-4 rounded-lg border ${
              verification.isValid
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/30 border-red-500/30 text-red-300'
            } flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                {verification.isValid ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <div>
                  <div className="text-sm font-semibold">
                    {verification.isValid ? 'Cryptographic Chain Valid & Untampered' : 'Tamper Detected in Chain!'}
                  </div>
                  <div className="text-xs text-neutral-300 mt-0.5">{verification.reason}</div>
                </div>
              </div>
              <div className="text-xs font-mono bg-black/40 px-3 py-1 rounded border border-white/10">
                Records Checked: {verification.unbrokenCount}
              </div>
            </div>
          )}

          {/* Audit Logs Table */}
          <div className="fluent-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
                <Hash className="w-4 h-4 text-emerald-400" />
                <span>Immutable Audit Trail ({logs.length} records)</span>
              </h2>
              <span className="text-[11px] text-neutral-400">Strictly Server-Hashed with SHA-256</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300 border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-[11px]">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">User & Role</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Previous Hash</th>
                    <th className="py-2.5 px-3">Current SHA-256 Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {logs.map((log, idx) => (
                    <tr key={log._id || idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 text-[11px] text-neutral-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="font-medium text-white">{log.userId}</span>
                        <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                          {log.userRole}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans font-medium text-emerald-400">
                        {log.action}
                      </td>
                      <td className="py-2.5 px-3 text-[10px] text-neutral-500 truncate max-w-[140px]" title={log.previousHash}>
                        {log.previousHash}
                      </td>
                      <td className="py-2.5 px-3 text-[10px] text-teal-400 truncate max-w-[160px]" title={log.currentHash}>
                        {log.currentHash}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Screen 2: Anonymized Overview */}
      {activeScreen === 'overview' && <AuditOverviewView />}

      {/* Screen 3: Redacted Logs */}
      {activeScreen === 'logs' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Redacted Compliance Logs (Personally Identifiable Information Scrubbed)</span>
          </h2>
          <div className="space-y-2">
            {logs.map((l, i) => (
              <div key={i} className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">{l.action}</div>
                  <div className="text-[11px] text-neutral-400">User: [REDACTED_ACTOR_HASH_{i}] · Role: {l.userRole}</div>
                </div>
                <div className="text-right text-[10px] font-mono text-neutral-400">{new Date(l.timestamp).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen 4: Immutable Export */}
      {activeScreen === 'export' && <AuditExportView />}

      {/* Screen 5: Domain Registry */}
      {activeScreen === 'domains' && (
        <div className="fluent-card p-5 space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white">Audited Campus Domain Registry</h2>
          <div className="space-y-2">
            <div className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between">
              <div>
                <span className="font-semibold text-white">verdia.edu</span>
                <span className="text-neutral-400 ml-2">Verdia Central University (Verified DNS)</span>
              </div>
              <span className="text-emerald-400 font-mono">TXT: verdantiq-site-verification=verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Screen 6: Tenant History */}
      {activeScreen === 'tenant-history' && <AuditTenantHistoryView />}

      {/* Screen 7: Data Requests */}
      {activeScreen === 'requests' && <AuditRequestsView />}

      {/* Screen 8: Model Cards */}
      {activeScreen === 'model-cards' && <AuditModelCardsView />}

      {/* Screen 9: Data Lineage Flow */}
      {activeScreen === 'data-flow' && <AuditDataFlowView />}

      {/* Screen 10: Fairness Reports */}
      {activeScreen === 'fairness-reports' && <AuditFairnessReportsView />}

      {/* Screen 11: Retention Policies */}
      {activeScreen === 'settings' && <AuditSettingsView />}
    </div>
  );
}
