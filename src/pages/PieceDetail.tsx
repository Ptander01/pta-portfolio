/**
 * PieceDetail — /projects/:id
 * ─────────────────────────────────────────────────────────────
 * The "double click into it" page: every macro shot for a piece, stacked
 * full-width and scrollable, with Patrick's long-form narrative.
 *
 * Distinct from /work/:slug, which is the six hand-built dashboard case
 * studies with their own bespoke data. This page is generic — it reads the
 * PROJECTS array, so every gallery piece gets a detail page for free and
 * the two can never disagree about a title or an image.
 *
 * Images here are deliberately NOT the hover-crossfade component used on
 * cards: on a detail page the visitor wants to see all of them at once, in
 * order, not one at a time on hover.
 *
 * Patrick Anderson — PTA Geospatial Intelligence
 */

import { Link, useParams } from "wouter";
import { useEffect } from "react";
import PageTransition from "@/components/animations/PageTransition";
import { PROJECTS, DOMAINS } from "./Projects";
import { narratives } from "@/lib/narratives";
import NotFound from "./NotFound";

export default function PieceDetail() {
  const params = useParams<{ id: string }>();
  const project = PROJECTS.find((p) => p.id === params.id);

  // Arriving from a gallery card mid-scroll would otherwise land mid-page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.id]);

  if (!project) return <NotFound />;

  const domain = DOMAINS[project.domain];
  const narrative = narratives[project.id];
  const images = project.images?.length ? project.images : [project.image];

  return (
    <PageTransition>
      <div style={{ background: "#070A0E", minHeight: "100vh", paddingTop: "6rem" }}>
        <header
          style={{
            padding: "0 6vw 2.5rem",
            borderBottom: "0.5px solid rgba(100,160,220,0.07)",
            marginBottom: "3rem",
          }}
        >
          <Link href="/projects">
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.5625rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(232,240,254,0.28)",
                cursor: "pointer",
                display: "inline-block",
                marginBottom: "2rem",
              }}
            >
              ← All work
            </span>
          </Link>

          <div
            className="label-mono"
            style={{
              color: project.accent,
              fontSize: "0.5625rem",
              letterSpacing: "0.18em",
              marginBottom: "0.75rem",
            }}
          >
            {domain.label} · {project.accentLabel} · PTA {project.index}
          </div>

          <h1
            style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: "clamp(1.9rem, 4.5vw, 3.4rem)",
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.02em",
              color: "#E8F0FE",
              margin: 0,
              textWrap: "balance",
            }}
          >
            {project.title}
          </h1>

          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.6875rem",
              letterSpacing: "0.05em",
              color: "rgba(232,240,254,0.4)",
              margin: "1rem 0 0",
            }}
          >
            {project.subtitle}
          </p>

          <div
            style={{
              display: "flex",
              gap: "1.25rem",
              flexWrap: "wrap",
              marginTop: "1.5rem",
            }}
          >
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="piece-cta"
                style={{ color: project.accent, borderColor: project.accent }}
              >
                View the interactive version ↗
              </a>
            )}
            {project.caseStudy && (
              <Link href={`/work/${project.caseStudy}`} className="piece-cta">
                Full case study →
              </Link>
            )}
          </div>
        </header>

        <main style={{ padding: "0 6vw 6rem" }}>
          <div style={{ maxWidth: 760, marginBottom: "3.5rem" }}>
            {narrative?.standfirst && (
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "1.375rem",
                  lineHeight: 1.5,
                  color: "#E8F0FE",
                  margin: "0 0 1.75rem",
                }}
              >
                {narrative.standfirst}
              </p>
            )}

            {(narrative?.paragraphs ?? [project.description]).map((p, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  color: "rgba(232,240,254,0.72)",
                  margin: "0 0 1.25rem",
                }}
              >
                {p}
              </p>
            ))}

            <blockquote className="pull-quote" style={{ marginTop: "2rem" }}>
              {project.insight}
            </blockquote>
          </div>

          {/* Every macro, full width, in order. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              marginBottom: "3.5rem",
            }}
          >
            {images.map((src, i) => (
              <figure key={src} style={{ margin: 0 }}>
                <img
                  src={src}
                  alt={`${project.title} — view ${i + 1} of ${images.length}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: 4,
                    background: "#0A0E14",
                  }}
                />
                <figcaption
                  className="label-mono"
                  style={{
                    fontSize: "0.5rem",
                    letterSpacing: "0.16em",
                    color: "rgba(232,240,254,0.22)",
                    marginTop: 6,
                  }}
                >
                  {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </figcaption>
              </figure>
            ))}
          </div>

          <div style={{ maxWidth: 760 }}>
            <DetailBlock label="Method" accent={project.accent}>
              <p className="piece-body">{project.method}</p>
            </DetailBlock>

            {narrative?.credits?.map((c) => (
              <DetailBlock key={c.label} label={c.label} accent={project.accent}>
                {c.lines.map((l, i) => (
                  <p key={i} className="piece-body piece-body--tight">
                    {l}
                  </p>
                ))}
              </DetailBlock>
            ))}

            <DetailBlock label="Source" accent={project.accent}>
              <p className="piece-body piece-body--tight">{project.source}</p>
            </DetailBlock>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "1.5rem" }}>
              {project.tags.map((t) => (
                <span key={t} className="piece-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}

function DetailBlock({
  label,
  accent,
  children,
}: {
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "1.75rem" }}>
      <h2
        className="label-mono"
        style={{
          fontSize: "0.5625rem",
          letterSpacing: "0.2em",
          color: accent,
          marginBottom: "0.6rem",
        }}
      >
        {label}
      </h2>
      {children}
    </section>
  );
}
