import React, { useState } from 'react';
import { Radio, Megaphone, Trash2 } from 'lucide-react';

export function AdminBroadcastsView() {
  const [broadcasts, setBroadcasts] = useState([
    {
      id: 'bc_101',
      title: 'Scheduled Maintenance: Groq Inference Cluster Upgrade',
      message: 'Groq inference route will undergo a 15-minute scheduled window at 02:00 UTC. Gemini fallback is active.',
      severity: 'warning',
      targetRoles: 'All Roles',
      active: true,
      createdAt: '2026-08-01 07:00',
    },
    {
      id: 'bc_102',
      title: 'Campus Sustainability Challenge Q3 Launch',
      message: 'New dormitory energy reduction challenges are live across Pacific State University campuses.',
      severity: 'info',
      targetRoles: 'Students & Dept Moderators',
      active: true,
      createdAt: '2026-07-31 12:00',
    },
  ]);

  const [titleInput, setTitleInput] = useState('');
  const [msgInput, setMsgInput] = useState('');
  const [severityInput, setSeverityInput] = useState('info');
  const [targetRoleInput, setTargetRoleInput] = useState('All Platform Roles');

  const handleCreateBroadcast = (e) => {
    e.preventDefault();
    if (!titleInput.trim() || !msgInput.trim()) return;

    const newBc = {
      id: `bc_${Date.now()}`,
      title: titleInput.trim(),
      message: msgInput.trim(),
      severity: severityInput,
      targetRoles: targetRoleInput,
      active: true,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setBroadcasts(prev => [newBc, ...prev]);
    setTitleInput('');
    setMsgInput('');
  };

  const handleDeleteBroadcast = (id) => {
    setBroadcasts(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="fluent-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Cross-Tenant System Broadcasts & Global Banners</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Publish high-priority advisory notifications, maintenance advisories, and campus alerts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-3">
          <h3 className="text-xs font-semibold text-white">Active System Broadcasts</h3>
          {broadcasts.map(bc => (
            <div key={bc.id} className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    bc.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                    bc.severity === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-sky-500/20 text-sky-300'
                  }`}>
                    {bc.severity}
                  </span>
                  <span className="font-semibold text-white">{bc.title}</span>
                </div>
                <button
                  onClick={() => handleDeleteBroadcast(bc.id)}
                  className="text-neutral-500 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-neutral-300 text-[11px] leading-relaxed">
                {typeof bc.message === 'string' ? bc.message : (bc.message?.message || JSON.stringify(bc.message || ''))}
              </p>
              <div className="flex justify-between text-[10px] text-neutral-500 pt-1 font-mono">
                <span>Audience: {bc.targetRoles}</span>
                <span>Published: {bc.createdAt}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-3">
          <h3 className="text-xs font-semibold text-white flex items-center space-x-1.5">
            <Megaphone className="w-4 h-4 text-emerald-400" />
            <span>Compose New Broadcast</span>
          </h3>
          <form onSubmit={handleCreateBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-300 mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Winter Grid Emergency Alert"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded p-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-1">Severity Level</label>
              <select
                value={severityInput}
                onChange={(e) => setSeverityInput(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded p-2 text-white"
              >
                <option value="info">Informational (Blue)</option>
                <option value="warning">Warning / Planned Event (Amber)</option>
                <option value="critical">Critical Outage / Emergency (Red)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 mb-1">Target Audience</label>
              <select
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded p-2 text-white"
              >
                <option>All Platform Roles</option>
                <option>Institution Admins Only</option>
                <option>Students & Department Moderators</option>
                <option>Household Standard Users</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 mb-1">Message Content</label>
              <textarea
                rows="3"
                placeholder="Enter global banner announcement text..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded p-2 text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
            >
              Publish Broadcast
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
