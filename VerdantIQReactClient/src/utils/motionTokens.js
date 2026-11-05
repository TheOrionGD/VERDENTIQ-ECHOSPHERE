/**
 * Centralized Motion Design Tokens
 * Follows editorial and cinematic easing curves
 */
export const MOTION_TOKENS = {
  ease: {
    editorial: 'power4.out',
    cinematic: 'power3.inOut',
    smooth: 'power2.out',
    snappy: 'back.out(1.4)',
    reveal: 'expo.out'
  },
  duration: {
    instant: 0.2,
    fast: 0.4,
    medium: 0.8,
    editorial: 1.2,
    cinematic: 1.6
  },
  stagger: {
    tight: 0.04,
    medium: 0.08,
    relaxed: 0.14
  }
};

