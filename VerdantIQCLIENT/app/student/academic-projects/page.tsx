'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  GraduationCap,
  BookOpen,
  Plus,
  ExternalLink,
  Award,
  CheckCircle2,
  Sparkles,
  Tag,
  UserCheck,
} from 'lucide-react';
import { AcademicProject } from '@/lib/services/userDataService';

export default function StudentAcademicProjectsPage() {
  const [projects, setProjects] = useState<AcademicProject[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Form state
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [facultyMentor, setFacultyMentor] = useState('Dr. Aris Thorne');
  const [impactMetric, setImpactMetric] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !abstract) return;

    const newProj: AcademicProject = {
      id: `proj_${Date.now()}`,
      title,
      studentName: 'Marcus Chen',
      studentEmail: 'mchen24@cs.pacific.edu',
      department: 'Computer Science & Environmental Engineering',
      abstract,
      repoUrl: repoUrl || 'https://github.com/pacific-cs/green-compute',
      facultyMentor,
      impactMetric: impactMetric || '-1.5 MWh/yr Compute Optimization',
      status: 'in_review',
      createdAt: new Date().toISOString().split('T')[0],
      submittedDate: 'Just now',
      peerEndorsementsCount: 1,
    };

    setProjects([newProj, ...projects]);
    setTitle('');
    setAbstract('');
    setRepoUrl('');
    setImpactMetric('');
    setIsSubmitModalOpen(false);
  };

  const handleEndorse = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, peerEndorsementsCount: (p.peerEndorsementsCount || 1) + 1 } : p
      )
    );
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Faculty-Mentored Research</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Academic Research & Sustainability Projects
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Link campus thesis projects, green computing algorithm papers, and faculty-endorsed sustainability research.
            </p>
          </div>

          <Button
            onClick={() => setIsSubmitModalOpen(true)}
            variant="primary"
            size="sm"
            className="gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Submit Academic Project</span>
          </Button>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <Card key={proj.id} className="border border-stone-200 bg-white/90 shadow-xs flex flex-col justify-between">
              <CardHeader className="border-b border-stone-100 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={proj.status === 'approved' || proj.status === 'featured' ? 'emerald' : 'stone'} size="xs">
                    {proj.status === 'approved' || proj.status === 'featured' ? 'Faculty Endorsed' : 'Under Peer Review'}
                  </Badge>
                  <span className="text-[10px] font-mono text-stone-400">{proj.submittedDate || proj.createdAt}</span>
                </div>
                <CardTitle className="text-base font-bold text-stone-900 mt-2">{proj.title}</CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 leading-relaxed">{proj.abstract}</p>

                <div className="space-y-2 pt-2 border-t border-stone-100 font-mono text-xs">
                  <div className="flex items-center justify-between text-stone-700">
                    <span className="flex items-center gap-1.5 font-sans font-bold">
                      <UserCheck className="h-4 w-4 text-emerald-700" /> Faculty Mentor:
                    </span>
                    <strong className="text-emerald-900">{proj.facultyMentor}</strong>
                  </div>

                  <div className="flex items-center justify-between text-stone-700">
                    <span className="flex items-center gap-1.5 font-sans font-bold">
                      <Award className="h-4 w-4 text-amber-600" /> Measured Impact:
                    </span>
                    <strong className="text-emerald-800">{proj.impactMetric}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-800 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Repository / Dataset
                  </a>

                  <Button
                    onClick={() => handleEndorse(proj.id)}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <span>Peer Endorse ({proj.peerEndorsementsCount || 1})</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Research Modal */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-emerald-700" />
                  <span>Submit Academic Research Project</span>
                </h3>
              </div>

              <form onSubmit={handleAddProject} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Energy-Efficient Transformer Inference Benchmarks"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Abstract / Executive Summary</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Brief description of methodology, dataset, and carbon savings..."
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Tag Faculty Mentor</label>
                    <select
                      value={facultyMentor}
                      onChange={(e) => setFacultyMentor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    >
                      <option value="Dr. Aris Thorne">Dr. Aris Thorne (CS Dept)</option>
                      <option value="Prof. Elena Vance">Prof. Elena Vance (Env Sci)</option>
                      <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Thermal Eng)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Measured Impact Metric</label>
                    <input
                      type="text"
                      placeholder="e.g. -2.4 kWh per 1k queries"
                      value={impactMetric}
                      onChange={(e) => setImpactMetric(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">GitHub / Paper URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/user/research-repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" onClick={() => setIsSubmitModalOpen(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Submit for Endorsement
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
