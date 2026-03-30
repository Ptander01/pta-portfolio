/**
 * ParticleHero.tsx
 * ─────────────────────────────────────────────────────────────
 * The WebGL engine behind the cinematic scroll experience.
 *
 * Architecture:
 *   - Single persistent Three.js scene — never torn down
 *   - One BufferGeometry with MAX_PARTICLES points
 *   - Per-chapter target positions stored in Float32Arrays
 *   - GSAP animates particle positions between chapter states
 *   - Custom ShaderMaterial for per-particle color + size + alpha
 *   - Chapter color uniforms transition via GSAP
 *   - Chapter 7: particles assemble into name glyphs, then fires
 *     onIdentityComplete()
 *
 * Theme-aware rendering:
 *   - Dark mode:  AdditiveBlending, bright accent colors, glowing particles
 *   - Light mode: NormalBlending, matte charcoal particles, ink/graphite feel
 *
 * Chapter scenes:
 *   1 · Capture     — orbital satellite swarm + crop field grid
 *   2 · Raw Data    — pixel raster grid dissolving into noise
 *   3 · Processing  — band separation → classified land surface
 *   4 · The Map     — census block choropleth + city grid
 *   5 · Analysis    — 3D urban extrusion + hotspot clusters
 *   6 · AI/Insight  — data center rack geometry + flow streams
 *   7 · Identity    — particles spell "PATRICK ANDERSON"
 *
 * Props:
 *   activeChapter      : number  (1–7, from useActiveChapter hook)
 *   onIdentityComplete : () => void  (fires after name assembly)
 *   isDark             : boolean (theme state from useTheme)
 *
 * Patrick Anderson — PTA Geospatial Intelligence
 */

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const MAX_PARTICLES = 18_000;

// Per-chapter accent colors — DARK MODE (bright, glowing)
const CHAPTER_COLORS_DARK: Record<number, [number, number, number]> = {
  1: [0.0,   0.898, 1.0  ],   // #00E5FF  cold cyan
  2: [1.0,   0.420, 0.169],   // #FF6B2B  infrared orange
  3: [0.0,   0.784, 0.592],   // #00C897  teal
  4: [0.498, 0.784, 0.753],   // #7FC8C0  census teal
  5: [0.290, 0.565, 0.851],   // #4A90D9  steel blue
  6: [0.910, 0.627, 0.188],   // #E8A030  amber
  7: [0.961, 0.871, 0.702],   // #F5DEB3  warm wheat
};

// Per-chapter accent colors — LIGHT MODE (matte charcoal tints)
// Base charcoal with subtle chapter-specific warm/cool shifts
const CHAPTER_COLORS_LIGHT: Record<number, [number, number, number]> = {
  1: [0.18,  0.20,  0.22 ],   // cool charcoal (slight blue)
  2: [0.22,  0.18,  0.16 ],   // warm charcoal (slight brown)
  3: [0.16,  0.20,  0.19 ],   // teal-tinted charcoal
  4: [0.19,  0.21,  0.20 ],   // neutral charcoal
  5: [0.17,  0.19,  0.23 ],   // steel charcoal (slight blue)
  6: [0.23,  0.20,  0.16 ],   // amber-tinted charcoal
  7: [0.12,  0.11,  0.10 ],   // deep charcoal for name reveal
};

// Transition durations per chapter change (seconds)
const MORPH_DURATION = 2.4;
const COLOR_DURATION = 2.8;
const IDENTITY_ASSEMBLE_DURATION = 3.2;

// Reduced motion check
const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

/* ─────────────────────────────────────────────────────────────
   VERTEX SHADER
───────────────────────────────────────────────────────────── */
const VERTEX_SHADER = /* glsl */ `
  attribute vec3  aColor;
  attribute float aSize;
  attribute float aAlpha;

  uniform float uTime;
  uniform float uProgress;
  uniform vec3  uAccentColor;
  uniform float uAccentBlend;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Blend per-particle color toward chapter accent over transition
    vec3 col = mix(aColor, uAccentColor, uAccentBlend * 0.35);
    vColor = col;

    // Subtle shimmer — particles breathe slightly
    float shimmer = sin(uTime * 1.4 + position.x * 3.1 + position.y * 2.7) * 0.5 + 0.5;
    vAlpha = aAlpha * (0.72 + shimmer * 0.28);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (280.0 / -mvPosition.z);
    gl_Position  = projectionMatrix * mvPosition;
  }
`;

/* ─────────────────────────────────────────────────────────────
   FRAGMENT SHADER
───────────────────────────────────────────────────────────── */
const FRAGMENT_SHADER = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Circular soft disc
    vec2  uv   = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Soft edge falloff
    float alpha = smoothstep(0.5, 0.15, dist) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

/* ─────────────────────────────────────────────────────────────
   GEOMETRY GENERATORS
   Each returns a Float32Array of length MAX_PARTICLES * 3 (xyz)
   All coordinates in normalized scene space [-8, 8]
───────────────────────────────────────────────────────────── */

/** Utility: seeded pseudo-random (fast, deterministic) */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Ch1 · CAPTURE
 * Satellite orbital ring + crop field grid below
 */
function generateCapture(): Float32Array {
  const pos = new Float32Array(MAX_PARTICLES * 3);
  const rng = seededRandom(1001);
  let i = 0;

  // Orbital ring — 6000 particles
  const ringCount = 6000;
  for (let p = 0; p < ringCount && i < MAX_PARTICLES; p++, i++) {
    const angle = (p / ringCount) * Math.PI * 2;
    const tilt  = 0.3;
    const r     = 5.5 + (rng() - 0.5) * 0.6;
    pos[i * 3]     = Math.cos(angle) * r;
    pos[i * 3 + 1] = Math.sin(angle) * r * Math.cos(tilt) + (rng() - 0.5) * 0.3;
    pos[i * 3 + 2] = Math.sin(angle) * r * Math.sin(tilt) + (rng() - 0.5) * 0.2;
  }

  // Secondary smaller orbital ring (inclined)
  const ring2 = 3000;
  for (let p = 0; p < ring2 && i < MAX_PARTICLES; p++, i++) {
    const angle = (p / ring2) * Math.PI * 2 + 1.0;
    const r     = 4.2 + (rng() - 0.5) * 0.4;
    pos[i * 3]     = Math.cos(angle) * r;
    pos[i * 3 + 1] = Math.sin(angle) * r * Math.cos(0.8) + (rng() - 0.5) * 0.2;
    pos[i * 3 + 2] = Math.sin(angle) * r * Math.sin(0.8);
  }

  // Agricultural field grid below — rows of crops
  const fieldCount = MAX_PARTICLES - i;
  const cols = 80;
  const rows = Math.ceil(fieldCount / cols);
  for (let r = 0; r < rows && i < MAX_PARTICLES; r++) {
    for (let c = 0; c < cols && i < MAX_PARTICLES; c++, i++) {
      const blockX = Math.floor(c / 8) * 1.8 - 7;
      const blockY = Math.floor(r / 6) * 1.2 - 5;
      pos[i * 3]     = blockX + (rng() - 0.5) * 1.6 + (rng() - 0.5) * 0.1;
      pos[i * 3 + 1] = blockY + (rng() - 0.5) * 1.0;
      pos[i * 3 + 2] = (rng() - 0.5) * 1.5;
    }
  }

  return pos;
}

/**
 * Ch2 · RAW DATA
 * Dense pixel raster grid — regular with noise
 */
function generateRawData(): Float32Array {
  const pos = new Float32Array(MAX_PARTICLES * 3);
  const rng = seededRandom(2002);
  const cols = 134;
  const rows = Math.ceil(MAX_PARTICLES / cols);

  for (let i = 0; i < MAX_PARTICLES; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = (c / cols) * 16 - 8;
    const y = (r / rows) * 12 - 6;
    const noise = rng() * 0.18;
    pos[i * 3]     = x + (rng() - 0.5) * noise;
    pos[i * 3 + 1] = y + (rng() - 0.5) * noise;
    pos[i * 3 + 2] = (rng() - 0.5) * 0.8;
  }

  return pos;
}

/**
 * Ch3 · PROCESSING
 * Spectral bands separating — horizontal layer stripes
 */
function generateProcessing(): Float32Array {
  const pos = new Float32Array(MAX_PARTICLES * 3);
  const rng = seededRandom(3003);
  const bandCount = 6;
  const perBand = Math.floor(MAX_PARTICLES / bandCount);

  for (let b = 0; b < bandCount; b++) {
    const bandY = (b / (bandCount - 1)) * 10 - 5;
    for (let p = 0; p < perBand; p++) {
      const i = b * perBand + p;
      if (i >= MAX_PARTICLES) break;
      const x = (p / perBand) * 16 - 8;
      const zDepth = (b - bandCount / 2) * 0.5;
      pos[i * 3]     = x + (rng() - 0.5) * 0.3;
      pos[i * 3 + 1] = bandY + (rng() - 0.5) * 0.35;
      pos[i * 3 + 2] = zDepth + (rng() - 0.5) * 0.2;
    }
  }

  return pos;
}

/**
 * Ch4 · THE MAP
 * Census block grid — irregular polygonal clusters
 */
function generateTheMap(): Float32Array {
  const pos = new Float32Array(MAX_PARTICLES * 3);
  const rng = seededRandom(4004);

  const blocks: Array<{x: number; y: number; w: number; h: number; density: number}> = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 10; c++) {
      blocks.push({
        x: c * 1.6 - 7.5,
        y: r * 1.4 - 5.2,
        w: 1.2 + rng() * 0.5,
        h: 1.0 + rng() * 0.4,
        density: 0.3 + rng() * 0.7,
      });
    }
  }

  const totalDensity = blocks.reduce((s, b) => s + b.density, 0);
  let i = 0;

  for (const block of blocks) {
    const count = Math.floor((block.density / totalDensity) * MAX_PARTICLES);
    for (let p = 0; p < count && i < MAX_PARTICLES; p++, i++) {
      pos[i * 3]     = block.x + rng() * block.w;
      pos[i * 3 + 1] = block.y + rng() * block.h;
      pos[i * 3 + 2] = (rng() - 0.5) * 0.4;
    }
  }

  while (i < MAX_PARTICLES) {
    pos[i * 3]     = (rng() - 0.5) * 16;
    pos[i * 3 + 1] = (rng() - 0.5) * 11;
    pos[i * 3 + 2] = (rng() - 0.5) * 0.3;
    i++;
  }

  return pos;
}

/**
 * Ch5 · ANALYSIS
 * 3D urban extrusion — building heights as data
 */
function generateAnalysis(): Float32Array {
  const pos = new Float32Array(MAX_PARTICLES * 3);
  const rng = seededRandom(5005);

  const gridCols = 20;
  const gridRows = 15;
  const buildings: Array<{x: number; z: number; height: number}> = [];

  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const centerDist = Math.sqrt(
        Math.pow((c - gridCols / 2) / gridCols, 2) +
        Math.pow((r - gridRows / 2) / gridRows, 2)
      );
      const height = Math.max(0.2, (1 - centerDist * 1.8) * 5 + rng() * 1.5);
      buildings.push({
        x: (c / gridCols) * 14 - 7,
        z: (r / gridRows) * 10 - 5,
        height,
      });
    }
  }

  const perBuilding = Math.floor(MAX_PARTICLES / buildings.length);
  let i = 0;

  for (const b of buildings) {
    const count = Math.max(1, Math.floor(perBuilding * (b.height / 5)));
    for (let p = 0; p < count && i < MAX_PARTICLES; p++, i++) {
      pos[i * 3]     = b.x + (rng() - 0.5) * 0.55;
      pos[i * 3 + 1] = rng() * b.height - b.height * 0.1;
      pos[i * 3 + 2] = b.z + (rng() - 0.5) * 0.55;
    }
  }

  while (i < MAX_PARTICLES) {
    pos[i * 3]     = (rng() - 0.5) * 14;
    pos[i * 3 + 1] = (rng() - 0.5) * 2;
    pos[i * 3 + 2] = (rng() - 0.5) * 10;
    i++;
  }

  return pos;
}

/**
 * Ch6 · AI / INSIGHT
 * Data center rack geometry + signal flow streams
 */
function generateAIInsight(): Float32Array {
  const pos = new Float32Array(MAX_PARTICLES * 3);
  const rng = seededRandom(6006);

  const rackCount = 8;
  const rackParticles = Math.floor(MAX_PARTICLES * 0.65);
  const perRack = Math.floor(rackParticles / rackCount);

  let i = 0;
  for (let rack = 0; rack < rackCount; rack++) {
    const rackX = (rack / (rackCount - 1)) * 12 - 6;
    for (let p = 0; p < perRack && i < MAX_PARTICLES; p++, i++) {
      pos[i * 3]     = rackX + (rng() - 0.5) * 0.5;
      pos[i * 3 + 1] = (p / perRack) * 8 - 4 + (rng() - 0.5) * 0.15;
      pos[i * 3 + 2] = (rng() - 0.5) * 1.2;
    }
  }

  const streamParticles = MAX_PARTICLES - i;
  for (let p = 0; p < streamParticles && i < MAX_PARTICLES; p++, i++) {
    const t     = p / streamParticles;
    const arcX  = (t * 2 - 1) * 7;
    const arcY  = Math.sin(t * Math.PI) * 3 - 1.5 + (rng() - 0.5) * 0.8;
    const arcZ  = Math.cos(t * Math.PI * 4) * 2 + (rng() - 0.5) * 0.5;
    pos[i * 3]     = arcX;
    pos[i * 3 + 1] = arcY;
    pos[i * 3 + 2] = arcZ;
  }

  return pos;
}

/**
 * Ch7 · IDENTITY
 * Particles assemble into "PATRICK ANDERSON" text.
 * Wrapped in document.fonts.ready to prevent font race condition.
 */
async function generateIdentityAsync(): Promise<Float32Array> {
  await document.fonts.ready;

  const pos = new Float32Array(MAX_PARTICLES * 3);
  const rng = seededRandom(7007);

  const canvas  = document.createElement("canvas");
  canvas.width  = 800;
  canvas.height = 200;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000000";
  ctx.font      = "bold 68px 'Playfair Display', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PATRICK", canvas.width / 2, 70);
  ctx.fillText("ANDERSON", canvas.width / 2, 148);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels    = imageData.data;

  const textPixels: Array<[number, number]> = [];
  for (let py = 0; py < canvas.height; py++) {
    for (let px = 0; px < canvas.width; px++) {
      const idx = (py * canvas.width + px) * 4;
      const brightness = pixels[idx];
      if (brightness < 128) {
        textPixels.push([px, py]);
      }
    }
  }

  for (let i = 0; i < MAX_PARTICLES; i++) {
    if (textPixels.length === 0) {
      pos[i * 3]     = (rng() - 0.5) * 12;
      pos[i * 3 + 1] = (rng() - 0.5) * 3;
      pos[i * 3 + 2] = (rng() - 0.5) * 0.5;
      continue;
    }

    const sample = textPixels[Math.floor(rng() * textPixels.length)];
    const sceneX = (sample[0] / canvas.width)  * 14 - 7;
    const sceneY = -(sample[1] / canvas.height) * 6 + 3;

    pos[i * 3]     = sceneX + (rng() - 0.5) * 0.08;
    pos[i * 3 + 1] = sceneY + (rng() - 0.5) * 0.08;
    pos[i * 3 + 2] = (rng() - 0.5) * 0.3;
  }

  return pos;
}

/* ─────────────────────────────────────────────────────────────
   PARTICLE ATTRIBUTE GENERATORS
   Theme-aware: dark mode = bright accents, light mode = charcoal
───────────────────────────────────────────────────────────── */

function generateColors(chapter: number, isDark: boolean): Float32Array {
  const colors = new Float32Array(MAX_PARTICLES * 3);
  const rng    = seededRandom(chapter * 9999);
  const palette = isDark ? CHAPTER_COLORS_DARK : CHAPTER_COLORS_LIGHT;
  const base   = palette[chapter] ?? palette[1];

  // Light mode: very tight variation for consistent charcoal
  // Dark mode: wider variation for sparkle
  const variation = isDark ? 0.15 : 0.04;

  for (let i = 0; i < MAX_PARTICLES; i++) {
    colors[i * 3]     = Math.max(0, Math.min(1, base[0] + (rng() - 0.5) * variation));
    colors[i * 3 + 1] = Math.max(0, Math.min(1, base[1] + (rng() - 0.5) * variation));
    colors[i * 3 + 2] = Math.max(0, Math.min(1, base[2] + (rng() - 0.5) * variation));
  }

  return colors;
}

function generateSizes(chapter: number, isDark: boolean): Float32Array {
  const sizes = new Float32Array(MAX_PARTICLES);
  const rng   = seededRandom(chapter * 1337);

  for (let i = 0; i < MAX_PARTICLES; i++) {
    if (isDark) {
      // Dark mode: original sizes
      const base = chapter === 7 ? 1.8 : 1.2;
      sizes[i] = base + rng() * 1.0;
    } else {
      // Light mode: smaller, tighter particles for matte feel
      const base = chapter === 7 ? 1.2 : 0.7;
      sizes[i] = base + rng() * 0.5;
    }
  }

  return sizes;
}

function generateAlphas(chapter: number, isDark: boolean): Float32Array {
  const alphas = new Float32Array(MAX_PARTICLES);
  const rng    = seededRandom(chapter * 2674);

  for (let i = 0; i < MAX_PARTICLES; i++) {
    if (isDark) {
      // Dark mode: original alpha range
      alphas[i] = 0.4 + rng() * 0.6;
    } else {
      // Light mode: lower, more uniform opacity for matte charcoal
      alphas[i] = 0.25 + rng() * 0.35;
    }
  }

  return alphas;
}

/* ─────────────────────────────────────────────────────────────
   SCENE GEOMETRY CACHE
   Chapters 1-6 are synchronous; Chapter 7 is async (font loading).
───────────────────────────────────────────────────────────── */
const SYNC_GENERATORS: Record<number, () => Float32Array> = {
  1: generateCapture,
  2: generateRawData,
  3: generateProcessing,
  4: generateTheMap,
  5: generateAnalysis,
  6: generateAIInsight,
};

/* ─────────────────────────────────────────────────────────────
   PARTICLE HERO COMPONENT
───────────────────────────────────────────────────────────── */
interface ParticleHeroProps {
  activeChapter: number;
  onIdentityComplete: () => void;
  isDark: boolean;
}

export default function ParticleHero({
  activeChapter,
  onIdentityComplete,
  isDark,
}: ParticleHeroProps) {
  const mountRef           = useRef<HTMLDivElement>(null);
  const rendererRef        = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef           = useRef<THREE.Scene | null>(null);
  const cameraRef          = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef        = useRef<THREE.ShaderMaterial | null>(null);
  const geometryRef        = useRef<THREE.BufferGeometry | null>(null);
  const pointsRef          = useRef<THREE.Points | null>(null);
  const rafRef             = useRef<number>(0);
  const prevChapterRef     = useRef<number>(0);
  const positionCacheRef   = useRef<Record<number, Float32Array>>({});
  const identityFiredRef   = useRef(false);
  const clockRef           = useRef(new THREE.Clock());
  const isDarkRef          = useRef(isDark);

  // Keep isDarkRef in sync
  isDarkRef.current = isDark;

  /* ── Get positions (sync for 1-6, async-cached for 7) ── */
  const getPositions = useCallback((chapter: number): Float32Array => {
    if (positionCacheRef.current[chapter]) {
      return positionCacheRef.current[chapter];
    }
    if (chapter !== 7 && SYNC_GENERATORS[chapter]) {
      const result = SYNC_GENERATORS[chapter]();
      positionCacheRef.current[chapter] = result;
      return result;
    }
    // Chapter 7 not cached yet — return chapter 1 as fallback
    return positionCacheRef.current[1] ?? generateCapture();
  }, []);

  /* ── Scene setup ── */
  useEffect(() => {
    if (!mountRef.current) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 12);
    cameraRef.current = camera;

    // Geometry — single persistent buffer
    const geometry = new THREE.BufferGeometry();
    const initialPositions = getPositions(1);

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(initialPositions.slice(), 3)
    );
    geometry.setAttribute(
      "aColor",
      new THREE.BufferAttribute(generateColors(1, isDarkRef.current), 3)
    );
    geometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(generateSizes(1, isDarkRef.current), 1)
    );
    geometry.setAttribute(
      "aAlpha",
      new THREE.BufferAttribute(generateAlphas(1, isDarkRef.current), 1)
    );

    geometryRef.current = geometry;

    // Shader material — blending mode set by theme
    const palette = isDarkRef.current ? CHAPTER_COLORS_DARK : CHAPTER_COLORS_LIGHT;
    const [r, g, b] = palette[1];
    const material = new THREE.ShaderMaterial({
      vertexShader:   VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime:        { value: 0 },
        uProgress:    { value: 0 },
        uAccentColor: { value: new THREE.Vector3(r, g, b) },
        uAccentBlend: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: isDarkRef.current ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    materialRef.current = material;

    // Points mesh
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    pointsRef.current = points;

    // Pre-cache chapters 2-6 synchronously in background (staggered)
    let cacheIdx = 2;
    const cacheNext = () => {
      if (cacheIdx <= 6) {
        getPositions(cacheIdx);
        cacheIdx++;
        setTimeout(cacheNext, 80);
      }
    };
    setTimeout(cacheNext, 500);

    // Pre-cache chapter 7 asynchronously (requires font loading)
    generateIdentityAsync().then((positions) => {
      positionCacheRef.current[7] = positions;
    });

    // Animation loop
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const elapsed = clockRef.current.getElapsedTime();
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = elapsed;
      }
      // Slow camera drift — cinematic parallax
      if (cameraRef.current && !PREFERS_REDUCED_MOTION) {
        cameraRef.current.position.x = Math.sin(elapsed * 0.07) * 0.4;
        cameraRef.current.position.y = Math.cos(elapsed * 0.05) * 0.25;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [getPositions]);

  /* ── Theme change — update blending, colors, sizes, alphas ── */
  useEffect(() => {
    if (!materialRef.current || !geometryRef.current) return;

    const material = materialRef.current;
    const geometry = geometryRef.current;
    const chapter  = prevChapterRef.current || 1;

    // Switch blending mode
    material.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
    material.needsUpdate = true;

    // Update accent color uniform
    const palette = isDark ? CHAPTER_COLORS_DARK : CHAPTER_COLORS_LIGHT;
    const [tr, tg, tb] = palette[chapter] ?? palette[1];

    const colorDur = PREFERS_REDUCED_MOTION ? 0.01 : 1.2;
    gsap.to(material.uniforms.uAccentColor.value, {
      x: tr,
      y: tg,
      z: tb,
      duration: colorDur,
      ease: "power1.inOut",
    });

    // Transition per-particle attributes to new theme
    const newColors = generateColors(chapter, isDark);
    const newSizes  = generateSizes(chapter, isDark);
    const newAlphas = generateAlphas(chapter, isDark);
    const colorAttr = geometry.attributes.aColor as THREE.BufferAttribute;
    const sizeAttr  = geometry.attributes.aSize  as THREE.BufferAttribute;
    const alphaAttr = geometry.attributes.aAlpha as THREE.BufferAttribute;

    const oldColors = (colorAttr.array as Float32Array).slice();
    const oldSizes  = (sizeAttr.array  as Float32Array).slice();
    const oldAlphas = (alphaAttr.array as Float32Array).slice();

    const themeProxy = { t: 0 };
    gsap.to(themeProxy, {
      t: 1,
      duration: colorDur,
      ease: "power1.inOut",
      onUpdate() {
        const t = themeProxy.t;
        const ca = colorAttr.array as Float32Array;
        const sa = sizeAttr.array  as Float32Array;
        const aa = alphaAttr.array as Float32Array;
        for (let i = 0; i < MAX_PARTICLES; i++) {
          ca[i * 3]     = oldColors[i * 3]     + (newColors[i * 3]     - oldColors[i * 3])     * t;
          ca[i * 3 + 1] = oldColors[i * 3 + 1] + (newColors[i * 3 + 1] - oldColors[i * 3 + 1]) * t;
          ca[i * 3 + 2] = oldColors[i * 3 + 2] + (newColors[i * 3 + 2] - oldColors[i * 3 + 2]) * t;
          sa[i]         = oldSizes[i]  + (newSizes[i]  - oldSizes[i])  * t;
          aa[i]         = oldAlphas[i] + (newAlphas[i] - oldAlphas[i]) * t;
        }
        colorAttr.needsUpdate = true;
        sizeAttr.needsUpdate  = true;
        alphaAttr.needsUpdate = true;
      },
    });
  }, [isDark]);

  /* ── Chapter morph on activeChapter change ── */
  useEffect(() => {
    if (
      !geometryRef.current ||
      !materialRef.current ||
      activeChapter === prevChapterRef.current
    ) return;

    prevChapterRef.current = activeChapter;

    const geometry  = geometryRef.current;
    const material  = materialRef.current;
    const targetPos = getPositions(activeChapter);
    const posAttr   = geometry.attributes.position as THREE.BufferAttribute;
    const currentPos = posAttr.array as Float32Array;

    // Snapshot current positions for interpolation
    const startPos = currentPos.slice();

    // Respect prefers-reduced-motion — skip animation
    const duration = PREFERS_REDUCED_MOTION
      ? 0.01
      : activeChapter === 7
        ? IDENTITY_ASSEMBLE_DURATION
        : MORPH_DURATION;

    // GSAP morph — interpolate positions
    const proxy = { t: 0 };
    gsap.to(proxy, {
      t: 1,
      duration,
      ease: activeChapter === 7 ? "power3.inOut" : "power2.inOut",
      onUpdate() {
        const t = proxy.t;
        for (let i = 0; i < MAX_PARTICLES * 3; i++) {
          currentPos[i] = startPos[i] + (targetPos[i] - startPos[i]) * t;
        }
        posAttr.needsUpdate = true;
      },
      onComplete() {
        if (activeChapter === 7 && !identityFiredRef.current) {
          identityFiredRef.current = true;
          setTimeout(() => onIdentityComplete(), 600);
        }
      },
    });

    // Transition accent color — use theme-appropriate palette
    const dark = isDarkRef.current;
    const palette = dark ? CHAPTER_COLORS_DARK : CHAPTER_COLORS_LIGHT;
    const [tr, tg, tb] = palette[activeChapter] ?? palette[1];
    const colorDur = PREFERS_REDUCED_MOTION ? 0.01 : COLOR_DURATION;
    gsap.to(material.uniforms.uAccentColor.value, {
      x: tr,
      y: tg,
      z: tb,
      duration: colorDur,
      ease: "power1.inOut",
    });

    // Accent blend — flash in, then settle
    gsap.timeline()
      .to(material.uniforms.uAccentBlend, {
        value: 1,
        duration: colorDur * 0.4,
        ease: "power2.in",
      })
      .to(material.uniforms.uAccentBlend, {
        value: 0.2,
        duration: colorDur * 0.6,
        ease: "power1.out",
      });

    // Update per-particle attributes for new chapter (theme-aware)
    const newColors = generateColors(activeChapter, dark);
    const newSizes  = generateSizes(activeChapter, dark);
    const newAlphas = generateAlphas(activeChapter, dark);
    const colorAttr = geometry.attributes.aColor as THREE.BufferAttribute;
    const sizeAttr  = geometry.attributes.aSize  as THREE.BufferAttribute;
    const alphaAttr = geometry.attributes.aAlpha as THREE.BufferAttribute;

    const attribProxy = { t: 0 };
    const oldColors = (colorAttr.array as Float32Array).slice();
    const oldSizes  = (sizeAttr.array  as Float32Array).slice();
    const oldAlphas = (alphaAttr.array as Float32Array).slice();

    gsap.to(attribProxy, {
      t: 1,
      duration: colorDur,
      ease: "power1.inOut",
      onUpdate() {
        const t = attribProxy.t;
        const ca = colorAttr.array as Float32Array;
        const sa = sizeAttr.array  as Float32Array;
        const aa = alphaAttr.array as Float32Array;
        for (let i = 0; i < MAX_PARTICLES; i++) {
          ca[i * 3]     = oldColors[i * 3]     + (newColors[i * 3]     - oldColors[i * 3])     * t;
          ca[i * 3 + 1] = oldColors[i * 3 + 1] + (newColors[i * 3 + 1] - oldColors[i * 3 + 1]) * t;
          ca[i * 3 + 2] = oldColors[i * 3 + 2] + (newColors[i * 3 + 2] - oldColors[i * 3 + 2]) * t;
          sa[i]         = oldSizes[i]  + (newSizes[i]  - oldSizes[i])  * t;
          aa[i]         = oldAlphas[i] + (newAlphas[i] - oldAlphas[i]) * t;
        }
        colorAttr.needsUpdate = true;
        sizeAttr.needsUpdate  = true;
        alphaAttr.needsUpdate = true;
      },
    });

  }, [activeChapter, getPositions, onIdentityComplete]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
