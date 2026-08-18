'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { StatGauge } from '@/components/ui/StatGauge';
import { Zap, ShieldAlert, Plus, Trash2, Edit2, CheckCircle2, Sliders } from 'lucide-react';

interface RouteRule {
  id: string;
  route: string;
  role: string;
  reqMin: number;
  burst: number;
  dailyQuota: number;
  throttledCount: number;
}

export default function AdminRateLimitsPage() {
  const [routes, setRoutes] = useState<RouteRule[]>([
    { id: 'rt_1', route: '/api/gemini/generate', role: 'student', reqMin: 60, burst: 10, dailyQuota: 1000, throttledCount: 2 },
    { id: 'rt_2', route: '/api/milp/solve', role: 'dept', reqMin: 300, burst: 50, dailyQuota: 10000, throttledCount: 0 },
    { id: 'rt_3', route: '/api/telemetry/ingest', role: 'institution', reqMin: 5000, burst: 1000, dailyQuota: 500000, throttledCount: 0 },
    { id: 'rt_4', route: '/api/reports/export', role: 'user', reqMin: 20, burst: 5, dailyQuota: 200, throttledCount: 14 },
  ]);

  const [whitelistedIps, setWhitelistedIps] = useState<string[]>([
    '10.0.0.1/24 (Campus Internal)',
    '192.168.1.104 (Admin Workstation)',
  ]);
  const [newIp, setNewIp] = useState('');
  const [ipToRemove, setIpToRemove] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editReqMin, setEditReqMin] = useState<number>(60);
  const [editBurst, setEditBurst] = useState<number>(10);

  const [newRouteInput, setNewRouteInput] = useState('');
  const [newRoleInput, setNewRoleInput] = useState('student');
  const [newReqMinInput, setNewReqMinInput] = useState(100);

  const handleAddIp = () => {
    if (newIp.trim()) {
      setWhitelistedIps((prev) => [...prev, newIp.trim()]);
      setNewIp('');
    }
  };

  const handleRemoveIp = (ip: string) => {
    setWhitelistedIps((prev) => prev.filter((i) => i !== ip));
  };

  const startEdit = (rt: RouteRule) => {
    setEditingId(rt.id);
    setEditReqMin(rt.reqMin);
    setEditBurst(rt.burst);
  };

  const saveEdit = (id: string) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reqMin: editReqMin, burst: editBurst } : r))
    );
    setEditingId(null);
  };

  const handleAddRule = () => {
    if (newRouteInput.trim()) {
      const newR: RouteRule = {
        id: `rt_${Date.now()}`,
        route: newRouteInput.trim(),
        role: newRoleInput,
        reqMin: newReqMinInput,
        burst: Math.floor(newReqMinInput * 0.2),
        dailyQuota: newReqMinInput * 100,
        throttledCount: 0,
      };
      setRoutes([...routes, newR]);
      setNewRouteInput('');
    }
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-5 w-5 text-[#064E3B]" />
              <Badge variant="emerald">Traffic Protection & Quota Policy</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              API Rate Limits, Quota Policies & IP Throttling Manager
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Protect inference routes and database connections against surge attacks, configure daily quotas per role.
            </p>
          </div>
        </div>

        {/* Global Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatGauge
            title="Total Requests Throttled Today"
            value={16}
            target={0}
            unit="blocked requests"
            trend="down"
            changePercentage={-40}
            status="optimal"
            subtitle="IP Token Bucket Active"
          />
          <StatGauge
            title="Ingress Firewall Status"
            value={100}
            target={100}
            unit="% rules active"
            trend="neutral"
            changePercentage={0}
            status="optimal"
            subtitle="Cloud Run WAF Protected"
          />
          <StatGauge
            title="Avg Token Bucket Overhead"
            value={0.4}
            target={2.0}
            unit="ms latency"
            trend="neutral"
            changePercentage={0}
            status="optimal"
            subtitle="Redis Token Bucket cache"
          />
        </div>

        {/* Add New Rate Limit Rule Form */}
        <Card className="p-5 bg-white/95 border-stone-200 space-y-3">
          <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            Configure New Endpoint Rate Limit Rule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-700 block mb-1">Route Path</label>
              <input
                type="text"
                placeholder="e.g. /api/user/forecast"
                value={newRouteInput}
                onChange={(e) => setNewRouteInput(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Target Role</label>
              <select
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              >
                <option value="user">User</option>
                <option value="student">Student</option>
                <option value="dept">Dept</option>
                <option value="institution">Institution</option>
                <option value="region">Region</option>
                <option value="mlops">MLOps</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Req / Min</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newReqMinInput}
                  onChange={(e) => setNewReqMinInput(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                />
                <Button variant="primary" size="sm" onClick={handleAddRule}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Route Rate Limits Table */}
        <Card className="p-5 bg-white/95 border-stone-200 space-y-4">
          <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            Configured Ingress Endpoint Limits & Daily Quota Policy
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Route Endpoint</th>
                  <th className="py-2.5 px-3">Target Role</th>
                  <th className="py-2.5 px-3">Max Req / Min</th>
                  <th className="py-2.5 px-3">Burst Capacity</th>
                  <th className="py-2.5 px-3">Daily Quota Limit</th>
                  <th className="py-2.5 px-3">Throttled (24H)</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {routes.map((rt) => {
                  const isEditing = editingId === rt.id;
                  return (
                    <tr key={rt.id} className="hover:bg-stone-50">
                      <td className="py-3 px-3 font-mono font-bold text-stone-900">{rt.route}</td>
                      <td className="py-3 px-3">
                        <Badge variant="stone">{rt.role}</Badge>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-emerald-800">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editReqMin}
                            onChange={(e) => setEditReqMin(parseInt(e.target.value))}
                            className="w-20 px-2 py-1 bg-white border border-stone-300 rounded-lg"
                          />
                        ) : (
                          `${rt.reqMin} r/m`
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-stone-600">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editBurst}
                            onChange={(e) => setEditBurst(parseInt(e.target.value))}
                            className="w-20 px-2 py-1 bg-white border border-stone-300 rounded-lg"
                          />
                        ) : (
                          `${rt.burst} burst`
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-stone-700">{rt.dailyQuota.toLocaleString()} reqs/day</td>
                      <td className="py-3 px-3">
                        <span className={`font-mono font-bold ${rt.throttledCount > 0 ? 'text-amber-700' : 'text-stone-400'}`}>
                          {rt.throttledCount} requests
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isEditing ? (
                          <Button variant="primary" size="sm" onClick={() => saveEdit(rt.id)} className="text-xs py-1">
                            Save
                          </Button>
                        ) : (
                          <button
                            onClick={() => startEdit(rt)}
                            className="text-stone-500 hover:text-emerald-800 cursor-pointer p-1"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* IP Whitelist Manager */}
        <Card className="p-5 bg-white/95 border-stone-200 space-y-4">
          <h3 className="font-editorial text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
            Trusted IP Subnet Whitelist
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 10.10.0.0/16 or 192.168.1.50"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-800"
            />
            <Button variant="primary" size="sm" onClick={handleAddIp}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add IP Subnet
            </Button>
          </div>

          <div className="space-y-2 pt-2">
            {whitelistedIps.map((ip) => (
              <div key={ip} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="font-mono font-semibold text-stone-800">{ip}</span>
                <button
                  onClick={() => setIpToRemove(ip)}
                  className="text-rose-600 hover:text-rose-800 cursor-pointer p-1"
                  title="Remove IP Subnet from Whitelist"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Confirmation Dialog for IP Subnet Removal */}
        <ConfirmationDialog
          isOpen={Boolean(ipToRemove)}
          onClose={() => setIpToRemove(null)}
          onConfirm={() => {
            if (ipToRemove) {
              handleRemoveIp(ipToRemove);
              setIpToRemove(null);
            }
          }}
          title="Remove IP Subnet from Trusted Whitelist?"
          description={
            ipToRemove ? (
              <div className="space-y-2">
                <p>
                  You are about to remove{' '}
                  <strong className="font-mono text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                    {ipToRemove}
                  </strong>{' '}
                  from the trusted WAF whitelist.
                </p>
                <p className="text-[11px] opacity-80">
                  Requests originating from this subnet will no longer bypass API rate limits or daily quota enforcement policies.
                </p>
              </div>
            ) : ''
          }
          confirmText="Remove Subnet"
          cancelText="Keep Whitelisted"
          variant="danger"
        />
      </div>
    </AppShell>
  );
}
