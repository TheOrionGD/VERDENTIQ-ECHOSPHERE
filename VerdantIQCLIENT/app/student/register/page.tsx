'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { isInstitutionalEmail } from '@/lib/utils';
import {
  UserCheck,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Sparkles,
  ShieldCheck,
  Clock,
  Send,
  Home,
  Cpu,
  Flame,
  Layers,
} from 'lucide-react';

export default function StudentRegisterPage() {
  const { user } = useAuth();
  const [emailInput, setEmailInput] = useState<string>('mchen24@cs.pacific.edu');
  const [batchYear, setBatchYear] = useState<string>('Class of 2026 (Senior Year)');
  const [digitalTwinChoice, setDigitalTwinChoice] = useState<'dorm' | 'off_campus'>('dorm');
  const [isFirebaseVerified, setIsFirebaseVerified] = useState<boolean>(true);

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'exact_subdomain' | 'bare_institution' | 'unmatched_moderator' | 'override_submitted';
    institution?: string;
    department?: string;
    ticketId?: string;
  }>({ status: 'idle' });

  const [selectedBareDept, setSelectedBareDept] = useState<string>('Computer Science & Engineering');
  const [moderatorNote, setModeratorNote] = useState<string>('');
  const [shakeEmail, setShakeEmail] = useState<boolean>(false);

  const handleRunVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.includes('@')) {
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 500);
      return;
    }

    setIsVerifying(true);
    setVerificationResult({ status: 'idle' });

    setTimeout(() => {
      setIsVerifying(false);
      const lower = emailInput.toLowerCase();
      
      // Exact subdomain match e.g. cs.pacific.edu or ece.stanford.edu
      if (lower.includes('cs.') || lower.includes('ece.') || lower.includes('env.')) {
        setVerificationResult({
          status: 'exact_subdomain',
          institution: 'Pacific State University',
          department: lower.includes('cs.')
            ? 'Computer Science & Engineering'
            : lower.includes('ece.')
            ? 'Electrical & Microgrid Systems'
            : 'Environmental Science & Policy',
        });
      } 
      // Bare institution match e.g. @pacific.edu or @stanford.edu
      else if (lower.endsWith('.edu') || lower.includes('institution.org') || lower.includes('.ac.uk')) {
        setVerificationResult({
          status: 'bare_institution',
          institution: 'Pacific State University',
        });
      } 
      // Unmatched domain -> route to Department Moderator
      else {
        setVerificationResult({
          status: 'unmatched_moderator',
          institution: 'Unregistered Domain',
          ticketId: `DEPT-MOD-${Math.floor(1000 + Math.random() * 9000)}`,
        });
      }
    }, 800);
  };

  const handleConfirmBareDept = () => {
    setVerificationResult({
      status: 'exact_subdomain',
      institution: 'Pacific State University',
      department: selectedBareDept,
    });
  };

  const handleSubmitModeratorOverride = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationResult({
      status: 'override_submitted',
      institution: 'Pending Moderator Review',
      department: selectedBareDept,
      ticketId: `DEPT-MOD-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-stone-200/90 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="h-5 w-5 text-emerald-800" />
            <Badge variant="emerald">Academic Domain & Registry Protocol</Badge>
          </div>
          <h1 className="font-editorial text-2xl font-bold text-stone-900">
            Student Domain Verification Portal
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            College email domain check maps your institution, department, batch cohort, and dorm digital twin node.
          </p>
        </div>

        {/* Firebase Auth Email Banner */}
        <div className="p-4 rounded-2xl bg-emerald-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Firebase Auth Email Verification</span>
                <Badge variant="emerald" size="xs">Confirmed Address</Badge>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                The domain registry check runs on a Firebase-verified email address before department auto-mapping.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFirebaseVerified(!isFirebaseVerified)}
            className="text-[11px] font-mono text-emerald-300 underline cursor-pointer hover:text-white self-start sm:self-auto"
          >
            {isFirebaseVerified ? 'Simulate Unverified' : 'Simulate Verified'}
          </button>
        </div>

        {/* Registration Form Card */}
        <Card className="border border-stone-200 bg-white/90 shadow-xs">
          <CardHeader className="border-b border-stone-100 pb-3">
            <CardTitle className="text-base text-stone-900 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-700" />
              <span>Step 1: College Email & Domain Registry Check</span>
            </CardTitle>
            <CardDescription>
              Exact subdomain auto-assigns department; bare institution domain prompts manual department picker; unmatched domain routes to Department Moderator.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <form onSubmit={handleRunVerification} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    College / University Email
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex.student@cs.pacific.edu"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className={`w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono bg-stone-50 transition-colors ${
                        shakeEmail ? 'animate-shake border-red-500 ring-2 ring-red-500/20' : 'border-stone-300'
                      }`}
                    />
                    {isFirebaseVerified && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 absolute right-3 top-3" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Batch / Year Cohort Auto-Tag
                  </label>
                  <select
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-300 bg-white font-sans"
                  >
                    <option value="Class of 2026 (Senior Year)">Class of 2026 (Senior Year)</option>
                    <option value="Class of 2027 (Junior Year)">Class of 2027 (Junior Year)</option>
                    <option value="Class of 2028 (Sophomore Year)">Class of 2028 (Sophomore Year)</option>
                    <option value="Class of 2029 (Freshman Year)">Class of 2029 (Freshman Year)</option>
                    <option value="Postgraduate / PhD Researcher">Postgraduate / PhD Researcher</option>
                  </select>
                </div>
              </div>

              {/* Digital Twin Preference Setup */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-900 block">Initial Digital Twin Housing Profile</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDigitalTwinChoice('dorm')}
                    className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center gap-2 cursor-pointer transition-all ${
                      digitalTwinChoice === 'dorm'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Cpu className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                    <div>
                      <div>On-Campus Dorm / Hostel</div>
                      <div className="text-[10px] text-stone-500 font-normal">Founders Hall Room Node</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDigitalTwinChoice('off_campus')}
                    className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center gap-2 cursor-pointer transition-all ${
                      digitalTwinChoice === 'off_campus'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Home className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                    <div>
                      <div>Off-Campus Apartment</div>
                      <div className="text-[10px] text-stone-500 font-normal">Private / Shared House</div>
                    </div>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isVerifying}
                variant="primary"
                size="sm"
                className="w-full gap-2 cursor-pointer py-2.5 text-xs font-semibold"
              >
                {isVerifying ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>Cross-Checking Registry & Subdomain Records...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Run Institutional Domain Auto-Match</span>
                  </>
                )}
              </Button>
            </form>

            {/* Case 1: Exact Subdomain Match */}
            {verificationResult.status === 'exact_subdomain' && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-700 flex-shrink-0" />
                  <span>Exact Subdomain Auto-Matched!</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-emerald-200/80 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Institution:</span>
                    <strong className="text-emerald-900">{verificationResult.institution}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Auto-Assigned Department:</span>
                    <strong className="text-emerald-900">{verificationResult.department}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Batch Cohort:</span>
                    <strong className="text-emerald-900">{batchYear}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Digital Twin Mode:</span>
                    <strong className="text-emerald-900">{digitalTwinChoice === 'dorm' ? 'Founders Hall Dorm' : 'Off-Campus Home'}</strong>
                  </div>
                </div>

                <p className="text-xs text-emerald-900">
                  Your academic credentials are setup and verified. Access to inter-dorm competitions, faculty research mentor endorsements, and cafeteria green credits is now active!
                </p>
              </div>
            )}

            {/* Case 2: Bare Institution Match (Manual Dept Pick Required) */}
            {verificationResult.status === 'bare_institution' && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <Building2 className="h-5 w-5 text-amber-700 flex-shrink-0" />
                  <span>Bare Institution Domain Matched — Select Department</span>
                </div>

                <p className="text-xs text-amber-900">
                  Your email matched institution domain ({verificationResult.institution}), but sub-department routing was ambiguous. Please declare your official department:
                </p>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-800">Department Selection</label>
                  <select
                    value={selectedBareDept}
                    onChange={(e) => setSelectedBareDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white font-mono"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Environmental Science & Policy">Environmental Science & Policy</option>
                    <option value="Mechanical & Thermal Engineering">Mechanical & Thermal Engineering</option>
                    <option value="Electrical & Microgrid Systems">Electrical & Microgrid Systems</option>
                    <option value="Biology & Ecosystem Dynamics">Biology & Ecosystem Dynamics</option>
                  </select>
                </div>

                <Button onClick={handleConfirmBareDept} variant="primary" size="sm" className="gap-2 cursor-pointer text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Confirm Department Assignment</span>
                </Button>
              </div>
            )}

            {/* Case 3: Unmatched Domain -> Department Moderator Routing */}
            {verificationResult.status === 'unmatched_moderator' && (
              <div className="p-5 rounded-2xl bg-stone-100 border border-stone-300 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <span>Unmatched Domain — Route to Department Moderator</span>
                </div>

                <p className="text-xs text-stone-700">
                  Your email domain ({emailInput}) is not currently listed in the institutional registry. Submit a manual review request to your Department Moderator:
                </p>

                <form onSubmit={handleSubmitModeratorOverride} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Target Department</label>
                    <select
                      value={selectedBareDept}
                      onChange={(e) => setSelectedBareDept(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-sans"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Environmental Science & Policy">Environmental Science & Policy</option>
                      <option value="Mechanical & Thermal Engineering">Mechanical & Thermal Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Verification Note / Student ID</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Student ID #9821034, enrolled in Dr. Aris Thorne's lab class..."
                      value={moderatorNote}
                      onChange={(e) => setModeratorNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="sm" className="gap-2 cursor-pointer text-xs">
                    <Send className="h-4 w-4" />
                    <span>Submit Manual Review Ticket to Department Moderator</span>
                  </Button>
                </form>
              </div>
            )}

            {/* Case 4: Moderator Review Ticket Submitted */}
            {verificationResult.status === 'override_submitted' && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                    <Clock className="h-5 w-5 text-amber-700" />
                    <span>Manual Override Ticket Pending Moderator Approval</span>
                  </div>
                  <Badge variant="amber" className="font-mono">{verificationResult.ticketId}</Badge>
                </div>

                <p className="text-xs text-amber-900 leading-relaxed">
                  Your manual verification request has been routed to Dr. Aris Thorne (Department Moderator). Provisional student access is active while your student ID document is reviewed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
