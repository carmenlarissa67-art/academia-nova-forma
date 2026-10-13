import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * useScrollReveal - Revelação Elegante Guiada por Scroll (Page Transitions)
 * 
 * Anima a entrada gradual de seções e cartões via GSAP ScrollTrigger.
 * Aplica uma subida suave de 24px no eixo Y acoplada a um fade-in de opacidade,
 * com easing 'power3.out' (curva cinematográfica não-elástica).
 * 
 * Executa apenas 1 vez (once: true) para garantir que a leitura subsequente seja 100% estável.
 * 
 * @param {React.RefObject} scopeRef - Referência do container raiz ou escopo
 */
export function useScrollReveal(scopeRef) {
  useEffect(() => {
    const scope = scopeRef?.current || document;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Seleciona elementos-chave existentes na estrutura sem exigir reescrita de classes
      const sections = scope.querySelectorAll(
        '.problem-section, .benefits-section, .modalities-section, .testimonials-section, .pricing-section, .faq-section, .cta-final'
      );

      sections.forEach((section) => {
        // Encontra o cabeçalho e os itens filhos daquela seção específica
        const header = section.querySelector('.section-header, h2');
        const items = section.querySelectorAll(
          '.problem-list li, .solution-text, .benefit-card, .modality-card, .testimonial-card, .pricing-card, .faq-item'
        );

        // Animação do cabeçalho da seção
        if (header) {
          gsap.fromTo(
            header,
            { opacity: 0, y: 26 },
            {
              opacity: 1,
              y: 0,
              duration: 0.95,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 86%',
                once: true
              }
            }
          );
        }

        // Animação cadenciada (stagger) dos itens de conteúdo
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 78%',
                once: true
              }
            }
          );
        }
      });
    }, scopeRef);

    return () => {
      ctx.revert();
    };
  }, [scopeRef]);
}

export default useScrollReveal;
