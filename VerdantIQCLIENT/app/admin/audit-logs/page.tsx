'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileCode, Search, Filter, Download, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuditLogFilters } from '@/lib/hooks/useAuditLogFilters';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  actionType: 'Auth' | 'Config Change' | 'Permission Escalation' | 'Data Export' | 'Model Retrain' | 'System Alert';
  targetResource: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

export default function AdminAuditLogsPage() {
  const {
    filters,
    updateFilter,
    resetFilters,
    isSaved,
    userAccountIdentifier,
  } = useAuditLogFilters('admin_audit_logs', {
    searchQuery: '',
    selectedAction: 'all',
    selectedRole: 'all',
    selectedSeverity: 'all',
  });

  const { searchQuery, selectedAction, selectedRole, selectedSeverity } = filters;
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);

  const logs: AuditLogEntry[] = [
    {
      id: 'log_9012',
      timestamp: '2026-08-01 08:14:22',
      actor: 'Amara Okafor',
      role: 'Platform Admin',
      actionType: 'Permission Escalation',
      targetResource: 'rbac_policy_v2',
      ipAddress: '192.168.1.104',
      severity: 'warning',
    },
    {
      id: 'log_9011',
      timestamp: '2026-08-01 07:52:10',
      actor: 'Kenji Takahashi',
      role: 'ML Ops Admin',
      actionType: 'Model Retrain',
      targetResource: 'hvac_opt_model_v2.4',
      ipAddress: '10.0.4.12',
      severity: 'info',
    },
    {
      id: 'log_9010',
      timestamp: '2026-08-01 06:30:15',
      actor: 'Claire Beauchamp',
      role: 'Auditor',
      actionType: 'Data Export',
      targetResource: 'regional_carbon_report_q2.csv',
      ipAddress: '172.16.0.45',
      severity: 'info',
    },
    {
      id: 'log_9009',
      timestamp: '2026-08-01 05:12:00',
      actor: 'Dr. Aris Thorne',
      role: 'Dept Moderator',
      actionType: 'Config Change',
      targetResource: 'building_b_schedule',
      ipAddress: '192.168.1.55',
      severity: 'info',
    },
    {
      id: 'log_9008',
      timestamp: '2026-08-01 04:02:44',
      actor: 'Sophia Sterling',
      role: 'Institution Admin',
      actionType: 'Auth',
      targetResource: 'sso_saml_login',
      ipAddress: '192.168.1.88',
      severity: 'info',
    },
    {
      id: 'log_9007',
      timestamp: '2026-08-01 02:15:30',
      actor: 'System Watchdog',
      role: 'Automated Service',
      actionType: 'System Alert',
      targetResource: 'groq_llm_latency_spike',
      ipAddress: '127.0.0.1',
      severity: 'critical',
    },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = selectedAction === 'all' || log.actionType === selectedAction;
    const matchesRole = selectedRole === 'all' || log.role === selectedRole;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;

    return matchesSearch && matchesAction && matchesRole && matchesSeverity;
  });

  const toggleSelectAll = () => {
    if (selectedLogs.length === filteredLogs.length && filteredLogs.length > 0) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(filteredLogs.map((log) => log.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedLogs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkExport = () => {
    const exportData = logs.filter((l) => selectedLogs.includes(l.id));
    const headers = ['ID', 'Timestamp', 'Actor', 'Role', 'Action Type', 'Target Resource', 'IP Address', 'Severity'];
    const rows = exportData.map((l) => [
      l.id,
      l.timestamp,
      `"${l.actor}"`,
      `"${l.role}"`,
      `"${l.actionType}"`,
      `"${l.targetResource}"`,
      l.ipAddress,
      l.severity,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_logs_bulk_export_${selectedLogs.length}_items.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileCode className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">Security & Compliance</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Global Platform Audit Trail
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Searchable, immutable ledger of all administrative events, privilege escalations, and system actions.
            </p>
          </div>

          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1.5" /> Export Audit CSV
          </Button>
        </div>

        {/* Filter Toolbar */}
        <Card className="p-4 bg-white/95 border-stone-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-emerald-800" />
              <span className="font-bold text-xs text-stone-800">Audit Log Filters</span>
              {isSaved && (
                <Badge variant="emerald" className="text-[10px] font-mono py-0.5">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-700" />
                  Saved to Local Storage ({userAccountIdentifier})
                </Badge>
              )}
            </div>
            {(searchQuery || selectedAction !== 'all' || selectedRole !== 'all' || selectedSeverity !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-[11px] text-stone-500 hover:text-stone-900 h-7 px-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset Filter Preferences
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search actor, log ID, target..."
                value={searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>

            <div>
              <select
                value={selectedAction}
                onChange={(e) => updateFilter('selectedAction', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800"
              >
                <option value="all">All Action Types</option>
                <option value="Auth">Auth</option>
                <option value="Config Change">Config Change</option>
                <option value="Permission Escalation">Permission Escalation</option>
                <option value="Data Export">Data Export</option>
                <option value="Model Retrain">Model Retrain</option>
                <option value="System Alert">System Alert</option>
              </select>
            </div>

            <div>
              <select
                value={selectedRole}
                onChange={(e) => updateFilter('selectedRole', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800"
              >
                <option value="all">All Roles</option>
                <option value="Platform Admin">Platform Admin</option>
                <option value="ML Ops Admin">ML Ops Admin</option>
                <option value="Auditor">Auditor</option>
                <option value="Dept Moderator">Dept Moderator</option>
                <option value="Institution Admin">Institution Admin</option>
                <option value="Automated Service">Automated Service</option>
              </select>
            </div>

            <div>
              <select
                value={selectedSeverity}
                onChange={(e) => updateFilter('selectedSeverity', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800"
              >
                <option value="all">All Severities</option>
                <option value="info">INFO</option>
                <option value="warning">WARNING</option>
                <option value="critical">CRITICAL</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Bulk Actions Banner */}
        <div id="audit-log-bulk-actions">
          {selectedLogs.length > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 border border-emerald-200/90 rounded-xl p-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-900">
                <ShieldCheck className="h-4 w-4 text-[#064E3B]" />
                <span>
                  <strong className="font-semibold">{selectedLogs.length}</strong> audit log entries selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBulkExport}
                  className="bg-[#064E3B] hover:bg-[#04382a] text-white text-xs px-3 py-1.5"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Bulk Export Selected
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLogs([])}
                  className="text-stone-600 hover:text-stone-900 text-xs"
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Logs Table or Empty State */}
        {filteredLogs.length === 0 ? (
          <EmptyState
            title="No Matching Audit Logs"
            description="No system security logs match your active search filters or role criteria."
            actionLabel="Reset Search Filters"
            onAction={resetFilters}
          />
        ) : (
          <Card className="p-4 bg-white/95 border-stone-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-mono text-[10px] uppercase">
                    <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={filteredLogs.length > 0 && selectedLogs.length === filteredLogs.length}
                        onChange={toggleSelectAll}
                        aria-label="Select all rows"
                        className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-800 h-3.5 w-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-3">Log ID & Time</th>
                    <th className="py-2.5 px-3">Actor & Role</th>
                    <th className="py-2.5 px-3">Action Type</th>
                    <th className="py-2.5 px-3">Target Resource</th>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {filteredLogs.map((log) => {
                    const isSelected = selectedLogs.includes(log.id);
                    return (
                      <tr
                        key={log.id}
                        className={`hover:bg-stone-50 transition-colors ${
                          isSelected ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(log.id)}
                            aria-label={`Select log ${log.id}`}
                            className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-800 h-3.5 w-3.5 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-stone-900 block">{log.id}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{log.timestamp}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-stone-800 block">{log.actor}</span>
                          <span className="text-[10px] text-emerald-800 font-semibold">{log.role}</span>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="stone">{log.actionType}</Badge>
                        </td>
                        <td className="py-3 px-3 font-mono text-stone-700">{log.targetResource}</td>
                        <td className="py-3 px-3 font-mono text-stone-500">{log.ipAddress}</td>
                        <td className="py-3 px-3">
                          <Badge variant={log.severity === 'critical' ? 'coral' : log.severity === 'warning' ? 'amber' : 'emerald'}>
                            {log.severity.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
