// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatGauge } from '@/components/ui/StatGauge';
import {
  Building,
  Plus,
  UserCheck,
  DollarSign,
  Zap,
  CheckCircle2,
  Users,
  Search,
  Edit2,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';
import { DepartmentItem } from '@/lib/services/institutionService';

export default function DepartmentsManagementPage() {
  const [departments, setDepartments] = useState<DepartmentItem[]>(() => ([] as any));
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);

  // New Department Form State
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newModName, setNewModName] = useState('');
  const [newModEmail, setNewModEmail] = useState('');
  const [newBudget, setNewBudget] = useState('120000');
  const [newCarbonTarget, setNewCarbonTarget] = useState('25000');
  const [newBuilding, setNewBuilding] = useState('Science Building C');
  const [newHeadCount, setNewHeadCount] = useState('200');

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode || !newModName || !newModEmail) return;

    const created = null as any;

    setDepartments([...departments, created]);
    setShowCreateModal(false);
    // Reset form
    setNewName('');
    setNewCode('');
    setNewModName('');
    setNewModEmail('');
  };

  const handleUpdateModerator = (deptId: string, modName: string, modEmail: string) => {
    ([] as any);
    setDepartments(([] as any));
    setEditingDept(null);
  };

  const filteredDepts = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.moderatorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBudget = departments.reduce((acc, d) => acc + d.budgetAnnualUsd, 0);
  const totalSpent = departments.reduce((acc, d) => acc + d.budgetSpentUsd, 0);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Department Management</Badge>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-mono">5 Active Faculties</span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Department Creation & Moderator Assignment
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Establish departmental governance units, assign faculty moderators, set annual budget and carbon reduction targets.
            </p>
          </div>

          <Button
            variant="emerald"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="gap-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Department</span>
          </Button>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatGauge
            title="Total Departmental Budget"
            value={totalBudget / 1000}
            target={800}
            unit="k USD ($)"
            trend="neutral"
            status="optimal"
            subtitle={`YTD Spent: $${(totalSpent / 1000).toFixed(1)}k`}
          />
          <StatGauge
            title="Assigned Department Moderators"
            value={departments.length}
            target={5}
            unit="Moderators Active"
            trend="up"
            status="optimal"
            subtitle="100% faculty coverage"
          />
          <StatGauge
            title="Average Department EcoScore"
            value={Number(
              (
                departments.reduce((acc, d) => acc + d.ecoScore, 0) /
                (departments.length || 1)
              ).toFixed(1)
            )}
            target={90.0}
            unit="/ 100 Index"
            trend="up"
            changePercentage={3.5}
            status="optimal"
            subtitle="Cross-faculty sustainability average"
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search departments, codes, or moderators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div className="text-xs text-stone-500">
            Showing <strong>{filteredDepts.length}</strong> of <strong>{departments.length}</strong> Departments
          </div>
        </div>

        {/* Departments Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepts.map((dept) => {
            const budgetPercent = Math.min(100, (dept.budgetSpentUsd / dept.budgetAnnualUsd) * 100);
            const carbonPercent = Math.min(100, (dept.carbonActualKg / dept.carbonTargetKg) * 100);

            return (
              <div
                key={dept.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {dept.code}
                      </span>
                      <h3 className="text-sm font-bold text-stone-900 mt-1">{dept.name}</h3>
                      <p className="text-[11px] text-stone-500">{dept.locationBuilding}</p>
                    </div>
                    <Badge variant={dept.status === 'Active' ? 'emerald' : 'amber'}>
                      {dept.status}
                    </Badge>
                  </div>

                  {/* Moderator Info */}
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 my-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 text-[11px]">Assigned Moderator:</span>
                      <button
                        onClick={() => setEditingDept(dept)}
                        className="text-[10px] text-emerald-800 font-medium hover:underline flex items-center gap-0.5"
                      >
                        <Edit2 className="h-2.5 w-2.5" /> Reassign
                      </button>
                    </div>
                    <p className="font-semibold text-stone-900">{dept.moderatorName}</p>
                    <p className="text-[11px] text-stone-500 font-mono">{dept.moderatorEmail}</p>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] text-stone-600 mb-0.5">
                        <span>Annual Budget (${dept.budgetAnnualUsd.toLocaleString()})</span>
                        <span className="font-mono font-semibold">${dept.budgetSpentUsd.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-700 rounded-full"
                          style={{ width: `${budgetPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-stone-600 mb-0.5">
                        <span>Carbon Target ({dept.carbonTargetKg.toLocaleString()} kg)</span>
                        <span className="font-mono font-semibold">{dept.carbonActualKg.toLocaleString()} kg</span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded-full"
                          style={{ width: `${carbonPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-stone-400" />
                    {dept.memberCount} / {dept.headCount} Members
                  </span>
                  <span className="font-mono font-bold text-emerald-900">
                    EcoScore {dept.ecoScore}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Create Department */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleCreateDepartment}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Building className="h-4 w-4 text-emerald-800" />
                  <span>Create New Institution Department</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="col-span-2">
                  <label className="font-medium text-stone-700 block mb-1">Department Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Department of Materials Science"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Code Suffix</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., MATSCI"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Building Location</label>
                  <input
                    type="text"
                    required
                    value={newBuilding}
                    onChange={(e) => setNewBuilding(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="col-span-2 border-t pt-3">
                  <label className="font-bold text-stone-900 block mb-1">Assigned Moderator</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Moderator Full Name"
                      value={newModName}
                      onChange={(e) => setNewModName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                    <input
                      type="email"
                      required
                      placeholder="moderator@domain.edu"
                      value={newModEmail}
                      onChange={(e) => setNewModEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Annual Budget ($)</label>
                  <input
                    type="number"
                    required
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Carbon Target (kg)</label>
                  <input
                    type="number"
                    required
                    value={newCarbonTarget}
                    onChange={(e) => setNewCarbonTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowCreateModal(false)} type="button">
                  Cancel
                </Button>
                <Button variant="emerald" size="sm" type="submit">
                  Establish Department
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Modal: Edit Moderator */}
        {editingDept && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-bold text-stone-900">
                  Reassign Moderator for {editingDept.name}
                </h3>
                <button onClick={() => setEditingDept(null)} className="text-stone-400 text-xs">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Moderator Name</label>
                  <input
                    type="text"
                    defaultValue={editingDept.moderatorName}
                    id="editModName"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Moderator Email</label>
                  <input
                    type="email"
                    defaultValue={editingDept.moderatorEmail}
                    id="editModEmail"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setEditingDept(null)}>
                  Cancel
                </Button>
                <Button
                  variant="emerald"
                  size="sm"
                  onClick={() => {
                    const name = (document.getElementById('editModName') as HTMLInputElement).value;
                    const email = (document.getElementById('editModEmail') as HTMLInputElement).value;
                    handleUpdateModerator(editingDept.id, name, email);
                  }}
                >
                  Save Reassignment
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
