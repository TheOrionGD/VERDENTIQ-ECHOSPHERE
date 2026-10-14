import React, { useState } from 'react';
import { 
  Leaf, 
  ArrowRight, 
  Droplet, 
  Recycle, 
  TreePine, 
  Bike, 
  Lock, 
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  Cpu,
  MapPin,
  Compass,
  FileCheck2,
  CheckCircle2,
  Building2,
  ChevronRight,
  Gauge,
  Radio
} from 'lucide-react';
import { ROLE_HIERARCHY_ORDER, ROLE_CONFIGS } from '../../lib/services/authService';
import { BackgroundVideo } from '../common/BackgroundVideo';
import { ApplicationFooter } from '../common/ApplicationFooter';

export function LandingPage({ 
  onEnterLogin, 
  onDirectRoleSelect, 
  onOpenTenantRequest, 
  onOpenTenantStatus,
  onNavigateScreen
}) {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'How does VerdantIQ verify multi-campus tenant isolation?',
      a: 'VerdantIQ isolates institutional workspaces via MongoDB multi-tenant query filters, institutional domain DNS claims (.edu / .org / .gov), and MongoDB 2dsphere GeoJSON campus perimeter bounding polygon checks.'
    },
    {
      q: 'What IoT telemetry protocols are supported out of the box?',
      a: 'The Ecosphere ingestion pipeline supports standard BACnet/IP, MQTT IoT Smart Meter Gateways, Modbus RTU-over-TCP, and REST webhook intakes with SHA-256 tamper-proof ledger hashing.'
    },
    {
      q: 'How does student eco-challenge proof verification work?',
      a: 'Students submit time-stamped, geofenced evidence or smart meter receipts for challenges like dorm peak reduction. Department faculty review the moderation queue to award cryptographic EcoPoints.'
    },
    {
      q: 'Can our institution model peak demand reduction scenarios before implementation?',
      a: 'Yes. The MLOps forecasting engine utilizes Holt-Winters exponential smoothing and multi-objective Pareto frontier solvers to simulate tariff optimization and battery load shifting in real time.'
    }
  ];

  return (
    <div className="min-h-screen text-white selection:bg-emerald-500 selection:text-black font-sans relative">
      {/* Background Video (Exact styling matching LoginPage) */}
      <BackgroundVideo overlayClassName="bg-neutral-950/75 backdrop-blur-[2px]" />
      {/* Background glow matching LoginPage */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.2) 0%, transparent 60%)',
        }}
      />
      {/* SECTION 1: Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 fluent-mica border-b border-white/10 flex items-center justify-between px-6 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-emerald-400/40 shadow-lg shadow-emerald-500/20 overflow-hidden p-1 flex items-center justify-center">
            <img src="/icon.png" alt="VerdantIQ" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center space-x-1.5">
              <span>VerdantIQ</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">ECOSPHERE</span>
            </div>
            <div className="text-[10px] text-neutral-400">Pure JavaScript Sustainability Platform</div>
          </div>
        </div>

        {/* Quick Nav Anchors */}
        <div className="hidden lg:flex items-center space-x-6 text-xs text-neutral-300">
          <a href="#hero" className="hover:text-emerald-400 transition-colors">Platform</a>
          <a href="#pillars" className="hover:text-emerald-400 transition-colors">6 Pillars</a>
          <a href="#roles" className="hover:text-emerald-400 transition-colors">8 Roles</a>
          <a href="#architecture" className="hover:text-emerald-400 transition-colors">Architecture</a>
          <a href="#telemetry" className="hover:text-emerald-400 transition-colors">IoT Stream</a>
          <a href="#governance" className="hover:text-emerald-400 transition-colors">Governance</a>
          <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenTenantRequest}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Register Tenant</span>
          </button>

          <button
            onClick={() => onOpenTenantStatus('')}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
          >
            <span>Track Status</span>
          </button>

          <button
            onClick={onEnterLogin}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In / Enter</span>
          </button>
        </div>
      </nav>

      {/* SECTION 2: Hero Section */}
      <section id="hero" className="pt-24 pb-8 px-6 max-w-6xl mx-auto text-center relative">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full-Stack Multi-Resource Sustainability Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
          Next-Generation Environmental <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
            Campus Governance & Action
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-400 mb-8 leading-relaxed">
          Unifying institutional electricity accounting, water conservation, circular waste streams, verified Scope 1–3 emissions, living lab biodiversity, and student eco-challenge engagement.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <button
            onClick={onEnterLogin}
            className="liquid-btn liquid-shimmer flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white text-sm font-semibold shadow-xl shadow-emerald-600/30 border border-emerald-400/30 cursor-pointer"
          >
            <span>Launch Ecosphere Suite</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenTenantRequest}
            className="liquid-btn liquid-shimmer px-6 py-3 rounded-xl liquid-glass-panel text-emerald-300 text-sm font-medium border border-emerald-500/40 cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            Apply for Campus Tenant
          </button>

          <a
            href="#roles"
            className="liquid-btn px-6 py-3 rounded-xl liquid-glass-panel text-neutral-200 text-sm font-medium border border-white/20 transition-all hover:text-white"
          >
            Explore 8 System Roles
          </a>
        </div>

        {/* Live Metrics Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="liquid-glass-panel liquid-shimmer p-4 rounded-xl border border-white/10 text-left">
            <div className="text-2xl font-bold font-mono text-white">1.82M</div>
            <div className="text-[11px] text-neutral-300">Total kWh Monitored</div>
          </div>
          <div className="liquid-glass-panel liquid-shimmer p-4 rounded-xl border border-white/10 text-left">
            <div className="text-2xl font-bold font-mono text-emerald-400">58.4%</div>
            <div className="text-[11px] text-neutral-300">Waste Diversion Rate</div>
          </div>
          <div className="liquid-glass-panel liquid-shimmer p-4 rounded-xl border border-white/10 text-left">
            <div className="text-2xl font-bold font-mono text-sky-400">34,200 m³</div>
            <div className="text-[11px] text-neutral-300">Rainwater Conserved</div>
          </div>
          <div className="liquid-glass-panel liquid-shimmer p-4 rounded-xl border border-white/10 text-left">
            <div className="text-2xl font-bold font-mono text-teal-300">-22.4%</div>
            <div className="text-[11px] text-neutral-300">Scope 2 Emissions Drop</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: The 6 Core Sustainability Pillars */}
      <section id="pillars" className="py-10 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-12">
          <div className="text-xs font-mono uppercase text-emerald-400 font-bold mb-2 tracking-wider">Multi-Resource Accounting</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            The 6 Pillars of Campus Decarbonization
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            Granular real-time metering, automated Scope 1–3 emissions conversion, and interactive living lab tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div className="liquid-glass-panel liquid-shimmer p-5 border-amber-500/25 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">1. Real-Time Electricity Grid</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Main distribution panel telemetry, time-of-use tariffs, solar micro-inverter export tracking, and automated peak shaving alerts.
            </p>
            <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-amber-300">
              BACnet/IP & Smart Submeter Ingestion
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="liquid-glass-panel liquid-shimmer p-5 border-sky-500/25 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-sky-400" />
            </div>
            <h3 className="text-base font-bold text-white">2. Water Storage & Harvesting</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Municipal supply monitoring, greywater filtration systems, smart flow meters, and rainfall catchment storage basin analytics.
            </p>
            <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-sky-300">
              Greywater Recycling + Reservoir Tracking
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="liquid-glass-panel liquid-shimmer p-5 border-teal-500/25 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
              <Recycle className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-base font-bold text-white">3. Circular Waste Streams</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Compost collection, e-waste triage, recycling contamination logging, and certified waste-to-landfill diversion rate calculations.
            </p>
            <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-teal-300">
              Zero-Waste Campus Certification Metrics
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="liquid-glass-panel liquid-shimmer p-5 border-emerald-500/25 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">4. Scope 1–3 GHG Inventory</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Automated GHG Protocol emission factors applied to fuel usage (Scope 1), purchased power (Scope 2), and travel surveys (Scope 3).
            </p>
            <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-emerald-300">
              EPA eGRID + Regional Factors Engine
            </div>
          </div>

          {/* Pillar 5 */}
          <div className="liquid-glass-panel liquid-shimmer p-5 border-green-500/25 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center">
              <TreePine className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-base font-bold text-white">5. Biodiversity & Living Labs</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Campus arboretum mapping, native flora survival rates, microclimate sensor networks, and student-planted urban tree inventories.
            </p>
            <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-green-300">
              Living Lab Geotagged Canopy Inventory
            </div>
          </div>

          {/* Pillar 6 */}
          <div className="liquid-glass-panel liquid-shimmer p-5 border-purple-500/25 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <Bike className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-base font-bold text-white">6. Clean Mobility & Transit</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Campus commuter mode-share surveys, bicycle rack occupancy telemetry, EV charging utilization, and transit pass incentive validation.
            </p>
            <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-purple-300">
              Multimodal Modal Split Analytics
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: The 8 Role Dashboards Showcase */}
      <section id="roles" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-12">
          <div className="text-xs font-mono uppercase text-emerald-400 font-bold mb-2 tracking-wider">Windows 11 Role Governance</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            The 8 Role-Separated Workspaces
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl mx-auto">
            Strict RBAC separation across all institutional hierarchies with customized permissions and 85+ feature screens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLE_HIERARCHY_ORDER.map((roleKey) => {
            const conf = ROLE_CONFIGS[roleKey];
            return (
              <div 
                key={roleKey}
                onClick={() => onDirectRoleSelect(roleKey)}
                className="liquid-glass-panel liquid-shimmer p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-500/60 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Tier {conf.hierarchyLevel}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono uppercase">{conf.id}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{conf.label}</h3>
                  <p className="text-[11px] text-neutral-300 leading-relaxed mb-4">{conf.description}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-400 font-medium">
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: Full-Stack Architecture & Security Engine */}
      <section id="architecture" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-12">
          <div className="text-xs font-mono uppercase text-emerald-400 font-bold mb-2 tracking-wider">Technology Architecture</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Engineered with Zero TypeScript Overhead
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto">
            Built using modern 100% pure JavaScript: React 19, Express.js backend on Port 5000, and MongoDB Atlas with cryptographic ledger hashing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="liquid-glass-panel liquid-shimmer p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Client Environment</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> React 19 + Vite HMR</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Windows 11 Fluent UI + Mica effects</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dynamic Role-Switching Taskbar</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> SVG & Recharts Data Visualization</li>
            </ul>
          </div>

          <div className="liquid-glass-panel liquid-shimmer p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Express Backend Pipeline</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> 8 Dedicated Role Router Suites</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Holt-Winters Time-Series Forecaster</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Multi-Objective Pareto Frontier Solver</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Native Node Fetch API (Port 5000)</li>
            </ul>
          </div>

          <div className="liquid-glass-panel liquid-shimmer p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">MongoDB Atlas & Compliance</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Multi-Tenant Document Isolation</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> 2dsphere GeoJSON Campus Geofencing</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> SHA-256 Tamper-Proof Audit Ledger</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> PII-Redacted Global Compliance Logs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 6: Live IoT Telemetry & Submeter Ingestion */}
      <section id="telemetry" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">Submeter Infrastructure</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Unified Real-Time Telemetry & Smart Sensor Ingestion
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Connect campus substations, dorm HVAC split systems, cafeteria water chillers, and laboratory exhaust hoods directly to the Ecosphere event loop.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl liquid-glass-panel border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <div>
                    <div className="text-xs font-bold text-white">BACnet/IP Gateway Node</div>
                    <div className="text-[11px] text-neutral-300">Main Quad Substation Transformer · 480V 3-Phase</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">ONLINE</span>
              </div>

              <div className="p-3.5 rounded-xl liquid-glass-panel border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gauge className="w-4 h-4 text-sky-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Ultrasonic Flow Sensor Array</div>
                    <div className="text-[11px] text-neutral-300">North Water Tower Municipal Intake · 12.4 L/sec</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono border border-sky-500/30">NOMINAL</span>
              </div>
            </div>
          </div>

          <div className="liquid-glass-panel liquid-shimmer p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Live Campus Ingestion Feed
              </span>
              <span className="text-[10px] font-mono text-emerald-400">100 Hz Sample Rate</span>
            </div>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-white/10 flex justify-between text-neutral-300">
                <span>[14:02:11] METER_01_KWH</span>
                <span className="text-emerald-400">142.8 kW (Cos φ: 0.96)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-white/10 flex justify-between text-neutral-300">
                <span>[14:02:14] WATER_M3_INTAKE</span>
                <span className="text-sky-400">3.4 m³ (Rainwater: 42%)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-white/10 flex justify-between text-neutral-300">
                <span>[14:02:17] GEOFENCE_LOC_PING</span>
                <span className="text-teal-400">13.0102° N, 80.2354° E [LOCKED]</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-white/10 flex justify-between text-neutral-300">
                <span>[14:02:20] AI_PEAK_SHED_SOLVER</span>
                <span className="text-amber-400">Pareto Opt: -18 kW Target</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Pre-Auth Tenant Provisioning & Geofencing */}
      <section id="governance" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="liquid-glass-panel liquid-shimmer p-8 sm:p-12 border-emerald-500/35 rounded-3xl space-y-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
              <MapPin className="w-3.5 h-3.5" />
              <span>Real-Time GPS Sensor Geofencing</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Onboard Your Institution to VerdantIQ
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Apply for an isolated academic tenant workspace with automatic domain validation (.edu, .org, .gov), regional board jurisdiction routing, and GPS sensor perimeter lock.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <div className="text-xs font-bold text-white">Tier Selection</div>
              <div className="text-[11px] text-neutral-300">Academic Campus or Regional District Authority</div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1">
              <Compass className="w-4 h-4 text-sky-400" />
              <div className="text-xs font-bold text-white">Hardware GPS Lock</div>
              <div className="text-[11px] text-neutral-300">2dsphere perimeter boundary and radius verification</div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-1">
              <FileCheck2 className="w-4 h-4 text-teal-400" />
              <div className="text-xs font-bold text-white">Instant Tracking</div>
              <div className="text-[11px] text-neutral-300">Live TR-XXXXXX lookup and status simulator</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenTenantRequest}
              className="liquid-btn px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-xl shadow-emerald-950/60 flex items-center gap-2 cursor-pointer transition-all border border-emerald-400/40"
            >
              <span>Begin Tenant Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenTenantStatus('')}
              className="liquid-btn px-5 py-3 rounded-xl bg-neutral-900/70 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-white/15 transition-colors cursor-pointer"
            >
              Track Existing Application
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8: Frequently Asked Questions & Technical Specifications */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto border-t border-white/10">
        <div className="text-center mb-12">
          <div className="text-xs font-mono uppercase text-emerald-400 font-bold mb-2 tracking-wider">Technical Specifications</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300">
            Everything you need to know about deployment, compliance, and multi-tenant telemetry.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="liquid-glass-panel p-4.5 rounded-xl transition-all cursor-pointer hover:border-emerald-500/40"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span>{faq.q}</span>
                <ChevronRight className={`w-4 h-4 text-emerald-400 transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
              </div>
              {activeFaq === idx && (
                <div className="pt-3 text-xs text-neutral-300 leading-relaxed border-t border-white/10 mt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: Dedicated Full-Featured Platform Footer */}
      <ApplicationFooter
        onSelectRole={onDirectRoleSelect}
        onNavigateScreen={onNavigateScreen}
        onOpenTenantRequest={onOpenTenantRequest}
      />
    </div>
  );
}
