import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registra o plugin apenas uma vez
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * useOryzoScrollTrigger - Hook de Scroll-telling cinemático (Efeito ORYZO)
 * 
 * Mantém um elemento gráfico central fixo (pin: true) enquanto o conteúdo lateral
 * desliza pela tela, aplicando micro-rotação 3D e escala sutil proporcionais ao scroll.
 * Não quebra o fluxo de leitura nem altera tipografia/margens.
 * 
 * @param {React.RefObject} triggerRef - Referência do container pai da seção
 * @param {React.RefObject} graphicRef - Referência do elemento gráfico que será pinado/rotacionado
 * @param {Object} options - Parâmetros customizáveis para ajuste fino
 */
export function useOryzoScrollTrigger(triggerRef, graphicRef, options = {}) {
  useEffect(() => {
    const triggerEl = triggerRef?.current;
    const graphicEl = graphicRef?.current;

    if (!triggerEl || !graphicEl) return;

    // Respeita preferência por movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Configura contexto do GSAP para limpeza automática no React
    const ctx = gsap.context(() => {
      // Ajuste responsivo: aplica pin completo em desktop e parallax sutil sem pin em telas pequenas
      ScrollTrigger.matchMedia({
        // Desktop (> 768px): Pin ativo com rotação 3D gradual
        '(min-width: 769px)': function () {
          // Define ponto focal 3D suave
          gsap.set(graphicEl, {
            transformPerspective: 1200,
            transformOrigin: 'center center',
            willChange: 'transform'
          });

          gsap.fromTo(
            graphicEl,
            {
              rotationY: options.initialRotationY ?? -4,
              rotationX: options.initialRotationX ?? 3,
              scale: 0.98,
              y: 0
            },
            {
              rotationY: options.finalRotationY ?? 4,
              rotationX: options.finalRotationX ?? -3,
              scale: options.maxScale ?? 1.03,
              ease: 'none',
              scrollTrigger: {
                trigger: triggerEl,
                pin: graphicEl,
                pinSpacing: options.pinSpacing ?? true,
                start: options.start ?? 'top 15%',
                end: options.end ?? 'bottom 85%',
                scrub: options.scrub ?? 1.2,
                anticipatePin: 1,
                invalidateOnRefresh: true
              }
            }
          );
        },

        // Mobile (<= 768px): Sem pin forçado para manter fluxo de leitura natural, apenas parallax suave
        '(max-width: 768px)': function () {
          gsap.fromTo(
            graphicEl,
            {
              scale: 0.99,
              yPercent: -2
            },
            {
              scale: 1.02,
              yPercent: 3,
              ease: 'none',
              scrollTrigger: {
                trigger: triggerEl,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1
              }
            }
          );
        }
      });
    }, triggerRef);

    return () => {
      ctx.revert(); // Garante desmontagem limpa e remoção do ScrollTrigger
    };
  }, [triggerRef, graphicRef, options]);
}

export default useOryzoScrollTrigger;
