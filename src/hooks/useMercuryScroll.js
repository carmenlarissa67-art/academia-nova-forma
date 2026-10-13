import { useState, useEffect } from 'react';

/**
 * useMercuryScroll - Hook de scroll passivo otimizado para navegação Mercury
 * Monitora o scrollY sem causar layout thrashing, retornando flag booleana
 * para transição suave de glassmorphism.
 * 
 * @param {number} threshold - Ponto de ativação do scroll em pixels (padrão: 50)
 */
export function useMercuryScroll(threshold = 50) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setScrollY(currentY);
          setIsScrolled(currentY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Avaliação inicial
    setIsScrolled(window.scrollY > threshold);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { isScrolled, scrollY };
}

export default useMercuryScroll;
