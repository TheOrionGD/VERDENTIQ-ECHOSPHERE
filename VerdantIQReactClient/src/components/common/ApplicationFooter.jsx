import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Cpu, 
  Lock,
  BookOpen,
  Globe2
} from 'lucide-react';

export function ApplicationFooter({ 
  onSelectRole, 
  onNavigateScreen, 
  onOpenTenantRequest 
}) {
  return (
    <footer className="relative z-20 border-t border-white/10 liquid-glass-panel py-12 text-xs text-neutral-300 select-none">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Main 6-Column Navigation Grid matching VerdantIQCLIENT */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-[12px]">
          {/* Column 1: Core Governance Portals */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>PORTALS</span>
            </div>
            <ul className="space-y-2 font-sans">
              <li>
                <button
                  onClick={() => onSelectRole('admin')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Platform Admin (T1)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('mlops')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  MLOps Engine (T2)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('audit')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Audit Trail (T3)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('region')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  District Governance (T4)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Campus Tiers */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>CAMPUS TIERS</span>
            </div>
            <ul className="space-y-2 font-sans">
              <li>
                <button
                  onClick={() => onSelectRole('institution')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Institution Admin (T5)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('dept')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Dept Moderator (T6)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('student')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Student Eco-League (T7)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('user')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Citizen Household (T8)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: State Governance */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>STATE GOVERNANCE</span>
            </div>
            <ul className="space-y-2 font-sans">
              <li>
                <button
                  onClick={() => onSelectRole('region')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Regional Districts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('region')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Grid Carbon Caps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('user')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Household Solar
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTenantRequest}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Tenant Onboarding
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Microservices */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>MICROSERVICES</span>
            </div>
            <ul className="space-y-2 font-sans">
              <li>
                <button
                  onClick={() => onNavigateScreen('documentation')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Spring Boot Provisioner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('mlops')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  XGBoost Inference
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('student')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  MILP Setpoint Solver
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRole('mlops')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Isolation Forest Logs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Dedicated Screens & Resources */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>RESOURCES</span>
            </div>
            <ul className="space-y-2 font-sans">
              <li>
                <button
                  onClick={() => onNavigateScreen('help')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateScreen('documentation')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateScreen('api-reference')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  API Reference
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTenantRequest}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Register Campus
                </button>
              </li>
            </ul>
          </div>

          {/* Column 6: Security Dedicated Screens */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>SECURITY</span>
            </div>
            <ul className="space-y-2 font-sans">
              <li>
                <button
                  onClick={() => onNavigateScreen('security', 'db-claims')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Database Claims
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateScreen('security', 'tenant-encryption')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  AES-256 Encryption
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateScreen('security', 'postgres-isolation')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  Postgres Isolation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateScreen('security', 'audit-hashes')}
                  className="hover:text-emerald-400 text-neutral-300 transition-colors cursor-pointer text-left"
                >
                  SHA-256 Audit Hashes
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner with Brand, Version, & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-emerald-400/40 p-1 flex items-center justify-center shadow-md">
              <img src="/icon.png" alt="VerdantIQ" className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-bold tracking-tight text-sm">VerdantIQ Ecosphere</span>
            <span className="text-neutral-400">Enterprise ESG Platform • Pure JavaScript React • ©2026</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <button
              onClick={() => onNavigateScreen('help')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              FAQ Support
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateScreen('security', 'db-claims')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Security Spec
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateScreen('api-reference')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              REST APIs
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ApplicationFooter;
