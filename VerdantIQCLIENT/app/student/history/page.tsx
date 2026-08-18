// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  History,
  Download,
  Search,
  Filter,
  GraduationCap,
  ShieldCheck,
  FileCheck,
  Archive,
  Info,
} from 'lucide-react';

export default function StudentHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isOffboardingModalOpen, setIsOffboardingModalOpen] = useState(false);
  const [offboardingStep, setOffboardingStep] = useState<'idle' | 'exported' | 'anonymized'>('idle');

  const filteredItems = [].filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Category', 'Title', 'Details', 'kWh Delta', 'Carbon Delta (kg)', 'Points Delta'];
    const rows = filteredItems.map((item) => [
      item.id,
      `"${item.timestamp}"`,
      `"${item.category}"`,
      `"${item.title}"`,
      `"${item.details}"`,
      item.kwhDelta ?? '',
      item.carbonDeltaKg ?? '',
      item.pointsDelta ?? '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `verdantiq_student_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <RoleSubNav />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Student Audit Trail &amp; Offboarding</Badge>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Campus Log History &amp; Offboarding Protocol
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Full activity logs, CSV data export, and graduation/transfer data retention policy manager.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button onClick={() => setIsOffboardingModalOpen(true)} variant="outline" size="sm" className="gap-2 cursor-pointer">
              <GraduationCap className="h-4 w-4 text-emerald-700" />
              <span>Graduation / Transfer Offboard</span>
            </Button>
            <Button onClick={handleExportCSV} variant="primary" size="sm" className="gap-2 cursor-pointer">
              <Download className="h-4 w-4" />
              <span>Export CSV Log</span>
            </Button>
          </div>
        </div>

        {/* Graduation / Transfer Offboarding Banner */}
        <div className="p-4 rounded-2xl bg-stone-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center font-bold flex-shrink-0">
              <Archive className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Academic Data Retention &amp; Alumni Transition Policy</span>
                <Badge variant="emerald" size="xs">30-Day Window</Badge>
              </div>
              <p className="text-xs text-stone-300">
                Upon graduation or transfer, research project credits and dorm twin logs are archived. Your account transitions to Alumni status after a 30-day retention grace period.
              </p>
            </div>
          </div>

          <Button onClick={() => setIsOffboardingModalOpen(true)} variant="secondary" size="sm" className="whitespace-nowrap text-xs cursor-pointer">
            Manage Data Retention
          </Button>
        </div>

        {/* Table Card */}
        <Card className="border border-stone-200 bg-white/90 shadow-xs">
          <CardHeader className="border-b border-stone-100 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="h-4 w-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search campus logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Filter className="h-3.5 w-3.5 text-stone-500" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Energy">Energy</option>
                  <option value="Optimization">Optimization</option>
                  <option value="Device">Device</option>
                  <option value="Challenge">Challenge</option>
                  <option value="Reward">Reward</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono text-[11px]">
                  <th className="p-3 pl-6">Timestamp</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Title &amp; Details</th>
                  <th className="p-3 text-right">kWh Impact</th>
                  <th className="p-3 text-right">Carbon Delta</th>
                  <th className="p-3 pr-6 text-right">Credits Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3 pl-6 font-mono text-stone-400 text-[11px] whitespace-nowrap">{item.timestamp}</td>
                    <td className="p-3 whitespace-nowrap">
                      <Badge variant="stone" size="xs">{item.category}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{item.title}</div>
                      <div className="text-[11px] text-stone-500">{item.details}</div>
                    </td>
                    <td className="p-3 text-right font-mono text-stone-700 font-semibold">
                      {item.kwhDelta ? `${item.kwhDelta} kWh` : '-'}
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-800 font-semibold">
                      {item.carbonDeltaKg ? `${item.carbonDeltaKg} kg` : '-'}
                    </td>
                    <td className="p-3 pr-6 text-right font-mono font-bold text-emerald-700">
                      {item.pointsDelta ? `+${item.pointsDelta} pts` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Graduation Offboarding Modal */}
        {isOffboardingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-emerald-700" />
                  <span>Graduation &amp; Transfer Offboarding</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs text-stone-700">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-950 block">30-Day Data Retention Policy</span>
                  <p className="text-emerald-900 leading-relaxed">
                    All faculty-mentored research papers and dorm energy records remain accessible for 30 days after student status expiration. After 30 days, personal identifiers are anonymized.
                  </p>
                </div>

                {offboardingStep === 'idle' && (
                  <div className="space-y-2">
                    <p className="font-semibold text-stone-800">Select Offboarding Action:</p>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        onClick={() => {
                          handleExportCSV();
                          setOffboardingStep('exported');
                        }}
                        variant="primary"
                        size="sm"
                        className="w-full gap-2 text-xs cursor-pointer justify-start"
                      >
                        <Download className="h-4 w-4" />
                        <span>1. Download Full Research &amp; Activity Portfolio (JSON/CSV)</span>
                      </Button>

                      <Button
                        onClick={() => setOffboardingStep('anonymized')}
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 text-xs cursor-pointer justify-start text-stone-700"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-700" />
                        <span>2. Convert Account to Alumni Mode (Anonymize Dorm Telemetry)</span>
                      </Button>
                    </div>
                  </div>
                )}

                {offboardingStep === 'exported' && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold">
                    ✓ Research Portfolio Downloaded! You can now convert your account to Alumni status.
                  </div>
                )}

                {offboardingStep === 'anonymized' && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold">
                    ✓ Alumni Transition Queued. Your personal dorm telemetry will be anonymized in 30 days.
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2 border-t border-stone-200">
                <Button onClick={() => { setIsOffboardingModalOpen(false); setOffboardingStep('idle'); }} variant="outline" size="sm">
                  Close Manager
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
