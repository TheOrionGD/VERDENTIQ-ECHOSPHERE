// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { DeptMember } from '@/lib/services/deptService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Users, UserPlus, CheckCircle, ShieldAlert, Mail, Building, Plus } from 'lucide-react';

export default function DeptMembersPage() {
  const [members, setMembers] = useState<DeptMember[]>(() => ([] as any));
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Moderator' | 'Senior Staff' | 'Lab Lead' | 'Faculty Rep'>('Lab Lead');
  const [newCohort, setNewCohort] = useState('Undergrad Bio Lab A');

  const handleToggleStatus = (id: string, currentStatus: 'Active' | 'Suspended') => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    ([] as any);
    setMembers(([] as any));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    ([] as any);
    setMembers(([] as any));
    setNewName('');
    setNewEmail('');
    setAddModalOpen(false);
  };

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        <RoleSubNav />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Department Roster</Badge>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 font-editorial">
              Department Member Roster & Moderation Roles
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage department moderators, lab leads, faculty reps, and domain verification status.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="bg-[#064E3B] text-white hover:bg-emerald-900 text-xs font-semibold gap-1.5"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Department Member</span>
          </Button>
        </div>

        {/* Member Table */}
        <Card className="p-0 bg-white border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 font-mono text-[11px] text-stone-500 uppercase">
                <tr>
                  <th className="p-3.5">Member Name</th>
                  <th className="p-3.5">Email / Domain</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Sub-Cohort</th>
                  <th className="p-3.5">Verifications</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-stone-900">
                      <div>{m.name}</div>
                      <div className="text-[10px] font-mono text-stone-400 font-normal">{m.id} • Joined {m.joinedDate}</div>
                    </td>
                    <td className="p-3.5 font-mono text-stone-700">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-stone-400" />
                        <span>{m.email}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant={m.role === 'Moderator' ? 'emerald' : 'stone'}>
                        {m.role}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-stone-600 font-medium">
                      {m.subCohort}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-800">
                      {m.verificationsCompleted} items
                    </td>
                    <td className="p-3.5">
                      <Badge variant={m.status === 'Active' ? 'emerald' : 'coral'}>
                        {m.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(m.id, m.status as any)}
                        className="text-[11px] py-1 h-auto"
                      >
                        {m.status === 'Active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Modal */}
        {addModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <form onSubmit={handleAddMember} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="text-base font-bold text-stone-900 font-editorial">Add Department Member</h3>
                <button type="button" onClick={() => setAddModalOpen(false)} className="text-stone-400">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Dr. Jane Doe"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Department Email</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="jdoe@bioeng.edu"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                    >
                      <option value="Moderator">Moderator</option>
                      <option value="Senior Staff">Senior Staff</option>
                      <option value="Lab Lead">Lab Lead</option>
                      <option value="Faculty Rep">Faculty Rep</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Sub-Cohort</label>
                    <select
                      value={newCohort}
                      onChange={(e) => setNewCohort(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800"
                    >
                      <option value="Undergrad Bio Lab A">Undergrad Bio Lab A</option>
                      <option value="Grad AI & Synthetic Bio Lab">Grad AI & Synthetic Bio Lab</option>
                      <option value="Faculty Research Labs">Faculty Research Labs</option>
                      <option value="Admin Staff & Facilities">Admin Staff & Facilities</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <Button variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>Cancel</Button>
                <Button variant="primary" size="sm" type="submit" className="bg-[#064E3B] text-white">Save Member</Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
