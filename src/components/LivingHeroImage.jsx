import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * LivingHeroImage - Efeito 'Foto Viva' (Cinemagraph / WebGL Displacement)
 * 
 * Transforma uma imagem estática em uma experiência visual viva e orgânica.
 * Aplica um mapa de deslocamento procedimental contínuo (Simplex Noise 2D)
 * simulando uma respiração lenta e fluxo sutil de profundidade, transmitindo calma e foco.
 * 
 * Mantém 100% o enquadramento (object-fit: cover) sem distorcer proporções.
 */
export default function LivingHeroImage({
  src = '/hero_bg.jpg',
  alt = 'Academia Nova Forma',
  className = 'hero-img',
  intensity = 0.016, // Intensidade ultra-suave (sem distorções grotescas)
  speed = 0.35 // Ritmo calmo e contemplativo
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Three.js Scene & Orthographic Quad (Full Viewport)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch {
      setHasError(true);
      return;
    }

    // 2. Carrega a textura e extrai a resolução original para manter proporção perfeita
    const textureLoader = new THREE.TextureLoader();
    let texture = null;
    let material = null;
    let animationFrameId;

    const uniforms = {
      uTexture: { value: null },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uImageResolution: { value: new THREE.Vector2(1920, 1080) },
      uIntensity: { value: prefersReducedMotion ? 0.0 : intensity },
      uSpeed: { value: speed }
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uImageResolution;
      uniform float uIntensity;
      varying vec2 vUv;

      // Implementação elegante de Simplex Noise 2D
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        // Cálculo de 'object-fit: cover' no espaço UV do Shader
        vec2 ratio = vec2(
          min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
          min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
        );
        vec2 coverUv = vec2(
          vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
          vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
        );

        // Fluxo orgânico de respiração (dupla oitava suave de noise)
        float t = uTime * 0.28;
        float n1 = snoise(coverUv * 2.5 + vec2(t * 0.12, t * 0.08));
        float n2 = snoise(coverUv * 4.8 - vec2(t * 0.09, t * 0.15));

        vec2 displacement = vec2(n1, n2) * uIntensity;

        // Pulsação sutil radial (expansão e contração de respiração viva)
        float breath = sin(uTime * 0.42) * 0.004;
        vec2 centerOffset = coverUv - vec2(0.5);

        vec2 finalUv = coverUv + displacement + centerOffset * breath;

        // Trava para evitar repetição nas bordas
        finalUv = clamp(finalUv, 0.002, 0.998);

        vec4 color = texture2D(uTexture, finalUv);
        gl_FragColor = color;
      }
    `;

    textureLoader.load(
      src,
      (loadedTexture) => {
        texture = loadedTexture;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const img = loadedTexture.image;
        if (img) {
          uniforms.uImageResolution.value.set(img.naturalWidth || img.width, img.naturalHeight || img.height);
        }

        uniforms.uTexture.value = texture;

        material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms,
          depthWrite: false,
          depthTest: false
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Inicia loop
        const startTime = performance.now();
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          const elapsed = (performance.now() - startTime) * 0.001;
          uniforms.uTime.value = elapsed * uniforms.uSpeed.value;
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      () => {
        setHasError(true);
      }
    );

    // 3. Ajuste de Redimensionamento Responsivo
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // 4. Limpeza
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (texture) texture.dispose();
      if (material) material.dispose();
      if (renderer) renderer.dispose();
    };
  }, [src, intensity, speed]);

  if (hasError) {
    // Fallback gracioso mantendo a imagem nativa se WebGL não for suportado
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="eager"
        fetchPriority="high"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`living-image-wrapper ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
        aria-label={alt}
      />
    </div>
  );
}
