import React, { useRef, useEffect } from 'react';

/**
 * AnimatedText Component
 * Splits strings into animated words or individual characters with staggered scroll reveal.
 * 
 * @param {string} text - The text string to animate
 * @param {'words' | 'chars'} mode - Whether to split by words or characters
 * @param {string} className - Optional container CSS class
 * @param {string} tag - HTML element type (h1, h2, h3, p, span)
 * @param {number} baseDelay - Starting delay in ms
 * @param {number} staggerMs - Step delay per unit in ms
 */
export default function AnimatedText({
  text = '',
  mode = 'words',
  className = '',
  tag = 'span',
  baseDelay = 0,
  staggerMs = 35,
  style = {}
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const Component = tag;

  if (mode === 'chars') {
    // Character by character split
    const chars = text.split('');
    return (
      <Component ref={containerRef} className={`animated-text-container mode-chars ${className}`} style={style}>
        {chars.map((char, index) => {
          const delay = baseDelay + index * staggerMs;
          return (
            <span
              key={index}
              className="anim-char-mask"
              style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
            >
              <span
                className="anim-char"
                style={{
                  display: 'inline-block',
                  transitionDelay: `${delay}ms`,
                  whiteSpace: char === ' ' ? 'pre' : 'normal'
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          );
        })}
      </Component>
    );
  }

  // Word by word split (default)
  const words = text.split(' ');
  return (
    <Component ref={containerRef} className={`animated-text-container mode-words ${className}`} style={style}>
      {words.map((word, index) => {
        const delay = baseDelay + index * staggerMs;
        return (
          <span
            key={index}
            className="anim-word-mask"
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.28em' }}
          >
            <span
              className="anim-word"
              style={{
                display: 'inline-block',
                transitionDelay: `${delay}ms`
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </Component>
  );
}

