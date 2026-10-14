import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Building
} from 'lucide-react';

export function InstitutionChallengesView() {
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Campus-Wide');
  const [newPoints, setNewPoints] = useState(50);
  const [newTargetKg, setNewTargetKg] = useState(1200);
  const [newDesc, setNewDesc] = useState('');

  const [challenges, setChallenges] = useState([
    {
      id: 'chal-01',
      title: 'Lab Twilight HVAC & Workstation Shutdown',
      departmentName: 'Computer Science & AI',
      proposedBy: 'Dr. Alan Vance',
      category: 'Energy Conservation',
      description: 'Power down multi-GPU training nodes and lab workstation clusters by 20:00 to reduce idle load.',
      targetCarbonSavingKg: 4200,
      rewardPoints: 40,
      status: 'Active Campaign',
    },
    {
      id: 'chal-02',
      title: 'Living Lab Native Arboretum Bio-Stewardship',
      departmentName: 'Environmental Science',
      proposedBy: 'Prof. Martha Chen',
      category: 'Biodiversity & Soil',
      description: 'Collect moisture sensor telemetry and maintain native flora in the south campus watershed.',
      targetCarbonSavingKg: 1800,
      rewardPoints: 50,
      status: 'Active Campaign',
    },
    {
      id: 'chal-03',
      title: 'Dorm Twilight Cold-Water Laundry Shift',
      departmentName: 'Student Residential Life',
      proposedBy: 'Elena Rostova',
      category: 'Water & Heat',
      description: 'Incentivize cold-wash detergent usage and off-peak laundry cycles between 22:00 and 06:00.',
      targetCarbonSavingKg: 3100,
      rewardPoints: 35,
      status: 'Pending Approval',
    },
    {
      id: 'chal-04',
      title: 'Campus Dining Organic Compost Segregation',
      departmentName: 'Facility Auxiliary Services',
      proposedBy: 'Chef Marcus Finch',
      category: 'Circular Waste',
      description: 'Eliminate single-use bioplastics and divert prep waste to the campus anaerobic digester.',
      targetCarbonSavingKg: 2900,
      rewardPoints: 30,
      status: 'Pending Approval',
    },
  ]);

  const handleReview = (id, newStatus) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleCreateChallenge = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    const created = {
      id: `chal-${Date.now()}`,
      title: newTitle,
      departmentName: newDept,
      proposedBy: 'Campus Sustainability Office',
      category: 'Energy & Climate',
      description: newDesc,
      targetCarbonSavingKg: Number(newTargetKg),
      rewardPoints: Number(newPoints),
      status: 'Active Campaign',
    };
    setChallenges([created, ...challenges]);
    setShowModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const filtered = challenges.filter(c => {
    if (activeTab === 'pending') return c.status === 'Pending Approval';
    if (activeTab === 'active') return c.status === 'Active Campaign';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>Campus Challenge Approval & Campaign Governance Console</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Review department-submitted sustainability proposals, authorize EcoPoint reward pools, and launch campus sprints.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Launch Campus Campaign</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 text-xs">
        {[
          { id: 'all', label: 'All Campaigns', count: challenges.length },
          { id: 'pending', label: 'Pending Approval', count: challenges.filter(c => c.status === 'Pending Approval').length },
          { id: 'active', label: 'Active Campaigns', count: challenges.filter(c => c.status === 'Active Campaign').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
            }`}
          >
            <span>{tab.label}</span>
            <span className="font-mono text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="fluent-card p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono text-teal-400 font-semibold uppercase bg-teal-500/10 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-semibold text-white mt-1.5">{item.title}</h3>
                  <div className="text-[11px] text-neutral-400 flex items-center space-x-1 mt-0.5">
                    <Building className="w-3 h-3 text-neutral-500" />
                    <span>{item.departmentName} · By {item.proposedBy}</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                  item.status === 'Active Campaign' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                {item.description}
              </p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-neutral-900 border border-white/5 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-neutral-500 font-sans block">Carbon Abatement Target</span>
                  <span className="font-bold text-teal-400">-{item.targetCarbonSavingKg.toLocaleString()} kg CO₂</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 font-sans block">EcoPoint Reward Pool</span>
                  <span className="font-bold text-emerald-400">+{item.rewardPoints} EcoPoints</span>
                </div>
              </div>
            </div>

            {item.status === 'Pending Approval' && (
              <div className="pt-3 border-t border-white/10 flex items-center space-x-2">
                <button
                  onClick={() => handleReview(item.id, 'Rejected')}
                  className="flex-1 py-1.5 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs border border-red-500/30 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleReview(item.id, 'Active Campaign')}
                  className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Launch</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for New Campaign */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="fluent-mica p-6 rounded-xl max-w-md w-full border border-white/10 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-white">Create New Campus Sustainability Campaign</h3>
            <form onSubmit={handleCreateChallenge} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Quad Night Micro-Lighting Audit"
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Target Department / Zone</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">Points per Action</label>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1">Target Carbon (kg CO₂)</label>
                  <input
                    type="number"
                    value={newTargetKg}
                    onChange={(e) => setNewTargetKg(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Operational Instructions</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe student action, required photo evidence, and guidelines..."
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
