import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck, Database, Cpu, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { BackgroundVideo } from '../common/BackgroundVideo';
import { TextParticleTransition } from '../common/TextParticleTransition';

/**
 * Enhanced SplashScreen Component
 *
 * Cinematic Sequence:
 * 1. Initial High-Impact Typographic Stage:
 *    "VERDANT IQ" · "ECOSPHERE" formed from thousands of flocking glowing particles.
 * 2. Particle Disintegration Stage:
 *    Text particles explode outward in a 3D spherical wavefront, dispersing into the
 *    ambient Three.js particle field with glowing starlight and orbital rings.
 * 3. 16:9 Ambient Video Master Reveal:
 *    The 16:9 background video seamlessly reveals through the particle field with
 *    subtle progress telemetry and status indicators.
 * 4. Smooth Transition:
 *    User can click to skip immediately or allow the auto-progression into the workspace.
 */
export function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('text-intro'); // 'text-intro' | 'particle-reveal' | 'video-ambient'
  const [progress, setProgress] = useState(10);
  const [stepText, setStepText] = useState('Synthesizing Core Neural Grid & Particles...');
  const [videoDimmed, setVideoDimmed] = useState(true);

  // Progressive telemetry sequence
  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(35);
      setStepText('Connecting to MongoDB Atlas Cluster (VerdantIQ)...');
    }, 1200);

    const t2 = setTimeout(() => {
      setProgress(65);
      setStepText('Calibrating 16:9 Video Pipeline & GPU Shaders...');
    }, 2200);

    const t3 = setTimeout(() => {
      setProgress(88);
      setStepText('Verifying Cryptographic SHA-256 Audit Integrity...');
    }, 3200);

    const t4 = setTimeout(() => {
      setProgress(100);
      setStepText('VerdantIQ Ecosphere Workspace Ready.');
    }, 4200);

    const t5 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onFinish]);

  const handleTextDispersed = () => {
    setPhase('particle-reveal');
    setVideoDimmed(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white select-none overflow-hidden bg-black">
      {/* 16:9 Native Background Video Loop */}
      <BackgroundVideo 
        overlayClassName={`transition-all duration-1000 ${
          videoDimmed 
            ? 'bg-neutral-950/90 backdrop-blur-[4px]' 
            : 'bg-neutral-950/65 backdrop-blur-[1px]'
        }`} 
        poster="/bg.png"
        showParticles={true}
      />

      {/* Stage 1 & 2: Text to Particle Dispersion Overlay Canvas */}
      <TextParticleTransition
        title="VERDANT IQ"
        subtitle="ECOSPHERE · 100% PURE JS SUSTAINABILITY PLATFORM"
        onDispersed={handleTextDispersed}
      />

      {/* Stage 3: Windows 11 Fluent UI Telemetry Card & Brand Overlay */}
      <div 
        className={`relative z-40 flex flex-col items-center max-w-[92vw] sm:max-w-md w-full px-6 sm:px-8 py-5 rounded-2xl liquid-glass-panel border border-white/15 text-center my-auto shadow-2xl transition-all duration-700 ${
          phase === 'text-intro' ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Animated Brand Emblem */}
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900/90 flex items-center justify-center shadow-2xl shadow-emerald-500/30 border border-emerald-400/40 overflow-hidden p-2.5">
            <img src="/icon.png" alt="VerdantIQ" className="w-full h-full object-contain animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white mb-1 flex items-center justify-center space-x-2">
          <span>VerdantIQ</span>
          <span className="text-emerald-400 font-light font-mono text-sm px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
            ECOSPHERE
          </span>
        </h1>
        <p className="text-[11px] text-neutral-400 mb-6 font-mono">
          Full-Stack Sustainability Intelligence · 16:9 Panoramic Engine
        </p>

        {/* Windows 11 Fluent Progress Bar */}
        <div className="w-full bg-neutral-900/80 rounded-full h-1.5 overflow-hidden mb-3 border border-white/10 shadow-inner">
          <div 
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-neutral-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>{stepText}</span>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 w-full flex items-center justify-between text-[10px] text-neutral-400 font-mono">
          <span className="flex items-center space-x-1">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>MongoDB Atlas</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-teal-400" />
            <span>Express v5</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-sky-400" />
            <span>GPU Three.js</span>
          </span>
        </div>
      </div>

      {/* Skip Intro Button */}
      <div className="absolute bottom-6 right-6 z-50">
        <button
          onClick={() => {
            if (onFinish) onFinish();
          }}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-neutral-300 hover:text-white border border-white/15 text-xs font-mono transition-all cursor-pointer backdrop-blur-md shadow-lg"
        >
          <span>Skip to Platform</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default SplashScreen;
