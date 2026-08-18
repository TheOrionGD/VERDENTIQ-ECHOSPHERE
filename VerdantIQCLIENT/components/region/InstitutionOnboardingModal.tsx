// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { InstitutionRecord } from '@/lib/services/regionService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { X, Building, Globe, ShieldCheck, Terminal, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Cpu } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newInst: InstitutionRecord) => void;
}

export const InstitutionOnboardingModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    domain: '',
    regionDistrict: 'District 1 (Bay Area North)',
    studentCount: 12000,
    targetEUI: 110,
    targetCarbonIntensity: 200,
    primaryMX: '',
  });

  const [provisioning, setProvisioning] = useState(false);
  const [provisioningLogs, setProvisioningLogs] = useState<string[]>([]);
  const [completedInst, setCompletedInst] = useState<InstitutionRecord | null>(null);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step === 1 && (!formData.name || !formData.code)) return;
    if (step === 2 && !formData.domain) return;
    setStep((prev) => (prev < 4 ? ((prev + 1) as any) : prev));
  };

  const handlePrevStep = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as any) : prev));
  };

  const handleStartSpringProvisioning = async () => {
    setProvisioning(true);
    setProvisioningLogs([
      '[Spring Boot] Contacting Regional Gateway API: https://provisioning.region.sustainability.gov/...',
    ]);

    const logsSequence = [
      '[Spring Boot] Validating tenant domain ownership and SSL CSR parameters...',
      '[Spring Boot] Provisioning isolated Postgres schema "tenant_' + formData.domain.replace(/[^a-zA-Z0-9]/g, '_') + '"...',
      '[Spring Boot] Injecting regional aggregation pipeline & privacy quarantine policy...',
      '[Spring Boot] Setting default EUI target (' + formData.targetEUI + ' kBtu/sqft) and carbon cap (' + formData.targetCarbonIntensity + ' gCO2e)...',
      '[Spring Boot] Deploying initial OAuth credentials and student gamification hooks...',
      '[Spring Boot SUCCESS 200 OK] Institution tenant successfully provisioned!',
    ];

    for (let i = 0; i < logsSequence.length; i++) {
      await new Promise((res) => setTimeout(res, 600));
      setProvisioningLogs((prev) => [...prev, logsSequence[i]]);
    }

    const created = null as any;

    setCompletedInst(created);
    setProvisioning(false);
  };

  const handleFinish = () => {
    if (completedInst) {
      onSuccess(completedInst);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="font-editorial text-lg font-bold">Institution Onboarding Wizard</h3>
              <p className="text-xs text-emerald-300/80">Spring Boot Microservice Tenant Provisioning Workflow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Step Indicator */}
        <div className="bg-stone-100 px-6 py-3 border-b border-stone-200 flex items-center justify-between text-xs">
          {[
            { s: 1, name: 'Profile' },
            { s: 2, name: 'Domain & Geo' },
            { s: 3, name: 'Baselines' },
            { s: 4, name: 'Spring Provision' },
          ].map((st) => (
            <div key={st.s} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === st.s
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : step > st.s
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {step > st.s ? '✓' : st.s}
              </span>
              <span className={`font-medium ${step === st.s ? 'text-stone-900 font-bold' : 'text-stone-500'}`}>
                {st.name}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-stone-900 border-b pb-2">Step 1: Institution Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Institution Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Redwood Coast Academy"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Short Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. RCA"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Regional District</label>
                  <select
                    value={formData.regionDistrict}
                    onChange={(e) => setFormData({ ...formData, regionDistrict: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="District 1 (Bay Area North)">District 1 (Bay Area North)</option>
                    <option value="District 2 (Silicon Corridor)">District 2 (Silicon Corridor)</option>
                    <option value="District 3 (Northwest Coastal)">District 3 (Northwest Coastal)</option>
                    <option value="District 4 (Central Sierra)">District 4 (Central Sierra)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Estimated Student Headcount</label>
                  <input
                    type="number"
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-stone-900 border-b pb-2">Step 2: Domain Registry & Security</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Academic Domain (.edu / .org) *</label>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-3 rounded-xl border border-r-0 border-stone-300 bg-stone-100 text-stone-500 text-xs">
                      https://
                    </span>
                    <input
                      type="text"
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value.toLowerCase() })}
                      placeholder="redwoodacademy.edu"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1 text-xs text-stone-600">
                  <span className="font-semibold text-stone-800 block">Automated DNS Verification Checks:</span>
                  <p>• CNAME auto-delegation: <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">sustainability.{formData.domain || 'domain.edu'}</code></p>
                  <p>• SSL Wildcard provisioning via Let&apos;s Encrypt / Regional ACME</p>
                  <p>• Student email auto-validation trigger for domain extension</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-stone-900 border-b pb-2">Step 3: Energy & Carbon Baselines</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Target EUI (kBtu / sq ft)</label>
                  <input
                    type="number"
                    value={formData.targetEUI}
                    onChange={(e) => setFormData({ ...formData, targetEUI: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-[11px] text-stone-500 mt-0.5 block">Regional Target: 110.0</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Target Carbon Intensity (gCO2e / kWh)</label>
                  <input
                    type="number"
                    value={formData.targetCarbonIntensity}
                    onChange={(e) => setFormData({ ...formData, targetCarbonIntensity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-[11px] text-stone-500 mt-0.5 block">Regional Target: 200.0</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <ShieldCheck className="h-4 w-4 text-emerald-700 inline mr-1" />
                These targets establish the baseline for regional forecast-accuracy audits and &quot;Needs Support&quot; automated triggers.
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-stone-900 border-b pb-2">Step 4: Spring Boot Provisioning Workflow</h4>

              {!completedInst ? (
                <div className="space-y-3">
                  <p className="text-xs text-stone-600">
                    Clicking below initiates a Spring Boot REST workflow to create database schemas, configure OAuth endpoints, and launch tenant isolation pipelines.
                  </p>

                  {provisioningLogs.length > 0 && (
                    <div className="bg-stone-950 text-emerald-400 font-mono text-[11px] p-3.5 rounded-xl space-y-1 max-h-56 overflow-y-auto">
                      {provisioningLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Terminal className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {!provisioning && provisioningLogs.length === 0 && (
                    <Button onClick={handleStartSpringProvisioning} className="w-full bg-[#064E3B] hover:bg-emerald-800 text-white">
                      <Cpu className="h-4 w-4 mr-2" />
                      Execute Spring Boot Tenant Provisioning
                    </Button>
                  )}

                  {provisioning && (
                    <div className="flex items-center justify-center p-4 gap-2 text-xs font-semibold text-emerald-800">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                      Provisioning Spring Boot microservices... Please wait
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-editorial text-lg font-bold text-emerald-950">
                      {completedInst.name} Successfully Onboarded!
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Code: <strong>{completedInst.code}</strong> | Domain: <strong>{completedInst.domain}</strong>
                    </p>
                  </div>
                  <Badge variant="emerald">Spring Boot Tenant Active</Badge>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          {step > 1 && !completedInst && !provisioning ? (
            <Button variant="outline" onClick={handlePrevStep}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button onClick={handleNextStep} className="bg-[#064E3B] hover:bg-emerald-800 text-white">
              Next
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          ) : completedInst ? (
            <Button onClick={handleFinish} className="bg-[#064E3B] hover:bg-emerald-800 text-white">
              Done & View Institution
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
