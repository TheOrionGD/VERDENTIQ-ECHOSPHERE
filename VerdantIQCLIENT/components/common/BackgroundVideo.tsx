'use client';

import React from 'react';

interface BackgroundVideoProps {
  overlayClassName?: string;
  poster?: string;
  opacity?: string;
  playbackRate?: number;
}

/**
 * BackgroundVideo Component
 * Plays /landig.mp4 smoothly in the background across client pages
 * with an elegant dark vignette / backdrop overlay and poster fallback.
 */
export function BackgroundVideo({
  overlayClassName = 'bg-stone-950/15 backdrop-blur-[0.2px]',
  poster = '/bg.png',
  opacity = 'opacity-100',
  playbackRate = 1.0,
}: BackgroundVideoProps) {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 select-none ${opacity}`}
    >
      <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden bg-stone-950 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={poster}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto max-w-none object-cover pointer-events-none filter brightness-100 contrast-105"
          ref={(el) => {
            if (el && playbackRate !== 1.0) {
              el.playbackRate = playbackRate;
            }
          }}
        >
          <source src="/landig.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Vignette / Glass overlay to ensure high contrast and readability for UI text */}
      <div
        className={`absolute inset-0 pointer-events-none -z-10 transition-colors duration-500 ${overlayClassName}`}
      />
    </div>
  );
}

export default BackgroundVideo;
