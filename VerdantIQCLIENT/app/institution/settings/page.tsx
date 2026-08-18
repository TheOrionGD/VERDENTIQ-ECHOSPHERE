// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Settings,
  Shield,
  Activity,
  Plus,
  Radio,
  CheckCircle2,
  Bell,
  Search,
  Save,
  Palette,
  Server,
  FileCode,
  RefreshCw,
} from 'lucide-react';
import { TenantBrandingConfig, SmartMeterGateway, InstitutionAdminAuditLog,  } from '@/lib/services/institutionService';
import { useAuditLogFilters } from '@/lib/hooks/useAuditLogFilters';

export default function InstitutionSettingsAndAuditPage() {
  const [branding, setBranding] = useState<TenantBrandingConfig>(() => ([] as any));
  const [smartMeters, setSmartMeters] = useState<SmartMeterGateway[]>(() => ([] as any));
  const [auditLogs, setAuditLogs] = useState<InstitutionAdminAuditLog[]>(() => ([] as any));
  const [activeTab, setActiveTab] = useState<'branding' | 'iot' | 'audit'>('branding');

  // Persistent Audit Log Filters
  const {
    filters,
    updateFilter,
    resetFilters,
    isSaved,
    userAccountIdentifier,
  } = useAuditLogFilters('institution_audit_logs', {
    searchQuery: '',
    selectedAction: 'all',
    selectedRole: 'all',
  });

  const auditSearch = filters.searchQuery;

  // Branding Form
  const [instName, setInstName] = useState(() => ([] as any).institutionName);
  const [sysTitle, setSysTitle] = useState(() => ([] as any).systemTitle);
  const [primaryColor, setPrimaryColor] = useState(() => ([] as any).primaryColor);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Smart Meter Modal
  const [showAddMeterModal, setShowAddMeterModal] = useState(false);
  const [meterName, setMeterName] = useState('');
  const [meterProtocol, setMeterProtocol] = useState<'Modbus TCP' | 'MQTT Broker' | 'BACnet/IP' | 'REST Gateway'>('Modbus TCP');
  const [meterUrl, setMeterUrl] = useState('');
  const [meterDept, setMeterDept] = useState('Bioengineering');

  const handleSaveBranding = () => {
    const updated = ([] as any);
    setBranding(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddSmartMeter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meterName || !meterUrl) return;

    ([] as any);

    setSmartMeters(([] as any));
    setShowAddMeterModal(false);
    setMeterName('');
    setMeterUrl('');
  };

  const filteredAuditLogs = auditLogs.filter(
    (a) =>
      a.description.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.actionCategory.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-5 w-5 text-stone-700" />
              <Badge variant="emerald">Tenant Configuration</Badge>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-mono">Branding, IoT & Audit Logs</span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Institution Governance & Integration Settings
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Customize tenant branding & notification policies, configure smart meter IoT gateway integrations, and inspect administrative action audit trails.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            <span>Institution branding and notification policy settings updated successfully!</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
          {[
            { id: 'branding', label: 'Tenant Branding & Policy', icon: Palette },
            { id: 'iot', label: 'IoT Smart-Meter Integrations', icon: Radio, count: smartMeters.length },
            { id: 'audit', label: 'Admin Action Audit Log', icon: FileCode, count: auditLogs.length },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="bg-stone-200/60 px-1.5 py-0.5 rounded-full text-[10px] font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 1. Branding & Notification Policy */}
        {activeTab === 'branding' && branding && (
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-6 max-w-3xl">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
              <Palette className="h-4 w-4 text-emerald-800" />
              <span>Tenant Identity & Notification Policy</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Institution System Title
                </label>
                <input
                  type="text"
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Platform Headline Title
                </label>
                <input
                  type="text"
                  value={sysTitle}
                  onChange={(e) => setSysTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Primary Theme Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-9 w-12 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs w-32"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-3">
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-600" />
                  <span>Notification Policy Configuration</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 block mb-1">Executive Digest Frequency</span>
                    <select className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold">
                      <option>Daily Morning Briefing</option>
                      <option>Weekly Board Summary</option>
                      <option>Realtime Instant Push</option>
                    </select>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 block mb-1">Critical Anomaly Alert Threshold</span>
                    <select className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold">
                      <option>Score ≥ 0.75 (Recommended)</option>
                      <option>Score ≥ 0.85 (High Precision)</option>
                      <option>Score ≥ 0.50 (Strict Audit)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <Button variant="emerald" size="sm" onClick={handleSaveBranding} className="gap-1.5 text-xs">
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Tenant Branding & Policy</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Smart Meter / IoT Gateways */}
        {activeTab === 'iot' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900">Configured Smart-Meter IoT Gateways</h2>
                <p className="text-xs text-stone-500">Live telemetry feeds connecting building hardware to the platform.</p>
              </div>
              <Button
                variant="emerald"
                size="sm"
                onClick={() => setShowAddMeterModal(true)}
                className="gap-1.5 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Smart-Meter Gateway</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {smartMeters.map((meter) => (
                <div
                  key={meter.id}
                  className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {meter.protocol}
                      </span>
                      <h3 className="text-sm font-bold text-stone-900 mt-1">{meter.name}</h3>
                      <p className="text-[11px] text-stone-500">{meter.departmentName}</p>
                    </div>
                    <Badge variant={meter.status === 'Online' ? 'emerald' : 'amber'}>
                      {meter.status}
                    </Badge>
                  </div>

                  <div className="p-2.5 bg-stone-950 text-emerald-400 font-mono text-[11px] rounded-xl border border-stone-800">
                    Endpoint: {meter.endpointUrl}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono pt-2 border-t border-stone-100">
                    <span>Packets: {meter.packetsPerMinute} / min</span>
                    <span>Latency: {meter.latencyMs} ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Full Audit Log */}
        {activeTab === 'audit' && (
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-emerald-800" />
                  <span>Full Institution Admin Action Audit Log</span>
                </h2>
                <p className="text-xs text-stone-500">Immutable record of all administrative actions taken within this institution tenant.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                {isSaved && (
                  <Badge variant="emerald" className="text-[10px] font-mono py-0.5">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-700" />
                    Saved to Local Storage ({userAccountIdentifier})
                  </Badge>
                )}
                {auditSearch && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-[11px] text-stone-500 hover:text-stone-900 h-7 px-2"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                )}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search audit logs..."
                    value={auditSearch}
                    onChange={(e) => updateFilter('searchQuery', e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-800">
                  <tr>
                    <th className="p-3">Log ID</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/50">
                      <td className="p-3 font-bold text-stone-600">{log.id}</td>
                      <td className="p-3 text-stone-500">{log.timestamp}</td>
                      <td className="p-3 font-sans font-medium text-stone-900">{log.actorName}</td>
                      <td className="p-3 font-sans font-bold text-emerald-900">{log.actionCategory}</td>
                      <td className="p-3 font-sans text-stone-800">{log.description}</td>
                      <td className="p-3 text-stone-400">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add Smart Meter */}
        {showAddMeterModal && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleAddSmartMeter}
              className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Radio className="h-4 w-4 text-emerald-800" />
                  <span>Configure Smart Meter Gateway</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddMeterModal(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Gateway Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Turing Hall Sub-metering Array"
                    value={meterName}
                    onChange={(e) => setMeterName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Hardware Protocol</label>
                  <select
                    value={meterProtocol}
                    onChange={(e) => setMeterProtocol(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="Modbus TCP">Modbus TCP</option>
                    <option value="MQTT Broker">MQTT Broker</option>
                    <option value="BACnet/IP">BACnet/IP</option>
                    <option value="REST Gateway">REST Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Endpoint Connection URL / IP</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., mqtt://grid.psu.edu:1883"
                    value={meterUrl}
                    onChange={(e) => setMeterUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddMeterModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm">
                  Connect Hardware Gateway
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
