import React, { useState } from 'react';
import { Zap, Trash2 } from 'lucide-react';

export function AdminRateLimitsView() {
  const [routes, setRoutes] = useState([
    { id: 'rt_1', route: '/api/institution/readings', role: 'institution', reqMin: 300, burst: 50, dailyQuota: 10000 },
    { id: 'rt_2', route: '/api/student/proofs', role: 'student', reqMin: 60, burst: 15, dailyQuota: 1000 },
    { id: 'rt_3', route: '/api/mlops/forecast', role: 'mlops', reqMin: 120, burst: 20, dailyQuota: 5000 },
    { id: 'rt_4', route: '/api/audit/export', role: 'audit', reqMin: 30, burst: 5, dailyQuota: 200 },
  ]);

  const [whitelistedIps, setWhitelistedIps] = useState([
    '10.0.0.1/24 (Campus Internal Gateway)',
    '192.168.1.100 (Central MLOps Cluster)',
  ]);
  const [newIp, setNewIp] = useState('');

  const handleAddIp = (e) => {
    e.preventDefault();
    if (!newIp.trim()) return;
    setWhitelistedIps(prev => [...prev, newIp.trim()]);
    setNewIp('');
  };

  const handleRemoveIp = (ip) => {
    setWhitelistedIps(prev => prev.filter(i => i !== ip));
  };

  return (
    <div className="fluent-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>API Gateway Rate Limiting & DoS Protection</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Configure per-role endpoint quotas, burst tokens, and campus subnet whitelists.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="border-b border-white/10 text-neutral-400">
            <tr>
              <th className="py-2.5 px-3">Protected Route</th>
              <th className="py-2.5 px-3">Assigned Role</th>
              <th className="py-2.5 px-3">Req / Min</th>
              <th className="py-2.5 px-3">Burst Allowance</th>
              <th className="py-2.5 px-3">Daily Max Quota</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {routes.map(r => (
              <tr key={r.id} className="hover:bg-white/5">
                <td className="py-2.5 px-3 font-mono text-emerald-400">{r.route}</td>
                <td className="py-2.5 px-3 capitalize">{r.role}</td>
                <td className="py-2.5 px-3 font-mono">
                  <input
                    type="number"
                    value={r.reqMin}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRoutes(prev => prev.map(item => item.id === r.id ? { ...item, reqMin: val } : item));
                    }}
                    className="w-16 bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-xs text-white"
                  />
                </td>
                <td className="py-2.5 px-3 font-mono">{r.burst}</td>
                <td className="py-2.5 px-3 font-mono">{r.dailyQuota.toLocaleString()}</td>
                <td className="py-2.5 px-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                    ACTIVE
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/10 pt-4 space-y-3">
        <h3 className="text-xs font-semibold text-white">Whitelisted Institutional IP Subnets</h3>
        <div className="space-y-1.5">
          {whitelistedIps.map((ip) => (
            <div key={ip} className="flex justify-between items-center p-2 rounded bg-neutral-900 border border-white/5 text-xs">
              <span className="font-mono text-neutral-300">{ip}</span>
              <button
                onClick={() => handleRemoveIp(ip)}
                className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddIp} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. 172.16.0.0/16 (Dormitory Subnet)"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            className="flex-1 bg-neutral-900 border border-white/10 rounded px-3 py-1.5 text-xs text-white placeholder-neutral-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer"
          >
            Add Subnet
          </button>
        </form>
      </div>
    </div>
  );
}
