import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck, Database, Cpu } from 'lucide-react';
import { BackgroundVideo } from '../common/BackgroundVideo';

export function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(15);
  const [stepText, setStepText] = useState('Initializing Windows 11 Fluent Engine...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStepText('Connecting to MongoDB Atlas Cluster (VerdantIQ)...');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(80);
      setStepText('Verifying Cryptographic SHA-256 Audit Integrity...');
    }, 900);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStepText('Starting VerdantIQ Ecosphere Workspace...');
    }, 1400);

    const timer4 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white select-none">
      {/* Background Video */}
      <BackgroundVideo overlayClassName="bg-neutral-950/80 backdrop-blur-[2px]" />
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.25) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        {/* Animated Brand Emblem */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-neutral-900/80 flex items-center justify-center shadow-2xl shadow-emerald-500/20 border border-emerald-400/30 overflow-hidden p-2">
            <img src="/icon.png" alt="VerdantIQ" className="w-full h-full object-contain animate-pulse" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
          VerdantIQ <span className="text-emerald-400 font-light">Ecosphere</span>
        </h1>
        <p className="text-xs text-neutral-400 mb-8 font-mono">
          Full-Stack Sustainability Intelligence · 100% JavaScript Stack
        </p>

        {/* Windows 11 Fluent Progress Bar */}
        <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden mb-3 border border-white/5">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-neutral-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>{stepText}</span>
        </div>

        <div className="mt-12 flex items-center space-x-4 text-[10px] text-neutral-500 font-mono">
          <span className="flex items-center space-x-1">
            <Database className="w-3 h-3 text-teal-500" />
            <span>MongoDB Atlas</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Pure JS Express</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-sky-500" />
            <span>Gemini 3.6 Flash</span>
          </span>
        </div>
      </div>
    </div>
  );
}
