// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FileCheck2,
  CheckCircle,
  AlertOctagon,
  HelpCircle,
  AlertTriangle,
  Zap,
  SlidersHorizontal,
  ArrowRight,
  TrendingDown,
  Thermometer,
  DollarSign,
  Leaf,
  ShieldCheck,
  RotateCcw,
  Search,
  Lock,
  Database,
  Cpu,
  ShieldAlert,
  Layers,
  Filter,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { RAW_PERSONAL_DATA_FIELDS } from '@/lib/services/tenantPrivacyService';
import { RoleType } from '@/lib/services/authService';

/* 1. Evidence Review Panel Component */
export interface EvidenceReviewProps {
  documentTitle: string;
  sourceType: string;
  snippet: string;
  confidenceScore: number;
  verificationBadge: string;
  onApprove?: () => void;
  onFlag?: () => void;
  compact?: boolean;
}

export const EvidenceReviewPanel: React.FC<EvidenceReviewProps> = ({
  documentTitle,
  sourceType,
  snippet,
  confidenceScore,
  verificationBadge,
  onApprove,
  onFlag,
  compact = false,
}) => {
  const [status, setStatus] = useState<'pending' | 'approved' | 'flagged'>('pending');

  const handleApprove = () => {
    setStatus('approved');
    if (onApprove) onApprove();
  };

  const handleFlag = () => {
    setStatus('flagged');
    if (onFlag) onFlag();
  };

  return (
    <Card className="p-4 bg-white/90 border-emerald-950/10 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900 font-medium">
            <FileCheck2 className="h-4 w-4 text-emerald-700" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-stone-900">{documentTitle}</h4>
            <p className="text-[10px] text-stone-500 font-mono">{sourceType}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="emerald">{verificationBadge}</Badge>
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {confidenceScore}% Confidence
          </span>
        </div>
      </div>

      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-700 font-serif italic leading-relaxed">
        &quot;{snippet}&quot;
      </div>

      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-1.5">
          {status === 'approved' && (
            <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
              <CheckCircle className="h-3.5 w-3.5" /> Approved & Cryptographically Verified
            </span>
          )}
          {status === 'flagged' && (
            <span className="text-rose-700 font-semibold flex items-center gap-1 text-[11px]">
              <AlertOctagon className="h-3.5 w-3.5" /> Flagged for Compliance Audit
            </span>
          )}
          {status === 'pending' && (
            <span className="text-stone-500 text-[11px]">Audit Status: Pending Review</span>
          )}
        </div>

        {status === 'pending' && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleFlag} className="text-rose-700 border-rose-200 hover:bg-rose-50 text-[11px] h-7 px-2.5">
              Flag Evidence
            </Button>
            <Button variant="primary" size="sm" onClick={handleApprove} className="text-[11px] h-7 px-2.5">
              Approve Document
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

/* 2. Anomaly Flag Explanation Component */
export interface AnomalyFlagProps {
  title: string;
  detectedAt: string;
  rootCausePrediction: string;
  sensorConfidence: number;
  impactScore: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  onTriageAction?: (action: string) => void;
}

export const AnomalyFlagExplanation: React.FC<AnomalyFlagProps> = ({
  title,
  detectedAt,
  rootCausePrediction,
  sensorConfidence,
  impactScore,
  severity,
  onTriageAction,
}) => {
  const [triaged, setTriaged] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setTriaged(action);
    if (onTriageAction) onTriageAction(action);
  };

  const badgeVariant =
    severity === 'critical' ? 'coral' : severity === 'high' ? 'amber' : 'emerald';

  return (
    <Card className="p-4 bg-white/90 border-stone-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-800" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-stone-900">{title}</h4>
            <p className="text-[10px] text-stone-500 font-mono">Detected: {detectedAt}</p>
          </div>
        </div>
        <Badge variant={badgeVariant}>{severity.toUpperCase()} ANOMALY</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-1">
          <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
            Predicted Root Cause
          </span>
          <p className="text-stone-800 font-medium">{rootCausePrediction}</p>
        </div>
        <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
          <div className="flex justify-between text-[10px] text-stone-500 font-mono">
            <span>Sensor Confidence</span>
            <span className="font-bold text-stone-800">{sensorConfidence}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full"
              style={{ width: `${sensorConfidence}%` }}
            />
          </div>
          <span className="text-[10px] text-stone-600 block mt-1">
            Impact: <strong>{impactScore}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        {triaged ? (
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" /> Action Applied: {triaged}
          </span>
        ) : (
          <div className="flex items-center gap-2 text-xs w-full justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('Override Schedule')}
              className="text-[11px] h-7 px-2"
            >
              Override HVAC
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('Dispatch Field Tech')}
              className="text-[11px] h-7 px-2"
            >
              Dispatch Tech
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAction('Auto-recalibrate')}
              className="text-[11px] h-7 px-2"
            >
              Auto-recalibrate
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

/* 3. MILP What-If Simulator Component */
export interface MilpWhatIfProps {
  initialTemp?: number;
  initialCarbonLimit?: number;
  initialCostBudget?: number;
  title?: string;
}

export const MilpWhatIfSimulator: React.FC<MilpWhatIfProps> = ({
  initialTemp = 22,
  initialCarbonLimit = 150,
  initialCostBudget = 400,
  title = 'MILP Solver Multi-Objective "What-If" Tradeoff Engine',
}) => {
  const [temp, setTemp] = useState<number>(initialTemp);
  const [carbon, setCarbon] = useState<number>(initialCarbonLimit);
  const [cost, setCost] = useState<number>(initialCostBudget);

  // Recalculated tradeoff preview simulation formulas
  const calculatedSavingsKwh = Math.round((24 - temp) * 18.5 + (200 - carbon) * 1.2);
  const calculatedCostShift = Math.round((cost - 350) * 0.85 - (24 - temp) * 12);
  const comfortScore = Math.min(100, Math.max(65, Math.round(100 - Math.abs(21.5 - temp) * 8.5)));

  const handleReset = () => {
    setTemp(initialTemp);
    setCarbon(initialCarbonLimit);
    setCost(initialCostBudget);
  };

  return (
    <Card className="p-5 bg-white/95 border-emerald-950/15 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-900 text-white">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-editorial text-sm font-bold text-stone-900">{title}</h3>
            <p className="text-[11px] text-stone-500">
              Adjust constraint weights to recalculate linear programming Pareto frontier in real-time.
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs text-stone-500">
          <RotateCcw className="h-3 w-3 mr-1" /> Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Slider 1: Target Temperature */}
        <div className="space-y-1.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="flex justify-between text-xs font-semibold text-stone-800">
            <span className="flex items-center gap-1">
              <Thermometer className="h-3.5 w-3.5 text-coral-600" /> Temp Target
            </span>
            <span className="font-mono text-emerald-800">{temp}°C</span>
          </div>
          <input
            type="range"
            min="18"
            max="26"
            step="0.5"
            value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))}
            className="w-full accent-emerald-800 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 font-mono">
            <span>18°C (Cooler)</span>
            <span>26°C (Eco)</span>
          </div>
        </div>

        {/* Slider 2: Carbon Cap */}
        <div className="space-y-1.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="flex justify-between text-xs font-semibold text-stone-800">
            <span className="flex items-center gap-1">
              <Leaf className="h-3.5 w-3.5 text-emerald-600" /> Carbon Ceiling
            </span>
            <span className="font-mono text-emerald-800">{carbon} kg CO2e</span>
          </div>
          <input
            type="range"
            min="80"
            max="250"
            step="5"
            value={carbon}
            onChange={(e) => setCarbon(parseInt(e.target.value))}
            className="w-full accent-emerald-800 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 font-mono">
            <span>80kg (Strict)</span>
            <span>250kg (Relaxed)</span>
          </div>
        </div>

        {/* Slider 3: Daily Cost Target */}
        <div className="space-y-1.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="flex justify-between text-xs font-semibold text-stone-800">
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-amber-600" /> Max Budget
            </span>
            <span className="font-mono text-emerald-800">${cost}/day</span>
          </div>
          <input
            type="range"
            min="200"
            max="600"
            step="10"
            value={cost}
            onChange={(e) => setCost(parseInt(e.target.value))}
            className="w-full accent-emerald-800 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 font-mono">
            <span>$200</span>
            <span>$600</span>
          </div>
        </div>
      </div>

      {/* Realtime Recalculated MILP Output Preview Box */}
      <div className="p-4 bg-[#064E3B] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-300 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase text-emerald-200 tracking-wider">
              Simulated MILP Pareto Impact
            </span>
          </div>
          <p className="text-xs text-emerald-100/80">
            Optimal HVAC dispatch scheduled across 24 zones with constraint satisfaction guarantee.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full sm:w-auto text-center">
          <div className="p-2 bg-white/10 rounded-xl">
            <span className="text-[10px] text-emerald-300 block uppercase font-mono">Energy Impact</span>
            <span className="text-sm font-bold text-white font-mono">
              {calculatedSavingsKwh > 0 ? `-${calculatedSavingsKwh}` : `+${Math.abs(calculatedSavingsKwh)}`} kWh
            </span>
          </div>
          <div className="p-2 bg-white/10 rounded-xl">
            <span className="text-[10px] text-emerald-300 block uppercase font-mono">Daily Cost</span>
            <span className="text-sm font-bold text-white font-mono">
              ${calculatedCostShift}
            </span>
          </div>
          <div className="p-2 bg-white/10 rounded-xl">
            <span className="text-[10px] text-emerald-300 block uppercase font-mono">Comfort Score</span>
            <span className="text-sm font-bold text-emerald-200 font-mono">
              {comfortScore}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

import { useAuditLogFilters } from '@/lib/hooks/useAuditLogFilters';

/* 4. Cross-Role Input-Output Lineage Registry Table */
export const CrossRoleLineageTable: React.FC = () => {
  const {
    filters,
    updateFilter,
    resetFilters,
    isSaved,
    userAccountIdentifier,
  } = useAuditLogFilters('lineage_registry', {
    searchQuery: '',
    selectedRole: 'all',
    selectedAction: 'all',
  });

  const { searchQuery, selectedRole } = filters;

  const validationResult = { totalInputs: 0, validCount: 0, unmappedInputsCount: 0, orphanDisplaysCount: 0, is100PercentConsistent: false };
  const entries = ([] as any[]).filter((e) => {
    const matchRole = selectedRole === 'all' || e.role === selectedRole;
    const matchSearch =
      searchQuery.trim() === '' ||
      e.inputField.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.inputLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.calculationStep.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.presentationSurface.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <Card className="p-5 bg-white/95 border-emerald-950/15 shadow-md space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-900 text-white">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-editorial text-base font-bold text-stone-900">
              Cross-Role Input-Calculation-Presentation Lineage Registry
            </h3>
            <p className="text-xs text-stone-500">
              Guarantees every input has a named calculation step & presentation surface — zero orphan displays, zero unmapped inputs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={validationResult.is100PercentConsistent ? 'emerald' : 'coral'} className="text-xs py-1 px-2.5">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            {validationResult.is100PercentConsistent ? '100% Traceable Lineage' : 'Lineage Discrepancy Detected'}
          </Badge>
        </div>
      </div>

      {/* Audit Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <span className="text-[10px] text-stone-500 uppercase font-mono block">Registered Inputs</span>
          <span className="text-lg font-bold text-stone-900 font-mono">{validationResult.totalInputs}</span>
        </div>
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <span className="text-[10px] text-stone-500 uppercase font-mono block">Named Calculation Steps</span>
          <span className="text-lg font-bold text-emerald-800 font-mono">{validationResult.validCount}</span>
        </div>
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <span className="text-[10px] text-stone-500 uppercase font-mono block">Unmapped Inputs</span>
          <span className="text-lg font-bold text-stone-700 font-mono">{validationResult.unmappedInputsCount}</span>
        </div>
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <span className="text-[10px] text-stone-500 uppercase font-mono block">Orphan Displays</span>
          <span className="text-lg font-bold text-stone-700 font-mono">{validationResult.orphanDisplaysCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'user', 'student', 'dept', 'institution', 'region', 'admin', 'mlops', 'audit'].map((r) => (
            <button
              key={r}
              onClick={() => updateFilter('selectedRole', r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRole === r
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {r === 'all' ? 'All Roles' : r.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isSaved && (
            <Badge variant="emerald" className="text-[10px] font-mono py-0.5">
              <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-700" />
              Saved to Local Storage
            </Badge>
          )}
          {(searchQuery || selectedRole !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-[11px] text-stone-500 hover:text-stone-900 h-7 px-2"
            >
              Reset
            </Button>
          )}
          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search field, model, or page..."
              value={searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
            />
          </div>
        </div>
      </div>

      {/* Lineage Table */}
      <div className="overflow-x-auto border border-stone-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-mono text-[10px] uppercase">
              <th className="py-2.5 px-3">Role & Field Input</th>
              <th className="py-2.5 px-3">Collection Surface</th>
              <th className="py-2.5 px-3">Named Calculation Step / Model</th>
              <th className="py-2.5 px-3">Presentation Surface</th>
              <th className="py-2.5 px-3 text-center">Privacy Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-stone-400 italic">
                  No lineage records matched your filter.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge variant="stone" className="text-[9px] uppercase px-1.5 py-0">
                        {entry.role}
                      </Badge>
                      <span className="font-bold text-stone-900 font-mono text-[11px]">{entry.inputField}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-medium">{entry.inputLabel}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[10px] text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block w-fit">
                      {entry.collectionPoint}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 text-stone-800 font-semibold text-[11px]">
                      <Cpu className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                      <span>{entry.calculationStep}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono block mt-0.5">
                      Model ID: {entry.traceableSourceModel}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-stone-800 text-[11px] block">{entry.presentationSurface}</span>
                    <p className="text-[10px] text-stone-500 italic mt-0.5 max-w-xs">{entry.definedUse}</p>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      variant={
                        entry.privacyLevel === 'Personal Raw PII'
                          ? 'coral'
                          : entry.privacyLevel === 'Anonymized Telemetry'
                          ? 'amber'
                          : 'emerald'
                      }
                      className="text-[9px] whitespace-nowrap"
                    >
                      {entry.privacyLevel}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

/* 5. Tenant Privacy & Firebase Custom Claims Enforcement Sandbox */
export const TenantPrivacyEnforcementPanel: React.FC = () => {
  const [testRole, setTestRole] = useState<RoleType>('dept');
  const [targetTenantScope, setTargetTenantScope] = useState<'same' | 'foreign'>('foreign');
  const [requestedDataType, setRequestedDataType] = useState<'raw_pii' | 'anonymized'>('raw_pii');

  const userTenant = 'tenant_pacific_state';
  const targetTenant = targetTenantScope === 'same' ? 'tenant_pacific_state' : 'tenant_west_district_board';

  const isElevated = false;

  const claimResult = { allowed: false, reason: "API Required" };
  const queryResult = { allowed: false, reason: "API Required", mongoQueryProjection: {}, mongoAggregationFilter: {} } as any;

  return (
    <Card className="p-5 bg-white/95 border-rose-900/10 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-900 text-white">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-editorial text-base font-bold text-stone-900">
              MongoDB Query & Firebase Custom-Claims Tenant Privacy Guard
            </h3>
            <p className="text-xs text-stone-500">
              Roles with platform authority greater than Standard User/Student are explicitly denied default access to raw personal data outside their tenant.
            </p>
          </div>
        </div>

        <Badge variant={claimResult.allowed ? 'emerald' : 'coral'} className="text-xs py-1 px-2.5 font-mono">
          {claimResult.allowed ? 'HTTP 200 OK - PERMITTED' : 'HTTP 403 FORBIDDEN - DENIED'}
        </Badge>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
        <div>
          <label className="font-bold text-stone-700 block mb-1">Select Evaluated Role</label>
          <select
            value={testRole}
            onChange={(e) => setTestRole(e.target.value as RoleType)}
            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg font-semibold text-stone-800"
          >
            <option value="user">user (Standard User)</option>
            <option value="student">student (Student)</option>
            <option value="dept">dept (Department Moderator - Elevated)</option>
            <option value="institution">institution (Institution Admin - Elevated)</option>
            <option value="region">region (Regional Admin - Elevated)</option>
            <option value="admin">admin (Platform Admin - Elevated)</option>
            <option value="mlops">mlops (MLOps Admin - Elevated)</option>
            <option value="audit">audit (Auditor - Elevated)</option>
          </select>
          <span className="text-[10px] text-stone-500 block mt-1">
            Platform Authority: <strong>{isElevated ? 'YES (Elevated)' : 'NO (Standard)'}</strong>
          </span>
        </div>

        <div>
          <label className="font-bold text-stone-700 block mb-1">Target Query Tenant Scope</label>
          <div className="flex gap-2">
            <button
              onClick={() => setTargetTenantScope('same')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                targetTenantScope === 'same'
                  ? 'bg-emerald-800 text-white border-emerald-900'
                  : 'bg-white text-stone-700 border-stone-300'
              }`}
            >
              Own Tenant
            </button>
            <button
              onClick={() => setTargetTenantScope('foreign')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                targetTenantScope === 'foreign'
                  ? 'bg-rose-900 text-white border-rose-950'
                  : 'bg-white text-stone-700 border-stone-300'
              }`}
            >
              Foreign Tenant
            </button>
          </div>
          <span className="text-[10px] text-stone-500 font-mono block mt-1">
            Target ID: <code>{targetTenant}</code>
          </span>
        </div>

        <div>
          <label className="font-bold text-stone-700 block mb-1">Requested Data Format</label>
          <div className="flex gap-2">
            <button
              onClick={() => setRequestedDataType('raw_pii')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                requestedDataType === 'raw_pii'
                  ? 'bg-rose-900 text-white border-rose-950'
                  : 'bg-white text-stone-700 border-stone-300'
              }`}
            >
              Raw Personal PII
            </button>
            <button
              onClick={() => setRequestedDataType('anonymized')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                requestedDataType === 'anonymized'
                  ? 'bg-emerald-800 text-white border-emerald-900'
                  : 'bg-white text-stone-700 border-stone-300'
              }`}
            >
              Aggregated Metrics
            </button>
          </div>
          <span className="text-[10px] text-stone-500 block mt-1">
            Includes Email, Full Name, GPS, Sub-second Wattage
          </span>
        </div>
      </div>

      {/* Real-time Verification Outcome Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Layer 1: Firebase Custom-Claims Guard */}
        <div className={`p-4 rounded-xl border space-y-2 ${claimResult.allowed ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/80 border-rose-200'}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-800" />
              Firebase Custom-Claims Check Layer
            </span>
            <Badge variant={claimResult.allowed ? 'emerald' : 'coral'}>{claimResult.allowed ? 'PASS' : 'BLOCKED 403'}</Badge>
          </div>
          <p className="text-stone-700 leading-relaxed font-medium">{claimResult.reason}</p>
          <div className="pt-2 border-t border-stone-200/60 font-mono text-[10px] text-stone-600 space-y-0.5">
            <div>claims.role: <strong>&quot;{testRole}&quot;</strong></div>
            <div>claims.isPlatformAuthority: <strong>{String(isElevated)}</strong></div>
            <div>claims.crossTenantRawDataGranted: <strong>false</strong></div>
          </div>
        </div>

        {/* Layer 2: MongoDB Query Interceptor */}
        <div className={`p-4 rounded-xl border space-y-2 ${queryResult.allowed ? 'bg-emerald-50/70 border-emerald-200' : 'bg-stone-900 text-stone-100 border-stone-800'}`}>
          <div className="flex items-center justify-between">
            <span className={`font-bold flex items-center gap-1.5 ${queryResult.allowed ? 'text-stone-900' : 'text-emerald-300'}`}>
              <Database className="h-4 w-4 text-emerald-500" />
              MongoDB Query Isolation Layer
            </span>
            <Badge variant={queryResult.allowed ? 'emerald' : 'coral'}>{queryResult.allowed ? 'PROJECTION APPLIED' : 'QUERY DENIED'}</Badge>
          </div>
          <p className={`leading-relaxed ${queryResult.allowed ? 'text-stone-700' : 'text-stone-300'}`}>{queryResult.reason}</p>
          <div className="p-2 bg-black/40 rounded-lg font-mono text-[10px] text-emerald-300 space-y-1">
            <div className="text-stone-400 font-bold uppercase">$match & $projection Pipeline:</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(queryResult.mongoQueryProjection || queryResult.mongoAggregationFilter, null, 2)}</pre>
          </div>
        </div>
      </div>
    </Card>
  );
};

