import { useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * useCursorParallax - Parallax Suave de Cursor (Sensação de Profundidade 3D)
 * 
 * Move sutilmente elementos ou imagens de fundo em sentido inverso ao cursor (1% a 2%),
 * gerando profundidade espacial orgânica e calma.
 * 
 * @param {React.RefObject} targetRef - Referência do elemento que responderá ao parallax
 * @param {Object} options - Configurações de intensidade (offsetMax em px)
 */
export function useCursorParallax(targetRef, options = {}) {
  useEffect(() => {
    const target = targetRef?.current;
    if (!target) return;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasFinePointer || prefersReducedMotion) return;

    const maxOffset = options.maxOffset ?? 14; // ~1% do layout

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Normaliza de -1 a +1
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      // Movimento na direção oposta (inverso)
      gsap.to(target, {
        x: -normX * maxOffset,
        y: -normY * maxOffset,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [targetRef, options]);
}

/**
 * useGlobalCursorParallax - Aplica o parallax de profundidade automaticamente
 * em elementos de fundo marcados com a classe '.cursor-parallax-target' ou '.hero-bg'.
 * 
 * @param {React.RefObject} scopeRef - Referência do container raiz
 */
export function useGlobalCursorParallax(scopeRef) {
  useEffect(() => {
    const scope = scopeRef?.current || document;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasFinePointer || prefersReducedMotion) return;

    const targets = scope.querySelectorAll('.cursor-parallax-target, .hero-bg');
    if (!targets.length) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      gsap.to(targets, {
        x: -normX * 12, // 1% a 1.5% sutil
        y: -normY * 8,
        duration: 1.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scopeRef]);
}

export default useCursorParallax;
