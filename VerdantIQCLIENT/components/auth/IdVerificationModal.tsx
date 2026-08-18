// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ShieldCheck, KeyRound, Loader2, X } from 'lucide-react';


interface IdVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName?: string;
  onVerified?: () => void;
}

export const IdVerificationModal: React.FC<IdVerificationModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userName,
  onVerified,
}) => {
  const [step, setStep] = useState<'initial' | 'sending' | 'enter_otp' | 'verifying' | 'success'>('initial');
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    setStep('sending');
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const data = await ({ initVerification: () => ({ redirectUrl: "" }), checkVerificationStatus: () => ({ status: "pending" }) }).sendOtpForVerification(userEmail, userName, 'Institutional ID Verification');
      if (data.success) {
        setStep('enter_otp');
        setSuccessMessage(`One-Time Verification Password (OTP) sent to ${userEmail}`);
        if (data.devOtpHint) {
          setDevOtpHint(data.devOtpHint);
        }
      } else {
        setStep('initial');
        setErrorMessage(data.error || 'Failed to send OTP email');
      }
    } catch (err: any) {
      setStep('initial');
      setErrorMessage(err.message || 'Error connecting to Brevo verification service');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setStep('verifying');
    setErrorMessage(null);

    try {
      const data = await ({ initVerification: () => ({ redirectUrl: "" }), checkVerificationStatus: () => ({ status: "pending" }) }).verifyOtpCode(userEmail, otpCode.trim());
      if (data.success && data.verified) {
        setStep('success');
        setSuccessMessage('Identity verified successfully! Status updated in database.');
        if (onVerified) {
          onVerified();
        }
      } else {
        setStep('enter_otp');
        setErrorMessage(data.error || 'Invalid OTP verification password.');
      }
    } catch (err: any) {
      setStep('enter_otp');
      setErrorMessage(err.message || 'Verification error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-stone-900 border border-emerald-500/30 rounded-2xl shadow-2xl p-6 text-stone-100 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 transition-colors p-1 rounded-lg hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-100">Institutional ID Verification</h3>
            <p className="text-xs text-stone-400">Brevo Email OTP Authentication Engine</p>
          </div>
        </div>

        {/* Status alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && step !== 'success' && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start space-x-2 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Dev hint if active */}
        {devOtpHint && (
          <div className="mb-4 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs text-center font-mono">
            Dev OTP Code Hint: <strong>{devOtpHint}</strong>
          </div>
        )}

        {/* Step 1: Initial */}
        {step === 'initial' && (
          <div className="space-y-4">
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs space-y-2">
              <div className="flex justify-between text-stone-400">
                <span>Verification Email:</span>
                <span className="text-stone-200 font-semibold">{userEmail}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Method:</span>
                <span className="text-emerald-400 font-medium">BREVO_API_KEY Email OTP</span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Click below to send a 6-digit One-Time Verification Password (OTP) to your account email address for ID verification.
            </p>

            <button
              onClick={handleSendOtp}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-950 flex items-center justify-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Send Verification OTP Email</span>
            </button>
          </div>
        )}

        {/* Step 2: Sending loading state */}
        {step === 'sending' && (
          <div className="py-8 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm font-medium text-stone-200">Dispatching Brevo OTP Email...</p>
            <p className="text-xs text-stone-400">Communicating with Brevo Transactional API</p>
          </div>
        )}

        {/* Step 3: Enter OTP */}
        {(step === 'enter_otp' || step === 'verifying') && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-300 flex items-center space-x-1">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enter 6-Digit One-Time Password (OTP)</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                disabled={step === 'verifying'}
                className="w-full py-3 px-4 bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-xl text-center text-2xl font-mono tracking-widest text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={step === 'verifying'}
                className="w-1/3 py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition-colors"
              >
                Resend OTP
              </button>

              <button
                type="submit"
                disabled={step === 'verifying'}
                className="w-2/3 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-950 flex items-center justify-center space-x-2"
              >
                {step === 'verifying' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify ID Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-base font-bold text-stone-100">ID Verification Completed!</h4>
              <p className="text-xs text-stone-400 mt-1">Your identity and email have been verified in the database.</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
