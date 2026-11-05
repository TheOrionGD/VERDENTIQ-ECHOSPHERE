import React, { useRef, useEffect } from 'react';
import { ArrowRight, Terminal, Layers, ShieldCheck, Activity, Play } from 'lucide-react';
import AnimatedText from './AnimatedText';
import landingVideo from '../assets/landig.mp4';
import logoImg from '../assets/logo.png';

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay deferred', e));
    }
  }, []);

  return (
    <section className="hero-section bg-grid-pattern" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Video Loop with Atmospheric Gradient Scrim */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <video
          ref={videoRef}
          src={landingVideo}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.28,
            filter: 'saturate(1.2) contrast(1.1)'
          }}
        />
        {/* Dual Theme Ambient Overlays */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 65% 50%, transparent 20%, var(--bg-primary) 85%)'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, var(--bg-primary) 0%, transparent 40%, var(--bg-primary) 100%)'
        }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-grid">
          {/* Left: Editorial Hero Headline & CTAs with Word & Character Animations */}
          <div className="hero-content">
            <div className="eyebrow-tag reveal-scale" style={{ backdropFilter: 'blur(8px)', background: 'var(--tag-bg)' }}>
              <span className="dot pulse-active"></span>
              <AnimatedText text="THE INTELLIGENCE ECOSYSTEM" mode="chars" staggerMs={20} />
            </div>

            <h1 className="hero-headline">
              <AnimatedText 
                text="Everything connected." 
                mode="words" 
                staggerMs={70} 
                baseDelay={120} 
              />
              <br />
              <span className="text-gradient">
                <AnimatedText 
                  text="Intelligence in motion." 
                  mode="words" 
                  staggerMs={80} 
                  baseDelay={320} 
                />
              </span>
            </h1>

            <p className="hero-description text-blur-reveal is-visible delay-3">
              <AnimatedText 
                text="VerdantIQ Ecosphere unites operational intelligence, AI-powered predictive analytics, digital twins, mathematical optimization, and cryptographic governance in one cohesive ecosystem."
                mode="words"
                staggerMs={22}
                baseDelay={500}
              />
            </p>

            <div className="hero-cta-group reveal-up is-visible delay-4">
              <a href="#platform" className="btn-primary btn-motion">
                <span>Explore the Ecosystem</span>
                <ArrowRight size={16} className="btn-icon" />
              </a>
              <a href="#architecture" className="btn-secondary btn-motion" style={{ backdropFilter: 'blur(8px)' }}>
                <span>Discover the Architecture</span>
              </a>
            </div>

            <div className="hero-stats-strip stagger-container is-visible delay-5">
              <div className="hero-stat-item">
                <span className="hero-stat-val">8 Personas</span>
                <span className="hero-stat-lbl">Unified Access</span>
              </div>
              <div className="hero-stat-item">
                <span className="hero-stat-val">46 Collections</span>
                <span className="hero-stat-lbl">MongoDB Atlas</span>
              </div>
              <div className="hero-stat-item">
                <span className="hero-stat-val">SHA-256</span>
                <span className="hero-stat-lbl">Cryptographic Audit</span>
              </div>
              <div className="hero-stat-item">
                <span className="hero-stat-val">&lt; 20ms</span>
                <span className="hero-stat-lbl">Inference Latency</span>
              </div>
            </div>
          </div>

          {/* Right: Architectural Video Terminal Card with Official Glowing Logo */}
          <div className="hero-visual-card reveal-scale is-visible delay-2 hover-lift" style={{ position: 'relative', overflow: 'hidden', minHeight: '440px', padding: 0 }}>
            {/* Live Synchronized High-Fidelity Loop in Card */}
            <video
              src={landingVideo}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                minHeight: '440px'
              }}
            />

            {/* Gradient Scrim */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(7, 21, 18, 0.94) 0%, rgba(7, 21, 18, 0.25) 50%, rgba(7, 21, 18, 0.7) 100%)'
            }} />

            {/* Top Terminal Bar */}
            <div className="terminal-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'rgba(10, 26, 22, 0.88)', backdropFilter: 'blur(10px)' }}>
              <div className="terminal-dots">
                <span className="terminal-dot dot-red"></span>
                <span className="terminal-dot dot-yellow"></span>
                <span className="terminal-dot dot-green"></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={logoImg} alt="VerdantIQ" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                <span className="terminal-title">verdantiq-orchestrator.telemetry.daemon</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#A6D96A', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="pulse-active" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A6D96A' }}></span>
                ACTIVE
              </span>
            </div>

            {/* Floating Logo Badge Center Accent */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -60%)',
              pointerEvents: 'none',
              textAlign: 'center'
            }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                padding: '3px',
                background: 'rgba(18, 61, 50, 0.4)',
                border: '1.5px solid rgba(166, 217, 106, 0.5)',
                boxShadow: '0 0 35px rgba(166, 217, 106, 0.35)',
                backdropFilter: 'blur(12px)',
                margin: '0 auto',
                overflow: 'hidden'
              }}>
                <img src={logoImg} alt="VerdantIQ Core" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            {/* Bottom HUD Telemetry Card */}
            <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem', background: 'rgba(8, 26, 23, 0.9)', backdropFilter: 'blur(14px)', borderRadius: '8px', padding: '1rem 1.25rem', border: '1px solid rgba(166, 217, 106, 0.35)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontFamily: 'IBM Plex Mono', fontSize: '0.75rem' }}>
                <span style={{ color: '#A6D96A', fontWeight: '600' }}>CAMPUS AUTONOMOUS ENERGY GRID</span>
                <span style={{ color: '#FFFFFF' }}>CO2e OFFSET: -18.4%</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#D5E5DE', fontFamily: 'IBM Plex Mono', lineHeight: 1.5 }}>
                &gt; XGBoost 72h forecast sync: Optimal curve convergence (RMSE: 0.038)<br />
                &gt; 8 Persona contexts synchronized. 46 Collections healthy.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
