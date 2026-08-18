// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { InstitutionRecord } from '@/lib/services/regionService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { X, AlertTriangle, Archive, Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  institution: InstitutionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const InstitutionOffboardingModal: React.FC<Props> = ({
  institution,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState<string>('Contract Expiry');
  const [archiveData, setArchiveData] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  if (!isOpen || !institution) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 800));

    onOffboard();
    setIsSubmitting(false);
    setCompleted(true);
  };

  const handleDone = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h3 className="font-editorial text-lg font-bold">Institution Offboarding & Deactivation</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-rose-300 hover:text-white hover:bg-rose-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!completed ? (
            <>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <span className="font-bold block">Confirm Deactivation Target:</span>
                <p className="text-stone-700">
                  <strong>{institution.name}</strong> ({institution.code}) — {institution.studentCount.toLocaleString()} Students
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Primary Offboarding Reason *</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="Contract Expiry">Contract / License Expiry</option>
                    <option value="District Restructure">District Restructure or Merger</option>
                    <option value="Compliance Breach">Compliance & Data Policy Non-Compliance</option>
                    <option value="Campus Inactive">Campus Inactive / Consolidated</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Auditor Offboarding Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide additional details for regional governance records..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="archiveToggle"
                    checked={archiveData}
                    onChange={(e) => setArchiveData(e.target.checked)}
                    className="mt-0.5 rounded text-rose-700 focus:ring-rose-500"
                  />
                  <label htmlFor="archiveToggle" className="text-stone-700 leading-tight">
                    <strong>Archive Anonymized Regional Benchmark Data</strong>
                    <span className="block text-[11px] text-stone-500">
                      Preserves historical aggregate carbon offset metrics for regional trend reporting while purging active API keys and tenant access.
                    </span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <h4 className="font-editorial text-lg font-bold text-emerald-950">
                Institution Deactivated Successfully
              </h4>
              <p className="text-xs text-emerald-800">
                {institution.name} has been moved to deactivated status. Spring Boot tenant access revoked.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          {!completed ? (
            <Button
              onClick={handleExecuteOffboard}
              disabled={isSubmitting}
              className="bg-rose-700 hover:bg-rose-800 text-white"
            >
              {isSubmitting ? 'Deactivating...' : 'Confirm Offboarding'}
            </Button>
          ) : (
            <Button onClick={handleDone} className="bg-[#064E3B] text-white">
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
