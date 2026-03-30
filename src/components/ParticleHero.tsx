/**
 * ParticleHero — Scroll-Driven 3D Particle Morphing Animation
 * 6-Act narrative: Raw Data → GIS Grid → Globe → Neural Network → Dashboard Monolith → Disperse
 * Engine: Three.js via @react-three/fiber + @react-three/drei
 * Animation: GSAP ScrollTrigger bound to scroll position
 * Visual: InstancedMesh with bloom post-processing
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ── Constants ── */
const PARTICLE_COUNT = 2000;
const ACTS = 6;

/* ── Shape generators ── */
function generateRawData(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  return positions;
}

function generateGISGrid(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const gridSize = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i++) {
    const col = i % gridSize;
    const row = Math.floor(i / gridSize);
    positions[i * 3] = (col / gridSize - 0.5) * 10;
    positions[i * 3 + 1] =
      Math.sin(col * 0.3) * Math.cos(row * 0.3) * 1.5;
    positions[i * 3 + 2] = (row / gridSize - 0.5) * 10;
  }
  return positions;
}

function generateGlobe(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const radius = 4;
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  return positions;
}

function generateNeuralNetwork(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const layers = 6;
  const nodesPerLayer = Math.floor(count / layers);
  for (let i = 0; i < count; i++) {
    const layer = Math.floor(i / nodesPerLayer);
    const indexInLayer = i % nodesPerLayer;
    const layerWidth = layer === 0 || layer === layers - 1 ? 2 : 4;
    const cols = Math.ceil(Math.sqrt(nodesPerLayer * (layerWidth / 4)));
    const rows = Math.ceil(nodesPerLayer / cols);
    const col = indexInLayer % cols;
    const row = Math.floor(indexInLayer / cols);
    positions[i * 3] = (col / cols - 0.5) * layerWidth;
    positions[i * 3 + 1] = (row / rows - 0.5) * layerWidth;
    positions[i * 3 + 2] = (layer / (layers - 1) - 0.5) * 8;
  }
  return positions;
}

function generateMonolith(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const section = Math.random();
    if (section < 0.6) {
      // Main monolith body
      positions[i * 3] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    } else if (section < 0.8) {
      // Side panel left
      positions[i * 3] = -2.5 + (Math.random() - 0.5) * 1;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    } else {
      // Side panel right
      positions[i * 3] = 2.5 + (Math.random() - 0.5) * 1;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
  }
  return positions;
}

function generateDisperse(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 5 + Math.random() * 15;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  return positions;
}

/* ── Easing ── */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/* ── Particle System ── */
function Particles({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport } = useThree();

  // Pre-generate all shape targets
  const shapes = useMemo(
    () => [
      generateRawData(PARTICLE_COUNT),
      generateGISGrid(PARTICLE_COUNT),
      generateGlobe(PARTICLE_COUNT),
      generateNeuralNetwork(PARTICLE_COUNT),
      generateMonolith(PARTICLE_COUNT),
      generateDisperse(PARTICLE_COUNT),
    ],
    []
  );

  // Current interpolated positions
  const currentPositions = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const velocities = useRef(new Float32Array(PARTICLE_COUNT * 3));

  // Initialize positions
  useEffect(() => {
    currentPositions.current.set(shapes[0]);
  }, [shapes]);

  // Color palette per act
  const actColors = useMemo(
    () => [
      new THREE.Color("#00d4ff"), // Raw Data — cyan
      new THREE.Color("#00c897"), // GIS Grid — emerald
      new THREE.Color("#00d4ff"), // Globe — cyan
      new THREE.Color("#ffb347"), // Neural Network — amber
      new THREE.Color("#00d4ff"), // Monolith — cyan
      new THREE.Color("#ffb347"), // Disperse — amber
    ],
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const totalProgress = Math.max(0, Math.min(1, scrollProgress));
    const actFloat = totalProgress * (ACTS - 1);
    const actIndex = Math.min(Math.floor(actFloat), ACTS - 2);
    const actProgress = smoothstep(actFloat - actIndex);

    const fromShape = shapes[actIndex];
    const toShape = shapes[actIndex + 1];
    const fromColor = actColors[actIndex];
    const toColor = actColors[actIndex + 1];
    const blendedColor = fromColor.clone().lerp(toColor, actProgress);

    const time = state.clock.elapsedTime;

    // Scale factor for responsive sizing
    const scale = Math.min(viewport.width / 12, 1);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Interpolate between shapes
      const targetX =
        fromShape[i3] + (toShape[i3] - fromShape[i3]) * actProgress;
      const targetY =
        fromShape[i3 + 1] +
        (toShape[i3 + 1] - fromShape[i3 + 1]) * actProgress;
      const targetZ =
        fromShape[i3 + 2] +
        (toShape[i3 + 2] - fromShape[i3 + 2]) * actProgress;

      // Smooth follow with slight organic drift
      const drift = 0.03;
      currentPositions.current[i3] +=
        (targetX - currentPositions.current[i3]) * 0.08 +
        Math.sin(time * 0.5 + i * 0.1) * drift;
      currentPositions.current[i3 + 1] +=
        (targetY - currentPositions.current[i3 + 1]) * 0.08 +
        Math.cos(time * 0.4 + i * 0.15) * drift;
      currentPositions.current[i3 + 2] +=
        (targetZ - currentPositions.current[i3 + 2]) * 0.08 +
        Math.sin(time * 0.3 + i * 0.2) * drift;

      dummy.position.set(
        currentPositions.current[i3] * scale,
        currentPositions.current[i3 + 1] * scale,
        currentPositions.current[i3 + 2] * scale
      );

      // Size variation based on act
      const baseSize = 0.025 * scale;
      const sizeVar = 1 + Math.sin(i * 0.5 + time * 0.3) * 0.3;
      // Fade out in disperse act
      const disperseFade =
        actIndex === ACTS - 2 ? 1 - actProgress * 0.8 : 1;
      dummy.scale.setScalar(baseSize * sizeVar * disperseFade);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;

    // Update material color
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.color.copy(blendedColor);
    // Fade opacity for disperse
    mat.opacity = actIndex === ACTS - 2 ? 1 - actProgress * 0.7 : 1;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#00d4ff"
        transparent
        opacity={1}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/* ── Scene with camera ── */
function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <Particles scrollProgress={scrollProgress} />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          intensity={1.5}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

/* ── Act labels ── */
const actLabels = [
  { title: "Raw Data", subtitle: "Chaotic, unstructured information" },
  { title: "GIS Grid", subtitle: "Spatial structure & soil sampling" },
  { title: "Spatial Analysis", subtitle: "Global perspective & remote sensing" },
  { title: "Neural Network", subtitle: "AI architecture & deep learning" },
  { title: "Dashboard Monolith", subtitle: "Executive-level intelligence" },
  { title: "Disperse", subtitle: "" },
];

/* ── Main Component ── */
export default function ParticleHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentAct, setCurrentAct] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollableHeight = container.scrollHeight - window.innerHeight;
      // Calculate how far through the container we've scrolled
      const rawProgress = -rect.top / scrollableHeight;
      const progress = Math.max(0, Math.min(1, rawProgress));
      setScrollProgress(progress);
      setCurrentAct(
        Math.min(Math.floor(progress * ACTS), ACTS - 1)
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${(ACTS - 1) * 100}vh` }}
    >
      {/* Sticky canvas */}
      <div
        className="sticky top-0 left-0 w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ background: "var(--page-bg)" }}
        />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Three.js Canvas */}
        <div className="absolute inset-0 z-[2]">
          <Canvas
            camera={{ position: [0, 0, 12], fov: 60 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <Scene scrollProgress={scrollProgress} />
          </Canvas>
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 z-[3] flex items-center pointer-events-none">
          <div className="container">
            <div className="max-w-3xl">
              {/* Top label */}
              <span
                className="label-mono inline-block mb-6"
                style={{ color: "var(--cyan)", fontSize: "0.7rem" }}
              >
                DATA VISUALIZATION &middot; ANALYTICS &middot; GEOSPATIAL
              </span>

              {/* Title */}
              <h1
                className="heading-xl mb-6"
                style={{ color: "var(--heading-color)" }}
              >
                Patrick Anderson
                <br />
                <span
                  className="text-glow-cyan"
                  style={{ color: "var(--cyan)" }}
                >
                  Geospatial Data Scientist
                </span>
                <br />
                <span
                  style={{
                    fontSize: "0.6em",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                  }}
                >
                  &amp; AI Infrastructure Engineer
                </span>
              </h1>

              {/* Description */}
              <p
                className="body-lg max-w-xl mb-10"
                style={{ color: "var(--text-muted)" }}
              >
                I build production-grade data pipelines and interactive spatial
                dashboards that transform complex geospatial data into
                executive-level intelligence.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pointer-events-auto">
                <a
                  href="/work"
                  className="neu-raised inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold text-sm transition-all"
                  style={{
                    color: "var(--primary-foreground)",
                    background: "var(--cyan)",
                  }}
                >
                  VIEW PROJECTS
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="/contact"
                  className="neu-flat inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-medium text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  GET IN TOUCH
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Act indicator */}
        {currentAct < ACTS - 1 && (
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] text-center transition-opacity duration-500"
            style={{ opacity: scrollProgress > 0.02 ? 1 : 0 }}
          >
            <div
              className="label-mono mb-2"
              style={{ color: "var(--cyan)", fontSize: "0.6rem" }}
            >
              {actLabels[currentAct]?.title}
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {actLabels[currentAct]?.subtitle}
            </div>
            {/* Progress dots */}
            <div className="flex gap-2 justify-center mt-3">
              {actLabels.slice(0, -1).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: idx === currentAct ? 20 : 6,
                    height: 6,
                    background:
                      idx === currentAct
                        ? "var(--cyan)"
                        : idx < currentAct
                          ? "var(--amber)"
                          : "var(--text-muted)",
                    opacity: idx <= currentAct ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Scroll hint */}
        {scrollProgress < 0.05 && (
          <div
            className="absolute bottom-8 right-8 z-[4] flex flex-col items-center gap-2 animate-bounce"
          >
            <span
              className="label-mono"
              style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}
            >
              SCROLL
            </span>
            <svg
              width="16"
              height="24"
              viewBox="0 0 16 24"
              fill="none"
              style={{ color: "var(--text-muted)" }}
            >
              <rect
                x="1"
                y="1"
                width="14"
                height="22"
                rx="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="8" cy="8" r="2" fill="currentColor">
                <animate
                  attributeName="cy"
                  values="8;14;8"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
