/**
 * Home — Landing
 * ─────────────────────────────────────────────────────────────
 * One screen. Name, what I do, and a way in. No scroll narrative.
 *
 * Replaces the seven-chapter cinematic scroll (ParticleHero + GSAP),
 * which read as a remote-sensing pipeline story rather than a portfolio
 * front door. Modelled on the structure of the prior Portfoliobox site:
 * a single image, a name, a line, and four links.
 *
 * The hero art is portrait (1536×2752), so this is a split layout rather
 * than a full-bleed background — a 16:9 crop of that image keeps only
 * ~31% of it and cuts off the figure entirely.
 *
 * Patrick Anderson — PTA Geospatial Intelligence
 */

import { Link } from "wouter";
import PageTransition from "@/components/animations/PageTransition";
import ThemeToggle from "@/components/ThemeToggle";

const NAV = [
  { label: "Portfolio", href: "/projects" },
  { label: "About Me", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
] as const;

const HERO_SRC = "/images/work/cinematic_code_swirl_v1_geocode.webp";

export default function Home() {
  return (
    <PageTransition>
      <div
        // Grid columns/rows live in CSS (.home-split) so the media query can
        // switch to the two-column desktop layout — an inline value would win
        // over the media query and pin it to one column.
        style={{
          minHeight: "100vh",
          display: "grid",
          background: "var(--page-bg)",
        }}
        className="home-split"
      >
        {/* ── Left: identity + entry points ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(2.5rem, 6vw, 5rem)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ position: "absolute", top: "1.75rem", right: "1.75rem" }}>
            <ThemeToggle />
          </div>

          <h1
            style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 700,
              fontSize: "clamp(2.25rem, 5vw + 0.5rem, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "var(--heading-color)",
              margin: 0,
              textWrap: "balance",
            }}
          >
            Patrick J Anderson
          </h1>

          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "clamp(1rem, 1.2vw + 0.5rem, 1.25rem)",
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              margin: "1.1rem 0 0",
              maxWidth: "34ch",
            }}
          >
            Spatial data scientist: research, build, present.
          </p>

          <div
            style={{
              width: 48,
              height: 1,
              background: "var(--cyan)",
              opacity: 0.6,
              margin: "2.25rem 0",
            }}
          />

          <nav aria-label="Main">
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.9rem",
              }}
            >
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="home-nav-link"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.8125rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span className="home-nav-rule" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── Right: hero art ── */}
        <div
          className="home-hero"
          style={{
            position: "relative",
            overflow: "hidden",
            background: "#0A0E14",
            minHeight: "38vh",
          }}
        >
          <img
            src={HERO_SRC}
            alt="A figure seated with a laptop inside a ring of geospatial code — self-portrait as a data pipeline"
            fetchPriority="high"
            decoding="async"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 42%",
            }}
          />
          {/* Soften the seam between art and page on the text side */}
          <div
            className="home-hero-fade"
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          />
        </div>
      </div>
    </PageTransition>
  );
}
