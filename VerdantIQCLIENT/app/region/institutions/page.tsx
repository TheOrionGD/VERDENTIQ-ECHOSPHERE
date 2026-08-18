// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { InstitutionRecord } from '@/lib/services/regionService';
import { regionApi } from '@/lib/api/endpoints';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InstitutionOnboardingModal } from '@/components/region/InstitutionOnboardingModal';
import { InstitutionOffboardingModal } from '@/components/region/InstitutionOffboardingModal';
import { InstitutionComparison } from '@/components/region/InstitutionComparison';
import { Building, Plus, Search, Filter, AlertTriangle, Trash2, CheckCircle2, ShieldCheck, Flag, GitCompare } from 'lucide-react';

export default function RegionalInstitutionsPage() {
  const [institutions, setInstitutions] = useState<InstitutionRecord[]>(() => []);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [offboardInst, setOffboardInst] = useState<InstitutionRecord | null>(null);
  const [supportModalInst, setSupportModalInst] = useState<InstitutionRecord | null>(null);
  const [recommendationText, setRecommendationText] = useState('');

  const refreshList = () => {
    setInstitutions([]);
  };

  const handleToggleSupportFlag = (inst: InstitutionRecord) => {
    if (inst.supportFlagged) {
      ([] as any);
      refreshList();
    } else {
      setSupportModalInst(inst);
      setRecommendationText(inst.supportRecommendation || 'Recommend technical HVAC audit and solar inverter sync.');
    }
  };

  const handleConfirmSupportFlag = () => {
    if (supportModalInst) {
      ([] as any);
      setSupportModalInst(null);
      refreshList();
    }
  };

  const filtered = institutions.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = districtFilter === 'All' || inst.regionDistrict.includes(districtFilter);
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'active' && inst.status === 'active') ||
      (statusFilter === 'needs_support' && (inst.status === 'needs_support' || inst.supportFlagged)) ||
      (statusFilter === 'deactivated' && inst.status === 'deactivated');
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Regional Directory</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Institution Management & Offboarding Control
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage member academic campuses, trigger Spring Boot onboarding, send support recommendations, or execute offboarding flows.
            </p>
          </div>

          <Button
            onClick={() => setIsOnboardingOpen(true)}
            className="bg-[#064E3B] hover:bg-emerald-800 text-white text-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Onboard New Institution
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campus name, code, domain..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-300 bg-white"
            >
              <option value="All">All Districts</option>
              <option value="District 1">District 1 (Bay Area)</option>
              <option value="District 2">District 2 (Silicon)</option>
              <option value="District 3">District 3 (Northwest)</option>
              <option value="District 4">District 4 (Sierra)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-300 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="needs_support">Needs Support</option>
              <option value="deactivated">Deactivated / Offboarded</option>
            </select>
          </div>
        </div>

        {/* Directory Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 p-10 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-stone-900">No Registered Institutions</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                No academic institutions match your current search and filter criteria, or no institutions have registered for this region.
              </p>
              <Button onClick={() => setIsOnboardingOpen(true)} className="bg-[#064E3B] hover:bg-emerald-800 text-white text-xs">
                <Plus className="h-4 w-4 mr-1.5" />
                Onboard New Institution
              </Button>
            </div>
          ) : (
            filtered.map((inst) => (
            <div
              key={inst.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                inst.status === 'deactivated'
                  ? 'bg-stone-100/80 border-stone-300 opacity-75'
                  : inst.status === 'needs_support' || inst.supportFlagged
                  ? 'bg-amber-50/60 border-amber-300/80'
                  : 'bg-white/90 border-stone-200/90 shadow-xs hover:border-emerald-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-editorial text-base font-bold text-stone-900">{inst.name}</h3>
                    <p className="text-xs font-mono text-stone-500">{inst.domain} ({inst.code})</p>
                  </div>
                  <Badge
                    variant={
                      inst.status === 'deactivated'
                        ? 'stone'
                        : inst.status === 'needs_support' || inst.supportFlagged
                        ? 'amber'
                        : 'emerald'
                    }
                  >
                    {inst.status === 'deactivated'
                      ? 'Deactivated'
                      : inst.status === 'needs_support' || inst.supportFlagged
                      ? 'Needs Support'
                      : 'Active'}
                  </Badge>
                </div>

                <div className="text-xs text-stone-600 space-y-1 pt-1">
                  <div>District: <strong className="text-stone-800">{inst.regionDistrict}</strong></div>
                  <div>Student Population: <strong className="text-stone-800">{inst.studentCount.toLocaleString()}</strong></div>
                  <div>Provisioning: <span className="font-mono text-emerald-800 font-semibold">{inst.provisioningStatus}</span></div>
                </div>

                {inst.supportRecommendation && inst.status !== 'deactivated' && (
                  <div className="p-2.5 bg-amber-100/80 border border-amber-300 rounded-xl text-[11px] text-amber-950 space-y-0.5">
                    <span className="font-bold flex items-center gap-1">
                      <Flag className="h-3 w-3 text-amber-700" /> Regional Advisory Note:
                    </span>
                    <p>{inst.supportRecommendation}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs">
                {inst.status !== 'deactivated' ? (
                  <>
                    <button
                      onClick={() => handleToggleSupportFlag(inst)}
                      className={`px-2.5 py-1.5 rounded-xl font-medium border flex items-center gap-1 transition-all ${
                        inst.supportFlagged
                          ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <Flag className="h-3.5 w-3.5" />
                      {inst.supportFlagged ? 'Clear Support Flag' : 'Recommend Support'}
                    </button>

                    <button
                      onClick={() => setOffboardInst(inst)}
                      className="px-2.5 py-1.5 rounded-xl font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Offboard
                    </button>
                  </>
                ) : (
                  <span className="text-stone-400 italic text-[11px]">
                    Deactivated on {inst.deactivatedAt || 'Record'}
                  </span>
                )}
              </div>
            </div>
            ))
          )}
        </div>

        {/* Comparison Table Section */}
        <InstitutionComparison institutions={institutions} />

        {/* Flag Modal */}
        {supportModalInst && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-5 space-y-4">
              <h3 className="font-editorial text-lg font-bold text-stone-900">
                Flag &quot;Needs Support&quot; &amp; Send Advisory Recommendation
              </h3>
              <p className="text-xs text-stone-600">
                Flagging <strong>{supportModalInst.name}</strong> highlights performance variance on regional maps. Regional recommendations never override local institution settings.
              </p>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Regional Support Recommendation *</label>
                <textarea
                  rows={3}
                  value={recommendationText}
                  onChange={(e) => setRecommendationText(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setSupportModalInst(null)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmSupportFlag} className="bg-amber-600 hover:bg-amber-700 text-white">
                  Confirm Advisory Flag
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <InstitutionOnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onSuccess={refreshList}
        />

        <InstitutionOffboardingModal
          institution={offboardInst}
          isOpen={!!offboardInst}
          onClose={() => setOffboardInst(null)}
          onSuccess={refreshList}
        />
      </div>
    </AppShell>
  );
}
