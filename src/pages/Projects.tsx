/**
 * Projects Page — Flagship project showcase
 * Design: "Forged Monolith" — full-bleed project hero,
 * staggered feature cards, neumorphic details
 */
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import {
  BarChart3,
  ExternalLink,
  Globe,
  Layers,
  Map,
  TrendingUp,
  Users,
} from "lucide-react";

const SHOWCASE_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663348511113/cgabRkVvvkEeRS4uPt589p/projects-showcase-CUXB5JnzcTYYZbRASGdPug.webp";

const ABSTRACT_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663348511113/cgabRkVvvkEeRS4uPt589p/abstract-pattern-nPEs5azrbE2KA4zqzQqJSW.webp";

const features = [
  {
    icon: BarChart3,
    title: "Player Stats",
    description:
      "Interactive scatter plots, radar charts, and sortable data tables for 619+ players across all 30 MLS teams.",
  },
  {
    icon: TrendingUp,
    title: "Team Budget",
    description:
      "Salary cap visualization with drill-down breakdowns, comparative bar charts, and budget allocation treemaps.",
  },
  {
    icon: Users,
    title: "Attendance",
    description:
      "Stadium fill-rate heatmaps, trend lines, and year-over-year comparison charts with animated transitions.",
  },
  {
    icon: Map,
    title: "Travel Map",
    description:
      "deck.gl-powered 3D arc map showing team travel routes, distances, and schedule density across North America.",
  },
  {
    icon: Globe,
    title: "Pitch Match",
    description:
      "Tactical pitch visualization with player positioning, pass networks, and formation analysis overlays.",
  },
  {
    icon: Layers,
    title: "Season Pulse",
    description:
      "Animated race chart showing league standings progression over the season with real-time data integration.",
  },
];

export default function Projects() {
  return (
    <PageTransition>
      {/* ═══════ PROJECT HERO ═══════ */}
      <section
        className="relative min-h-[70vh] flex items-end overflow-hidden noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${ABSTRACT_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, var(--page-bg) 0%, transparent 60%)",
          }}
        />

        <div className="container relative z-10 pt-32 pb-16">
          <FadeIn delay={0.2} duration={0.8}>
            <span
              className="label-mono inline-block mb-4"
              style={{ color: "var(--amber)", fontSize: "0.7rem" }}
            >
              FLAGSHIP PROJECT
            </span>
          </FadeIn>
          <FadeIn delay={0.4} duration={0.8}>
            <h1 className="heading-xl mb-4" style={{ color: "#ffffff" }}>
              MLS Analytics
              <br />
              <span className="text-glow-cyan" style={{ color: "var(--cyan)" }}>
                Dashboard
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.6} duration={0.8}>
            <p
              className="body-lg max-w-2xl"
              style={{ color: "var(--glass-text-muted)" }}
            >
              A comprehensive analytics platform for Major League Soccer,
              featuring 10+ interactive chart components, 3D visualizations, and
              real-time data across all 30 teams and 619+ players.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ SHOWCASE IMAGE ═══════ */}
      <section
        className="relative py-20 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.8}>
            <div className="neu-raised rounded-2xl overflow-hidden">
              <img
                src={SHOWCASE_IMG}
                alt="MLS Analytics Dashboard — floating 3D interface showing charts and data visualizations"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.3} duration={0.6}>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <a
                href="https://mls-dashboard-one.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="neu-raised inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold text-sm transition-all"
                style={{
                  color: "var(--primary-foreground)",
                  background: "var(--cyan)",
                }}
              >
                LIVE DEMO
                <ExternalLink size={14} />
              </a>
              <a
                href="https://github.com/Ptander01/mls-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="neu-flat inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-medium text-sm"
                style={{ color: "#8892b0" }}
              >
                VIEW SOURCE
                <ExternalLink size={14} />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ FEATURES GRID ═══════ */}
      <section
        className="relative py-28 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <div className="text-center mb-16">
              <span
                className="label-mono inline-block mb-4"
                style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
              >
                DASHBOARD MODULES
              </span>
              <h2 className="heading-lg" style={{ color: "#ffffff" }}>
                Six integrated views.
                <br />
                One unified platform.
              </h2>
            </div>
          </FadeIn>

          <StaggerChildren
            staggerDelay={0.1}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <div className="neu-raised rounded-xl p-6 h-full">
                  <div
                    className="neu-concave rounded-lg p-3 inline-flex items-center justify-center mb-5"
                    style={{ minWidth: 44, minHeight: 44 }}
                  >
                    <feature.icon
                      size={20}
                      style={{ color: "var(--cyan)" }}
                    />
                  </div>
                  <h3
                    className="heading-md mb-3"
                    style={{ color: "#ffffff", fontSize: "1.1rem" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--glass-text-muted)" }}
                  >
                    {feature.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══════ TECH DETAILS ═══════ */}
      <section
        className="relative py-20 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <FadeIn direction="left" duration={0.7}>
              <div>
                <span
                  className="label-mono mb-4 inline-block"
                  style={{ color: "var(--amber)", fontSize: "0.65rem" }}
                >
                  ARCHITECTURE
                </span>
                <h2 className="heading-lg mb-6" style={{ color: "#ffffff" }}>
                  Built for scale.
                  <br />
                  Designed for impact.
                </h2>
                <p
                  className="body-lg"
                  style={{ color: "var(--glass-text-muted)" }}
                >
                  The MLS Dashboard is a 59,000+ line React application powered
                  by Vite 7, Tailwind CSS 4, and a custom neumorphic design
                  system. It features Three.js 3D visualizations, deck.gl
                  geospatial mapping, and Recharts data charting — all
                  orchestrated through a unified theme engine that supports both
                  light and dark modes.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="right" duration={0.7} delay={0.2}>
              <div className="space-y-4">
                {[
                  {
                    label: "FRONTEND",
                    items: "React 19 · TypeScript · Tailwind CSS 4",
                  },
                  {
                    label: "VISUALIZATION",
                    items: "Recharts · Three.js · deck.gl · Framer Motion",
                  },
                  {
                    label: "INFRASTRUCTURE",
                    items: "Vite 7 · Vercel · Express · OpenAI API",
                  },
                  {
                    label: "DESIGN SYSTEM",
                    items:
                      "Industrial Neumorphism · Glassmorphism · 3D Extruded Charts",
                  },
                ].map((row) => (
                  <div key={row.label} className="neu-raised rounded-xl p-5">
                    <div
                      className="label-mono mb-2"
                      style={{ color: "var(--cyan)", fontSize: "0.6rem" }}
                    >
                      {row.label}
                    </div>
                    <div
                      className="font-mono text-sm"
                      style={{ color: "#e2e8f0" }}
                    >
                      {row.items}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
