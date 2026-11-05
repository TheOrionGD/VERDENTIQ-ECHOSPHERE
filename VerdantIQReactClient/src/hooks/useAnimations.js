import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook for smooth Lenis-like scroll or Lenis instance sync
 */
export function useLenisScroll() {
  useEffect(() => {
    let lenisInstance = null;
    let rafId = null;

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis');
        const Lenis = LenisModule.default || LenisModule;
        
        lenisInstance = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          touchMultiplier: 1.5
        });

        lenisInstance.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenisInstance.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      } catch (err) {
        console.warn('Lenis could not be initialized, falling back to standard scroll', err);
      }
    };

    initLenis();

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, []);
}

/**
 * Text reveal hook for headings & editorial statements
 */
export function useTextReveal(selector, triggerSelector, options = {}) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray(selector);
      targets.forEach((target) => {
        gsap.fromTo(
          target,
          {
            y: options.y || 45,
            opacity: 0,
            filter: 'blur(8px)',
            transformOrigin: '0% 50%'
          },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: options.duration || 1.1,
            ease: 'power3.out',
            stagger: options.stagger || 0.08,
            scrollTrigger: {
              trigger: triggerSelector || target,
              start: options.start || 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, [selector, triggerSelector]);
}

/**
 * Parallax movement hook for layered depth
 */
export function useParallax(targetRef, speed = 0.25) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !targetRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(targetRef.current, {
        yPercent: -speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: targetRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    return () => ctx.revert();
  }, [targetRef, speed]);
}

/**
 * Magnetic button interaction hook
 */
export function useMagneticHover(buttonRef, strength = 0.35) {
  useEffect(() => {
    const el = buttonRef.current;
    if (!el || window.matchMedia('(max-width: 768px)').matches) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength;

      gsap.to(el, {
        x,
        y,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [buttonRef, strength]);
}

