import React, { useState } from 'react';
import { 
  Search, 
  Power, 
  Settings, 
  User, 
  ShieldCheck, 
  Cpu, 
  FileCheck, 
  MapPin, 
  Building2, 
  Layers, 
  GraduationCap, 
  Home 
} from 'lucide-react';
import { useAuth } from '../../lib/useAuth';
import { ROLE_HIERARCHY_ORDER, ROLE_CONFIGS } from '../../lib/services/authService';

const ROLE_ICONS = {
  admin: ShieldCheck,
  mlops: Cpu,
  audit: FileCheck,
  region: MapPin,
  institution: Building2,
  dept: Layers,
  student: GraduationCap,
  user: Home,
};

export function WindowsStartMenu({ isOpen, onClose }) {
  const { currentRole, switchRole, userName } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredRoles = ROLE_HIERARCHY_ORDER.filter(roleKey => {
    const conf = ROLE_CONFIGS[roleKey];
    return conf.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
           conf.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2 w-[540px] max-h-[580px] fluent-mica rounded-xl shadow-2xl p-5 z-50 flex flex-col text-neutral-100 animate-in fade-in slide-in-from-bottom-2 duration-150">
      {/* Search Input Box */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type here to search roles, capabilities, and system modules..."
          className="w-full bg-neutral-900/60 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-400 transition-colors"
          autoFocus
        />
      </div>

      {/* Pinned 8 System Roles */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-neutral-300">System Roles (Tier 1 - 8)</span>
          <span className="text-[11px] text-neutral-400">Pure JavaScript</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {filteredRoles.map((roleKey) => {
            const Icon = ROLE_ICONS[roleKey] || User;
            const config = ROLE_CONFIGS[roleKey];
            const isActive = currentRole === roleKey;

            return (
              <button
                key={roleKey}
                onClick={() => {
                  switchRole(roleKey);
                  onClose();
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg text-center transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-200'
                }`}
              >
                <div className={`p-2 rounded-lg mb-1.5 ${isActive ? 'bg-emerald-500/30' : 'bg-neutral-800'}`}>
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[11px] font-medium truncate w-full">{config.label}</span>
                <span className="text-[9px] text-neutral-400">Tier {config.hierarchyLevel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile Bar */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-700/60 flex items-center justify-center text-xs font-bold text-white border border-emerald-500/40">
            {userName.charAt(0)}
          </div>
          <div>
            <div className="text-xs font-medium text-white">{userName}</div>
            <div className="text-[10px] text-neutral-400 capitalize">{ROLE_CONFIGS[currentRole]?.label}</div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-2 rounded-md hover:bg-white/10 text-neutral-300" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-md hover:bg-white/10 text-neutral-300" title="Lock / Power">
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
