import React, { useState } from 'react';
import {
  Building2,
  Globe,
  MapPin,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  LocateFixed,
  RefreshCw,
  AlertCircle,
  FileSearch,
  ArrowLeft
} from 'lucide-react';
import { BackgroundVideo } from '../common/BackgroundVideo';

export function TenantRequestPage({ onBackToLanding, onGoToStatus }) {
  const [districts] = useState([
    { id: 'dist-1', name: 'District 1: Bay Area North', zone: 'Pacific' },
    { id: 'dist-2', name: 'District 2: Pacific Northwest', zone: 'Northwest' },
    { id: 'dist-3', name: 'District 3: Greater Los Angeles', zone: 'Southwest' },
    { id: 'dist-4', name: 'District 4: Midwest Academic Alliance', zone: 'Midwest' },
    { id: 'dist-5', name: 'District 5: Eastern Seaboard Consortium', zone: 'East' },
  ]);

  const [orgType, setOrgType] = useState('institution');
  const [orgName, setOrgName] = useState('Pacific State University');
  const [selectedRegion, setSelectedRegion] = useState('District 1: Bay Area North');
  const [domains, setDomains] = useState('pacific.edu, student.pacific.edu');

  // Admin Contact
  const [adminName, setAdminName] = useState('Dr. Helena Vance');
  const [adminEmail, setAdminEmail] = useState('h.vance@annauniv.edu');
  const [adminTitle, setAdminTitle] = useState('Chief Sustainability Officer');

  // Energy & Telemetry Infrastructure
  const [primaryEnergy, setPrimaryEnergy] = useState('Hybrid Grid + Rooftop Solar');
  const [bmsProtocol, setBmsProtocol] = useState('BACnet/IP & MQTT IoT Smart Meter Gateway');

  // Real GPS Geofence Acquisition
  const [latitude, setLatitude] = useState('13.0102');
  const [longitude, setLongitude] = useState('80.2354');
  const [radiusKm, setRadiusKm] = useState('2.5');
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeEmail, setShakeEmail] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const isInstitutionalEmail = (email) => {
    if (!email) return false;
    const lower = email.toLowerCase().trim();
    return lower.endsWith('.edu') || lower.endsWith('.org') || lower.endsWith('.gov') || lower.endsWith('.ac.in');
  };

  // Real GPS Geofence Acquisition
  const handleGetRealTimeGps = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError('Geolocation sensor is not supported in this browser environment.');
      return;
    }
    setIsLocatingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const accuracy = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 10;

        setLatitude(lat);
        setLongitude(lng);
        setGpsAccuracy(accuracy);
        setIsLocatingGps(false);
        setFeedbackMsg({
          type: 'success',
          text: `GPS coordinates locked: [${lat}° N, ${lng}° E] (±${accuracy}m accuracy)`,
        });
      },
      (err) => {
        setIsLocatingGps(false);
        let msg = 'Failed to acquire GPS position.';
        if (err.code === 1) {
          msg = 'Geolocation access denied. Please allow permissions or type coordinates manually.';
        } else if (err.code === 2) {
          msg = 'Location signal unavailable.';
        } else if (err.code === 3) {
          msg = 'Location request timed out.';
        }
        setGpsError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isInstitutionalEmail(adminEmail)) {
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 600);
      setFeedbackMsg({
        type: 'error',
        text: 'Please provide an official institutional email ending in .edu, .org, or .gov',
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const refId = `TR-${Math.floor(100000 + Math.random() * 900000)}`;

      const appData = {
        id: refId,
        refId,
        institutionName: orgName,
        orgName,
        orgType,
        selectedRegion: orgType === 'institution' ? selectedRegion : 'Platform Admin Direct',
        domainRequested: domains.split(',')[0].trim(),
        domains: domains.split(',').map((d) => d.trim()),
        adminContact: { name: adminName, email: adminEmail, title: adminTitle },
        applicantName: adminName,
        applicantEmail: adminEmail,
        energy: primaryEnergy,
        bmsProtocol,
        geofence: { latitude, longitude, radiusKm, accuracyMeters: gpsAccuracy },
        reviewRouter: orgType === 'institution' ? `Regional Admin (${selectedRegion})` : 'Platform Admin Direct Review',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        notes: `Energy: ${primaryEnergy}, BMS: ${bmsProtocol}, GPS: [${latitude}, ${longitude}], Radius: ${radiusKm}km`,
      };

      try {
        localStorage.setItem(`tenant_req_${refId}`, JSON.stringify(appData));
        localStorage.setItem('last_tenant_req_ref', refId);

        const existingQueueStr = localStorage.getItem('verdantiq_tenant_requests');
        const queue = existingQueueStr ? JSON.parse(existingQueueStr) : [];
        queue.unshift(appData);
        localStorage.setItem('verdantiq_tenant_requests', JSON.stringify(queue));
      } catch (err) {
        console.warn('LocalStorage save fallback:', err);
      }

      setIsSubmitting(false);
      onGoToStatus(refId);
    }, 1000);
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
            <div className="w-9 h-9 rounded-xl bg-stone-900 border border-emerald-500/40 text-white shadow-md overflow-hidden p-1 flex items-center justify-center">
              <img src="/icon.png" alt="VerdantIQ" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-lg text-white block leading-tight">VerdantIQ Ecosphere</span>
              <span className="text-[10px] font-mono text-emerald-400">Pre-Auth Tenant Provisioning</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToLanding}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:bg-stone-800/80 transition-colors cursor-pointer"
            >
              Landing Page
            </button>
            <button
              onClick={() => onGoToStatus('')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <FileSearch className="h-3.5 w-3.5" />
              <span>Track Application</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              feedbackMsg.type === 'error'
                ? 'bg-red-950/80 border-red-500/50 text-red-200'
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMsg.type === 'error' ? <AlertCircle className="h-4 w-4 text-red-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              <span>{feedbackMsg.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-stone-400 hover:text-white text-xs px-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Application Form Card */}
        <div className="liquid-glass-panel liquid-shimmer rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Pre-Auth Tenant Onboarding Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Register Your Organization Tenant
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Apply to provision an isolated VerdantIQ tenant for your campus or district authority with real-time GPS sensor geofencing and automatic domain verification.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Organization Type & Identity */}
            <div className="space-y-4 pt-2 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> 1. Organization Identity & Tier
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Step 1 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrgType('institution')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    orgType === 'institution'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-emerald-300 mb-1">Academic / Corporate Institution</div>
                  <p className="text-[11px] text-stone-400">
                    Single campus or institutional tenant. Reviewed by Regional Admin.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setOrgType('region')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    orgType === 'region'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-amber-300 mb-1">Regional Sustainability District</div>
                  <p className="text-[11px] text-stone-400">
                    Multi-campus regional district authority. Reviewed directly by Platform Admin.
                  </p>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Official Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {orgType === 'institution' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Target Regional Board Jurisdiction
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full h-10 px-3 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {districts.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} ({d.zone} Zone)
                        </option>
                      ))}
                      <option value="West Coast District Board">West Coast District Board</option>
                      <option value="Platform Admin Direct">Platform Admin Direct Review</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Verification Domains & Infrastructure */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="h-4 w-4" /> 2. Student Verification Domains & IoT
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Step 2 of 4</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Allowed Email Domains (Comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={domains}
                  onChange={(e) => setDomains(e.target.value)}
                  placeholder="pacific.edu, student.pacific.edu"
                  className="w-full h-10 px-3 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider">Primary Energy Source</label>
                  <input
                    type="text"
                    value={primaryEnergy}
                    onChange={(e) => setPrimaryEnergy(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-stone-950 border border-stone-800 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider">Telemetry & BMS Protocol</label>
                  <input
                    type="text"
                    value={bmsProtocol}
                    onChange={(e) => setBmsProtocol(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-stone-950 border border-stone-800 rounded-lg text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Primary Admin Contact */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="h-4 w-4" /> 3. Primary Administrative Contact
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Step 3 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Official Admin Email (.edu / .org / .gov)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@annauniv.edu"
                      className={`w-full h-10 pl-3 pr-20 text-xs bg-stone-950 border rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors ${
                        shakeEmail ? 'border-red-500 ring-2 ring-red-500/30' : 'border-stone-800'
                      }`}
                    />
                    {isInstitutionalEmail(adminEmail) && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-700">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>Valid</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Title / Role
                  </label>
                  <input
                    type="text"
                    required
                    value={adminTitle}
                    onChange={(e) => setAdminTitle(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Real-time GPS Geofence Acquisition */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> 4. Real-time GPS Geofence Acquisition
                </span>
                <span className="text-[10px] font-mono text-stone-500">2dsphere GeoJSON Boundary</span>
              </div>

              {/* GPS Sensor Control Box */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-emerald-800/60 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <LocateFixed className="h-4 w-4 text-emerald-400" />
                      <span>Query Device GPS Hardware Sensor</span>
                    </div>
                    <p className="text-[11px] text-stone-400">Request current latitude & longitude directly from browser location services.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGetRealTimeGps}
                    disabled={isLocatingGps}
                    className="bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 min-h-[40px] disabled:opacity-50 shadow-md shadow-emerald-950/40"
                  >
                    {isLocatingGps ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Querying GPS Sensor...</span>
                      </>
                    ) : (
                      <>
                        <LocateFixed className="h-3.5 w-3.5" />
                        <span>Request GPS Location</span>
                      </>
                    )}
                  </button>
                </div>

                {gpsAccuracy !== null && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-600/60 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>GPS locked: [{latitude}° N, {longitude}° E] with ±{gpsAccuracy}m precision</span>
                  </div>
                )}

                {gpsError && (
                  <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-600/60 text-[11px] font-mono text-red-300 flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                    <span>{gpsError}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-1">Center Latitude</label>
                    <input
                      type="text"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full h-9 px-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-1">Center Longitude</label>
                    <input
                      type="text"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full h-9 px-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-1">Geofence Radius (km)</label>
                    <input
                      type="text"
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(e.target.value)}
                      className="w-full h-9 px-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Footer */}
            <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-400 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Review Routing: <strong className="text-stone-200">{orgType === 'institution' ? `Regional Admin (${selectedRegion})` : 'Platform Admin Direct'}</strong>
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold px-8 py-3 rounded-xl text-xs shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Tenant Application</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
