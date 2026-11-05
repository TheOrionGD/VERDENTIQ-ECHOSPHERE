import { useEffect } from 'react';

/**
 * Robust IntersectionObserver for trigger-once and continuous reveal classes
 */
export function useScrollReveal() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Select all motion target classes
    const targets = document.querySelectorAll(
      '.reveal-up, .reveal-scale, .reveal-left, .reveal-right, .text-blur-reveal, .stagger-container, .text-mask-wrapper'
    );

    if (prefersReducedMotion) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Unobserve once revealed for zero memory leak & high performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      targets.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);
}

export default useScrollReveal;
