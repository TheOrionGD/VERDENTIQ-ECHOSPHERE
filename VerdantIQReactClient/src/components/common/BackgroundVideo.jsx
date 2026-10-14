import React from 'react';
import { CinematicParticleCanvas } from './CinematicParticleCanvas';

/**
 * BackgroundVideo Component
 * Provides a seamless HTML5 video background (`/landig.mp4`) paired with the GPU-accelerated
 * 160,000+ particle CinematicParticleCanvas across all application screens.
 */
export function BackgroundVideo({ 
  overlayClassName = 'bg-neutral-950/70 backdrop-blur-[1px]',
  poster = '/bg.png',
  showParticles = true
}) {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 select-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover -z-20 pointer-events-none"
      >
        <source src="/landig.mp4" type="video/mp4" />
      </video>
      {/* Cinematic GPU Particle Field */}
      {showParticles && (
        <CinematicParticleCanvas className="absolute inset-0 -z-15 opacity-70" />
      )}
      <div className={`absolute inset-0 pointer-events-none -z-10 transition-colors duration-300 ${overlayClassName}`} />
    </div>
  );
}

export default BackgroundVideo;
