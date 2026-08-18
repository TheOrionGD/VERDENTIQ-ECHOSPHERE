// @ts-nocheck
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Globe,
  MapPin,
  Mail,
  ArrowRight,
  Leaf,
  Sparkles,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

function TenantStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const refFromQuery = searchParams.get('ref') || '';
  const [searchRef, setSearchRef] = useState(refFromQuery);

  const [appData, setAppData] = useState<any>(() => {
    let targetRef = refFromQuery;
    if (!targetRef && typeof window !== 'undefined') {
      targetRef = localStorage.getItem('last_tenant_req_ref') || '';
    }

    if (targetRef && typeof window !== 'undefined') {
      const raw = localStorage.getItem(`tenant_req_${targetRef}`);
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch (e) {
          // ignore
        }
      }
      return {
        refId: targetRef,
        orgType: 'institution',
        orgName: 'Pacific Northwest Environmental Institute',
        selectedRegion: 'West Coast District Board',
        domains: ['pnei.edu', 'pne-institute.org'],
        adminContact: {
          name: 'Dr. Helena Vance',
          email: 'h.vance@pnei.edu',
          title: 'Chief Sustainability Officer',
        },
        geofence: { latitude: '47.6062', longitude: '-122.3321', radiusKm: '2.5' },
        reviewRouter: 'Regional Admin (West Coast District Board)',
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
    }

    return {
      refId: 'TR-849201',
      orgType: 'institution',
      orgName: 'Pacific Northwest Environmental Institute',
      selectedRegion: 'West Coast District Board',
      domains: ['pnei.edu', 'pne-institute.org'],
      adminContact: {
        name: 'Dr. Helena Vance',
        email: 'h.vance@pnei.edu',
        title: 'Chief Sustainability Officer',
      },
      geofence: { latitude: '47.6062', longitude: '-122.3321', radiusKm: '2.5' },
      reviewRouter: 'Regional Admin (West Coast District Board)',
      status: 'pending',
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    };
  });

  const [currentStatus, setCurrentStatus] = useState<'pending' | 'approved' | 'rejected'>(
    () => appData?.status || 'pending'
  );

  const loadApplication = React.useCallback((refId: string) => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(`tenant_req_${refId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setAppData(parsed);
        setCurrentStatus(parsed.status || 'pending');
      } catch (e) {
        // Fallback
      }
    } else {
      const fallback = {
        refId,
        orgType: 'institution',
        orgName: 'Pacific Northwest Environmental Institute',
        selectedRegion: 'West Coast District Board',
        domains: ['pnei.edu', 'pne-institute.org'],
        adminContact: {
          name: 'Dr. Helena Vance',
          email: 'h.vance@pnei.edu',
          title: 'Chief Sustainability Officer',
        },
        geofence: { latitude: '47.6062', longitude: '-122.3321', radiusKm: '2.5' },
        reviewRouter: 'Regional Admin (West Coast District Board)',
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      setAppData(fallback);
      setCurrentStatus('pending');
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.trim()) {
      loadApplication(searchRef.trim());
      router.push(`/tenant-request/status?ref=${encodeURIComponent(searchRef.trim())}`);
    }
  };

  const toggleStatus = (newStatus: 'pending' | 'approved' | 'rejected') => {
    setCurrentStatus(newStatus);
    if (appData) {
      const updated = { ...appData, status: newStatus };
      setAppData(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`tenant_req_${appData.refId}`, JSON.stringify(updated));
      }
      toast.success('Simulated Review Decision Updated', `Status changed to: ${newStatus.toUpperCase()}`);
    }
  };

  return (
    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between bg-stone-900/80 border border-stone-800 p-4 rounded-2xl backdrop-blur-xl">
        <Link href="/landing" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 text-stone-50 shadow-md">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <span className="font-editorial text-lg font-bold text-white block">VerdantIQ</span>
            <span className="text-[10px] font-mono text-emerald-400">Application Tracking</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/tenant-request">
            <Button variant="outline" size="sm" className="border-stone-700 text-xs text-stone-300">
              New Application
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs text-stone-300">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Reference Lookup Form */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white">Check Application Status</h2>
            <p className="text-xs text-stone-400">Enter your Tenant Request Reference ID (e.g. TR-849201)</p>
          </div>
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
          <Button type="submit" variant="secondary" size="sm" className="h-10 px-4 text-xs font-semibold">
            Track Request
          </Button>
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
              <h1 className="font-editorial text-2xl font-bold text-white">{appData.orgName}</h1>
            </div>

            <div>
              {currentStatus === 'pending' && (
                <Badge variant="amber" dot className="px-4 py-1.5 text-xs font-bold">
                  <Clock className="h-3.5 w-3.5 mr-1" /> Pending Review
                </Badge>
              )}
              {currentStatus === 'approved' && (
                <Badge variant="emerald" dot className="px-4 py-1.5 text-xs font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Tenant Provisioned
                </Badge>
              )}
              {currentStatus === 'rejected' && (
                <Badge variant="coral" dot className="px-4 py-1.5 text-xs font-bold">
                  <XCircle className="h-3.5 w-3.5 mr-1" /> Application Rejected
                </Badge>
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
                'Your application is currently queued for Spring Boot tenant provisioning and custom claim setup upon admin verification.'}
              {currentStatus === 'approved' &&
                'Your tenant workspace, MongoDB 2dsphere geofence, and Firebase custom claims mirror have been successfully provisioned.'}
              {currentStatus === 'rejected' &&
                'This application was not approved. Domain ownership or institutional registration requirements could not be verified.'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800/80 space-y-2">
              <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-emerald-400" /> Student Verification Domains
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {appData.domains?.map((d: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-mono text-[11px]">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800/80 space-y-2">
              <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-emerald-400" /> Admin Contact Invite
              </div>
              <div className="text-stone-200 font-semibold">{appData.adminContact?.name}</div>
              <div className="text-stone-400 text-[11px]">{appData.adminContact?.title} • {appData.adminContact?.email}</div>
            </div>

            <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800/80 space-y-2 sm:col-span-2">
              <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" /> Provisioned GeoJSON Geofence
              </div>
              <div className="font-mono text-[11px] text-stone-300">
                Center: [{appData.geofence?.latitude}° N, {appData.geofence?.longitude}° W] • Radius: {appData.geofence?.radiusKm} km
              </div>
            </div>
          </div>

          {/* Next Steps CTA on Approval */}
          {currentStatus === 'approved' && (
            <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-600/60 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Tenant Active — Next Steps for Admin</span>
              </div>
              <p className="text-xs text-stone-300">
                An invitation email was issued to <code className="text-emerald-300 font-mono">{appData.adminContact?.email}</code>. You can log in using Firebase Authentication to access your Institution Dashboard.
              </p>
              <Link href="/login">
                <Button variant="primary" size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold mt-1">
                  Proceed to Sign In <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}

          {/* Dev Test Switcher: Toggle Review Decision */}
          <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-stone-500 text-[11px] flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5 text-amber-400" /> Dev Simulation Control:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleStatus('pending')}
                className={`px-3 py-1 rounded-lg text-[11px] border cursor-pointer ${
                  currentStatus === 'pending'
                    ? 'bg-amber-950 text-amber-300 border-amber-600'
                    : 'bg-stone-950 text-stone-400 border-stone-800'
                }`}
              >
                Set Pending
              </button>
              <button
                onClick={() => toggleStatus('approved')}
                className={`px-3 py-1 rounded-lg text-[11px] border cursor-pointer ${
                  currentStatus === 'approved'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-stone-950 text-stone-400 border-stone-800'
                }`}
              >
                Simulate Approval
              </button>
              <button
                onClick={() => toggleStatus('rejected')}
                className={`px-3 py-1 rounded-lg text-[11px] border cursor-pointer ${
                  currentStatus === 'rejected'
                    ? 'bg-red-950 text-red-300 border-red-600'
                    : 'bg-stone-950 text-stone-400 border-stone-800'
                }`}
              >
                Simulate Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TenantStatusPage() {
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
      <Suspense fallback={<div className="text-center text-white p-12 relative z-10">Loading status...</div>}>
        <TenantStatusContent />
      </Suspense>
    </div>
  );
}
