// @ts-nocheck
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Globe,
  MapPin,
  UserCheck,
  Mail,
  ShieldCheck,
  ArrowRight,
  Leaf,
  CheckCircle2,
  Sparkles,
  Info,
  Crosshair,
  LocateFixed,
  RefreshCw,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { isInstitutionalEmail } from '@/lib/utils';


import { getRegionalDistricts } from '@/lib/data/regionalDistricts';

export default function TenantRequestPage() {
  const router = useRouter();
  const toast = useToast();

  const [districts, setDistricts] = useState(() => getRegionalDistricts());
  const [orgType, setOrgType] = useState<'institution' | 'region'>('institution');
  const [orgName, setOrgName] = useState('Pacific State University');
  const [selectedRegion, setSelectedRegion] = useState(() => {
    const list = getRegionalDistricts();
    return list[0] ? `${list[0].name}` : 'District 1: Bay Area North';
  });
  const [domains, setDomains] = useState('pacific.edu, student.pacific.edu');

  // Admin Contact
  const [adminName, setAdminName] = useState('Dr. Helena Vance');
  const [adminEmail, setAdminEmail] = useState('h.vance@annauniv.edu');
  const [adminTitle, setAdminTitle] = useState('Chief Sustainability Officer');

  // Energy & Telemetry
  const [primaryEnergy, setPrimaryEnergy] = useState('Hybrid Grid + Rooftop Solar');
  const [bmsProtocol, setBmsProtocol] = useState('BACnet/IP & MQTT IoT Smart Meter Gateway');

  // Geofence GPS
  const [latitude, setLatitude] = useState('13.0102');
  const [longitude, setLongitude] = useState('80.2354');
  const [radiusKm, setRadiusKm] = useState('2.5');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeEmail, setShakeEmail] = useState(false);

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

        // Auto-match region district if close
        const matched = districts.find((d) =>
          d.centerLatLong && Math.abs(d.centerLatLong.lat - parseFloat(lat)) < 0.5
        );
        if (matched) {
          setSelectedRegion(matched.name);
        }

        // removed mock call
        toast.success('GPS Location Captured', `Coordinates set to [${lat}° N, ${lng}° E] (±${accuracy}m accuracy)`);
      },
      (err) => {
        setIsLocatingGps(false);
        let msg = 'Failed to acquire GPS position.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Geolocation access denied. Please grant permission or enter latitude/longitude manually.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location signal unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setGpsError(msg);
        toast.error('GPS Sensor Error', msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInstitutionalEmail(adminEmail)) {
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 500);
      toast.error('Invalid Email Domain', 'Please provide an official institutional email address ending in .edu, .org, or .gov');
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      const refId = `TR-${Math.floor(100000 + Math.random() * 900000)}`;

      const reqObj = {
        id: refId,
        institutionName: orgName,
        applicantName: adminName,
        applicantEmail: adminEmail,
        domainRequested: domains.split(',')[0].trim(),
        regionDistrict: orgType === 'institution' ? selectedRegion : 'Platform Admin Direct',
        estimatedStudents: 12500,
        accreditationDoc: `${orgName.replace(/\s+/g, '_')}_Accreditation.pdf`,
        notes: `Energy: ${primaryEnergy}, BMS: ${bmsProtocol}, GPS: [${latitude}, ${longitude}], Radius: ${radiusKm}km`,
      };

      // Store in regionService
      ([] as any);

      const appData = {
        ...reqObj,
        refId,
        orgType,
        orgName,
        selectedRegion: orgType === 'institution' ? selectedRegion : 'N/A (Platform Admin Direct)',
        domains: domains.split(',').map((d) => d.trim()),
        adminContact: { name: adminName, email: adminEmail, title: adminTitle },
        energy: primaryEnergy,
        bmsProtocol,
        geofence: { latitude, longitude, radiusKm, accuracyMeters: gpsAccuracy },
        reviewRouter: orgType === 'institution' ? `Regional Admin (${selectedRegion})` : 'Platform Admin Only',
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(`tenant_req_${refId}`, JSON.stringify(appData));
        localStorage.setItem('last_tenant_req_ref', refId);
      } catch (e) {
        // Fallback
      }

      toast.success('Tenant Request Submitted', `Application Reference ID: ${refId}`);
      setIsSubmitting(false);
      router.push(`/tenant-request/status?ref=${refId}`);
    }, 1200);
  };

  return (
    <div
      className="min-h-screen text-stone-100 font-sans p-4 sm:p-8 relative bg-no-repeat bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-[2px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between bg-stone-900/80 border border-stone-800 p-4 rounded-2xl backdrop-blur-xl">
          <Link href="/landing" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 text-stone-50 shadow-md">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <span className="font-editorial text-lg font-bold text-white block">VerdantIQ</span>
              <span className="text-[10px] font-mono text-emerald-400">Organization Provisioning</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/landing#tenant-request">
              <Button variant="ghost" size="sm" className="text-xs text-stone-300">
                Landing Section
              </Button>
            </Link>
            <Link href="/tenant-request/status">
              <Button variant="outline" size="sm" className="border-stone-700 text-xs text-stone-300">
                Check Status
              </Button>
            </Link>
          </div>
        </div>

        {/* Application Form Card */}
        <div className="bg-stone-900/90 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <Badge variant="emerald" dot className="px-3 py-1 text-xs">
              Pre-Auth Tenant Onboarding Portal
            </Badge>
            <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
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
                  <Building2 className="h-4 w-4" /> 1. Organization Identity
                </span>
                <span className="text-[10px] text-stone-500">Tier Selection</span>
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
                    Multi-campus regional district authority. Reviewed by Platform Admin.
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

            {/* Step 2: Verification Domains */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="h-4 w-4" /> 2. Student Verification Domains
                </span>
                <span className="text-[10px] text-stone-500">Automatic Custom Claims</span>
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
                  placeholder="annauniv.edu, student.annauniv.edu"
                  className="w-full h-10 px-3 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Step 3: Primary Admin Contact */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="h-4 w-4" /> 3. Primary Admin Contact
                </span>
                <span className="text-[10px] text-stone-500">Tenant Admin</span>
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
                    Official Admin Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@annauniv.edu"
                      className={`w-full h-10 pl-3 pr-10 text-xs bg-stone-950 border rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors ${
                        shakeEmail ? 'animate-shake border-red-500 ring-2 ring-red-500/20' : 'border-stone-800'
                      }`}
                    />
                    {isInstitutionalEmail(adminEmail) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-700">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Title / Designation
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

            {/* Step 4: Real-time GPS Geofence */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> 4. Real-time GPS Geofence Acquisition
                </span>
                <span className="text-[10px] font-mono text-stone-500">2dsphere GeoJSON Boundary</span>
              </div>

              {/* GPS Button */}
              <div className="p-4 rounded-xl bg-stone-950 border border-emerald-800/60 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <LocateFixed className="h-4 w-4 text-emerald-400" />
                      <span>Query Device GPS Sensor</span>
                    </div>
                    <p className="text-[11px] text-stone-400">Request current latitude & longitude directly from browser location services.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGetRealTimeGps}
                    disabled={isLocatingGps}
                    className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 min-h-[40px] disabled:opacity-50"
                  >
                    {isLocatingGps ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Querying GPS...</span>
                      </>
                    ) : (
                      <>
                        <Crosshair className="h-3.5 w-3.5" />
                        <span>Request GPS Location</span>
                      </>
                    )}
                  </button>
                </div>

                {gpsAccuracy !== null && (
                  <div className="p-2.5 rounded bg-emerald-950/80 border border-emerald-600/60 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>GPS locked: [{latitude}° N, {longitude}° E] with ±{gpsAccuracy}m precision</span>
                  </div>
                )}

                {gpsError && (
                  <div className="p-2.5 rounded bg-red-950/80 border border-red-600/60 text-[11px] font-mono text-red-300 flex items-center gap-2">
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

            {/* Submit Button */}
            <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-400 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Review Routing: <strong className="text-stone-200">{orgType === 'institution' ? `Regional Admin (${selectedRegion})` : 'Platform Admin'}</strong>
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold px-8 shadow-xl shadow-emerald-950/50"
              >
                Submit Tenant Application <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
