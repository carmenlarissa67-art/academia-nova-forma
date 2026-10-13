import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/creative-interactions.css';

/**
 * CustomCursor - Cursor Minimalista Global com Mix-Blend-Mode
 * 
 * Cria um ponto de precisão central e um anel fluido que segue o mouse
 * com inércia cinemática. Usa `mix-blend-mode: difference` para garantir
 * contraste absoluto sobre qualquer fundo (escuro, claro ou com imagem).
 * 
 * Detecta interações com botões/links e se adapta sem afetar touchscreens.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // 1. Não inicializa em dispositivos sem ponteiro fino (touchscreens/smartphones)
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    // 2. Configura interpolação rápida GSAP (zero lag)
    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power2.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power2.out' });
    
    // O anel tem inércia mais cinematográfica (duração de 0.28s)
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'power3.out' });

    let isVisible = false;

    const handleMouseMove = (e) => {
      if (!isVisible) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
        isVisible = true;
      }
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);
    };

    const handleMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    };

    const handleMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
      isVisible = false;
    };

    // 3. Detecção de elementos interativos para expansão do cursor
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, input, [role="button"], .modality-card, .faq-item');
      if (target) {
        ring.classList.add('is-hovering');
        dot.classList.add('is-hovering');
      } else {
        ring.classList.remove('is-hovering');
        dot.classList.remove('is-hovering');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    // 4. Limpeza
    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  );
}
