import React, { useState } from 'react';
import { AlertTriangle, Users, GraduationCap, Trophy } from 'lucide-react';

export function DeptEscalationsView() {
  const [escalations] = useState([
    { id: 'ESC-401', equipment: 'HVAC Chiller #2 Air Handler', location: 'Science Complex B', issue: 'Compressor bypass continuous draw during non-occupancy hours', priority: 'High', status: 'Pending Facilities Dispatch' },
    { id: 'ESC-402', equipment: 'Sub-meter Pulse Counter', location: 'Robotics Lab 104', issue: 'Sensor heartbeat timeout > 120 minutes', priority: 'Normal', status: 'Dispatched' },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        <span>Equipment Waste & Facility Energy Escalations</span>
      </h2>
      <div className="space-y-2.5">
        {escalations.map(e => (
          <div key={e.id} className="p-3.5 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white">{e.equipment} ({e.location})</div>
              <div className="text-[11px] text-neutral-400">{e.issue}</div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">{e.priority}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">{e.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeptMembersView() {
  const [members] = useState([
    { name: 'Dr. Alan Vance', role: 'Department Moderator Lead', email: 'a.vance@verdia.edu', status: 'Active' },
    { name: 'Prof. Clara Higgins', role: 'Lab Energy Steward', email: 'c.higgins@verdia.edu', status: 'Active' },
    { name: 'Marcus Brody', role: 'Graduate Research Facility Officer', email: 'm.brody@verdia.edu', status: 'Active' },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <Users className="w-4 h-4 text-emerald-400" />
        <span>Department Moderator Roster & Facility Stewards</span>
      </h2>
      <div className="space-y-2">
        {members.map((m, i) => (
          <div key={i} className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white">{m.name}</div>
              <div className="text-[11px] text-neutral-400">{m.role} · {m.email}</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-semibold">{m.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeptStudentsView() {
  const [students] = useState([
    { id: 'STD-2041', name: 'Alex Mercer', major: 'Computer Science', ecoPoints: 260, verifiedChallenges: 6 },
    { id: 'STD-1988', name: 'Liam Chen', major: 'Software Engineering', ecoPoints: 290, verifiedChallenges: 8 },
    { id: 'STD-2104', name: 'Zoe Thorne', major: 'Data Science', ecoPoints: 175, verifiedChallenges: 4 },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <GraduationCap className="w-4 h-4 text-emerald-400" />
        <span>Department Enrolled Student Sustainability Directory</span>
      </h2>
      <div className="space-y-2">
        {students.map(s => (
          <div key={s.id} className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white">{s.name} ({s.id})</div>
              <div className="text-[11px] text-neutral-400">{s.major} · {s.verifiedChallenges} Verified EcoActions</div>
            </div>
            <span className="font-mono text-emerald-400 font-bold">{s.ecoPoints} EcoPoints</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeptChallengeTemplatesView() {
  const [templates] = useState([
    { title: 'Computer Lab Twilight Shutdown', target: 'Lab monitors & workstations', defaultPoints: 30, category: 'Energy Conservation' },
    { title: 'Server Rack Ambient Temperature Audit', target: 'Server rooms', defaultPoints: 50, category: 'HVAC Efficiency' },
    { title: 'E-Waste Sorting & Cable Reuse Drive', target: 'Department storage', defaultPoints: 40, category: 'Circular Economy' },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <Trophy className="w-4 h-4 text-emerald-400" />
        <span>Sustainability Challenge Design Templates</span>
      </h2>
      <div className="space-y-2.5">
        {templates.map((tpl, i) => (
          <div key={i} className="p-3.5 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white">{tpl.title}</div>
              <div className="text-[11px] text-neutral-400">{tpl.category} · Target: {tpl.target}</div>
            </div>
            <span className="font-mono text-emerald-400 font-bold">+{tpl.defaultPoints} Points</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeptLeaderboardView() {
  const [leaders] = useState([
    { rank: 1, name: 'Alex Mercer', points: 340, tier: 'Diamond Green', actions: 12 },
    { rank: 2, name: 'Zoe Thorne', points: 285, tier: 'Emerald', actions: 9 },
    { rank: 3, name: 'Liam Chen', points: 250, tier: 'Gold', actions: 8 },
    { rank: 4, name: 'Maya Patel', points: 215, tier: 'Silver', actions: 7 },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <Trophy className="w-4 h-4 text-emerald-400" />
        <span>Department Student Sustainability Leaderboard</span>
      </h2>
      <div className="space-y-2">
        {leaders.map((l) => (
          <div key={l.rank} className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="font-bold font-mono text-emerald-400">#{l.rank}</span>
              <div>
                <div className="font-semibold text-white">{l.name}</div>
                <div className="text-[11px] text-neutral-400">{l.tier} · {l.actions} Verified Actions</div>
              </div>
            </div>
            <span className="font-mono text-emerald-400 font-bold text-sm">{l.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeptHistoryView() {
  const [history] = useState([
    { id: 'ACT-901', action: 'Approved Lab Shutdown Proof', actor: 'Dr. Alan Vance', target: 'Alex Mercer (STD-2041)', points: '+30 pts', time: '2026-05-12 19:40' },
    { id: 'ACT-902', action: 'Facility Setpoint Modified', actor: 'Prof. Clara Higgins', target: 'Lab 102 Thermostat (23.5°C)', points: 'ESG Logged', time: '2026-05-11 14:15' },
    { id: 'ACT-903', action: 'Rejected Incomplete Proof', actor: 'Dr. Alan Vance', target: 'Evidence photo corrupted', points: '0 pts', time: '2026-05-10 11:00' },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <Trophy className="w-4 h-4 text-emerald-400" />
        <span>Department Moderation & Verification Audit History</span>
      </h2>
      <div className="space-y-2">
        {history.map((h) => (
          <div key={h.id} className="p-3 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white">{h.action}</div>
              <div className="text-[11px] text-neutral-400">{h.target} · By: {h.actor}</div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-mono font-bold">{h.points}</div>
              <div className="text-[10px] text-neutral-500 font-mono">{h.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
