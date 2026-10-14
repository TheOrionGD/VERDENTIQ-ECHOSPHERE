import React, { useEffect, useRef, useState } from 'react';

/**
 * TextParticleTransition
 * Renders the stage where high-contrast typographic text forms from particles,
 * vibrates, disperses dynamically outward into the 3D particle universe, and
 * dissolves to reveal the background video and application workspace.
 *
 * Sequence:
 * 1. Text formation: Particles flock to assemble the words "VERDANT IQ" & "ECOSPHERE"
 * 2. Glint & breathing vibration: Text glows with iridescent emerald/teal energy
 * 3. Particle explosion / dispersion: Particles scatter with momentum & drag
 * 4. Dissolve to Video: Canvas gently fades out into the 16:9 ambient video loop
 */
export function TextParticleTransition({
  title = "VERDANT IQ",
  subtitle = "ECOSPHERE · SUSTAINABILITY INTELLIGENCE",
  onDispersed,
  className = ""
}) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('forming'); // 'forming' | 'assembled' | 'dispersing' | 'finished'

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Off-screen canvas to sample exact text pixel coordinates
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    offCanvas.width = width;
    offCanvas.height = height;

    const createTextPoints = () => {
      offCtx.clearRect(0, 0, width, height);
      offCtx.fillStyle = '#ffffff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      // Title font calculation
      const titleFontSize = Math.min(Math.max(width * 0.08, 48), 110);
      offCtx.font = `900 ${titleFontSize}px "Segoe UI Variable Display", -apple-system, system-ui, sans-serif`;
      offCtx.fillText(title, width / 2, height / 2 - 25);

      // Subtitle font calculation
      const subFontSize = Math.min(Math.max(width * 0.016, 12), 22);
      offCtx.font = `600 ${subFontSize}px "Segoe UI Variable Text", monospace, sans-serif`;
      offCtx.letterSpacing = '6px';
      offCtx.fillText(subtitle, width / 2, height / 2 + 55);

      const imgData = offCtx.getImageData(0, 0, width, height).data;
      const points = [];
      const step = Math.max(Math.floor(width / 360), 3); // Adaptive sampling density for 60fps

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          if (imgData[index + 3] > 128) {
            points.push({
              targetX: x,
              targetY: y,
              // Start particles from scattered outer perimeter
              x: (Math.random() - 0.5) * width * 1.8 + width / 2,
              y: (Math.random() - 0.5) * height * 1.8 + height / 2,
              vx: 0,
              vy: 0,
              size: Math.random() * 1.8 + 1.2,
              alpha: Math.random() * 0.7 + 0.3,
              hue: Math.random() > 0.4 ? 158 : 185, // Emerald to cyan palette
              delay: Math.random() * 20
            });
          }
        }
      }
      return points;
    };

    let particles = createTextPoints();

    let frame = 0;
    let state = 'forming';
    const formDuration = 70;      // ~1.1s
    const assembleHold = 110;    // ~1.8s
    const disperseTime = 160;    // ~2.6s

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      if (frame === formDuration) {
        state = 'assembled';
        setPhase('assembled');
      } else if (frame === assembleHold) {
        state = 'dispersing';
        setPhase('dispersing');
        // Impart blast velocity away from screen center
        particles.forEach((p) => {
          const dx = p.x - width / 2;
          const dy = p.y - height / 2;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const speed = Math.random() * 14 + 6;
          p.vx = (dx / dist) * speed + (Math.random() - 0.5) * 8;
          p.vy = (dy / dist) * speed + (Math.random() - 0.5) * 8;
        });
      } else if (frame >= disperseTime) {
        state = 'finished';
        setPhase('finished');
        if (onDispersed) onDispersed();
        return;
      }

      // Draw and update text particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (state === 'forming') {
          // Spring force towards target
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          p.vx = p.vx * 0.86 + dx * 0.08;
          p.vy = p.vy * 0.86 + dy * 0.08;
          p.x += p.vx;
          p.y += p.vy;
        } else if (state === 'assembled') {
          // Micro-shimmer vibration
          const jitterX = (Math.random() - 0.5) * 0.45;
          const jitterY = (Math.random() - 0.5) * 0.45;
          p.x = p.targetX + jitterX;
          p.y = p.targetY + jitterY;
        } else if (state === 'dispersing') {
          // Explode outwards with gentle deceleration and upward float
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.x += p.vx;
          p.y += p.vy - 0.35; // thermal updraft
          p.alpha *= 0.96;
        }

        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      offCanvas.width = width;
      offCanvas.height = height;
      particles = createTextPoints();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [title, subtitle, onDispersed]);

  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 w-full h-full z-30 transition-opacity duration-1000 ${
          phase === 'finished' ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}

export default TextParticleTransition;
