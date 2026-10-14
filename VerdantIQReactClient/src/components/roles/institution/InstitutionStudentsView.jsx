import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  UserCheck
} from 'lucide-react';

export function InstitutionStudentsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const [students, setStudents] = useState([
    { id: 'std-101', name: 'Alex Mercer', email: 'alex.mercer@verdia.edu', department: 'Computer Science', subCohort: '2026 Systems Lab', verifiedActions: 8, points: 310, offsetKg: 42.5, status: 'Active' },
    { id: 'std-102', name: 'Elena Rostova', email: 'e.rostova@verdia.edu', department: 'Environmental Science', subCohort: 'Arboretum Living Lab', verifiedActions: 12, points: 480, offsetKg: 68.0, status: 'Active' },
    { id: 'std-103', name: 'Marcus Brody', email: 'm.brody@verdia.edu', department: 'Bioengineering', subCohort: 'Bio-Reactor Group B', verifiedActions: 5, points: 190, offsetKg: 28.2, status: 'Active' },
    { id: 'std-104', name: 'Sophia Lin', email: 's.lin@verdia.edu', department: 'Architecture', subCohort: 'Passive Solar Design', verifiedActions: 9, points: 350, offsetKg: 51.4, status: 'Active' },
    { id: 'std-105', name: 'Jordan Hayes', email: 'j.hayes@verdia.edu', department: 'Computer Science', subCohort: 'Green Cloud Computing', verifiedActions: 3, points: 120, offsetKg: 18.0, status: 'Flagged' },
  ]);

  const funnel = [
    { step: 'Domain Verified (@verdia.edu)', userCount: 18500, conversionPercent: 100 },
    { step: 'Dorm Twin Configured', userCount: 14200, conversionPercent: 76.8 },
    { step: 'Sprint Challenge Enrolled', userCount: 9800, conversionPercent: 53.0 },
    { step: 'Verified Proof Submitted', userCount: 6400, conversionPercent: 34.6 },
  ];

  const toggleStudentStatus = (id) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'Active' ? 'Flagged' : 'Active' };
      }
      return s;
    }));
  };

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.subCohort.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Institution-Wide Student Body Roster & Engagement Funnel</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Track educational domain registrations, Dorm Digital Twin deployments, and verified EcoPoint actions.
          </p>
        </div>
      </div>

      {/* Onboarding Funnel */}
      <div className="fluent-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Campus Sustainability Engagement Funnel</span>
        </h3>

        <div className="grid grid-cols-4 gap-3">
          {funnel.map((step, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-neutral-900 border border-white/5 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-neutral-400 truncate">{step.step}</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{step.conversionPercent}%</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">{step.userCount.toLocaleString()}</div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${step.conversionPercent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search students, emails, sub-cohorts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded pl-9 pr-3 py-1.5 text-white"
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="bg-neutral-900 border border-white/10 rounded px-3 py-1.5 text-white"
        >
          <option value="ALL">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Environmental Science">Environmental Science</option>
          <option value="Bioengineering">Bioengineering</option>
          <option value="Architecture">Architecture</option>
        </select>
      </div>

      {/* Student Roster Table */}
      <div className="fluent-card p-5 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-white/10 text-neutral-400">
              <tr>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Department & Lab Cohort</th>
                <th className="py-2.5 px-3">Verified EcoActions</th>
                <th className="py-2.5 px-3">Total EcoPoints</th>
                <th className="py-2.5 px-3">Carbon Offset</th>
                <th className="py-2.5 px-3">Account State</th>
                <th className="py-2.5 px-3 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 font-sans">
                    <div className="font-semibold text-white">{s.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{s.email}</div>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <div className="text-white">{s.department}</div>
                    <div className="text-[10px] text-teal-400 font-mono">{s.subCohort}</div>
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400">{s.verifiedActions} actions</td>
                  <td className="py-2.5 px-3 font-bold text-white">{s.points} Pts</td>
                  <td className="py-2.5 px-3 text-teal-300">-{s.offsetKg} kg CO₂</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                      s.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans">
                    <button
                      onClick={() => toggleStudentStatus(s.id)}
                      className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] transition-colors cursor-pointer"
                    >
                      {s.status === 'Active' ? 'Flag Account' : 'Reactivate'}
                    </button>
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
