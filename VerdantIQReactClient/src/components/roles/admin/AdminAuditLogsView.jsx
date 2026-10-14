import React, { useState } from 'react';
import { 
  FileCode, 
  Search, 
  Download, 
  CheckCircle
} from 'lucide-react';

export function AdminAuditLogsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const logs = [
    {
      id: 'LOG-8941',
      action: 'TENANT_DOMAIN_PROVISIONED',
      userId: 'usr-admin-lead',
      userRole: 'admin',
      timestamp: '2026-10-14T09:12:44Z',
      details: 'Registered domain @verdia.edu for Verdia Central University tenant',
      prevHash: 'SHA256:4a12f9...83b1',
      currentHash: 'SHA256:7e31c0...92d4',
      verified: true
    },
    {
      id: 'LOG-8942',
      action: 'RATE_LIMIT_RULE_UPDATED',
      userId: 'usr-admin-lead',
      userRole: 'admin',
      timestamp: '2026-10-14T09:34:11Z',
      details: 'Increased Gemini 2.5 Flash fallback quota to 1,200 req/min',
      prevHash: 'SHA256:7e31c0...92d4',
      currentHash: 'SHA256:c18402...51f8',
      verified: true
    },
    {
      id: 'LOG-8943',
      action: 'CANARY_SPLIT_MODIFIED',
      userId: 'usr-mlops-chief',
      userRole: 'mlops',
      timestamp: '2026-10-14T10:05:22Z',
      details: 'Promoted Holt-Winters additive predictor to 75% traffic split',
      prevHash: 'SHA256:c18402...51f8',
      currentHash: 'SHA256:d914a7...38e0',
      verified: true
    },
    {
      id: 'LOG-8944',
      action: 'BILL_INGESTION_SCOPED',
      userId: 'usr-inst-admin',
      userRole: 'institution',
      timestamp: '2026-10-14T10:45:00Z',
      details: 'Ingested May 2026 utility billing: 164,000 kWh ($19,680.00)',
      prevHash: 'SHA256:d914a7...38e0',
      currentHash: 'SHA256:29b3f4...66a1',
      verified: true
    },
    {
      id: 'LOG-8945',
      action: 'STUDENT_PROOF_VERIFIED',
      userId: 'usr-dept-moderator',
      userRole: 'dept',
      timestamp: '2026-10-14T11:15:30Z',
      details: 'Approved +30 EcoPoints to Alex Mercer for Lab Twilight Shutdown',
      prevHash: 'SHA256:29b3f4...66a1',
      currentHash: 'SHA256:ff421a...90b8',
      verified: true
    },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.currentHash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || log.userRole === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>Immutable Cryptographic Audit Logs & Hash Chain Inspector</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Tamper-evident record of all administrative, MLOps deployment, and campus utility actions.
          </p>
        </div>

        <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs border border-white/10 transition-colors cursor-pointer">
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search action, details, or hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded pl-9 pr-3 py-1.5 text-white"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-neutral-900 border border-white/10 rounded px-3 py-1.5 text-white"
        >
          <option value="all">All Roles</option>
          <option value="admin">Platform Admin</option>
          <option value="mlops">MLOps</option>
          <option value="institution">Campus Admin</option>
          <option value="dept">Dept Moderator</option>
        </select>
      </div>

      {/* Audit Log Entries Table */}
      <div className="fluent-card p-5 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-white/10 text-neutral-400">
              <tr>
                <th className="py-2.5 px-3">Event Action</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Current Block Hash</th>
                <th className="py-2.5 px-3">Chain State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 font-semibold text-white font-mono text-[11px]">{log.action}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-white font-medium">{log.userId}</span>
                    <span className="text-[10px] text-neutral-400 block font-mono uppercase">{log.userRole}</span>
                  </td>
                  <td className="py-2.5 px-3 text-neutral-300 max-w-xs">{log.details}</td>
                  <td className="py-2.5 px-3 text-neutral-400 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-teal-400 text-[10px]">
                    {log.currentHash}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="flex items-center space-x-1 text-emerald-400 text-[10px] font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      <span>VALIDATED</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
