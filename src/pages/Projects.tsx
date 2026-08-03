/**
 * Projects.tsx — Work Showcase · Switchable Gallery Layouts
 * ─────────────────────────────────────────────────────────────
 * Four layout modes the visitor can cycle between:
 *
 *   A · Cinematic     — Full-bleed vertical scroll, images lead
 *   B · Editorial     — Alternating image + Cinzel text blocks
 *   C · Gallery       — Masonry grid, hero pieces full-width
 *   D · By Domain     — Organized by career chapter / domain
 *
 * Presentation only. The data lives in `lib/projects.ts` — see that file for
 * the schema and for where images go.
 *
 * DEPENDENCIES: framer-motion (already in package.json)
 *
 * Patrick Anderson — PTA Geospatial Intelligence
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/animations/PageTransition";
import { useIsMobile } from "@/hooks/useMobile";
import { Link, useSearchParams } from "wouter";
import {
  DOMAIN_ORDER,
  DOMAINS,
  PROJECTS,
  TECHS,
  type DomainKey,
  type Project,
  type TechKey,
} from "@/lib/projects";

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
type LayoutMode = "cinematic" | "editorial" | "gallery" | "domain";

/* ─────────────────────────────────────────────────────────────
   LAYOUT MODE DEFINITIONS
───────────────────────────────────────────────────────────── */
const LAYOUTS: Record<
  LayoutMode,
  { label: string; description: string; icon: string }
> = {
  cinematic: {
    label: "Cinematic",
    description: "Full-bleed · images lead",
    icon: "◼",
  },
  editorial: {
    label: "Editorial",
    description: "Image + context · Lavergne style",
    icon: "◨",
  },
  gallery: {
    label: "Gallery",
    description: "Masonry · visual hierarchy",
    icon: "⊞",
  },
  domain: {
    label: "By Domain",
    description: "Organized by career chapter",
    icon: "≡",
  },
};


/* ─────────────────────────────────────────────────────────────
   SHARED SUB-COMPONENTS
───────────────────────────────────────────────────────────── */

/** Accent rule — small colored line matching chapter accent */
function AccentRule({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 24,
        height: 1,
        background: color,
        opacity: 0.7,
        verticalAlign: "middle",
        marginRight: 10,
      }}
    />
  );
}

/** Card eyebrow — `<Domain> · <Subtype>`.
 *
 *  The domain half is the Industry facet verbatim, so what a card says and
 *  what the filter offers are finally the same vocabulary; previously the card
 *  showed one of 41 freeform strings that the six filter options never
 *  mentioned. It leads, in the accent, because it is the half a reader can act
 *  on. The subtype is stepped back — it adds specificity, it does not compete.
 *
 *  Rendered inside each layout's existing eyebrow span, so it inherits that
 *  layout's colour and size rather than imposing its own. */
function PieceLabel({ project }: { project: Project }) {
  return (
    <>
      {DOMAINS[project.domain].label}
      {/* Below 768px the two halves stack onto their own lines and the
          separator is dropped. Joined, 34 of the 37 labels wrapped to two or
          three lines at 375px — a 9px uppercase micro-label breaking mid-phrase
          reads as broken rather than as a line break. The rule lives in
          index.css because no media query can reach an inline style. */}
      <span className="piece-label-sep" aria-hidden="true"> · </span>
      <span className="piece-label-sub">{project.subtype}</span>
    </>
  );
}

/** Image frame with accent bar and fallback placeholder.
 *  `priority` marks the first card in a layout — that one loads eagerly so
 *  the above-the-fold image isn't deferred; every other card lazy-loads. */
function ProjectImage({
  project,
  height = 360,
  priority = false,
}: {
  project: Project;
  height?: number;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasHovered, setHasHovered] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const gallery =
    project.images && project.images.length > 1
      ? project.images
      : [project.image];
  const hasMultiple = gallery.length > 1;

  const handleMouseEnter = () => {
    if (!hasMultiple) return;
    setHasHovered(true);
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % gallery.length);
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIndex(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, []);

  return (
    // The whole image is the way into the piece's own page — that is how
    // Patrick's previous site worked, and wrapping here covers all four
    // layouts at once instead of patching each card's link row.
    <Link
      href={`/projects/${project.id}`}
      aria-label={`${project.title} — open project page`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "block",
        position: "relative",
        border: "0.5px solid rgb(var(--hairline-rgb) / 0.1)",
        borderTopColor: "rgb(var(--hairline-rgb) / 0.18)",
        overflow: "hidden",
        background: "#0A0E14",
        cursor: "pointer",
      }}
    >
      {/* Accent bar — carries the domain color the corner brackets used to.
          One mark instead of two, anchored to the bottom edge. */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "34%",
          height: 2,
          background: project.accent,
          zIndex: 3,
        }}
      />

      {!error ? (
        <div style={{ position: "relative", width: "100%", height }}>
          {gallery.map((src, i) => {
            if (i > 0 && !hasHovered) return null; // lazy: only fetch extras after first hover
            return (
              <img
                key={src}
                src={src}
                alt={project.title}
                /* Extras (i > 0) are only mounted after first hover, so they
                   are already deferred — load them immediately once mounted
                   or the crossfade stalls on the first cycle. */
                loading={i > 0 || priority ? "eager" : "lazy"}
                fetchPriority={priority && i === 0 ? "high" : undefined}
                decoding="async"
                onLoad={() => i === 0 && setLoaded(true)}
                onError={() => i === 0 && setError(true)}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: project.imageCrop,
                  opacity: (i === 0 ? loaded : true) && i === activeIndex ? 1 : 0,
                  transition: "opacity 0.9s ease",
                }}
              />
            );
          })}
        </div>
      ) : (
        /* Placeholder while images are being deployed */
        <div
          style={{
            width: "100%",
            height,
            /* `${project.accent}12` used to append an alpha suffix to a hex
               literal. Accent is now `var(--domain-*)`, and you cannot
               concatenate onto a custom property — it would emit the string
               "var(--domain-sports)12". color-mix does the same job against
               whatever the variable resolves to, in either theme. */
            background: `linear-gradient(135deg, var(--gallery-bg), color-mix(in srgb, ${project.accent} 7%, transparent))`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: project.accent,
              opacity: 0.5,
            }}
          >
            {project.index} · {project.title}
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 8,
              color: "rgb(var(--fg-rgb) / 0.15)",
              letterSpacing: "0.15em",
            }}
          >
            public/images/work/ · pending
          </span>
        </div>
      )}

      {/* Bottom fade overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "25%",
          background:
            "linear-gradient(to top, rgba(7,10,14,0.65) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </Link>
  );
}

/** Source citation line */
function SourceLine({
  text,
  accent,
}: {
  text: string;
  accent: string;
}) {
  return (
    <div
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.5rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgb(var(--fg-rgb) / 0.18)",
        paddingTop: "0.625rem",
        marginTop: "0.75rem",
        borderTop: `0.5px solid rgb(var(--hairline-rgb) / 0.07)`,
      }}
    >
      {text}
    </div>
  );
}

/** Tag pill */
function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.5rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: "2px 8px",
        border: "0.5px solid rgb(var(--hairline-rgb) / 0.12)",
        color: "rgb(var(--fg-rgb) / 0.3)",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAYOUT A — CINEMATIC (Full-bleed vertical)
───────────────────────────────────────────────────────────── */
function LayoutCinematic({ projects }: { projects: Project[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
      {projects.map((p, i) => (
        <article key={p.id}>
          <ProjectImage project={p} height={420} priority={i === 0} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "0.75rem",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: p.accent,
                  opacity: 0.8,
                  marginBottom: "0.25rem",
                }}
              >
                <AccentRule color={p.accent} />
                <PieceLabel project={p} />
              </div>
              <h2
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  fontWeight: 700,
                  color: "rgb(var(--fg-rgb))",
                  lineHeight: 1.1,
                }}
              >
                {p.title}
              </h2>
            </div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.5rem",
                color: "rgb(var(--fg-rgb) / 0.2)",
                letterSpacing: "0.15em",
                textAlign: "right",
              }}
            >
              PTA · {p.index} · {p.year}
              {p.link && (
                <div style={{ marginTop: 4 }}>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: p.accent,
                      textDecoration: "none",
                      opacity: 0.8,
                    }}
                  >
                    View live ↗
                  </a>
                </div>
              )}
            </div>
          </div>
          <SourceLine text={p.source} accent={p.accent} />
        </article>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAYOUT B — EDITORIAL (Alternating image + text)
───────────────────────────────────────────────────────────── */
function LayoutEditorial({ projects }: { projects: Project[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
      {projects.map((p, i) => {
        const imgLeft = i % 2 === 0;
        return (
          <article
            key={p.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3.5rem",
              alignItems: "center",
            }}
          >
            {/* Image */}
            <div style={{ order: imgLeft ? 0 : 1 }}>
              <ProjectImage project={p} height={340} priority={i === 0} />
              {/* `p.category` used to sit here, opposite the index. It is the
                  old 41-string vocabulary, so this card was showing two
                  competing taxonomies at once — "AI Infrastructure · Remote
                  Sensing" under the image and "AI Infrastructure · Change
                  Detection" above the headline. The field stays in the data:
                  the Decision Log keeps those strings because, with the Data
                  Art domain retired, `category` is the only place that signal
                  still lives. It just no longer renders next to a label that
                  contradicts it. */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.5rem",
                    color: "rgb(var(--fg-rgb) / 0.15)",
                  }}
                >
                  PTA · {p.index} · {p.year}
                </span>
              </div>
            </div>

            {/* Text */}
            <div style={{ order: imgLeft ? 1 : 0 }}>
              {/* Category tag */}
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: p.accent,
                  opacity: 0.8,
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <AccentRule color={p.accent} />
                <PieceLabel project={p} />
              </div>

              {/* Editorial headline */}
              <h2
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  color: "rgb(var(--fg-rgb))",
                  marginBottom: "1.25rem",
                }}
              >
                {p.editorialTitle[0]}
                <em
                  style={{
                    display: "block",
                    fontStyle: "italic",
                    color: p.accent,
                  }}
                >
                  {p.editorialTitle[1]}
                </em>
              </h2>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: "0.9375rem",
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: "rgb(var(--fg-rgb) / 0.55)",
                  marginBottom: "1.25rem",
                }}
              >
                {p.description}
              </p>

              {/* Insight pullquote */}
              <blockquote
                className="pull-quote"
                style={{
                  borderLeftColor: p.accent,
                  background: `color-mix(in srgb, ${p.accent} 6%, transparent)`,
                  marginBottom: "1.25rem",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  color: "rgb(var(--fg-rgb) / 0.4)",
                }}
              >
                {p.insight}
              </blockquote>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "0.75rem" }}>
                {p.tags.map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </div>

              {/* Live link */}
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: p.accent,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: "0.75rem",
                  }}
                >
                  View live dashboard ↗
                </a>
              )}

              <SourceLine text={p.source} accent={p.accent} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAYOUT C — GALLERY (Masonry with hero pieces)
───────────────────────────────────────────────────────────── */
function LayoutGallery({ projects }: { projects: Project[] }) {
  const heroes = projects.filter((p) => p.hero);
  const supporting = projects.filter((p) => !p.hero);

  // Interleave: hero, 2 supporting, hero, 2 supporting...
  const sections: Array<{ hero: Project; pair: Project[] }> = [];
  let si = 0;
  heroes.forEach((h) => {
    sections.push({ hero: h, pair: supporting.slice(si, si + 2) });
    si += 2;
  });
  // Whatever the interleave didn't consume still has to render — including
  // the case where a filter leaves supporting pieces but no hero at all.
  const leftover = supporting.slice(si);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {sections.map((section, si) => (
        <div key={section.hero.id}>
          {/* Hero — full width */}
          <article style={{ marginBottom: "0.75rem" }}>
            <ProjectImage project={section.hero} height={480} priority={si === 0} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: section.hero.accent,
                    opacity: 0.75,
                    marginRight: 8,
                  }}
                >
                  <AccentRule color={section.hero.accent} />
                  <PieceLabel project={section.hero} />
                </span>
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "rgb(var(--fg-rgb))",
                  }}
                >
                  {section.hero.title}
                </span>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.5rem",
                    color: "rgb(var(--fg-rgb) / 0.2)",
                  }}
                >
                  PTA · {section.hero.index} · {section.hero.year}
                </span>
                {section.hero.caseStudy && (
                  <div style={{ marginTop: 3 }}>
                    <Link
                      href={`/work/${section.hero.caseStudy}`}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.5rem",
                        letterSpacing: "0.1em",
                        color: "var(--text-muted)",
                        textDecoration: "none",
                      }}
                    >
                      Case study →
                    </Link>
                  </div>
                )}
                {section.hero.link && (
                  <div style={{ marginTop: 3 }}>
                    <a
                      href={section.hero.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.5rem",
                        letterSpacing: "0.1em",
                        color: section.hero.accent,
                        textDecoration: "none",
                        opacity: 0.85,
                      }}
                    >
                      View live ↗
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "0.875rem",
                fontWeight: 300,
                color: "rgb(var(--fg-rgb) / 0.4)",
                lineHeight: 1.7,
                marginTop: 6,
                maxWidth: 640,
              }}
            >
              {section.hero.insight}
            </div>
            <SourceLine text={section.hero.source} accent={section.hero.accent} />
          </article>

          {/* Supporting pair — 2 column */}
          {section.pair.length > 0 && (
            <SupportingGrid projects={section.pair} />
          )}
        </div>
      ))}

      {/* Any pieces past the last hero's two slots — and, when a filter
          leaves no hero at all, every piece. Without this the layout
          silently dropped whatever the hero interleave didn't consume. */}
      {leftover.length > 0 && <SupportingGrid projects={leftover} />}
    </div>
  );
}

/** The 2-up supporting card row, shared by the hero interleave and the
 *  leftover drain below it. */
function SupportingGrid({ projects }: { projects: Project[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(projects.length, 2)}, 1fr)`,
        gap: "0.75rem",
        marginBottom: "3rem",
      }}
    >
      {projects.map((p) => (
        <article key={p.id}>
          <ProjectImage project={p} height={260} />
          <div style={{ marginTop: 6 }}>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: p.accent,
                opacity: 0.7,
                marginBottom: 3,
              }}
            >
              <AccentRule color={p.accent} />
              <PieceLabel project={p} />
            </div>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.9375rem",
                fontWeight: 700,
                color: "rgb(var(--fg-rgb))",
              }}
            >
              {p.title}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: 3 }}>
              {p.caseStudy && (
                <Link
                  href={`/work/${p.caseStudy}`}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.5rem",
                    letterSpacing: "0.1em",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                  }}
                >
                  Case study →
                </Link>
              )}
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.5rem",
                    letterSpacing: "0.1em",
                    color: p.accent,
                    textDecoration: "none",
                    opacity: 0.85,
                  }}
                >
                  View live ↗
                </a>
              )}
            </div>
            <SourceLine text={p.source} accent={p.accent} />
          </div>
        </article>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAYOUT D — BY DOMAIN
───────────────────────────────────────────────────────────── */
function LayoutDomain({ projects }: { projects: Project[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
      {/* DOMAIN_ORDER, not Object.entries — object key order is the order the
          domains happen to be declared in, which put Environmental (the oldest
          work, median 2019) first. Sections now run newest-median first, so the
          Meta and MLS chapters lead and Clemson closes. */}
      {DOMAIN_ORDER.map((key) => {
        const domain = DOMAINS[key];
        const domainProjects = projects.filter((p) => p.domain === key);
          if (domainProjects.length === 0) return null;
          return (
            <section key={key}>
              {/* Domain header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingBottom: "1rem",
                  marginBottom: "1.5rem",
                  borderBottom: `0.5px solid color-mix(in srgb, ${domain.accent} 16%, transparent)`,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: domain.accent,
                    flexShrink: 0,
                    boxShadow: `0 0 8px color-mix(in srgb, ${domain.accent} 38%, transparent)`,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "rgb(var(--fg-rgb))",
                    }}
                  >
                    {domain.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.5rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: domain.accent,
                      opacity: 0.6,
                      marginTop: 2,
                    }}
                  >
                    {domain.org} · {domainProjects.length}{" "}
                    {domainProjects.length === 1 ? "piece" : "pieces"}
                  </div>
                </div>
              </div>

              {/* 3-column grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "1rem",
                }}
              >
                {domainProjects.map((p) => (
                  <article key={p.id}>
                    <ProjectImage project={p} height={200} />
                    <div style={{ marginTop: 8 }}>
                      <div
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: "0.9375rem",
                          fontWeight: 700,
                          color: "rgb(var(--fg-rgb))",
                          marginBottom: 4,
                          lineHeight: 1.2,
                        }}
                      >
                        {p.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.5rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: p.accent,
                          opacity: 0.6,
                          marginBottom: 6,
                        }}
                      >
                        <PieceLabel project={p} />
                      </div>
                      <div
                        style={{
                          fontFamily: "'Lora', serif",
                          fontSize: "0.8125rem",
                          fontWeight: 300,
                          lineHeight: 1.65,
                          color: "rgb(var(--fg-rgb) / 0.4)",
                          marginBottom: 8,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.insight}
                      </div>
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "0.5rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: p.accent,
                            textDecoration: "none",
                            opacity: 0.8,
                          }}
                        >
                          View live ↗
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAYOUT SWITCHER BUTTON
───────────────────────────────────────────────────────────── */
function LayoutButton({
  mode,
  active,
  onClick,
}: {
  mode: LayoutMode;
  active: boolean;
  onClick: () => void;
}) {
  const { label, description, icon } = LAYOUTS[mode];
  return (
    /* The description used to render as a second line inside every button.
       Four of them stacked cost 248px on a phone — more than the page title —
       and on desktop they made the block 668px wide, which alongside a 578px
       title exceeded the content width and wrapped the whole switcher onto its
       own row. It is a tooltip now: the icon and the label already
       differentiate the four, and one of the strings ("Lavergne style") means
       nothing to a first-time reader anyway. */
    <button
      onClick={onClick}
      title={description}
      aria-pressed={active}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "0 13px",
        /* Matches the 40px the filter pills settled on — same reasoning:
           these are 10px micro-labels and a 44px capsule around one reads as
           a button that lost its text. */
        minHeight: 40,
        border: active
          ? "0.5px solid rgb(var(--accent-rgb) / 0.45)"
          : "0.5px solid rgb(var(--hairline-rgb) / 0.12)",
        background: active ? "rgb(var(--accent-rgb) / 0.06)" : "transparent",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!active)
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgb(var(--hairline-rgb) / 0.25)";
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgb(var(--hairline-rgb) / 0.12)";
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          color: active ? "rgb(var(--accent-rgb))" : "var(--text-muted)",
          transition: "color 0.2s ease",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.5625rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          /* `--text-muted`, not `rgb(var(--fg-rgb) / 0.45)`. These buttons now
             sit in the same row as the facet pills, so they take the same
             control token — which also lifts them off 2.3:1 on parchment,
             where the 0.45 alpha had put them. */
          color: active ? "rgb(var(--accent-rgb))" : "var(--text-muted)",
          fontWeight: active ? 700 : 400,
          transition: "color 0.2s ease",
        }}
      >
        {label}
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   FILTER PILL — shared by all three facet groups
───────────────────────────────────────────────────────────── */
function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`facet-pill${active ? " facet-pill--on" : ""}`}
    >
      {label}
    </button>
  );
}

/** One facet: a trigger word whose options cascade out on hover/focus.
 *  Collapsed by default so the bar reads as three words, not twenty pills. */
function Facet({
  name,
  activeCount,
  children,
}: {
  name: string;
  activeCount: number;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const label = (
    <>
      {name}
      {activeCount > 0 && <span className="facet-count">· {activeCount}</span>}
    </>
  );

  /* On a phone the three cascades pinned open stack to ~550px — the whole
     gallery below the fold behind a wall of filters. So mobile collapses by
     default and opens on an explicit tap.
     The open state is an inline style rather than a class because the base
     `:hover` / `:focus-within` rules are more specific than any class we
     could add, and a sticky :hover after tap would fight the toggle. Inline
     wins outright — the usual trap in this repo, useful for once. */
  /* max-height matters as much as max-width: the options wrap on mobile, so a
     zero-width box does not collapse — it turns into a 0px-wide, 990px-tall
     column of one pill per line. Both axes have to close. */
  const optionStyle = isMobile
    ? {
        maxWidth: open ? "64rem" : 0,
        maxHeight: open ? "none" : 0,
        opacity: open ? 1 : 0,
        transform: "none" as const,
      }
    : undefined;

  return (
    <div
      className={`facet${activeCount > 0 ? " facet--active" : ""}`}
      tabIndex={isMobile ? undefined : 0}
      role="group"
      aria-label={name}
      /* Open takes the whole row so the options wrap into it; closed is
         content-width so the four triggers pack two-to-a-row instead of one. */
      style={isMobile ? { width: open ? "100%" : "auto" } : undefined}
    >
      {isMobile ? (
        <button
          type="button"
          className="facet-trigger"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {label}
        </button>
      ) : (
        <span className="facet-trigger">{label}</span>
      )}
      <div className="facet-options" style={optionStyle}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROJECTS PAGE — ROOT COMPONENT
───────────────────────────────────────────────────────────── */
type FormatFilter = "all" | "interactive" | "static";

type SortOrder = "newest" | "oldest";

/* View state lives in the query string, not in useState.
 *
 * Every control on this page — layout, the three filter facets, sort order —
 * reads from and writes to the URL, so a view can be linked. That matters
 * practically: `/projects` was previously the only address this page had, so
 * there was no way to send someone the environmental work, or the AI
 * infrastructure work, without asking them to click the filters themselves.
 *
 * Derived from the URL rather than mirrored into state. Holding both would
 * mean keeping them in sync on every change, on back/forward, and on a pasted
 * link — three places to drift. The URL is simply the source of truth.
 *
 * Defaults are omitted from the query string so a clean view stays `/projects`
 * rather than accumulating `?layout=gallery&sort=newest`, and unknown values
 * are dropped instead of throwing: a hand-edited or stale link degrades to the
 * default view rather than an empty gallery. */
export default function Projects() {
  const [params, setParams] = useSearchParams();

  const readSet = <T extends string>(
    key: string,
    valid: readonly string[]
  ): ReadonlySet<T> =>
    new Set(
      (params.get(key) ?? "")
        .split(",")
        .map((v) => v.trim())
        .filter((v): v is T => valid.includes(v))
    );

  const rawLayout = params.get("layout") ?? "";
  const layout: LayoutMode = (
    rawLayout in LAYOUTS ? rawLayout : "gallery"
  ) as LayoutMode;
  const industries = readSet<DomainKey>("industry", DOMAIN_ORDER);
  const techs = readSet<TechKey>("tech", Object.keys(TECHS));
  const rawFormat = params.get("format") ?? "";
  const format: FormatFilter = (
    ["interactive", "static"].includes(rawFormat) ? rawFormat : "all"
  ) as FormatFilter;
  const sort: SortOrder = params.get("sort") === "oldest" ? "oldest" : "newest";

  /** Patch the query string; null or "" removes a key so defaults stay absent.
   *  `replace` so filtering does not fill the history stack — the back button
   *  should leave the gallery, not step through every pill the visitor tried. */
  const update = useCallback(
    (patch: Record<string, string | null>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) {
            if (v === null || v === "") next.delete(k);
            else next.set(k, v);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  const handleLayout = useCallback(
    (mode: LayoutMode) => update({ layout: mode === "gallery" ? null : mode }),
    [update]
  );

  const toggleIn = <T,>(set: ReadonlySet<T>, v: T): Set<T> => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  };

  const toggleParam = <T extends string>(
    key: string,
    set: ReadonlySet<T>,
    v: T
  ) => update({ [key]: Array.from(toggleIn(set, v)).join(",") || null });

  const matched = PROJECTS.filter(
    (p) =>
      (industries.size === 0 || industries.has(p.domain)) &&
      (techs.size === 0 || p.tech.some((t) => techs.has(t))) &&
      (format === "all" ||
        (format === "interactive" ? p.hasInteractive : p.hasStatic))
  );

  /* PROJECTS already arrives newest-first. "Oldest" re-sorts rather than
     reversing, so the domain and index tiebreaks keep pointing the same way in
     both directions instead of mirroring into a different order. */
  const filtered =
    sort === "oldest"
      ? [...matched].sort(
          (a, b) =>
            a.year - b.year ||
            DOMAIN_ORDER.indexOf(a.domain) - DOMAIN_ORDER.indexOf(b.domain) ||
            a.index.localeCompare(b.index)
        )
      : matched;

  const filtersActive =
    industries.size > 0 || techs.size > 0 || format !== "all";

  const clearFilters = () =>
    update({ industry: null, tech: null, format: null });

  return (
    <PageTransition>
      {/* `--page-bg`, not a literal. A hardcoded #070A0E here overrode the
          theme for the whole gallery and — via PieceDetail — all 47 piece
          pages, so choosing light mode turned every other route parchment and
          left the portfolio black under a light navbar. Inline styles beat the
          theme the same way they beat media queries. */}
      <div
        style={{
          background: "var(--gallery-bg)",
          minHeight: "100vh",
          paddingTop: "6rem",
        }}
      >
        {/* ── Page header ──
            Everything above the first piece of work is furniture, and it used
            to run 583px at 1280×720 and 890px at 375×812 — a full viewport on
            a phone before a single image. A stranger arriving from a LinkedIn
            link scrolled past a slogan, four view-switchers and four filter
            triggers before seeing any work at all.

            Two changes, no content removed: the switcher moved out of the
            header into the control band below (it was wrapping onto its own
            row on desktop and stacking four two-line buttons on mobile), and
            the rhythm between the three bands tightened. The title, the
            eyebrow, the back link and every control are all still here. */}
        <header
          style={{
            padding: "0 6vw 1.5rem",
            marginBottom: "1.25rem",
            borderBottom: "0.5px solid rgb(var(--hairline-rgb) / 0.07)",
          }}
        >
          {/* Back */}
          <Link href="/">
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.5625rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgb(var(--fg-rgb) / 0.25)",
                cursor: "pointer",
                display: "inline-block",
                marginBottom: "1rem",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgb(var(--fg-rgb) / 0.6)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgb(var(--fg-rgb) / 0.25)";
              }}
            >
              ← Patrick Anderson
            </span>
          </Link>

          {/* Title */}
          <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgb(var(--accent-rgb) / 0.65)",
                  marginBottom: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 1,
                    background: "currentColor",
                    display: "inline-block",
                  }}
                />
                Selected work · {PROJECTS.length} pieces
              </div>
              <h1
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "rgb(var(--fg-rgb))",
                }}
              >
                Work that turns
                <em
                  style={{
                    fontStyle: "italic",
                    display: "block",
                    color: "rgb(var(--accent-rgb))",
                  }}
                >
                  data into sight.
                </em>
              </h1>
          </div>
        </header>

        {/* ── Control band: view-as × industry × technique × format × sort ──
            One band rather than two. VIEW AS still reads as its own group —
            it changes how the same set is drawn, where the four facets change
            what is in the set, and that distinction is the reason sort lives
            with the filters — but grouping them onto one row costs nothing
            horizontally and saves a whole band vertically. */}
        <section
          aria-label="Gallery controls"
          style={{
            padding: "0 6vw",
            marginBottom: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              className="viewas-group"
              role="group"
              aria-label="View as"
              style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.5rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  /* Was `rgb(var(--fg-rgb) / 0.2)` — 1.5:1 on parchment, i.e.
                     a group label nobody could read. `--text-muted` puts it at
                     the same 3.65:1 as the facet triggers beside it; at 8px
                     with no border it still reads as a label, not a control. */
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                View as
              </span>
              {(Object.keys(LAYOUTS) as LayoutMode[]).map((mode) => (
                <LayoutButton
                  key={mode}
                  mode={mode}
                  active={layout === mode}
                  onClick={() => handleLayout(mode)}
                />
              ))}
            </div>

            {/* Hairline between the two groups — the only thing marking that
                VIEW AS and the facets do different jobs now they share a row.
                Hidden below 768px, where everything wraps anyway. */}
            <span className="control-band-rule" aria-hidden="true" />
            <Facet name="Industry" activeCount={industries.size}>
              {/* Same order as the By Domain sections, so the filter and the
                  layout present the domains in the same sequence. */}
              {DOMAIN_ORDER.map((key) => (
                <FilterPill
                  key={key}
                  label={DOMAINS[key].label}
                  active={industries.has(key)}
                  onClick={() => toggleParam("industry", industries, key)}
                />
              ))}
            </Facet>

            <Facet name="Technique" activeCount={techs.size}>
              {(Object.entries(TECHS) as [TechKey, string][]).map(([key, label]) => (
                <FilterPill
                  key={key}
                  label={label}
                  active={techs.has(key)}
                  onClick={() => toggleParam("tech", techs, key)}
                />
              ))}
            </Facet>

            <Facet name="Format" activeCount={format === "all" ? 0 : 1}>
              {(
                [
                  ["all", "All"],
                  ["interactive", "Interactive · Live"],
                  ["static", "Static · Print"],
                ] as [FormatFilter, string][]
              ).map(([key, label]) => (
                <FilterPill
                  key={key}
                  label={label}
                  active={format === key}
                  onClick={() => update({ format: key === "all" ? null : key })}
                />
              ))}
            </Facet>

            {/* Sort sits with the filters rather than in the VIEW AS block:
                both change what the gallery shows, where VIEW AS changes how
                the same set is drawn. It is a Facet so it inherits the
                collapse-on-mobile behaviour the other three already have. */}
            <Facet name="Sort" activeCount={sort === "newest" ? 0 : 1}>
              {(
                [
                  ["newest", "Newest first"],
                  ["oldest", "Oldest first"],
                ] as [SortOrder, string][]
              ).map(([key, label]) => (
                <FilterPill
                  key={key}
                  label={label}
                  active={sort === key}
                  onClick={() =>
                    update({ sort: key === "newest" ? null : key })
                  }
                />
              ))}
            </Facet>

            {filtersActive && (
              <FilterPill
                label={`Clear · ${filtered.length} of ${PROJECTS.length}`}
                active={false}
                onClick={clearFilters}
              />
            )}
          </div>
        </section>

        {/* ── Gallery ── */}
        <main style={{ padding: "0 6vw 6rem" }}>
          {filtered.length === 0 ? (
            <p
              style={{
                fontFamily: "'Lora', serif",
                color: "rgb(var(--fg-rgb) / 0.4)",
                padding: "4rem 0",
              }}
            >
              Nothing matches that combination — try removing a filter.
            </p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={layout}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {layout === "cinematic" && (
                  <LayoutCinematic projects={filtered} />
                )}
                {layout === "editorial" && (
                  <LayoutEditorial projects={filtered} />
                )}
                {layout === "gallery" && (
                  <LayoutGallery projects={filtered} />
                )}
                {layout === "domain" && (
                  <LayoutDomain projects={filtered} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* ── Footer ── */}
        <footer
          style={{
            padding: "2.5rem 6vw",
            borderTop: "0.5px solid rgb(var(--hairline-rgb) / 0.07)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgb(var(--fg-rgb) / 0.15)",
            }}
          >
            Patrick Anderson · PTA Geospatial Intelligence ·{" "}
            {new Date().getFullYear()}
          </span>
          <Link href="/">
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgb(var(--fg-rgb) / 0.2)",
                cursor: "pointer",
              }}
            >
              ← Back to home
            </span>
          </Link>
        </footer>
      </div>
    </PageTransition>
  );
}
