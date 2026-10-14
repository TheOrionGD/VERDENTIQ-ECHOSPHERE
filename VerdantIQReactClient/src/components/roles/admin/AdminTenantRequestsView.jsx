import React, { useState } from 'react';
import { Building } from 'lucide-react';

export function AdminTenantRequestsView() {
  const [requests, setRequests] = useState([
    {
      id: 'treq_101',
      regionName: 'West Coast District Board',
      requesterName: 'David Vance',
      requesterEmail: 'david.vance@westcoast-edu.org',
      requestType: 'Create New Region & Provision Regional Admin',
      details: 'Requesting creation of West Coast Region and provisioning of +500,000 kWh monthly telemetry quota for 4 newly onboarded community college campuses.',
      requestedQuota: '1.2M kWh/mo',
      status: 'pending',
      dateSubmitted: '2026-07-30',
    },
    {
      id: 'treq_102',
      regionName: 'Northwest Higher Ed Federation',
      requesterName: 'Dr. Sarah Jenkins',
      requesterEmail: 's.jenkins@nwhef.org',
      requestType: 'Dedicated LLM Inference Instance',
      details: 'Requesting dedicated Groq LPU pipeline isolate for strict privacy compliance on student research data.',
      requestedQuota: 'Dedicated LPU Node',
      status: 'pending',
      dateSubmitted: '2026-07-28',
    },
    {
      id: 'treq_103',
      regionName: 'Cascadia Sustainability Alliance',
      requesterName: 'Michael Chang',
      requesterEmail: 'm.chang@cascadia.org',
      requestType: 'Campus Tenant Expansion',
      details: 'Onboarding 2 regional satellite campuses with Scope 2 emissions monitoring.',
      requestedQuota: '800k kWh/mo',
      status: 'approved',
      dateSubmitted: '2026-07-25',
    },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="fluent-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Institutional Tenant Provisioning & Quota Requests</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Review onboarding requests from prospective campus administrators and regional authorities.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {requests.map(req => (
          <div key={req.id} className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-white">{req.regionName}</span>
                <span className="text-neutral-500 font-mono ml-2">({req.id})</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                req.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                'bg-amber-500/20 text-amber-300'
              }`}>
                {req.status}
              </span>
            </div>

            <div className="text-[11px] text-neutral-300 bg-neutral-950 p-2.5 rounded space-y-1">
              <div><span className="text-neutral-500">Requester: </span>{req.requesterName} ({req.requesterEmail})</div>
              <div><span className="text-neutral-500">Type: </span><span className="text-emerald-400 font-medium">{req.requestType}</span></div>
              <div><span className="text-neutral-500">Quota: </span><span className="font-mono text-white">{req.requestedQuota}</span></div>
              <div className="text-neutral-400 pt-1">"{req.details}"</div>
            </div>

            {req.status === 'pending' && (
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  onClick={() => handleUpdateStatus(req.id, 'rejected')}
                  className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleUpdateStatus(req.id, 'approved')}
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors cursor-pointer"
                >
                  Approve & Provision
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
