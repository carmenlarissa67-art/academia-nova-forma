import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * DalaBackground - Fundo Generativo Minimalista (Efeito Dala)
 * Renderiza um sistema de partículas orgânicas impulsionadas por Perlin/Simplex Noise
 * e morfologia cíclica (fases lunares), respeitando a paleta escura do projeto.
 */
export default function DalaBackground({
  isFixed = false,
  className = '',
  particleCount = 1400
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detecta redução de movimento do usuário
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0); // Fundo 100% transparente
    container.appendChild(renderer.domElement);

    // 2. Geometria de Partículas e Atributos Customizados
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);
    const lunarPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const seeds = new Float32Array(particleCount * 3);

    // Paleta exata do projeto:
    // Text (#F5F8FC), Text Muted (#9AA7B8), Faint Blue (#4DB2FF)
    const colorWhite = new THREE.Color('#F5F8FC');
    const colorMuted = new THREE.Color('#9AA7B8');
    const colorBlue = new THREE.Color('#4DB2FF');

    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Distribuição espacial inicial (nuvem fluida 3D)
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 110;
      const z = (Math.random() - 0.5) * 70;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      initialPositions[i3] = x;
      initialPositions[i3 + 1] = y;
      initialPositions[i3 + 2] = z;

      // Mapeamento lunar: arco/elipse celestial que simula o ciclo orbital/fase lunar
      const theta = Math.random() * Math.PI * 2;
      const radius = 35 + (Math.random() - 0.5) * 8;
      // Curvatura sutil de fase lunar em forma de crescente
      const crescentOffset = Math.sin(theta) * 12;
      lunarPositions[i3] = Math.cos(theta) * radius + crescentOffset * 0.4;
      lunarPositions[i3 + 1] = Math.sin(theta) * radius;
      lunarPositions[i3 + 2] = (Math.random() - 0.5) * 12;

      // Seeds para Perlin noise individual
      seeds[i3] = Math.random() * 100;
      seeds[i3 + 1] = Math.random() * 100;
      seeds[i3 + 2] = Math.random() * 100;

      // Variação de tamanho sutil
      scales[i] = Math.random() * 1.5 + 0.8;

      // Distribuição de cores estritamente monocromática com toques sutis de azul
      const randColor = Math.random();
      if (randColor > 0.88) {
        tempColor.copy(colorBlue); // Toque refinado e sutil (apenas 12% das partículas)
      } else if (randColor > 0.45) {
        tempColor.copy(colorMuted);
      } else {
        tempColor.copy(colorWhite);
      }

      colors[i3] = tempColor.r;
      colors[i3 + 1] = tempColor.g;
      colors[i3 + 2] = tempColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // 3. Shaders customizados para partículas ultra-definidas e iluminação suave
    // Cria pontos perfeitamente circulares com bordas difusas (evita o visual quadriculado de IA)
    const vertexShader = `
      attribute float scale;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;
      
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        // Variação de pulsação suave por distância da câmera
        float dist = length(mvPosition.xyz);
        vAlpha = smoothstep(130.0, 30.0, dist) * 0.55;
        
        gl_PointSize = scale * (180.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;
      
      void main() {
        // Gera um disco suave com decaimento gaussiano orgânico
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        
        float strength = smoothstep(0.5, 0.05, d) * vAlpha;
        gl_FragColor = vec4(vColor, strength);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 4. Implementação de Simplex/Perlin Noise 3D ultra-rápida (Stefan Gustavson formulation)
    const F3 = 1.0 / 3.0;
    const G3 = 1.0 / 6.0;
    const p = new Uint8Array(512);
    for (let i = 0; i < 256; i++) p[i] = p[i + 256] = Math.floor(Math.random() * 256);

    const grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];

    function noise3D(xin, yin, zin) {
      let n0, n1, n2, n3;
      const s = (xin + yin + zin) * F3;
      const i = Math.floor(xin + s);
      const j = Math.floor(yin + s);
      const k = Math.floor(zin + s);
      const t = (i + j + k) * G3;
      const X0 = i - t;
      const Y0 = j - t;
      const Z0 = k - t;
      const x0 = xin - X0;
      const y0 = yin - Y0;
      const z0 = zin - Z0;

      let i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) {
        if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
        else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
      } else {
        if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
        else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
        else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      }

      const x1 = x0 - i1 + G3;
      const y1 = y0 - j1 + G3;
      const z1 = z0 - k1 + G3;
      const x2 = x0 - i2 + 2.0 * G3;
      const y2 = y0 - j2 + 2.0 * G3;
      const z2 = z0 - k2 + 2.0 * G3;
      const x3 = x0 - 1.0 + 3.0 * G3;
      const y3 = y0 - 1.0 + 3.0 * G3;
      const z3 = z0 - 1.0 + 3.0 * G3;

      const ii = i & 255;
      const jj = j & 255;
      const kk = k & 255;

      const gi0 = p[ii + p[jj + p[kk]]] % 12;
      const gi1 = p[ii + i1 + p[jj + j1 + p[kk + k1]]] % 12;
      const gi2 = p[ii + i2 + p[jj + j2 + p[kk + k2]]] % 12;
      const gi3 = p[ii + 1 + p[jj + 1 + p[kk + 1]]] % 12;

      let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 < 0) n0 = 0.0;
      else { t0 *= t0; n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0 + grad3[gi0][2] * z0); }

      let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 < 0) n1 = 0.0;
      else { t1 *= t1; n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1 + grad3[gi1][2] * z1); }

      let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 < 0) n2 = 0.0;
      else { t2 *= t2; n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2 + grad3[gi2][2] * z2); }

      let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 < 0) n3 = 0.0;
      else { t3 *= t3; n3 = t3 * t3 * (grad3[gi3][0] * x3 + grad3[gi3][1] * y3 + grad3[gi3][2] * z3); }

      return 32.0 * (n0 + n1 + n2 + n3);
    }

    // 5. Interação com Cursor (Parallax ultra-amortecido)
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      targetMouseX = (e.clientX / innerWidth - 0.5) * 8;
      targetMouseY = (e.clientY / innerHeight - 0.5) * 8;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 6. Loop de Animação com Morfologia Lunar Contínua
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;
      const speed = prefersReducedMotion ? 0.02 : 0.15;
      const t = elapsedTime * speed;

      // Interpolação suave do mouse (damping de 5%)
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      particleSystem.rotation.y = mouseX * 0.02 + elapsedTime * 0.015;
      particleSystem.rotation.x = -mouseY * 0.02;

      // Ciclo de transição de fase lunar contínua (período de ~24 segundos)
      // Varia suavemente entre 0.0 (nuvem livre) e 0.45 (alinhamento lunar sutil)
      const lunarWeight = (Math.sin(elapsedTime * 0.25) * 0.5 + 0.5) * 0.45;

      const posArr = geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const seedX = seeds[i3];
        const seedY = seeds[i3 + 1];
        const seedZ = seeds[i3 + 2];

        // Vetores de ruído de Perlin tridimensional
        const nx = noise3D(seedX, seedY, t * 0.4) * 8;
        const ny = noise3D(seedY, seedZ, t * 0.4) * 8;
        const nz = noise3D(seedZ, seedX, t * 0.3) * 6;

        const initX = initialPositions[i3] + nx;
        const initY = initialPositions[i3 + 1] + ny;
        const initZ = initialPositions[i3 + 2] + nz;

        const moonX = lunarPositions[i3] + nx * 0.3;
        const moonY = lunarPositions[i3 + 1] + ny * 0.3;
        const moonZ = lunarPositions[i3 + 2] + nz * 0.3;

        // Lerp entre a nuvem orgânica de ruído e a forma lunar
        posArr[i3] = initX * (1 - lunarWeight) + moonX * lunarWeight;
        posArr[i3 + 1] = initY * (1 - lunarWeight) + moonY * lunarWeight;
        posArr[i3 + 2] = initZ * (1 - lunarWeight) + moonZ * lunarWeight;
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // 7. Redimensionamento Responsivo
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 8. Limpeza de Recursos (Zero memory leak)
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [particleCount]);

  const positioningStyle = isFixed
    ? { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }
    : { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 };

  return (
    <div
      ref={containerRef}
      className={`dala-canvas-container ${className}`}
      style={{
        ...positioningStyle,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
      aria-hidden="true"
    />
  );
}
