'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  Globe,
  Zap,
  Cpu,
  CheckCircle2,
  Lock,
  Database,
  Sun,
  Linkedin,
  Twitter,
  Github,
  Key,
  Shield,
  Building2,
  MapPin,
  UserCheck,
  Mail,
  Phone,
  Compass,
  Crosshair,
  Info,
  Layers,
  FileText,
  Check,
  Clock,
  LocateFixed,
  Navigation,
  Sparkles,
  AlertCircle,
  X,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { getRegionalDistricts } from '@/lib/data/regionalDistricts';
import { isInstitutionalEmail } from '@/lib/utils';

export const ScrollytellingLanding: React.FC = () => {
  const router = useRouter();
  const toast = useToast();

  // Modals
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // =========================================================================
  // TENANT REQUEST FORM STATE (EMBEDDED DIRECTLY ON LANDING PAGE)
  // =========================================================================
  const [orgType, setOrgType] = useState<'institution' | 'region' | 'corporate' | 'lab' | 'government'>('institution');
  const [orgName, setOrgName] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [institutionType, setInstitutionType] = useState('Autonomous College / University');
  const [primaryDomain, setPrimaryDomain] = useState('');
  const [allowedDomains, setAllowedDomains] = useState('');

  // Primary Admin Contact
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminTitle, setAdminTitle] = useState('');
  const [departmentName, setDepartmentName] = useState('');

  // Physical Location & Region
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  // Real-Time GPS Geofence Request State
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsAltitude, setGpsAltitude] = useState<number | null>(null);
  const [gpsTimestamp, setGpsTimestamp] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState('2.5');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Operational Scale & Capacity
  const [studentCapacity, setStudentCapacity] = useState('');
  const [staffCount, setStaffCount] = useState('');
  const [buildingCount, setBuildingCount] = useState('');
  const [totalFloorAreaSqFt, setTotalFloorAreaSqFt] = useState('');
  const [annualEnergyBudgetUsd, setAnnualEnergyBudgetUsd] = useState('');
  const [baselineEui, setBaselineEui] = useState('110');
  const [solarCapacityKw, setSolarCapacityKw] = useState('');
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState('');
  const [smartMetersCount, setSmartMetersCount] = useState('');

  // Security, Privacy & Encryption Options
  const [encryptionScheme, setEncryptionScheme] = useState('AES-256 Multi-Tenant Isolation');
  const [databaseIsolation, setDatabaseIsolation] = useState('Postgres Schema Per Tenant');
  const [auditRetentionPeriod, setAuditRetentionPeriod] = useState('1 Year Compliance');
  const [publicBenchmarkOptIn, setPublicBenchmarkOptIn] = useState(true);
  const [governanceNotes, setGovernanceNotes] = useState('');

  // Form Submission & Status Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeEmail, setShakeEmail] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  // Handle Real-Time GPS Geofence Location Request
  const handleRequestGpsLocation = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      const err = 'Geolocation is not supported by your browser.';
      setGpsError(err);
      toast.error('GPS Error', err);
      return;
    }

    setIsLocating(true);
    toast.info('GPS Request Initiated', 'Requesting high-accuracy device location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const accuracy = Math.round(position.coords.accuracy);
        const altitude = position.coords.altitude ? Math.round(position.coords.altitude) : null;
        const timeStr = new Date(position.timestamp).toLocaleTimeString();

        setLatitude(lat);
        setLongitude(lng);
        setGpsAccuracy(accuracy);
        setGpsAltitude(altitude);
        setGpsTimestamp(timeStr);
        setIsLocating(false);

        toast.success(
          'Real-time GPS Captured!',
          `Coordinates: ${lat}, ${lng} (Accuracy: ±${accuracy}m)`
        );
      },
      (error) => {
        setIsLocating(false);
        let errMsg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          errMsg = 'Location permission denied by browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errMsg = 'Location information is unavailable on your device.';
        } else if (error.code === error.TIMEOUT) {
          errMsg = 'Location request timed out. Please try again.';
        }
        setGpsError(errMsg);
        toast.error('GPS Capture Failed', errMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Handle Tenant Application Form Submission
  const handleSubmitTenantRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (adminEmail && !isInstitutionalEmail(adminEmail)) {
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 500);
      toast.error('Domain Verification Required', 'Please provide an official institutional email address');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const refId = `TR-${Math.floor(100000 + Math.random() * 900000)}`;

      const tenantApplication = {
        refId,
        orgType,
        orgName: orgName || 'New Institutional Tenant',
        orgCode: orgCode || 'TENANT',
        institutionType,
        primaryDomain,
        allowedDomains: allowedDomains ? allowedDomains.split(',').map((d) => d.trim()) : [], adminContact: {
          name: adminName,
          email: adminEmail,
          phone: adminPhone,
          title: adminTitle,
          department: departmentName,
        },
        location: {
          streetAddress,
          city,
          district: selectedDistrict,
          postalCode,
          country,
        },
        geofence: {
          latitude: latitude || '13.0827',
          longitude: longitude || '80.2707',
          gpsAccuracy,
          gpsAltitude,
          gpsTimestamp,
          radiusKm,
        },
        capacityAndMetrics: {
          studentCapacity: parseInt(studentCapacity || '0', 10),
          staffCount: parseInt(staffCount || '0', 10),
          buildingCount: parseInt(buildingCount || '0', 10),
          totalFloorAreaSqFt: parseInt(totalFloorAreaSqFt || '0', 10),
          annualEnergyBudgetUsd: parseFloat(annualEnergyBudgetUsd || '0'),
          baselineEui: parseFloat(baselineEui || '110'),
          solarCapacityKw: parseFloat(solarCapacityKw || '0'),
          batteryCapacityKwh: parseFloat(batteryCapacityKwh || '0'),
          smartMetersCount: parseInt(smartMetersCount || '0', 10),
        },
        securityAndPrivacy: {
          encryptionScheme,
          databaseIsolation,
          auditRetentionPeriod,
          publicBenchmarkOptIn,
          governanceNotes,
        },
        reviewRouting: orgType === 'institution' ? `Regional Board (${selectedDistrict})` : 'Platform Admin Authority',
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(`tenant_req_${refId}`, JSON.stringify(tenantApplication));
        localStorage.setItem('last_tenant_req_ref', refId);

        // Append to regional tenant requests store if existing
        const existingReqs = JSON.parse(localStorage.getItem('verdantiq_region_tenant_requests') || '[]');
        localStorage.setItem('verdantiq_region_tenant_requests', JSON.stringify([tenantApplication, ...existingReqs]));
      } catch {
        // Fallback
      }

      setIsSubmitting(false);
      setSubmittedRefId(refId);
      toast.success('Tenant Application Submitted', `Application Reference ID: ${refId}`);
    }, 1200);
  };

  return (
    <div
      className="relative min-h-screen font-sans text-stone-900 selection:bg-emerald-200 selection:text-emerald-950 overflow-x-hidden bg-no-repeat bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* FIXED LANDING PAGE BACKGROUND WITH 10% TRANSPARENCY OVERLAY */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-90"
        style={{
          backgroundImage: "url('/login-bg.png')",
        }}
      />
      <div className="fixed inset-0 bg-stone-950/10 backdrop-blur-[0.5px] pointer-events-none z-0" />

      {/* MAIN CONTENT WRAPPER (NO HEADER / NO NAVBAR / NO ROLE SWITCHER) */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-16 pb-20 pt-10">

        {/* HERO SECTION - ARCHITECTURAL DISPLAY */}
        <section className="relative pt-4 sm:pt-8 text-center sm:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: VISUAL CONTAINER */}
            <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
              <div className="absolute -inset-3 rounded-[36px] border border-emerald-400/50 pointer-events-none rotate-1 hidden sm:block" />

              <div className="relative bg-[#0F172A] text-white p-6 sm:p-8 rounded-[32px] border border-slate-800 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SPRING BOOT TENANT GATEWAY</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-emerald-300 font-bold">
                    200 OK READY
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-[4/3] shadow-inner bg-slate-900">
                  <Image
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1200&auto=format&fit=crop"
                    alt="VerdantIQ Environmental Telemetry"
                    fill
                    className="object-cover object-center"
                    priority
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1.5 text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/50 text-emerald-300 text-[11px] font-mono font-bold backdrop-blur-md">
                      <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                      <span>XGBoost & GPS Geofence Engine</span>
                    </div>
                    <div className="text-sm font-bold text-white font-editorial">
                      Real-Time GPS Footprint & Multi-Tenant Provisioning
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-left">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                    <div className="text-[10px] text-slate-400">Jurisdiction Scope</div>
                    <div className="font-bold text-white">Dynamic Regional Districts</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                    <div className="text-[10px] text-slate-400">Database Engine</div>
                    <div className="font-bold text-emerald-400">Isolated Schemas</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: HEADLINE & BRIEFING */}
            <div className="space-y-6 text-left">
              <Badge variant="emerald" dot className="px-4 py-1.5 text-xs bg-emerald-100 text-emerald-950 border-emerald-300 font-mono">
                VERDANTIQ ENTERPRISE ESG & REGIONAL GOVERNANCE
              </Badge>

              <h1 className="font-editorial text-4xl sm:text-6xl font-black text-stone-950 tracking-tight leading-[1.08]">
                Enterprise campus & regional tenant <br />
                <span className="text-emerald-700 underline decoration-emerald-300 decoration-4 underline-offset-8">
                  provisioning system.
                </span>
              </h1>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
                Register your institution, regional board, or corporate campus to provision isolated Spring Boot microservices, real-time GPS geofenced IoT telemetry, and domain-based student/staff verification.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a
                  href="#tenant-request-section"
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-8 h-14 rounded-full text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Register Organization Tenant</span>
                  <ArrowRight className="h-5 w-5" />
                </a>

                <Link
                  href="/login"
                  className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-8 h-14 rounded-full text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Access Auth Portal</span>
                  <ShieldCheck className="h-5 w-5" />
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* MAIN TENANT REQUEST ONBOARDING SECTION (MOVED DIRECTLY TO LANDING PAGE) */}
        {/* ========================================================================= */}
        <section id="tenant-request-section" className="relative pt-8">
          <div className="bg-white border border-stone-300 rounded-3xl p-6 sm:p-10 shadow-xl space-y-10">
            
            {/* SECTION HEADER */}
            <div className="space-y-3 border-b border-stone-200 pb-6">
              <div className="flex items-center gap-2">
                <Badge variant="emerald" dot className="px-3 py-1 text-xs">
                  Pre-Auth Tenant Onboarding Portal
                </Badge>
                <span className="text-xs font-mono text-stone-500">Form ID: TR-LANDING-2026</span>
              </div>
              
              <h2 className="font-editorial text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                Register Your Tenant Organization
              </h2>
              <p className="text-sm text-stone-600 max-w-3xl">
                Complete this comprehensive tenant onboarding questionnaire to request a dedicated, isolated VerdantIQ tenant environment. Captures organizational classification, domain verification taxonomy, real-time GPS coordinates, capacity metrics, and privacy/encryption options.
              </p>
            </div>

            {/* SUBMITTED CONFIRMATION BANNER */}
            {submittedRefId && (
              <div className="p-6 rounded-2xl bg-emerald-900 text-white space-y-4 shadow-xl border border-emerald-600">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-editorial text-xl font-bold">Tenant Request Submitted Successfully!</h3>
                    <p className="text-xs text-emerald-200">
                      Application Reference ID: <strong className="font-mono text-white text-sm">{submittedRefId}</strong>
                    </p>
                  </div>
                </div>
                <p className="text-xs text-emerald-100">
                  Your tenant request has been logged and routed for regional administrator review. You can check status anytime or sign in when approved.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setSubmittedRefId(null)}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-white text-emerald-950 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
                  >
                    Go to Sign In Portal
                  </Link>
                </div>
              </div>
            )}

            {/* MAIN FORM */}
            <form onSubmit={handleSubmitTenantRequest} className="space-y-10">
              
              {/* QUESTIONNAIRE BLOCK 1: ORGANIZATION CATEGORY & IDENTITY */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> 1. Organization Classification & Identity
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">Tier Selection</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { key: 'institution', label: 'Academic Institution', desc: 'University, College, or School' },
                    { key: 'region', label: 'Regional Board', desc: 'District Authority or Grid Board' },
                    { key: 'corporate', label: 'Corporate Campus', desc: 'Private Enterprise Facility' },
                    { key: 'lab', label: 'Research Institute', desc: 'R&D Park or Science Center' },
                    { key: 'government', label: 'Government Dept', desc: 'Public Infrastructure Agency' },
                  ].map((tier) => (
                    <button
                      key={tier.key}
                      type="button"
                      onClick={() => setOrgType(tier.key as any)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        orgType === tier.key
                          ? 'bg-emerald-950 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs mb-1">{tier.label}</div>
                        <p className="text-[10px] opacity-80">{tier.desc}</p>
                      </div>
                      <div className="mt-3 text-[10px] font-mono text-emerald-400 font-bold">
                        {orgType === tier.key ? '✓ Selected' : 'Select'}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Official Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anna University College of Engineering"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Short Code / Acronym *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AU-CEG"
                      value={orgCode}
                      onChange={(e) => setOrgCode(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Institution Type / Sub-Tier
                    </label>
                    <select
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                    >
                      <option value="State University / Deemed University">State University / Deemed University</option>
                      <option value="Autonomous Engineering College">Autonomous Engineering College</option>
                      <option value="Arts & Science College">Arts & Science College</option>
                      <option value="Polytechnic & Vocational Institute">Polytechnic & Vocational Institute</option>
                      <option value="Corporate R&D Campus">Corporate R&D Campus</option>
                      <option value="Regional Energy District Board">Regional Energy District Board</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Primary Institutional Domain
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. annauniv.edu"
                      value={primaryDomain}
                      onChange={(e) => setPrimaryDomain(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                    Allowed Email Domains for Student & Staff Auto-Verification (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. annauniv.edu, student.annauniv.edu, ceg.edu"
                    value={allowedDomains}
                    onChange={(e) => setAllowedDomains(e.target.value)}
                    className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <p className="text-[11px] text-stone-500">
                    Users registering with emails matching these domains are automatically mapped to this tenant&apos;s role taxonomy.
                  </p>
                </div>
              </div>

              {/* QUESTIONNAIRE BLOCK 2: PRIMARY ADMIN CONTACT */}
              <div className="space-y-6 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="h-4 w-4" /> 2. Primary Administrative Contact
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">Tenant Administrator</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Admin Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Helena Vance"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Official Admin Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="e.g. admin@annauniv.edu"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className={`w-full h-11 pl-3.5 pr-10 text-xs bg-stone-50 border rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                          shakeEmail ? 'animate-shake border-red-500 ring-2 ring-red-500/20' : 'border-stone-300'
                        }`}
                      />
                      {adminEmail && isInstitutionalEmail(adminEmail) && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Direct Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98400 12345"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Designation / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chief Sustainability Officer / Registrar"
                      value={adminTitle}
                      onChange={(e) => setAdminTitle(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Department / Administrative Division
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Office of Campus Governance & Infrastructure"
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* QUESTIONNAIRE BLOCK 3: PHYSICAL LOCATION & REGIONAL JURISDICTION */}
              <div className="space-y-6 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> 3. Physical Address & Regional Jurisdiction
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">Geographic Board</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Campus Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sardar Patel Road, Guindy"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      City / Municipality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Target District Board Jurisdiction *
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer font-semibold"
                    >
                      {getRegionalDistricts().map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} ({d.zone} Zone)
                        </option>
                      ))}
                      <option value="Global / International Jurisdiction">Global / Other Jurisdiction</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Postal Code / ZIP
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 600025"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="India"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* QUESTIONNAIRE BLOCK 4: REAL-TIME GPS GEOFENCE REQUEST (DEVICE LOCATION CAPTURE) */}
              <div className="space-y-6 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                    <LocateFixed className="h-4 w-4" /> 4. Real-Time GPS Geofence & Boundary Request
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">2dsphere GeoJSON Polygon</span>
                </div>

                <div className="p-6 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 space-y-6">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
                    <div>
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                        <Navigation className="h-4 w-4" /> Request Real-Time GPS Device Coordinates
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Click below to trigger live browser/device GPS request. Used to establish spatial boundary centroid for BACnet smart meters.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRequestGpsLocation}
                      disabled={isLocating}
                      className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 whitespace-nowrap"
                    >
                      {isLocating ? (
                        <>
                          <span className="h-3.5 w-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                          <span>Acquiring GPS Lock...</span>
                        </>
                      ) : (
                        <>
                          <Crosshair className="h-4 w-4 text-stone-950" />
                          <span>Get Geofence using Real Time GPS Request</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* GPS Coordinates Output Display */}
                  {latitude && longitude ? (
                    <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-mono text-emerald-300 font-bold text-xs">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>REAL-TIME GPS COORDINATES LOCKED</span>
                        </div>
                        {gpsTimestamp && (
                          <span className="text-[10px] font-mono text-emerald-400">Captured at {gpsTimestamp}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                        <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                          <span className="text-[10px] text-stone-400 block">Latitude</span>
                          <span className="font-bold text-white text-sm">{latitude}° N</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                          <span className="text-[10px] text-stone-400 block">Longitude</span>
                          <span className="font-bold text-white text-sm">{longitude}° E</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                          <span className="text-[10px] text-stone-400 block">GPS Accuracy</span>
                          <span className="font-bold text-emerald-400 text-sm">±{gpsAccuracy ?? 5} meters</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                          <span className="text-[10px] text-stone-400 block">Boundary Radius</span>
                          <span className="font-bold text-white text-sm">{radiusKm} km</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-400 flex items-center gap-3">
                      <Info className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      <span>
                        No real-time GPS locked yet. Click the button above to request real-time device location, or enter coordinates manually below.
                      </span>
                    </div>
                  )}

                  {gpsError && (
                    <div className="p-3 rounded-xl bg-red-950/80 border border-red-600/60 text-xs text-red-200 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                      <span>{gpsError}</span>
                    </div>
                  )}

                  {/* Manual Coordinates Input & Slider */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <label className="text-[11px] text-stone-300 block">Centroid Latitude</label>
                      <input
                        type="text"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="e.g. 13.0102"
                        className="w-full h-10 px-3 bg-stone-950 border border-stone-800 rounded-xl text-white font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-stone-300 block">Centroid Longitude</label>
                      <input
                        type="text"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="e.g. 80.2354"
                        className="w-full h-10 px-3 bg-stone-950 border border-stone-800 rounded-xl text-white font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-stone-300 block">Campus Boundary Radius (km)</label>
                      <input
                        type="text"
                        value={radiusKm}
                        onChange={(e) => setRadiusKm(e.target.value)}
                        placeholder="2.5"
                        className="w-full h-10 px-3 bg-stone-950 border border-stone-800 rounded-xl text-white font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* QUESTIONNAIRE BLOCK 5: OPERATIONAL SCALE & BASELINE METRICS */}
              <div className="space-y-6 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="h-4 w-4" /> 5. Operational Scale & Campus Energy Baseline
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">Resource Sizing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Estimated Student / Resident Population
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 18500"
                      value={studentCapacity}
                      onChange={(e) => setStudentCapacity(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Faculty & Staff Headcount
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1200"
                      value={staffCount}
                      onChange={(e) => setStaffCount(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Total Campus Buildings
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 42"
                      value={buildingCount}
                      onChange={(e) => setBuildingCount(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Total Floor Area (sq. ft)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2400000"
                      value={totalFloorAreaSqFt}
                      onChange={(e) => setTotalFloorAreaSqFt(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Annual Energy Budget (USD / INR)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 450000"
                      value={annualEnergyBudgetUsd}
                      onChange={(e) => setAnnualEnergyBudgetUsd(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Baseline EUI (kBtu / sq ft)
                    </label>
                    <input
                      type="text"
                      placeholder="110"
                      value={baselineEui}
                      onChange={(e) => setBaselineEui(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Rooftop Solar Array Capacity (kW)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 850"
                      value={solarCapacityKw}
                      onChange={(e) => setSolarCapacityKw(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Storage Battery Capacity (kWh)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1200"
                      value={batteryCapacityKwh}
                      onChange={(e) => setBatteryCapacityKwh(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Smart Meters / BACnet Nodes Count
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 120"
                      value={smartMetersCount}
                      onChange={(e) => setSmartMetersCount(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* QUESTIONNAIRE BLOCK 6: SECURITY, PRIVACY & ENCRYPTION OPTIONS */}
              <div className="space-y-6 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> 6. Security, Isolation & Encryption Preferences
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">Isolation Layer</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Tenant Encryption Scheme
                    </label>
                    <select
                      value={encryptionScheme}
                      onChange={(e) => setEncryptionScheme(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                    >
                      <option value="AES-256 Multi-Tenant Isolation">AES-256 Multi-Tenant Isolation</option>
                      <option value="RSA-4096 Dedicated Tenant Keypair">RSA-4096 Dedicated Keypair</option>
                      <option value="Quantum-Resistant Lattice Key System">Quantum-Resistant Lattice Key System</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Database Isolation Strategy
                    </label>
                    <select
                      value={databaseIsolation}
                      onChange={(e) => setDatabaseIsolation(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                    >
                      <option value="Postgres Schema Per Tenant">Postgres Schema Per Tenant</option>
                      <option value="Quarantined Firestore Multi-Project">Quarantined Firestore Multi-Project</option>
                      <option value="Row-Level Security (RLS) Shared Engine">Row-Level Security (RLS) Shared Engine</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Audit Log Retention Policy
                    </label>
                    <select
                      value={auditRetentionPeriod}
                      onChange={(e) => setAuditRetentionPeriod(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                    >
                      <option value="1 Year Compliance">1 Year Compliance</option>
                      <option value="90 Days Active">90 Days Active</option>
                      <option value="7 Years Government Statutory">7 Years Government Statutory</option>
                      <option value="Indefinite Immutable Ledger">Indefinite Immutable Ledger</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="benchmarkOptIn"
                    checked={publicBenchmarkOptIn}
                    onChange={(e) => setPublicBenchmarkOptIn(e.target.checked)}
                    className="h-4 w-4 text-emerald-800 focus:ring-emerald-600 border-stone-300 rounded cursor-pointer"
                  />
                  <label htmlFor="benchmarkOptIn" className="text-xs text-stone-700 cursor-pointer">
                    Opt-in to Regional Anonymous Benchmark Leaderboards (Enables district sustainability comparison without revealing raw student PII).
                  </label>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                    Special Operational Notes or Governance Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide any specific BACnet integration requirements, peak load restrictions, or institutional compliance mandates..."
                    value={governanceNotes}
                    onChange={(e) => setGovernanceNotes(e.target.value)}
                    className="w-full p-3.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-500 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                  <span>
                    Routing: <strong className="text-stone-900">{orgType === 'institution' ? `Regional Admin (${selectedDistrict})` : 'Platform Admin Authority'}</strong>
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-10 h-12 shadow-xl cursor-pointer min-h-[44px]"
                >
                  <span>Submit Tenant Application</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

            </form>
          </div>
        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer className="relative z-10 border-t border-stone-300 bg-[#F5F2EA] py-14 text-xs text-stone-700">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-[12px]">
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-stone-950">
                PORTALS
              </div>
              <ul className="space-y-2.5 font-sans">
                <li><Link href="/admin/telemetry" className="hover:text-stone-950">Platform Admin</Link></li>
                <li><Link href="/mlops/models" className="hover:text-stone-950">MLOps Engine</Link></li>
                <li><Link href="/audit/logs" className="hover:text-stone-950">Audit Trail</Link></li>
                <li><Link href="/region/dashboard" className="hover:text-stone-950">District Governance</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-stone-950">
                CAMPUS TIERS
              </div>
              <ul className="space-y-2.5 font-sans">
                <li><Link href="/institution/dashboard" className="hover:text-stone-950">Institution Admin</Link></li>
                <li><Link href="/dept/dashboard" className="hover:text-stone-950">Dept Moderator</Link></li>
                <li><Link href="/student/dashboard" className="hover:text-stone-950">Student Eco-League</Link></li>
                <li><Link href="/user/dashboard" className="hover:text-stone-950">Citizen Household</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-stone-950">
                STATE GOVERNANCE
              </div>
              <ul className="space-y-2.5 font-sans">
                <li><Link href="/region/domains" className="hover:text-stone-950">Regional Districts</Link></li>
                <li><Link href="/region/benchmark" className="hover:text-stone-950">Grid Carbon Caps</Link></li>
                <li><Link href="/user/devices" className="hover:text-stone-950">Household Solar</Link></li>
                <li><Link href="/admin/tenant-requests" className="hover:text-stone-950">Tenant Onboarding</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-stone-950">
                MICROSERVICES
              </div>
              <ul className="space-y-2.5 font-sans">
                <li><Link href="/admin/database" className="hover:text-stone-950">Spring Boot Provisioner</Link></li>
                <li><Link href="/mlops/optimizer" className="hover:text-stone-950">XGBoost Inference</Link></li>
                <li><Link href="/student/optimization" className="hover:text-stone-950">MILP Setpoint Solver</Link></li>
                <li><Link href="/mlops/alerts" className="hover:text-stone-950">Isolation Forest Logs</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-stone-950">
                RESOURCES
              </div>
              <ul className="space-y-2.5 font-sans">
                <li><Link href="/help" className="hover:text-stone-950">Help Center</Link></li>
                <li><Link href="/help/documentation" className="hover:text-stone-950">Documentation</Link></li>
                <li><Link href="/help/api-reference" className="hover:text-stone-950">API Reference</Link></li>
                <li><a href="#tenant-request-section" className="hover:text-stone-950">Register Campus</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-stone-950">
                SECURITY
              </div>
              <ul className="space-y-2.5 font-sans">
                <li><Link href="/security/firebase-claims" className="hover:text-stone-950">Firebase Claims</Link></li>
                <li><Link href="/security/tenant-encryption" className="hover:text-stone-950">AES-256 Encryption</Link></li>
                <li><Link href="/security/postgres-isolation" className="hover:text-stone-950">Postgres Isolation</Link></li>
                <li><Link href="/security/audit-hashes" className="hover:text-stone-950">SHA-256 Audit Hashes</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-stone-950 text-white flex items-center justify-center font-bold">
                <Leaf className="h-4 w-4 fill-white" />
              </div>
              <span className="font-editorial text-stone-950 font-bold text-sm">VerdantIQ</span>
              <span className="text-stone-600">Enterprise ESG Platform • ©2026</span>
            </div>

            <div className="flex items-center gap-4 text-stone-600">
              <a href="#" className="hover:text-stone-950"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="hover:text-stone-950"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="hover:text-stone-950"><Github className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </footer>

      {/* DEMO REQUEST MODAL */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full border border-stone-200 shadow-2xl relative space-y-6"
            >
              <button
                onClick={() => setDemoModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-2">
                <Badge variant="emerald" dot>System Walkthrough</Badge>
                <h3 className="font-editorial text-2xl font-bold text-stone-950">
                  Request a VerdantIQ Demo
                </h3>
                <p className="text-xs text-stone-600">
                  See how our Spring Boot tenant provisioner, XGBoost anomaly engine, and Regional District governance work together.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setDemoModalOpen(false); alert('Thank you! A VerdantIQ sustainability engineer will reach out shortly.'); }} className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-bold text-stone-700 block mb-1">Work Email</label>
                  <input
                    type="email"
                    placeholder="you@institution.edu"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-stone-700 block mb-1">Campus / District Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Anna University Campus"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-lg cursor-pointer"
                >
                  Schedule Demo Walkthrough
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMMAND SEARCH MODAL */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-4 max-w-lg w-full border border-stone-200 shadow-2xl space-y-3"
            >
              <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                <Search className="h-5 w-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Type a command or search capabilities..."
                  className="w-full text-sm focus:outline-none font-sans"
                  autoFocus
                />
                <button onClick={() => setSearchModalOpen(false)} className="text-xs text-stone-400 hover:text-stone-800">
                  ESC
                </button>
              </div>

              <div className="space-y-1 text-xs font-mono text-stone-600">
                <div className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-950 cursor-pointer flex items-center justify-between" onClick={() => { setSearchModalOpen(false); router.push('/region/dashboard'); }}>
                  <span>Go to District Governance</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
                <div className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-950 cursor-pointer flex items-center justify-between" onClick={() => { setSearchModalOpen(false); router.push('/mlops/models'); }}>
                  <span>Go to MLOps AI Model Registry</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
                <div className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-950 cursor-pointer flex items-center justify-between" onClick={() => { setSearchModalOpen(false); router.push('/login'); }}>
                  <span>Go to Auth Portal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
