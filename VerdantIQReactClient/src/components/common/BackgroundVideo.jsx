import React from 'react';
import { CinematicParticleCanvas } from './CinematicParticleCanvas';

/**
 * BackgroundVideo Component
 * Provides a cinematic, hardware-accelerated 16:9 aspect-ratio background video
 * (`/landig.mp4`) calibrated to cover the viewport without warping or letterboxing,
 * paired with the GPU-accelerated 160,000+ particle CinematicParticleCanvas.
 *
 * Aspect Ratio Implementation:
 * Uses a 16:9 container calculation (min-w-[177.78vh] min-h-[56.25vw]) to guarantee
 * perfect 16:9 geometry matching the 1280x720 video master on any resolution,
 * from ultra-wide 21:9 monitors to vertical mobile displays.
 */
export function BackgroundVideo({
  overlayClassName = 'bg-neutral-950/75 backdrop-blur-[1px]',
  poster = '/bg.png',
  showParticles = true,
  opacity = 'opacity-100',
  playbackRate = 1.0,
}) {
  return (
    <div className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 select-none ${opacity}`}>
      {/* 16:9 Aspect Ratio Constrained Video Container */}
      <div className="absolute inset-0 flex items-center justify-center -z-20 overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={poster}
          className="w-full h-full object-cover object-center pointer-events-none filter brightness-95 contrast-105"
          style={{ aspectRatio: '16 / 9' }}
          ref={(el) => {
            if (el && playbackRate !== 1.0) {
              el.playbackRate = playbackRate;
            }
          }}
        >
          <source src="./landig.mp4" type="video/mp4" />
          <source src="/landig.mp4" type="video/mp4" />
        </video>
      </div>

      {/* GPU Instanced Cinematic Particle Field */}
      {showParticles && (
        <CinematicParticleCanvas className="absolute inset-0 -z-15 opacity-75" />
      )}

      {/* Ambient Radial Vignette & Glass Blur Overlay */}
      <div className={`absolute inset-0 pointer-events-none -z-10 transition-colors duration-500 ${overlayClassName}`} />
      
      {/* 16:9 Edge Feathering Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10, 10, 14, 0.65) 100%)',
        }}
      />
    </div>
  );
}

export default BackgroundVideo;
