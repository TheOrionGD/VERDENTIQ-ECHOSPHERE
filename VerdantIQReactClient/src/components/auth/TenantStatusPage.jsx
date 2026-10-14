import React, { useState } from 'react';
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Globe,
  MapPin,
  Mail,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  Plus
} from 'lucide-react';
import { BackgroundVideo } from '../common/BackgroundVideo';

function getInitialApplication(targetRef) {
  let data = null;
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(`tenant_req_${targetRef}`);
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (e) {
        console.warn('Failed to parse saved application:', e);
      }
    }
  }

  if (!data) {
    data = {
      refId: targetRef || 'TR-849201',
      orgType: 'institution',
      orgName: 'Pacific Northwest Environmental Institute',
      selectedRegion: 'District 1: Bay Area North',
      domains: ['pnei.edu', 'student.pnei.edu'],
      adminContact: {
        name: 'Dr. Helena Vance',
        email: 'h.vance@pnei.edu',
        title: 'Chief Sustainability Officer',
      },
      energy: 'Hybrid Grid + Rooftop Solar',
      bmsProtocol: 'BACnet/IP & MQTT IoT Gateway',
      geofence: { latitude: '37.7749', longitude: '-122.4194', radiusKm: '2.5' },
      reviewRouter: 'Regional Admin (District 1: Bay Area North)',
      status: 'pending',
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    };
  }
  return data;
}

export function TenantStatusPage({ initialRef = '', onBackToLanding, onNewApplication }) {
  const [searchRef, setSearchRef] = useState(() => {
    if (initialRef) return initialRef;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('last_tenant_req_ref') || 'TR-849201';
    }
    return 'TR-849201';
  });

  const [appData, setAppData] = useState(() => {
    let target = initialRef;
    if (!target && typeof window !== 'undefined') {
      target = localStorage.getItem('last_tenant_req_ref') || 'TR-849201';
    }
    return getInitialApplication(target);
  });

  const [currentStatus, setCurrentStatus] = useState(() => appData?.status || 'pending');
  const [toastMsg, setToastMsg] = useState(null);

  const loadApplication = (refId) => {
    const data = getInitialApplication(refId);
    setAppData(data);
    setCurrentStatus(data.status || 'pending');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchRef.trim()) {
      loadApplication(searchRef.trim());
      setToastMsg(`Loaded application reference ${searchRef.trim()}`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const toggleStatus = (newStatus) => {
    setCurrentStatus(newStatus);
    if (appData) {
      const updated = { ...appData, status: newStatus };
      setAppData(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`tenant_req_${appData.refId}`, JSON.stringify(updated));
      }
      setToastMsg(`Simulated Review Status set to: ${newStatus.toUpperCase()}`);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  return (
    <div className="min-h-screen text-stone-100 font-sans p-4 sm:p-8 relative">
      {/* Video Background */}
      <BackgroundVideo overlayClassName="bg-stone-950/80 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between liquid-glass-panel liquid-shimmer p-4 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
              title="Return to Landing Page"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-stone-900 border border-emerald-500/40 text-white shadow-md overflow-hidden p-1 flex items-center justify-center animate-liquid-pulse">
              <img src="/icon.png" alt="VerdantIQ" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-lg text-white block leading-tight">VerdantIQ Ecosphere</span>
              <span className="text-[10px] font-mono text-emerald-400">Application Tracking</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNewApplication}
              className="liquid-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Tenant Application</span>
            </button>
            <button
              onClick={onBackToLanding}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Back to Landing
            </button>
          </div>
        </div>

        {/* Toast alert */}
        {toastMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Reference Lookup Card */}
        <div className="liquid-glass-panel liquid-shimmer rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white">Check Application Status</h2>
            <p className="text-xs text-stone-400">Enter your Tenant Request Reference ID (e.g. TR-849201)</p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                placeholder="TR-XXXXXX"
                className="w-full h-10 pl-10 pr-3 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-5 text-xs font-bold rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
            >
              Track Request
            </button>
          </form>
        </div>

        {/* Application Status Card */}
        {appData && (
          <div className="bg-stone-900/90 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            {/* Header Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-emerald-400 font-bold">{appData.refId}</span>
                  <span className="text-stone-500">•</span>
                  <span className="text-xs text-stone-400">
                    Submitted {new Date(appData.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white">{appData.orgName || appData.institutionName}</h1>
              </div>

              <div>
                {currentStatus === 'pending' && (
                  <div className="px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>Pending Verification</span>
                  </div>
                )}
                {currentStatus === 'approved' && (
                  <div className="px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Tenant Provisioned & Active</span>
                  </div>
                )}
                {currentStatus === 'rejected' && (
                  <div className="px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-red-400" />
                    <span>Application Rejected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Review Router Info Banner */}
            <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-300">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> Review Authority Routing:
                </span>
                <span className="font-mono text-stone-300">{appData.reviewRouter}</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                {currentStatus === 'pending' &&
                  'Your application is currently queued for institutional DNS validation, MongoDB 2dsphere geofence perimeter lock, and automated claim provisioning.'}
                {currentStatus === 'approved' &&
                  'Your campus tenant workspace, 2dsphere GPS geofence, and Database custom claims mirror have been successfully provisioned.'}
                {currentStatus === 'rejected' &&
                  'This application was not approved. Institutional accreditation documents or campus domain ownership could not be verified.'}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/80 space-y-2">
                <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-emerald-400" /> Student Verification Domains
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(appData.domains || [appData.domainRequested]).map((d, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-mono text-[11px]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/80 space-y-2">
                <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-emerald-400" /> Admin Contact Invite
                </div>
                <div className="text-stone-200 font-semibold">{appData.adminContact?.name || appData.applicantName}</div>
                <div className="text-stone-400 text-[11px]">
                  {appData.adminContact?.title || 'Administrator'} • {appData.adminContact?.email || appData.applicantEmail}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/80 space-y-2 sm:col-span-2">
                <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" /> Provisioned GeoJSON Geofence
                </div>
                <div className="font-mono text-[11px] text-stone-300">
                  Center Coordinates: [{appData.geofence?.latitude || '13.0102'}° N, {appData.geofence?.longitude || '80.2354'}° E] • Radius: {appData.geofence?.radiusKm || '2.5'} km
                </div>
              </div>
            </div>

            {/* Approval Call to Action */}
            {currentStatus === 'approved' && (
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-600/60 space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>Tenant Provisioned — Campus Ready</span>
                </div>
                <p className="text-xs text-stone-300">
                  An activation invite was assigned to <code className="text-emerald-300 font-mono">{appData.adminContact?.email || appData.applicantEmail}</code>. You can log in using your institutional credentials to administer the campus suite.
                </p>
                <button
                  onClick={onBackToLanding}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-950/50"
                >
                  <span>Proceed to Ecosphere Suite</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Simulation Review Switcher */}
            <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-stone-500 text-[11px] flex items-center gap-1 font-mono">
                <RefreshCw className="h-3.5 w-3.5 text-amber-400" /> Dev Simulation Decision Switcher:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleStatus('pending')}
                  className={`px-3 py-1 rounded-lg text-[11px] border cursor-pointer font-medium transition-colors ${
                    currentStatus === 'pending'
                      ? 'bg-amber-950 text-amber-300 border-amber-600'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => toggleStatus('approved')}
                  className={`px-3 py-1 rounded-lg text-[11px] border cursor-pointer font-medium transition-colors ${
                    currentStatus === 'approved'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  Approve Tenant
                </button>
                <button
                  type="button"
                  onClick={() => toggleStatus('rejected')}
                  className={`px-3 py-1 rounded-lg text-[11px] border cursor-pointer font-medium transition-colors ${
                    currentStatus === 'rejected'
                      ? 'bg-red-950 text-red-300 border-red-600'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
