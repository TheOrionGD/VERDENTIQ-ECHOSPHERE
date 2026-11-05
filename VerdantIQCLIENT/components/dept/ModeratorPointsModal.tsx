'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, AlertTriangle, Sparkles, Check, X, ArrowRight, RefreshCw } from 'lucide-react';

interface ModeratorPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string;
    name: string;
    email: string;
    points: number;
    department: string;
    subCohort: string;
  };
  onSuccess: (updatedPoints: number, reviewNotes: string) => void;
}

export const ModeratorPointsModal: React.FC<ModeratorPointsModalProps> = ({
  isOpen,
  onClose,
  student,
  onSuccess,
}) => {
  const [newPoints, setNewPoints] = useState<number>(student.points);
  const [reason, setReason] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [aiReviewResult, setAiReviewResult] = useState<{
    status: 'APPROVED' | 'REJECTED';
    confidence: number;
    auditorReview: string;
    finalPoints: number;
    delta: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const delta = newPoints - student.points;

  const handleVerifyAndApply = async () => {
    if (!reason || reason.trim().length < 10) {
      setErrorMsg('Please supply a thorough technical explanation (minimum 10 characters) for AI verification.');
      return;
    }
    setErrorMsg('');
    setIsVerifying(true);
    setAiReviewResult(null);

    try {
      const res = await fetch('/api/dept/verify-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          studentName: student.name,
          departmentId: student.department,
          originalPoints: student.points,
          newPoints,
          reason,
          moderatorEmail: 'dept@institution.org',
        }),
      });

      const data = await res.json();
      setIsVerifying(false);

      if (data.success) {
        setAiReviewResult({
          status: data.status,
          confidence: data.confidence,
          auditorReview: data.auditorReview,
          finalPoints: data.finalPoints,
          delta: data.delta,
        });

        if (data.approved) {
          onSuccess(data.finalPoints, data.auditorReview);
        }
      } else {
        setErrorMsg(data.error || 'Failed to process AI verification request');
      }
    } catch (err: any) {
      setIsVerifying(false);
      setErrorMsg(err.message || 'Network error communicating with AI Auditor');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold font-editorial">AI-Gated EcoPoints Moderator Adjustment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Target Student Info Card */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-stone-900">{student.name}</div>
              <div className="text-[11px] font-mono text-stone-500">{student.email} &bull; {student.subCohort}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-stone-400 block font-bold">Current Score</span>
              <span className="font-mono text-lg font-black text-emerald-800">{student.points} pts</span>
            </div>
          </div>

          {/* New Points Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-700">
              <label>Proposed New EcoPoints</label>
              <span className={`font-mono font-bold ${delta > 0 ? 'text-emerald-700' : delta < 0 ? 'text-rose-700' : 'text-stone-500'}`}>
                Delta: {delta > 0 ? `+${delta}` : delta} pts
              </span>
            </div>
            <input
              type="number"
              value={newPoints}
              onChange={(e) => setNewPoints(parseInt(e.target.value) || 0)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            />
          </div>

          {/* Reason Text Area */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-700">
              <label>Technical Justification for AI Audit</label>
              <span className="text-[10px] text-stone-400">Must cite sensor/log/hackathon evidence</span>
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Retroactive credit for campus solar lab shift verified by BACnet meter log; corrected double submission penalty..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* AI Auditor Result Box */}
          {aiReviewResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 ${
                aiReviewResult.status === 'APPROVED'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-1.5">
                  {aiReviewResult.status === 'APPROVED' ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-rose-700" />
                  )}
                  <span>AI Audit Decision: {aiReviewResult.status}</span>
                </div>
                <Badge variant={aiReviewResult.status === 'APPROVED' ? 'emerald' : 'rose'}>
                  Confidence: {(aiReviewResult.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-[11px] leading-relaxed">{aiReviewResult.auditorReview}</p>
              <div className="pt-1 font-mono text-[11px] font-semibold">
                Updated Student Score: <span className="font-bold">{aiReviewResult.finalPoints} pts</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
              {aiReviewResult?.status === 'APPROVED' ? 'Close' : 'Cancel'}
            </Button>
            {(!aiReviewResult || aiReviewResult.status === 'REJECTED') && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleVerifyAndApply}
                disabled={isVerifying}
                className="bg-[#064E3B] text-white hover:bg-emerald-900 text-xs font-bold gap-1.5"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>AI Verifying Reason...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Submit for AI Approval</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

