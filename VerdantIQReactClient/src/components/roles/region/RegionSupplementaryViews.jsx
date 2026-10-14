import React, { useState } from 'react';
import { Building2, LifeBuoy, Users } from 'lucide-react';

export function RegionInstitutionsStreamView() {
  const [institutions] = useState([
    { id: 'inst-verdia', name: 'Verdia Central University', region: 'Pacific Northwest', type: 'Higher Education', status: 'Active Telemetry', students: 18500, kwhMo: '164,000' },
    { id: 'inst-cascadia', name: 'Cascadia Polytechnic College', region: 'Pacific Northwest', type: 'Vocational Technical', status: 'Active Telemetry', students: 8200, kwhMo: '92,000' },
    { id: 'inst-olympic', name: 'Olympic Coastal Institute', region: 'Pacific Northwest', type: 'Marine Research', status: 'Pending Verification', students: 3400, kwhMo: '41,500' },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>District Institutions Stream & Live Telemetry Gate</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Real-time multi-campus reporting status across participating district colleges and academies.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {institutions.map(inst => (
          <div key={inst.id} className="p-3.5 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white">{inst.name}</div>
              <div className="text-[11px] text-neutral-400">{inst.type} · {inst.students.toLocaleString()} Students · Monthly Load: {inst.kwhMo} kWh</div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
              inst.status === 'Active Telemetry' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {inst.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegionSupportTicketsView() {
  const [tickets, setTickets] = useState([
    { id: 'TICK-901', campus: 'Cascadia Polytechnic', subject: 'Sensor Gateway Subnet Desync', priority: 'High', status: 'In Review', date: '2026-08-01' },
    { id: 'TICK-902', campus: 'Verdia Central University', subject: 'Scope 2 Regional Grid Factor Annual Recalibration', priority: 'Normal', status: 'Resolved', date: '2026-07-29' },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <LifeBuoy className="w-4 h-4 text-emerald-400" />
            <span>Regional Administrative Support & Technical Escalations</span>
          </h2>
          <p className="text-[11px] text-neutral-400">District incident triage for campus utility managers.</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {tickets.map(t => (
          <div key={t.id} className="p-3.5 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white">{t.subject}</div>
              <div className="text-[11px] text-neutral-400">{t.campus} · Logged: {t.date}</div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">{t.priority}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
              }`}>{t.status}</span>
              {t.status !== 'Resolved' && (
                <button
                  onClick={() => setTickets(prev => prev.map(item => item.id === t.id ? { ...item, status: 'Resolved' } : item))}
                  className="px-2 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[10px] transition font-medium"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegionStudentsDemographicsView() {
  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <Users className="w-4 h-4 text-emerald-400" />
        <span>District Student Body Demographics & EcoPoint Participation</span>
      </h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5">
          <div className="text-neutral-400">Total Enrolled District Students</div>
          <div className="text-xl font-bold text-white mt-1">30,100</div>
        </div>
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5">
          <div className="text-neutral-400">Active Challenge Participants</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">11,480 (38.1%)</div>
        </div>
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5">
          <div className="text-neutral-400">Total Verified EcoPoints Awarded</div>
          <div className="text-xl font-bold text-teal-400 mt-1">294,200</div>
        </div>
      </div>
    </div>
  );
}
