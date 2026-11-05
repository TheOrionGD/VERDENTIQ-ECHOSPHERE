import React, { useRef } from 'react';
import { useMagneticHover } from '../hooks/useAnimations';

export default function MagneticButton({ children, href, onClick, className = 'btn-primary', style = {} }) {
  const btnRef = useRef(null);
  useMagneticHover(btnRef, 0.28);

  if (href) {
    return (
      <a ref={btnRef} href={href} className={className} style={{ display: 'inline-flex', willChange: 'transform', ...style }}>
        {children}
      </a>
    );
  }

  return (
    <button ref={btnRef} onClick={onClick} className={className} style={{ display: 'inline-flex', willChange: 'transform', ...style }}>
      {children}
    </button>
  );
}

