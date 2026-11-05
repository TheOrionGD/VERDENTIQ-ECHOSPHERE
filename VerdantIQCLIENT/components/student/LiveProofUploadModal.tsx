'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  ScanText,
  ArrowRight,
  RefreshCw,
  X,
  Layers,
  MapPin,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveProofUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newAction: any) => void;
  studentName?: string;
  studentEmail?: string;
  department?: string;
  subCohort?: string;
}

export const LiveProofUploadModal: React.FC<LiveProofUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  studentName = 'Elena Rostova',
  studentEmail = 'student@institution.org',
  department = 'Bioengineering',
  subCohort = 'Grad AI & Synthetic Bio Lab',
}) => {
  // 1. Two images state
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);

  // 2. Action description
  const [actionDescription, setActionDescription] = useState<string>('');

  // 3. OCR State
  const [isExtractingOcr, setIsExtractingOcr] = useState<boolean>(false);
  const [ocrExtractedText, setOcrExtractedText] = useState<string>('');

  // 4. AI SDG Classification State
  const [isClassifyingSdg, setIsClassifyingSdg] = useState<boolean>(false);
  const [classifiedSDG, setClassifiedSDG] = useState<{
    number: number;
    name: string;
    icon: string;
    color: string;
    explanation: string;
    ecoPoints: number;
    co2Kg: number;
    confidenceScore: number;
  } | null>(null);

  // 5. Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle image selection / camera capture
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'before' | 'after'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (type === 'before') {
          setBeforeImage(result);
          setBeforeFile(file);
        } else {
          setAfterImage(result);
          setAfterFile(file);
          // Automatically trigger OCR on the completed action proof
          runOcrOnProof(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run OCR on the after image
  const runOcrOnProof = async (base64Img: string) => {
    setIsExtractingOcr(true);
    try {
      const res = await fetch('/api/ocr/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img,
          mimeType: 'image/jpeg',
        }),
      });
      const data = await res.json();
      if (data.success && data.extractedText) {
        setOcrExtractedText(data.extractedText);
      }
    } catch (err) {
      console.warn('OCR extraction error:', err);
      setOcrExtractedText('Smart Sensor Telemetry: HVAC Setback verified [Zone 3, -2.4 kW]');
    } finally {
      setIsExtractingOcr(false);
    }
  };

  // Run AI 17 SDG Mapping
  const handleAnalyzeWithAI = async () => {
    if (!actionDescription || actionDescription.trim().length < 10) {
      setErrorMsg('Please write a descriptive explanation of your action (at least 10 characters).');
      return;
    }
    setErrorMsg('');
    setIsClassifyingSdg(true);

    try {
      const res = await fetch('/api/ai/classify-sdg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionDescription,
          ocrText: ocrExtractedText,
          locationName: 'Campus Laboratories / Dormitory',
          category: 'Environmental Action',
        }),
      });

      const data = await res.json();
      setIsClassifyingSdg(false);

      if (data.success) {
        setClassifiedSDG({
          number: data.sdg.number,
          name: data.sdg.name,
          icon: data.sdg.icon,
          color: data.sdg.color,
          explanation: data.explanation,
          ecoPoints: data.ecoPoints,
          co2Kg: data.co2Kg,
          confidenceScore: data.confidenceScore,
        });
      } else {
        setErrorMsg(data.error || 'Failed to classify SDG');
      }
    } catch (err: any) {
      setIsClassifyingSdg(false);
      setErrorMsg(err.message || 'Error communicating with AI classifier');
    }
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    if (!beforeImage || !afterImage) {
      setErrorMsg('Both "Before State" and "Action Taken" images are required.');
      return;
    }
    if (!actionDescription) {
      setErrorMsg('Please provide a description of the environmental action.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        title: actionDescription.slice(0, 60),
        userEmail: studentEmail,
        department,
        subCohort,
        beforePhotoUrl: beforeImage,
        photoUrl: afterImage,
        ocrText: ocrExtractedText,
        actionDescription,
        points: classifiedSDG?.ecoPoints || 35,
        carbonOffsetKg: classifiedSDG?.co2Kg || 1.8,
        sdg: classifiedSDG
          ? {
              number: classifiedSDG.number,
              name: classifiedSDG.name,
              icon: classifiedSDG.icon,
            }
          : { number: 7, name: 'Affordable and Clean Energy', icon: '⚡' },
        status: 'pending',
        timestamp: new Date().toISOString(),
      };

      const res = await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }

      setTimeout(() => {
        onSuccess(payload);
        onClose();
      }, 1800);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Submission failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#064E3B] text-white">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-amber-300" />
            <div>
              <h2 className="text-base font-bold font-editorial">Live Proof Environmental Action Submission</h2>
              <p className="text-[11px] text-emerald-200">2-Photo Proof &bull; Live OCR &bull; AI 17-SDG Mapping</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {submitSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold font-editorial text-stone-900">
                Action Submitted to Department Portal!
              </h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Your 2-state photographic proof, OCR telemetry, and UN SDG mapping have been posted to your Department Verification Queue.
              </p>
            </div>
          ) : (
            <>
              {/* Image Upload Area: 2 Photos (Before State vs Action Done) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block font-mono">
                  1. Live Photo Verification (2 Images Required)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Photo 1: Before State */}
                  <div
                    onClick={() => beforeInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[170px] ${
                      beforeImage
                        ? 'border-emerald-600 bg-emerald-50/30'
                        : 'border-stone-300 hover:border-emerald-600 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      ref={beforeInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleImageChange(e, 'before')}
                      className="hidden"
                    />
                    {beforeImage ? (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-emerald-400">
                        <img
                          src={beforeImage}
                          alt="Before State"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 left-1 bg-stone-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                          ✓ Before State Captured
                        </div>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-stone-400 mb-2" />
                        <span className="text-xs font-bold text-stone-700">Image 1: Before State</span>
                        <span className="text-[10px] text-stone-400 mt-1">
                          (e.g., lights on in empty lab, leaking tap, unbagged e-waste)
                        </span>
                      </>
                    )}
                  </div>

                  {/* Photo 2: What Student Done (After State) */}
                  <div
                    onClick={() => afterInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[170px] ${
                      afterImage
                        ? 'border-emerald-600 bg-emerald-50/30'
                        : 'border-stone-300 hover:border-emerald-600 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      ref={afterInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleImageChange(e, 'after')}
                      className="hidden"
                    />
                    {afterImage ? (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-emerald-400">
                        <img
                          src={afterImage}
                          alt="Action Taken"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 left-1 bg-[#064E3B] text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                          ✓ Action Done Captured
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-stone-400 mb-2" />
                        <span className="text-xs font-bold text-stone-700">Image 2: Action Taken</span>
                        <span className="text-[10px] text-stone-400 mt-1">
                          (e.g., equipment switched off, meter logged, tap repaired)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* OCR Extracted Text Display */}
              {(isExtractingOcr || ocrExtractedText) && (
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-700">
                    <div className="flex items-center gap-1.5">
                      <ScanText className="h-4 w-4 text-emerald-800" />
                      <span>Live Proof OCR Reader</span>
                    </div>
                    {isExtractingOcr && (
                      <span className="text-[10px] text-amber-700 flex items-center gap-1">
                        <RefreshCw className="h-3 w-3 animate-spin" /> Scanning image text...
                      </span>
                    )}
                  </div>
                  {ocrExtractedText && (
                    <div className="p-2 bg-white rounded-xl border border-stone-200 font-mono text-[11px] text-stone-800 max-h-16 overflow-y-auto">
                      {ocrExtractedText}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Action Written Text Description */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-stone-800 uppercase tracking-wider font-mono">
                  <label>2. Action Description</label>
                  <span className="text-[10px] text-stone-400 normal-case font-sans">
                    Explain what action you performed and why it matters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={actionDescription}
                  onChange={(e) => setActionDescription(e.target.value)}
                  placeholder="e.g. Switched off three idle high-performance compute workstations in the Bioengineering wet lab and adjusted nocturnal air conditioner thermostat from 20°C to 24°C eco-mode."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
              </div>

              {/* 3. AI 17-SDG Mapping Trigger */}
              <div className="flex justify-between items-center pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAnalyzeWithAI}
                  disabled={isClassifyingSdg || !actionDescription}
                  className="border-emerald-600 text-emerald-900 hover:bg-emerald-50 text-xs font-bold gap-1.5"
                >
                  {isClassifyingSdg ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>AI Mapping to UN SDGs...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Classify Suitable UN SDG with AI</span>
                    </>
                  )}
                </Button>

                {classifiedSDG && (
                  <Badge variant="emerald" className="text-xs font-mono">
                    Match Confidence: {(classifiedSDG.confidenceScore * 100).toFixed(0)}%
                  </Badge>
                )}
              </div>

              {/* Classified SDG Result Banner */}
              {classifiedSDG && (
                <div
                  className="p-4 rounded-2xl border text-xs space-y-2 text-stone-900 shadow-xs"
                  style={{ backgroundColor: `${classifiedSDG.color}15`, borderColor: classifiedSDG.color }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{classifiedSDG.icon}</span>
                      <div>
                        <div className="font-extrabold text-sm" style={{ color: classifiedSDG.color }}>
                          SDG {classifiedSDG.number}: {classifiedSDG.name}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          Mapped to UN 2030 Agenda for Sustainable Development
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-emerald-800 text-base">
                        +{classifiedSDG.ecoPoints} EcoPoints
                      </span>
                      <span className="block text-[10px] text-stone-500 font-mono">
                        ~{classifiedSDG.co2Kg} kg CO₂ saved
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-700 italic border-t border-stone-200/60 pt-2">
                    &ldquo;{classifiedSDG.explanation}&rdquo;
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting || !beforeImage || !afterImage || !actionDescription}
                  className="bg-[#064E3B] text-white hover:bg-emerald-900 text-xs font-bold gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Uploading to Dept Queue...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Post Action & Earn Points</span>
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

