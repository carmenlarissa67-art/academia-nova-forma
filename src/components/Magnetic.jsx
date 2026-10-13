import { useRef } from 'react';
import { useMagnetic } from '../hooks/useMagnetic';

/**
 * Magnetic - Componente utilitário para envolver qualquer elemento individual
 * e conferir atração magnética ao passar o mouse.
 */
export default function Magnetic({ children, strength = 0.32, className = '' }) {
  const magneticRef = useRef(null);
  useMagnetic(magneticRef, strength);

  return (
    <div
      ref={magneticRef}
      className={`inline-block will-change-transform ${className}`}
      style={{ display: 'inline-block' }}
    >
      {children}
    </div>
  );
}
