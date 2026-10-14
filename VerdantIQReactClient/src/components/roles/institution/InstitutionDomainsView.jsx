import React, { useState } from 'react';
import { 
  Globe, 
  Plus, 
  Trash2, 
  Search 
} from 'lucide-react';

export function InstitutionDomainsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [autoVerify, setAutoVerify] = useState(true);

  const [domains, setDomains] = useState([
    { id: 'dom-01', suffix: 'verdia.edu', label: 'Verdia Central Campus (Primary)', autoVerify: true, activeUsers: 18500, registrar: 'Dr. Evelyn Cross (Registrar Office)' },
    { id: 'dom-02', suffix: 'cs.verdia.edu', label: 'Computer Science & AI Subdomain', autoVerify: true, activeUsers: 2420, registrar: 'Lab Systems Moderator' },
    { id: 'dom-03', suffix: 'med.verdia.edu', label: 'Health Sciences & Clinical Labs', autoVerify: false, activeUsers: 1890, registrar: 'Dean of Medical Faculty' },
    { id: 'dom-04', suffix: 'partner.verdia.edu', label: 'CleanTech Research Consortium Affiliate', autoVerify: false, activeUsers: 340, registrar: 'Innovation Hub Steward' },
  ]);

  const handleToggleAutoVerify = (id) => {
    setDomains(prev => prev.map(d => d.id === id ? { ...d, autoVerify: !d.autoVerify } : d));
  };

  const handleDeleteDomain = (id) => {
    if (confirm('Remove domain from authorized campus registry?')) {
      setDomains(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleAddDomain = (e) => {
    e.preventDefault();
    if (!newDomain || !newDepartment) return;
    const added = {
      id: `dom-${Date.now()}`,
      suffix: newDomain.replace('@', ''),
      label: newDepartment,
      autoVerify,
      activeUsers: 0,
      registrar: 'Campus Lead Admin',
    };
    setDomains([...domains, added]);
    setShowAddModal(false);
    setNewDomain('');
    setNewDepartment('');
  };

  const filtered = domains.filter(d => 
    d.suffix.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Authorized Educational Email-Domain Registry</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure approved academic domain suffixes for automatic student proof admission and leaderboards.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Authorize Academic Domain</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search domain suffixes or faculties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded pl-9 pr-3 py-1.5 text-white"
          />
        </div>
        <span className="text-neutral-400 font-mono text-[11px]">{domains.length} Suffixes Active</span>
      </div>

      {/* Domain Registry Table */}
      <div className="fluent-card p-5 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-white/10 text-neutral-400">
              <tr>
                <th className="py-2.5 px-3">Domain Suffix</th>
                <th className="py-2.5 px-3">Institutional Faculty / Unit</th>
                <th className="py-2.5 px-3">Auto-Verify Status</th>
                <th className="py-2.5 px-3">Enrolled Members</th>
                <th className="py-2.5 px-3">Registrar Steward</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 font-bold text-white">@{d.suffix}</td>
                  <td className="py-2.5 px-3 font-sans text-neutral-200">{d.label}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <button
                      onClick={() => handleToggleAutoVerify(d.id)}
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase cursor-pointer ${
                        d.autoVerify ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {d.autoVerify ? 'Auto-Verify Active' : 'Manual Triage'}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400">{d.activeUsers.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-sans text-neutral-400">{d.registrar}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleDeleteDomain(d.id)}
                      className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="fluent-mica p-6 rounded-xl max-w-md w-full border border-white/10 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-white">Authorize New Campus Email Domain</h3>
            <form onSubmit={handleAddDomain} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1">Domain Suffix (without @)</label>
                <input
                  type="text"
                  placeholder="e.g. bioeng.verdia.edu"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Department / Faculty Name</label>
                <input
                  type="text"
                  placeholder="e.g. Department of Bioengineering"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="autoverify-chk"
                  checked={autoVerify}
                  onChange={(e) => setAutoVerify(e.target.checked)}
                  className="accent-emerald-500"
                />
                <label htmlFor="autoverify-chk" className="text-neutral-300 cursor-pointer">
                  Enable Instant Auto-Verification for Student Onboarding
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Authorize Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
