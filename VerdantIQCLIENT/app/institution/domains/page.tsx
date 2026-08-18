// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Search,
  Building,
  Users,
} from 'lucide-react';
import { AcceptedDomainItem } from '@/lib/services/institutionService';

export default function DomainRegistryPage() {
  const [domains, setDomains] = useState<AcceptedDomainItem[]>(() => ([] as any));
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newDomainName, setNewDomainName] = useState('');
  const [newInstName, setNewInstName] = useState('');
  const [autoVerify, setAutoVerify] = useState(true);

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainName || !newInstName) return;

    const added = null as any;

    setDomains(([] as any));
    setShowAddModal(false);
    setNewDomainName('');
    setNewInstName('');
  };

  const handleToggleAutoVerify = (id: string) => {
    ([] as any);
    setDomains(([] as any));
  };

  const handleDeleteDomain = (id: string) => {
    if (confirm('Are you sure you want to remove this domain from the accepted registry?')) {
      ([] as any);
      setDomains(([] as any));
    }
  };

  const filtered = domains.filter(
    (d) =>
      d.domainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.institutionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-5 w-5 text-indigo-700" />
              <Badge variant="emerald">Domain Registry Policy</Badge>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-mono">Accepted Email Suffixes</span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Accepted Email-Domain Registry Management
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Control academic and partner email domains (@psu.edu, @bioeng.edu) allowed for instant student onboarding verification.
            </p>
          </div>

          <Button
            variant="emerald"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gap-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Accepted Domain</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search domains or institution names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div className="text-xs text-stone-500">
            <strong>{domains.length}</strong> Registered Email Domains
          </div>
        </div>

        {/* Domain List Table */}
        <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50/80 border-b border-stone-200 font-semibold text-stone-800">
                <tr>
                  <th className="p-3.5">Domain Suffix</th>
                  <th className="p-3.5">Institution / Faculty</th>
                  <th className="p-3.5">Auto-Verify Status</th>
                  <th className="p-3.5">Verified Students</th>
                  <th className="p-3.5">Contact Registrar</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-stone-900">
                      @{item.domainName}
                    </td>
                    <td className="p-3.5 font-medium text-stone-800">{item.institutionName}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleAutoVerify(item.id)}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <Badge variant={item.autoVerify ? 'emerald' : 'amber'}>
                          {item.autoVerify ? 'Auto-Verify Active' : 'Manual Review'}
                        </Badge>
                      </button>
                    </td>
                    <td className="p-3.5 font-mono font-semibold text-stone-800">
                      {item.studentCount} Students
                    </td>
                    <td className="p-3.5 font-mono text-stone-500">{item.contactEmail}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteDomain(item.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add Domain */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleAddDomain}
              className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-emerald-800" />
                  <span>Register Accepted Email Domain</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Domain Suffix</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., bioeng.edu"
                    value={newDomainName}
                    onChange={(e) => setNewDomainName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Associated Institution / Faculty</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Department of Bioengineering"
                    value={newInstName}
                    onChange={(e) => setNewInstName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                  <span>Enable Auto-Verification for domain</span>
                  <input
                    type="checkbox"
                    checked={autoVerify}
                    onChange={(e) => setAutoVerify(e.target.checked)}
                    className="accent-emerald-800"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)} type="button">
                  Cancel
                </Button>
                <Button variant="emerald" size="sm" type="submit">
                  Register Domain
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
