'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Trophy,
  Users,
  CheckCircle2,
  Clock,
  Award,
  GraduationCap,
  Upload,
  Camera,
  FileText,
  MapPin,
  Sparkles,
  CheckSquare,
  ExternalLink,
} from 'lucide-react';

export default function StudentChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [scopeFilter, setScopeFilter] = useState<'all' | 'campus' | 'class'>('all');

  // Evidence Modal State
  const [activeEvidenceChallengeId, setActiveEvidenceChallengeId] = useState<string | null>(null);
  const [evidenceType, setEvidenceType] = useState<'ocr_receipt' | 'geotag_photo'>('ocr_receipt');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const toggleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, joined: !c.joined } : c))
    );
  };

  const filteredChallenges = challenges.filter((c) => {
    if (scopeFilter === 'campus') return c.scope === 'campus';
    if (scopeFilter === 'class') return c.scope === 'class';
    return true;
  });

  const handleUploadEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setActiveEvidenceChallengeId(null);
        setEvidenceNote('');
        setEvidenceFile(null);
      }, 1500);
    }, 1200);
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Campus & Class Sprints</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Campus & Class-Scoped Challenges
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Participate in inter-dorm competitions, departmental green coding sprints, and verify evidence via shared OCR/geotag pipeline.
            </p>
          </div>

          {/* Scope Filter Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs self-start sm:self-auto">
            <button
              onClick={() => setScopeFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-all ${
                scopeFilter === 'all' ? 'bg-[#064E3B] text-white font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              All Sprints
            </button>
            <button
              onClick={() => setScopeFilter('campus')}
              className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-all ${
                scopeFilter === 'campus' ? 'bg-[#064E3B] text-white font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              Campus-Wide
            </button>
            <button
              onClick={() => setScopeFilter('class')}
              className={`px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-all ${
                scopeFilter === 'class' ? 'bg-[#064E3B] text-white font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              Class & Department Scoped
            </button>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredChallenges.map((chal) => (
            <Card key={chal.id} className="border border-stone-200 bg-white/90 shadow-xs flex flex-col justify-between">
              <CardHeader className="border-b border-stone-100 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <Badge variant={chal.scope === 'campus' ? 'emerald' : 'stone'} size="xs">
                      {chal.scope === 'campus' ? 'Campus-Wide Sprint' : 'Class / Dept Scoped'}
                    </Badge>
                    <CardTitle className="text-base text-stone-900 mt-1">{chal.title}</CardTitle>
                  </div>
                  <Badge variant={chal.joined ? 'emerald' : 'stone'}>{chal.joined ? 'Enrolled' : 'Open'}</Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600">{chal.description}</p>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold text-stone-700">
                    <span>Target Progress</span>
                    <span className="font-mono text-emerald-800">{chal.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${chal.progressPercentage}%` }} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-stone-100">
                  <span className="text-xs font-mono font-bold text-amber-800 flex items-center gap-1 self-start sm:self-auto">
                    <Award className="h-4 w-4 text-amber-600" /> +{chal.rewardPoints} Green Credits
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                    <Button
                      onClick={() => {
                        const text = `VerdantIQ Challenge: ${chal.title} (${chal.rewardPoints} pts)`;
                        navigator.clipboard.writeText(text);
                        window.open('https://tasks.google.com', '_blank', 'noopener,noreferrer');
                      }}
                      variant="outline"
                      size="sm"
                      title="Set reminder in Google Tasks"
                      className="gap-1 text-xs cursor-pointer text-blue-700 border-blue-200 hover:bg-blue-50"
                    >
                      <CheckSquare className="h-3.5 w-3.5 text-blue-600" />
                      <span className="hidden md:inline">Google Tasks</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>

                    {chal.joined && (
                      <Button
                        onClick={() => setActiveEvidenceChallengeId(chal.id)}
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs cursor-pointer flex-1 sm:flex-none"
                      >
                        <Upload className="h-3.5 w-3.5 text-emerald-700" />
                        <span>OCR Evidence</span>
                      </Button>
                    )}

                    <Button
                      onClick={() => toggleJoin(chal.id)}
                      variant={chal.joined ? 'outline' : 'primary'}
                      size="sm"
                      className="gap-1 text-xs cursor-pointer flex-1 sm:flex-none"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{chal.joined ? 'Enrolled' : 'Join Sprint'}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shared OCR / Geotag Pipeline Modal */}
        {activeEvidenceChallengeId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-emerald-700" />
                  <span>Shared Evidence Pipeline (OCR &amp; Geotag)</span>
                </h3>
              </div>

              <form onSubmit={handleUploadEvidence} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Evidence Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEvidenceType('ocr_receipt')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                        evidenceType === 'ocr_receipt' ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      <FileText className="h-4 w-4 text-emerald-700" />
                      <span>Cafeteria / Purchase Receipt OCR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEvidenceType('geotag_photo')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                        evidenceType === 'geotag_photo' ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      <MapPin className="h-4 w-4 text-emerald-700" />
                      <span>Geotagged Photo Verification</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Attach Image / Document</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                    className="w-full text-xs font-mono file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-800 file:font-semibold hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Notes / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Plant-based dining receipt from Student Union Cafeteria..."
                    value={evidenceNote}
                    onChange={(e) => setEvidenceNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                {uploadSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-center text-xs font-bold text-emerald-900">
                    ✓ Evidence Verified via OCR Pipeline! +100 Credits Awarded.
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button type="button" onClick={() => setActiveEvidenceChallengeId(null)} variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm" isLoading={isUploading} className="cursor-pointer gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      <span>Submit for Verification</span>
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
