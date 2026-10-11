'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { KeyRound, Check, X, Download, Plus, ShieldCheck, Info } from 'lucide-react';
import { CrossRoleLineageTable } from '@/components/shared/ConsistencyPatterns';

interface CapabilityDefinition {
  key: string;
  label: string;
  description: string;
  category: 'Telemetry' | 'Optimization' | 'Governance' | 'ML Ops';
}

export default function AdminRbacSchemaPage() {
  const [capabilities, setCapabilities] = useState<CapabilityDefinition[]>([
    { key: 'read:telemetry', label: 'Read Raw Telemetry', description: 'Stream live building & dorm power telemetry data.', category: 'Telemetry' },
    { key: 'write:schedules', label: 'Write Schedules', description: 'Modify HVAC/lighting automated schedules.', category: 'Telemetry' },
    { key: 'exec:milp_optimization', label: 'Execute MILP Solver', description: 'Trigger linear integer program optimization dispatch.', category: 'Optimization' },
    { key: 'export:raw_data', label: 'Export Raw Data CSV', description: 'Download raw un-aggregated telemetry logs.', category: 'Governance' },
    { key: 'manage:users', label: 'Manage User Roster', description: 'Approve, suspend, or promote campus accounts.', category: 'Governance' },
    { key: 'retrain:ml_models', label: 'Retrain ML Models', description: 'Trigger model retrain jobs on GPU/LPU cluster.', category: 'ML Ops' },
    { key: 'audit:immutable_logs', label: 'Audit Compliance Logs', description: 'Access immutable cryptographic event ledger.', category: 'Governance' },
  ]);

  const rolesList = ['user', 'student', 'dept', 'institution', 'region', 'admin', 'mlops', 'audit'];

  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    user: { 'read:telemetry': true, 'write:schedules': false, 'exec:milp_optimization': false, 'export:raw_data': false, 'manage:users': false, 'retrain:ml_models': false, 'audit:immutable_logs': false },
    student: { 'read:telemetry': true, 'write:schedules': false, 'exec:milp_optimization': true, 'export:raw_data': false, 'manage:users': false, 'retrain:ml_models': false, 'audit:immutable_logs': false },
    dept: { 'read:telemetry': true, 'write:schedules': true, 'exec:milp_optimization': true, 'export:raw_data': true, 'manage:users': false, 'retrain:ml_models': false, 'audit:immutable_logs': false },
    institution: { 'read:telemetry': true, 'write:schedules': true, 'exec:milp_optimization': true, 'export:raw_data': true, 'manage:users': true, 'retrain:ml_models': false, 'audit:immutable_logs': false },
    region: { 'read:telemetry': true, 'write:schedules': true, 'exec:milp_optimization': true, 'export:raw_data': true, 'manage:users': true, 'retrain:ml_models': false, 'audit:immutable_logs': true },
    admin: { 'read:telemetry': true, 'write:schedules': true, 'exec:milp_optimization': true, 'export:raw_data': true, 'manage:users': true, 'retrain:ml_models': true, 'audit:immutable_logs': true },
    mlops: { 'read:telemetry': true, 'write:schedules': true, 'exec:milp_optimization': true, 'export:raw_data': true, 'manage:users': false, 'retrain:ml_models': true, 'audit:immutable_logs': true },
    audit: { 'read:telemetry': true, 'write:schedules': false, 'exec:milp_optimization': false, 'export:raw_data': true, 'manage:users': false, 'retrain:ml_models': false, 'audit:immutable_logs': true },
  });

  const [newCapKey, setNewCapKey] = useState('');
  const [newCapLabel, setNewCapLabel] = useState('');
  const [newCapDesc, setNewCapDesc] = useState('');

  const togglePermission = (role: string, perm: string) => {
    setMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role]?.[perm],
      },
    }));
  };

  const handleAddCapability = () => {
    if (newCapKey.trim() && newCapLabel.trim()) {
      const keyFormatted = newCapKey.toLowerCase().replace(/\s+/g, '_');
      const newCap: CapabilityDefinition = {
        key: keyFormatted,
        label: newCapLabel.trim(),
        description: newCapDesc || 'Custom capability definition.',
        category: 'Governance',
      };
      setCapabilities([...capabilities, newCap]);

      // Grant to admin by default
      setMatrix((prev) => {
        const next = { ...prev };
        rolesList.forEach((r) => {
          next[r] = { ...next[r], [keyFormatted]: r === 'admin' };
        });
        return next;
      });

      setNewCapKey('');
      setNewCapLabel('');
      setNewCapDesc('');
    }
  };

  const exportRbacJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ capabilities, matrix }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'rbac_schema_capabilities.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">Security Policy Matrix</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Role-Based Access Control (RBAC) & Capability Definitions
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Interactive permission matrix and capability definitions governing action execution across all 8 platform roles.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={exportRbacJson}>
            <Download className="h-3.5 w-3.5 mr-1.5" /> Export RBAC Schema JSON
          </Button>
        </div>

        {/* Add Capability Definition */}
        <Card className="p-5 bg-white/95 border-stone-200 space-y-3">
          <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            Define New Capability
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Capability Key</label>
              <input
                type="text"
                placeholder="e.g. override:geofence"
                value={newCapKey}
                onChange={(e) => setNewCapKey(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Display Label</label>
              <input
                type="text"
                placeholder="e.g. Override Geofence Radius"
                value={newCapLabel}
                onChange={(e) => setNewCapLabel(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Description</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Allows bypass of GPS bounds"
                  value={newCapDesc}
                  onChange={(e) => setNewCapDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
                <Button variant="primary" size="sm" onClick={handleAddCapability}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Matrix Table */}
        <Card className="p-5 bg-white/95 border-stone-200 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-mono text-[10px] uppercase">
                  <th className="py-3 px-4 text-left">Role Identifier</th>
                  {capabilities.map((cap) => (
                    <th key={cap.key} className="py-3 px-2 min-w-[110px]" title={cap.description}>
                      <span className="block font-bold text-stone-800">{cap.key}</span>
                      <span className="text-[9px] text-stone-400 font-sans font-normal">{cap.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {rolesList.map((roleKey) => (
                  <tr key={roleKey} className="hover:bg-stone-50/80">
                    <td className="py-3 px-4 text-left">
                      <Badge variant="stone">{roleKey.toUpperCase()}</Badge>
                    </td>
                    {capabilities.map((cap) => {
                      const isGranted = matrix[roleKey]?.[cap.key];
                      return (
                        <td key={cap.key} className="py-3 px-2">
                          <button
                            onClick={() => togglePermission(roleKey, cap.key)}
                            className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                              isGranted
                                ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                                : 'bg-stone-100 text-stone-400 border border-transparent hover:border-stone-300'
                            }`}
                          >
                            {isGranted ? (
                              <Check className="h-4 w-4 mx-auto text-emerald-800" />
                            ) : (
                              <X className="h-4 w-4 mx-auto text-stone-400" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Lineage Table */}
        <CrossRoleLineageTable />
      </div>
    </AppShell>
  );
}
