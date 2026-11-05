import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import logoImg from '../assets/logo.png';
import splashBg from '../assets/splash-bg.jpg';

export default function CinematicPreloader({ onComplete }) {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const barRef = useRef(null);
  const tagRef = useRef(null);
  const bgImageRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      // 1. Initial State
      tl.set(overlayRef.current, { display: 'flex', opacity: 1 })
        .set(bgImageRef.current, { scale: 1.15, opacity: 0 })
        .set(logoRef.current, { opacity: 0, scale: 0.85, y: 20 })
        .set(tagRef.current, { opacity: 0, y: 12 })
        .set(barRef.current, { scaleX: 0 });

      // 2. Fade in Architectural Campus Background with gentle zoom
      tl.to(bgImageRef.current, {
        opacity: 0.45,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out'
      }, 0)
      // 3. Logo & Emblem Reveal with Glow
      .to(logoRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, 0.2)
      .to(tagRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4')
      // 4. Loading bar sweep
      .to(barRef.current, {
        scaleX: 1,
        duration: 0.9,
        ease: 'power3.inOut'
      })
      // 5. Cinematic Curtain Lift
      .to([logoRef.current, tagRef.current, barRef.current], {
        opacity: 0,
        y: -15,
        duration: 0.4,
        ease: 'power2.in'
      }, '+=0.1')
      .to(overlayRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: 'expo.inOut'
      });
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#071714',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Uploaded Architectural Eco-Campus Background Image */}
      <img
        ref={bgImageRef}
        src={splashBg}
        alt="VerdantIQ Architectural Campus"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none'
        }}
      />

      {/* Atmospheric Vignette & Scrim */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(7, 23, 20, 0.65) 0%, rgba(5, 18, 15, 0.92) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Center Branding Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div ref={logoRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '84px', height: '84px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(166,217,106,0.6)', background: '#081A17', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(166,217,106,0.45)' }}>
            <img src={logoImg} alt="VerdantIQ" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '2.4rem', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1 }}>
              VerdantIQ
            </span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.82rem', color: '#A6D96A', letterSpacing: '0.22em', marginTop: '6px' }}>
              ECOSPHERE CORE &bull; RELEASE v2.4
            </span>
          </div>
        </div>

        <div ref={tagRef} style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.82rem', color: '#D5E5DE', letterSpacing: '0.1em', marginBottom: '2rem' }}>
          INITIALIZING SHA-256 INTELLIGENCE FABRIC...
        </div>

        {/* Loading Progress Bar */}
        <div style={{ width: '220px', height: '3px', background: 'rgba(255,255,255,0.15)', position: 'relative', overflow: 'hidden', borderRadius: '999px' }}>
          <div
            ref={barRef}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, #267A58, #A6D96A)',
              transformOrigin: 'left center'
            }}
          />
        </div>
      </div>
    </div>
  );
}
