import { useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * useMagnetic - Hook para Efeito Magnético Individual
 * 
 * Atrai suavemente o elemento em direção ao cursor quando o mouse passa sobre ele
 * e retorna à posição neutra com desaceleração fluida (power3.out), sem oscilações elásticas.
 * 
 * @param {React.RefObject} ref - Referência do elemento que terá o comportamento magnético
 * @param {number} strength - Força da atração (padrão: 0.32, resultando em ~8-12px de deslocamento)
 */
export function useMagnetic(ref, strength = 0.32) {
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'power3.out'
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, strength]);
}

/**
 * useGlobalMagnetic - Aplica efeito magnético a todos os botões e links de ação
 * 
 * Descobre automaticamente botões (.btn-primary, .btn-ghost, .menu-btn, .floating-whatsapp)
 * e aplica o efeito magnético de forma não-intrusiva sem que o usuário precise envelopar cada um.
 * 
 * @param {React.RefObject} scopeRef - Referência do container raiz
 */
export function useGlobalMagnetic(scopeRef) {
  useEffect(() => {
    const scope = scopeRef?.current || document;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    const buttons = scope.querySelectorAll('.btn-primary, .btn-ghost, .menu-btn, .floating-whatsapp');
    const cleanups = [];

    buttons.forEach((btn) => {
      const handleMouseMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        gsap.to(btn, {
          x: deltaX,
          y: deltaY,
          duration: 0.28,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'power3.out'
        });
      };

      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseleave', handleMouseLeave);

      cleanups.push(() => {
        btn.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [scopeRef]);
}

export default useMagnetic;
