'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatGauge } from '@/components/ui/StatGauge';
import { InstitutionRecord } from '@/lib/services/regionService';
import { regionApi } from '@/lib/api/endpoints';
import { RegionalChoroplethMap } from '@/components/region/RegionalChoroplethMap';
import { RegionalSSEFeed } from '@/components/region/RegionalSSEFeed';
import { InstitutionOnboardingModal } from '@/components/region/InstitutionOnboardingModal';
import { RegionalPDFReportModal } from '@/components/region/RegionalPDFReportModal';
import {
  getRegionalDistricts,
  addRegionalDistrict,
  SYSTEM_ROLE_HIERARCHY_EXPLANATION,
  RegionalDistrict,
} from '@/lib/data/regionalDistricts';
import {
  Globe,
  Plus,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Building,
  Scale,
  Users,
  ShieldCheck,
  Home,
  GraduationCap,
  Layers,
  MapPin,
  ChevronRight,
  Sparkles,
  Award,
  X,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function RegionDashboardPage() {
  const { user, roleConfig } = useAuth();
  const [institutions, setInstitutions] = useState<InstitutionRecord[]>(() => []);
  const [districts, setDistricts] = useState<RegionalDistrict[]>(() => getRegionalDistricts());
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(() => {
    const list = getRegionalDistricts();
    return list[0]?.id || '';
  });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isCreateDistrictOpen, setIsCreateDistrictOpen] = useState(false);

  // New District Form State
  const [newDistrictName, setNewDistrictName] = useState('');
  const [newDistrictHq, setNewDistrictHq] = useState('');
  const [newDistrictZone, setNewDistrictZone] = useState<'North' | 'South' | 'West' | 'East' | 'Central'>('North');
  const [newGridCarbon, setNewGridCarbon] = useState('140');
  const [newRenewableShare, setNewRenewableShare] = useState('60');
  const [newHouseholdsCount, setNewHouseholdsCount] = useState('50000');

  const benchmarks = { institutionCount: 0, totalStudents: 0, avgEUI: 0, avgTargetEUI: 0, avgCarbon: 0, avgTargetCarbon: 0, avgAccuracy: 0, privacyPolicyNotice: "" };

  const selectedDistrict =
    districts.find((d) => d.id === selectedDistrictId) || districts[0] || {
      id: 'default',
      name: 'Central District',
      hq: 'Regional HQ',
      zone: 'North' as const,
      institutionsCount: 0,
      departmentsCount: 0,
      studentsCount: 0,
      standardHouseholdsCount: 0,
      avgGridCarbon: 140,
      renewableSharePct: 60,
      complianceRatePct: 95,
      governanceStatus: 'Optimal Governance' as const,
    };

  const handleOnboardingSuccess = (newInst: InstitutionRecord) => {
    setInstitutions([]);
  };

  const handleCreateDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrictName.trim() || !newDistrictHq.trim()) return;

    const created = addRegionalDistrict({
      name: newDistrictName.trim(),
      hq: newDistrictHq.trim(),
      zone: newDistrictZone,
      institutionsCount: 0,
      departmentsCount: 0,
      studentsCount: 0,
      standardHouseholdsCount: parseInt(newHouseholdsCount) || 10000,
      avgGridCarbon: parseFloat(newGridCarbon) || 140,
      renewableSharePct: parseFloat(newRenewableShare) || 50,
      complianceRatePct: 95,
      governanceStatus: 'Optimal Governance',
    });

    const updatedDistricts = getRegionalDistricts();
    setDistricts(updatedDistricts);
    setSelectedDistrictId(created.id);
    setIsCreateDistrictOpen(false);

    // Reset form
    setNewDistrictName('');
    setNewDistrictHq('');
    setNewDistrictZone('North');
    setNewGridCarbon('140');
    setNewRenewableShare('60');
    setNewHouseholdsCount('50000');
  };

  const totalRegionalStudents = districts.reduce((acc, d) => acc + d.studentsCount, 0);
  const totalRegionalHouseholds = districts.reduce((acc, d) => acc + d.standardHouseholdsCount, 0);
  const totalRegionalInstitutions = districts.reduce((acc, d) => acc + d.institutionsCount, 0);

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Page Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Globe className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Tier 4: Regional Admin</Badge>
              <span className="text-xs text-stone-500 font-mono flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-700" /> Regional Districts ({districts.length} Configured)
              </span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Regional District Governance & Multi-Branch Oversight Hub
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Dynamically governing regional districts created by Regional Admin, with dual oversight streams: Educational Institutions and Standard Household Citizens.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setIsCreateDistrictOpen(true)}
              variant="outline"
              className="border-emerald-700/40 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold"
            >
              <PlusCircle className="h-4 w-4 mr-1.5 text-emerald-700" />
              Create District
            </Button>

            <Button
              onClick={() => setIsReportOpen(true)}
              variant="outline"
              className="border-stone-300 text-stone-700 hover:bg-stone-100 text-xs"
            >
              <FileText className="h-4 w-4 mr-1.5 text-emerald-700" />
              Rolled-Up PDF Report
            </Button>

            <Button
              onClick={() => setIsOnboardingOpen(true)}
              className="bg-[#064E3B] hover:bg-emerald-800 text-white text-xs"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Onboard Institution
            </Button>
          </div>
        </div>

        {/* District Switcher & Regional Governance Overview Bar */}
        <div className="p-4 bg-gradient-to-r from-[#064E3B] via-emerald-900 to-stone-900 text-white rounded-2xl shadow-lg border border-emerald-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-300 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider block">
                  Regional District Governance Authority
                </span>
                <span className="text-sm font-bold text-white">
                  Active District: {selectedDistrict.name} (HQ: {selectedDistrict.hq})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-emerald-200 font-medium">Select District:</label>
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="bg-white text-stone-900 text-xs px-3 py-1.5 rounded-xl border border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold cursor-pointer max-w-xs shadow-xs"
              >
                {districts.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.name} ({dist.zone} Zone)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dual Governance Streams Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Stream A: Educational Institutions */}
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-start gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-200">Governance Branch 1: Educational Stream</span>
                  <Badge variant="emerald" className="text-[10px]">Active</Badge>
                </div>
                <p className="text-[11px] text-stone-300 mt-1">
                  Governs <strong>{selectedDistrict.institutionsCount} Institutions</strong> & <strong>{selectedDistrict.departmentsCount} Departments</strong> serving <strong>{selectedDistrict.studentsCount.toLocaleString()} Students</strong>.
                </p>
                <div className="mt-2 text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                  Hierarchy: Region → Institution → Department → Student
                </div>
              </div>
            </div>

            {/* Stream B: Standard Households */}
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-start gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg shrink-0">
                <Home className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-200">Governance Branch 2: Household Stream</span>
                  <Badge variant="stone" className="text-[10px]">District Governed</Badge>
                </div>
                <p className="text-[11px] text-stone-300 mt-1">
                  Governs <strong>{selectedDistrict.standardHouseholdsCount.toLocaleString()} Standard Citizen Households</strong> directly for residential smart-grid & carbon monitoring.
                </p>
                <div className="mt-2 text-[10px] font-mono text-amber-300 flex items-center gap-1">
                  Hierarchy: Region → Standard User (Household)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate KPI Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatGauge
            title={`${selectedDistrict.name} Grid Carbon`}
            value={selectedDistrict.avgGridCarbon}
            target={180.0}
            unit="gCO2e / kWh"
            trend="down"
            changePercentage={-5.2}
            status={selectedDistrict.avgGridCarbon <= 180 ? 'optimal' : 'warning'}
            subtitle={`Regional ${selectedDistrict.zone} Grid`}
          />
          <StatGauge
            title="Renewable Power Share"
            value={selectedDistrict.renewableSharePct}
            target={50.0}
            unit="% solar / wind"
            trend="up"
            changePercentage={4.2}
            status={selectedDistrict.renewableSharePct >= 50 ? 'optimal' : 'warning'}
            subtitle="District Solar & Wind Microgrids"
          />
          <StatGauge
            title="Standard Household Count"
            value={selectedDistrict.standardHouseholdsCount}
            target={1000000}
            unit="governed homes"
            trend="up"
            changePercentage={6.8}
            status="optimal"
            subtitle="Direct Residential Governance"
          />
          <StatGauge
            title="Total Student Headcount"
            value={selectedDistrict.studentsCount}
            target={100000}
            unit="enrolled students"
            trend="up"
            changePercentage={8.5}
            status="optimal"
            subtitle={`${selectedDistrict.institutionsCount} Institutions in ${selectedDistrict.name}`}
          />
        </div>

        {/* 8-Tier System Hierarchy Status Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-800" />
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900">
                  VerdantIQ 8-Tier System Role Hierarchy
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Top-down governance architecture & downstream routing boundaries.
                </p>
              </div>
            </div>
            <Badge variant="emerald">Tier 4 Active</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {SYSTEM_ROLE_HIERARCHY_EXPLANATION.levels.map((lvl) => (
              <div
                key={lvl.level}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  lvl.role === 'region'
                    ? 'bg-emerald-950 text-white border-emerald-600 ring-2 ring-emerald-500/50 shadow-md'
                    : 'bg-stone-50 text-stone-800 border-stone-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    lvl.role === 'region' ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-700'
                  }`}>
                    Tier {lvl.level}
                  </span>
                  <span className="text-[10px] font-semibold opacity-75">{lvl.role}</span>
                </div>
                <h4 className="font-bold text-xs truncate mb-1">{lvl.name}</h4>
                <p className={`text-[10px] line-clamp-2 leading-tight ${
                  lvl.role === 'region' ? 'text-emerald-200' : 'text-stone-500'
                }`}>
                  {lvl.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Choropleth Map */}
        <RegionalChoroplethMap institutions={institutions} />

        {/* Leaderboard + SSE Stream Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard Table */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900">
                  Regional Leaderboard & Institution Benchmark
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Academic institutions under Regional District oversight across governed zones.
                </p>
              </div>
              <Link href="/region/institutions" className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1">
                View All Directory <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-semibold bg-stone-50/50">
                    <th className="p-2.5 rounded-l-lg">Institution</th>
                    <th className="p-2.5">District</th>
                    <th className="p-2.5">Students</th>
                    <th className="p-2.5">Forecast Match</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {institutions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-stone-500">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Building className="h-8 w-8 text-stone-300" />
                          <p className="font-semibold text-stone-700 text-xs">No Institutions Registered for this Region</p>
                          <p className="text-xs text-stone-500 max-w-sm">
                            When institutions register under this regional governance portal, they will appear here.
                          </p>
                          <Button onClick={() => setIsOnboardingOpen(true)} className="mt-2 bg-[#064E3B] hover:bg-emerald-800 text-white text-xs">
                            <Plus className="h-3.5 w-3.5 mr-1" /> Onboard First Institution
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    institutions.slice(0, 6).map((inst) => (
                      <tr key={inst.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-2.5 font-semibold text-stone-900 flex items-center gap-2">
                          <Building className="h-4 w-4 text-emerald-700 shrink-0" />
                          <div>
                            <div>{inst.name}</div>
                            <span className="text-[10px] text-stone-400 font-mono font-normal">{inst.domain}</span>
                          </div>
                        </td>
                        <td className="p-2.5 text-stone-600 font-medium">
                          {inst.regionDistrict || 'District 1'}
                        </td>
                        <td className="p-2.5 text-stone-600 font-mono">
                          {inst.studentCount.toLocaleString()}
                        </td>
                        <td className="p-2.5 font-mono text-emerald-700 font-bold">
                          {inst.forecastAccuracyPct}%
                        </td>
                        <td className="p-2.5">
                          <Badge variant={inst.status === 'active' ? 'emerald' : 'amber'}>
                            {inst.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SSE Live Event Feed */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xs p-5 space-y-4">
            <RegionalSSEFeed />
          </div>
        </div>
      </div>

      {/* Create New District Modal */}
      {isCreateDistrictOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-5 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsCreateDistrictOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900">
                  Create Regional District
                </h3>
                <p className="text-xs text-stone-500">
                  Dynamically provision a new district governance authority
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateDistrict} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  District Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. District 5: Metro South"
                  value={newDistrictName}
                  onChange={(e) => setNewDistrictName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Headquarters *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oakland"
                    value={newDistrictHq}
                    onChange={(e) => setNewDistrictHq(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Zone *
                  </label>
                  <select
                    value={newDistrictZone}
                    onChange={(e) => setNewDistrictZone(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="West">West</option>
                    <option value="East">East</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Grid Carbon (gCO2e)
                  </label>
                  <input
                    type="number"
                    value={newGridCarbon}
                    onChange={(e) => setNewGridCarbon(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Renewable %
                  </label>
                  <input
                    type="number"
                    value={newRenewableShare}
                    onChange={(e) => setNewRenewableShare(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Households
                  </label>
                  <input
                    type="number"
                    value={newHouseholdsCount}
                    onChange={(e) => setNewHouseholdsCount(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDistrictOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#064E3B] hover:bg-emerald-800 text-white text-xs font-semibold"
                >
                  Create District
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <InstitutionOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSuccess={handleOnboardingSuccess}
      />
      <RegionalPDFReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </AppShell>
  );
}
