/**
 * Home Page — Cinematic Scroll-Driven Pipeline Narrative
 * Design: "Cold Signal → Warm Insight"
 * Seven chapters: Capture → Raw Data → Processing → The Map
 *                 → Analysis → AI/Insight → Identity
 *
 * Architecture:
 *   - Fixed WebGL canvas behind everything (ParticleHero drives it)
 *   - Scroll container provides scrub height for GSAP ScrollTrigger
 *   - Each ChapterPanel is a full-viewport text overlay
 *   - 2D data overlays float over the 3D scene per chapter
 *   - Identity chapter: particle assembly reveals Patrick's name
 *
 * Patrick Anderson — PTA Geospatial Intelligence
 */

import { useCallback, useEffect, useRef, useState } from "react";
import PageTransition from "@/components/animations/PageTransition";
import ParticleHero from "@/components/ParticleHero";
import { useTheme } from "@/contexts/ThemeContext";

/* ─────────────────────────────────────────────────────────────
   CHAPTER DATA
   Single source of truth for all seven chapters.
   The ParticleHero component reads chapterIndex to morph scenes.
───────────────────────────────────────────────────────────── */
const CHAPTERS = [
  {
    index: 1,
    id: "capture",
    tag: "Chapter 01 · Capture",
    headline: ["Light becomes", "signal."],
    headlineItalic: 1,
    body: "A constellation of optical and SAR sensors sweeps the surface at 500 km altitude. Every overpass collects terabytes of raw electromagnetic data — agriculture, infrastructure, coastline — recorded before human interpretation begins.",
    align: "left",
    dataPanel: {
      label: "ACTIVE SENSOR",
      lines: [
        "PLATFORM  · Sentinel-2A MSI",
        "ALTITUDE  · 786 km SSO",
        "SWATH     · 290 km",
        "REVISIT   · 5 days",
        "BANDS     · 13 spectral",
      ],
    },
    tags: ["SAR", "MSI", "LIDAR", "THERMAL"],
  },
  {
    index: 2,
    id: "rawdata",
    tag: "Chapter 02 · Raw Data",
    headline: ["Pixels before", "meaning."],
    headlineItalic: 1,
    body: "DN values. Radiometric noise. Atmospheric interference. The raw raster is unprocessed signal — integers encoding reflected radiance across 13 spectral bands. Without calibration, it is data without truth.",
    align: "right",
    dataPanel: {
      label: "RASTER PROPERTIES",
      lines: [
        "TYPE      · UInt16 DN",
        "DIMS      · 10980 × 10980 px",
        "BANDS     · B1–B12 + B8A",
        "NODATA    · 0",
        "CRS       · EPSG:32614",
      ],
    },
    tags: ["DN VALUES", "RADIANCE", "NOISE", "RAW"],
  },
  {
    index: 3,
    id: "processing",
    tag: "Chapter 03 · Processing",
    headline: ["Signal becomes", "surface."],
    headlineItalic: 1,
    body: "Atmospheric correction strips the haze. Radiometric calibration converts integers to reflectance. Band math derives NDVI, NDWI, EVI. A Random Forest classifier assigns every pixel to a land cover class with 94.2% overall accuracy.",
    align: "left",
    dataPanel: {
      label: "CLASSIFICATION PIPELINE",
      lines: [
        "CORRECTION · Sen2Cor L2A",
        "ALGORITHM  · Random Forest",
        "ACCURACY   · 94.2% OA",
        "KAPPA      · 0.91",
        "CLASSES    · 12 LCLU",
      ],
    },
    tags: ["NDVI", "L2A", "CLASSIFICATION", "RF"],
  },
  {
    index: 4,
    id: "themap",
    tag: "Chapter 04 · The Map",
    headline: ["Geography", "made legible."],
    headlineItalic: 1,
    body: "Classified pixels dissolve into choropleth surfaces. Census tract boundaries emerge. Population density gradients pull warm hues across urban cores. The raster becomes a map — a human artifact of geographic knowledge.",
    align: "right",
    dataPanel: {
      label: "SPATIAL REFERENCE",
      lines: [
        "PROJECTION · NAD83 / UTM 17N",
        "SCALE      · 1 : 25,000",
        "UNITS      · Meters",
        "CENSUS     · ACS 2022 5-yr",
        "FEATURES   · 42,381 tracts",
      ],
    },
    tags: ["CHOROPLETH", "CENSUS", "VECTOR", "CARTOGRAPHY"],
  },
  {
    index: 5,
    id: "analysis",
    tag: "Chapter 05 · Analysis",
    headline: ["Pattern becomes", "insight."],
    headlineItalic: 1,
    body: "Spatial autocorrelation. Getis-Ord hotspot clustering. Network analysis across 3D urban infrastructure. The city's data skeleton becomes visible — corridors of high broadband demand, AI data center siting criteria resolved to the parcel level.",
    align: "left",
    dataPanel: {
      label: "SPATIAL STATISTICS",
      lines: [
        "METHOD     · Getis-Ord Gi*",
        "BANDWIDTH  · Adaptive KDE",
        "P-VALUE    · < 0.001",
        "CLUSTERS   · 847 hotspots",
        "SCALE      · Parcel-level",
      ],
    },
    tags: ["HOTSPOT", "MORAN'S I", "NETWORK", "3D"],
  },
  {
    index: 6,
    id: "aiinsight",
    tag: "Chapter 06 · AI / Insight",
    headline: ["Data becomes", "decision."],
    headlineItalic: 1,
    body: "A 158K-line automated geospatial pipeline — written in 2026 alone — feeds spatial features into infrastructure siting models. Transmission proximity, fiber dark spots, environmental constraints, and demographic demand surfaces converge into executive-level visual intelligence.",
    align: "right",
    dataPanel: {
      label: "PIPELINE STATUS",
      lines: [
        "CODEBASE   · 158K lines (2026)",
        "MODEL      · XGBoost + GNN",
        "FEATURES   · 847 spatial",
        "INFERENCE  · < 2s / parcel",
        "OUTPUT     · 5 LIVE DASHBOARDS",
      ],
    },
    tags: ["ML", "XGBOOST", "GNN", "PIPELINE"],
  },
  {
    index: 7,
    id: "identity",
    tag: "Chapter 07 · Identity",
    headline: null,
    body: null,
    align: "center",
    dataPanel: null,
    tags: null,
  },
] as const;

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────────── */
function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="data-value">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA PANEL  — 2D overlay HUD block
───────────────────────────────────────────────────────────── */
function DataPanel({
  label,
  lines,
}: {
  label: string;
  lines: readonly string[];
}) {
  return (
    <div className="data-panel" style={{ display: "inline-block", marginTop: "2rem" }}>
      <div className="label-mono-sm" style={{ marginBottom: "0.75rem" }}>
        {label}
      </div>
      {lines.map((line) => (
        <div key={line} className="data-string">
          {line}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAG ROW  — spectral band / method pills
───────────────────────────────────────────────────────────── */
function TagRow({
  tags,
  align,
}: {
  tags: readonly string[];
  align: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "1.5rem",
        justifyContent:
          align === "right"
            ? "flex-end"
            : align === "center"
            ? "center"
            : "flex-start",
      }}
    >
      {tags.map((tag) => (
        <span key={tag} className="data-tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CHAPTER PANEL  — one full-viewport scroll section
───────────────────────────────────────────────────────────── */
function ChapterPanel({
  chapter,
}: {
  chapter: (typeof CHAPTERS)[number];
}) {
  const isIdentity = chapter.id === "identity";

  if (isIdentity) {
    return (
      <section
        id={`chapter-${chapter.index}`}
        data-chapter={chapter.index}
        className="identity-section"
        style={{ minHeight: "100vh" }}
      >
        <IdentityReveal />
      </section>
    );
  }

  return (
    <section
      id={`chapter-${chapter.index}`}
      data-chapter={chapter.index}
      className={`chapter-section align-${chapter.align}`}
    >
      <div className="chapter-content">
        {/* Chapter tag */}
        <div className="chapter-tag">{chapter.tag}</div>

        {/* Headline — second line italic */}
        <h2
          className="heading-xl"
          style={{ marginBottom: "1.5rem" }}
        >
          {chapter.headline?.map((line, i) =>
            i === chapter.headlineItalic ? (
              <em
                key={i}
                style={{
                  fontStyle: "italic",
                  display: "block",
                  color: "var(--ch-accent)",
                }}
              >
                {line}
              </em>
            ) : (
              <span key={i} style={{ display: "block" }}>
                {line}
              </span>
            )
          )}
        </h2>

        {/* Body copy */}
        {chapter.body && (
          <p
            className="body-lg"
            style={{
              color: "var(--text-secondary)",
              maxWidth: "480px",
              marginBottom: "1rem",
            }}
          >
            {chapter.body}
          </p>
        )}

        {/* Tags */}
        {chapter.tags && (
          <TagRow tags={chapter.tags} align={chapter.align} />
        )}

        {/* Data panel overlay */}
        {chapter.dataPanel && (
          <DataPanel
            label={chapter.dataPanel.label}
            lines={chapter.dataPanel.lines}
          />
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   IDENTITY REVEAL  — final chapter, particle assembly
───────────────────────────────────────────────────────────── */
function IdentityReveal() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const handler = () => setRevealed(true);
    window.addEventListener("identity:revealed", handler);
    return () => window.removeEventListener("identity:revealed", handler);
  }, []);

  const contactLinks = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/patrick-anderson-gis/" },
    { label: "GitHub",   href: "https://github.com/Ptander01" },
    { label: "Email",    href: "mailto:patrick.t.anderson1@gmail.com" },
  ];

  return (
    <div style={{ textAlign: "center", padding: "0 6vw" }}>
      <h1 className={`identity-name ${revealed ? "revealed" : ""}`}>
        Patrick Anderson
      </h1>

      <p className={`identity-title ${revealed ? "revealed" : ""}`}>
        Geospatial Data Scientist · AI Infrastructure · Remote Sensing
      </p>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "center",
          marginTop: "3rem",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 1s ease 1s, transform 1s ease 1s",
        }}
      >
        {contactLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="link-signal"
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={
              link.href.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
          >
            {link.label}
            <span style={{ opacity: 0.5 }}>↗</span>
          </a>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "2rem",
          opacity: revealed ? 1 : 0,
          transition: "opacity 1s ease 1.4s",
        }}
      >
        {[
          "GIS · RS · AI",
          "158K LINES IN 2026",
          "5 LIVE DASHBOARDS",
          "3 PUBLICATIONS",
        ].map((tag) => (
          <span key={tag} className="data-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────────────────────── */
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="chapter-progress-bar"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   ACTIVE CHAPTER TRACKER
   Reads IntersectionObserver across all chapter sections
   and returns the current chapter index (1–7).
───────────────────────────────────────────────────────────── */
function useActiveChapter() {
  const [activeChapter, setActiveChapter] = useState(1);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-chapter]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ch = Number(
              (entry.target as HTMLElement).dataset.chapter
            );
            if (!isNaN(ch)) setActiveChapter(ch);
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return activeChapter;
}

/* ─────────────────────────────────────────────────────────────
   HUD NAV  (homepage-only navigation)
───────────────────────────────────────────────────────────── */
function HudNav({ activeChapter }: { activeChapter: number }) {
  const chapter = CHAPTERS.find((c) => c.index === activeChapter);

  return (
    <nav className="hud-nav">
      <a href="/" className="hud-logo">
        PTA GEOSPATIAL
      </a>

      <div className="label-mono-sm" style={{ opacity: 0.6 }}>
        {chapter?.tag ?? ""}
      </div>

      <ul
        style={{
          display: "flex",
          gap: "2rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {(
          [
            { label: "Work",    href: "/work" },
            { label: "Contact", href: "#chapter-7" },
          ] as const
        ).map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="label-mono"
              style={{
                textDecoration: "none",
                color: "var(--text-muted)",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color =
                  "var(--heading-color)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color =
                  "var(--text-muted)")
              }
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOME PAGE  — root component
───────────────────────────────────────────────────────────── */
export default function Home() {
  const activeChapter = useActiveChapter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleIdentityComplete = useCallback(() => {
    window.dispatchEvent(new Event("identity:revealed"));
  }, []);

  return (
    <PageTransition>
      {/* ── Scan line effect ── */}
      <div className="scan-line" />

      {/* ── Progress bar ── */}
      <ScrollProgressBar />

      {/* ── HUD navigation ── */}
      <HudNav activeChapter={activeChapter} />

      {/* ── Fixed WebGL canvas — behind everything ── */}
      <div className="canvas-layer">
        <ParticleHero
          activeChapter={activeChapter}
          onIdentityComplete={handleIdentityComplete}
          isDark={isDark}
        />
      </div>

      {/* ── Scroll container — seven chapters ── */}
      <main className="scroll-container">
        {CHAPTERS.map((chapter) => (
          <ChapterPanel
            key={chapter.id}
            chapter={chapter}
          />
        ))}
      </main>
    </PageTransition>
  );
}
