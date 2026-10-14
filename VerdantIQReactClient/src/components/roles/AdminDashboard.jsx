import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Server, 
  Database, 
  Activity, 
  Users, 
  Plus, 
  CheckCircle,
  Building2 
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../lib/useAuth';

import { AdminDomainsView } from './admin/AdminDomainsView';
import { AdminRateLimitsView } from './admin/AdminRateLimitsView';
import { AdminAccessGrantsView } from './admin/AdminAccessGrantsView';
import { AdminBroadcastsView } from './admin/AdminBroadcastsView';
import { AdminTenantRequestsView } from './admin/AdminTenantRequestsView';
import { AdminDatabaseView } from './admin/AdminDatabaseView';
import { AdminTelemetryView } from './admin/AdminTelemetryView';
import { AdminAuditLogsView } from './admin/AdminAuditLogsView';
import { AdminFeatureFlagsView } from './admin/AdminFeatureFlagsView';
import { AdminRbacSchemaView } from './admin/AdminRbacSchemaView';

export function AdminDashboard() {
  const { activeScreen } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // New campus registration modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [studentCount, setStudentCount] = useState('');
  const [campusAreaSqM, setCampusAreaSqM] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/api/admin/overview');
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/api/admin/overview');
        if (isMounted) setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleCreateInstitution = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await apiRequest('/api/admin/institutions', {
        method: 'POST',
        body: { name, code, studentCount, campusAreaSqM },
      });
      setShowModal(false);
      setName('');
      setCode('');
      setStudentCount('');
      setCampusAreaSqM('');
      await fetchAdminData();
    } catch (err) {
      alert(`Registration error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
        Loading Platform Admin Suite...
      </div>
    );
  }

  const { institutions = [], recentAudits = [] } = data || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Platform Governance & Administration Suite</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Active Feature Screen: <span className="text-emerald-400 font-semibold uppercase">{activeScreen}</span> · Multi-Tenant Operations & Security
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Provision New Campus</span>
        </button>
      </div>

      {/* Screen 1: Overview Dashboard / System Center */}
      {(activeScreen === 'admin-dashboard' || activeScreen === 'dashboard') && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="liquid-glass-panel p-4 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between items-center text-neutral-300 text-xs mb-1.5 font-medium">
                <span>Active Campuses</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">{data?.totalInstitutions}</div>
              <div className="text-[11px] text-neutral-400 mt-1 font-sans">Multi-tenant tenants provisioned</div>
            </div>

            <div className="liquid-glass-panel p-4 rounded-xl border border-white/10 hover:border-sky-500/30 transition-all">
              <div className="flex justify-between items-center text-neutral-300 text-xs mb-1.5 font-medium">
                <span>Express Backend</span>
                <Server className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-lg font-bold text-emerald-400 flex items-center space-x-1.5 font-mono">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Port 5000 Healthy</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-sans">Heap: {data?.serverMemoryUsageMb} MB active</div>
            </div>

            <div className="liquid-glass-panel p-4 rounded-xl border border-white/10 hover:border-teal-500/30 transition-all">
              <div className="flex justify-between items-center text-neutral-300 text-xs mb-1.5 font-medium">
                <span>MongoDB Atlas</span>
                <Database className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-lg font-bold text-teal-300 flex items-center space-x-1.5 font-mono">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>VerdantIQ Cluster</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-sans">Multi-collection persistence</div>
            </div>

            <div className="liquid-glass-panel p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all">
              <div className="flex justify-between items-center text-neutral-300 text-xs mb-1.5 font-medium">
                <span>Total Recorded Records</span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {((data?.totalReadingsRecorded || 0) + (data?.totalWaterRecords || 0) + (data?.totalWasteRecords || 0)).toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-sans">{data?.totalProofsSubmitted || 0} Verified Student Proofs</div>
            </div>
          </div>

          <div className="liquid-glass-panel rounded-2xl p-5 border border-white/10 shadow-xl space-y-3">
            <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Provisioned Institutional Campuses</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-200">
                <thead className="border-b border-white/10 text-neutral-400 text-[11px] uppercase font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Campus Name</th>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Students</th>
                    <th className="py-2.5 px-3">Estate Area</th>
                    <th className="py-2.5 px-3">Grid Emission Factor</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {institutions.map((inst) => (
                    <tr key={inst._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-white">{inst.name}</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">{inst.code}</td>
                      <td className="py-2.5 px-3">{inst.studentCount?.toLocaleString()}</td>
                      <td className="py-2.5 px-3">{inst.campusAreaSqM?.toLocaleString()} m²</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-300">{inst.regionalGridFactor} kg/kWh</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase font-mono font-semibold border border-emerald-500/30">
                          {inst.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Global Audit Activity */}
          <div className="liquid-glass-panel rounded-2xl p-5 border border-white/10 shadow-xl space-y-3">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Immutable Global System Audit Log Stream ({recentAudits.length} Records)</span>
            </h2>
            <div className="space-y-2">
              {recentAudits.slice(0, 5).map((log, idx) => (
                <div key={log._id || log.hash || idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-emerald-300 uppercase text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 font-semibold">
                      {log.action || 'SYSTEM_EVENT'}
                    </span>
                    <span className="text-white text-xs">
                      {typeof log.details === 'string'
                        ? log.details
                        : log.details?.message || (typeof log.message === 'string' ? log.message : (log.message?.message || JSON.stringify(log.details || log.message || 'Audited Transaction Secured')))}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recent'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Screen 2: Telemetry Grid */}
      {activeScreen === 'telemetry' && <AdminTelemetryView />}

      {/* Screen 3: Database Admin */}
      {activeScreen === 'database' && <AdminDatabaseView />}

      {/* Screen 4: Global Audit Logs */}
      {activeScreen === 'audit-logs' && <AdminAuditLogsView />}

      {/* Screen 5: Tenant Requests */}
      {activeScreen === 'tenant-requests' && <AdminTenantRequestsView />}

      {/* Screen 6: Domain Conflicts */}
      {activeScreen === 'domains' && <AdminDomainsView />}

      {/* Screen 7: Feature Flags */}
      {activeScreen === 'feature-flags' && <AdminFeatureFlagsView />}

      {/* Screen 8: Rate Limits */}
      {activeScreen === 'rate-limits' && <AdminRateLimitsView />}

      {/* Screen 9: RBAC Schema */}
      {activeScreen === 'rbac-schema' && <AdminRbacSchemaView />}

      {/* Screen 10: Access Grants */}
      {activeScreen === 'access-grants' && <AdminAccessGrantsView />}

      {/* Screen 11: Broadcasts */}
      {activeScreen === 'broadcasts' && <AdminBroadcastsView />}

      {/* Provision Campus Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="fluent-mica p-6 rounded-xl max-w-md w-full shadow-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-semibold text-white">Provision New Institutional Tenant</h3>
            <form onSubmit={handleCreateInstitution} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1">Campus Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pacific Technical University"
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">Campus Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. PTU"
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1">Student Body</label>
                  <input
                    type="number"
                    value={studentCount}
                    onChange={(e) => setStudentCount(e.target.value)}
                    placeholder="e.g. 12000"
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Campus Area (m²)</label>
                <input
                  type="number"
                  value={campusAreaSqM}
                  onChange={(e) => setCampusAreaSqM(e.target.value)}
                  placeholder="e.g. 75000"
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded bg-neutral-800 text-neutral-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium"
                >
                  {isSubmitting ? 'Provisioning...' : 'Provision Campus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
