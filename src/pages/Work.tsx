/**
 * Work Page — Project index with 3D Carousel
 * Design: "Forged Monolith" — 3D perspective carousel with glassmorphism cards
 * S-5: Replaced static grid with interactive 3D carousel
 */
import FadeIn from "@/components/animations/FadeIn";
import Carousel3D from "@/components/Carousel3D";
import PageTransition from "@/components/animations/PageTransition";
import {
  ArrowRight,
  BarChart3,
  Building,
  Globe,
  Map,
  Satellite,
  Workflow,
} from "lucide-react";
import { Link } from "wouter";

export interface ProjectSummary {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
  techHighlights: string[];
  demoUrl: string;
}

export const projects: ProjectSummary[] = [
  {
    slug: "mls-dashboard",
    title: "MLS Analytics Dashboard",
    subtitle: "Sports Analytics Platform",
    description:
      "A 6-tab interactive dashboard with 3D visualizations, auto-generated data journalism, and a custom Industrial Neumorphic 3D design system covering all 30 MLS teams.",
    icon: BarChart3,
    color: "var(--cyan)",
    techHighlights: ["React 19", "Three.js", "Recharts", "TypeScript"],
    demoUrl: "https://mls-dashboard-one.vercel.app/",
  },
  {
    slug: "consensus-viewer",
    title: "AI Data Center Consensus Tracker",
    subtitle: "Geospatial Intelligence Platform",
    description:
      "An interactive geospatial dashboard that harmonizes data from 9 vendor sources into a unified consensus view across 120 campuses and 280 buildings.",
    icon: Globe,
    color: "var(--emerald)",
    techHighlights: ["MapLibre GL", "Apache ECharts", "TanStack Table", "TypeScript"],
    demoUrl: "https://aidatacentertracker.vercel.app/",
  },
  {
    slug: "dc-graveyard",
    title: "Data Center Graveyard Dashboard",
    subtitle: "Risk Intelligence Platform",
    description:
      "A risk intelligence dashboard tracking 28 at-risk or failed data center projects across 11 US states, analyzing opposition factors, regulatory status, and residual investment potential.",
    icon: Map,
    color: "var(--coral)",
    techHighlights: ["MapLibre GL", "Apache ECharts", "TanStack Table", "TypeScript"],
    demoUrl: "https://dc-graveyard-dashboard.vercel.app/",
  },
  {
    slug: "satellite-explorer",
    title: "Satellite Time-Series Explorer",
    subtitle: "Remote Sensing Platform",
    description:
      "A time-series satellite imagery viewer that tracks construction progress across 5 sites with 53 historical snapshots, featuring infrastructure detection overlays and capacity forecasting.",
    icon: Satellite,
    color: "var(--amber)",
    techHighlights: ["MapLibre GL", "Apache ECharts", "TanStack Table", "TypeScript"],
    demoUrl: "https://satellite-explorer-seven.vercel.app/",
  },
  {
    slug: "dc-parcel-dashboard",
    title: "DC Parcel Dashboard",
    subtitle: "Real Estate Intelligence Platform",
    description:
      "An interactive parcel-level intelligence dashboard for data center site evaluation, combining zoning data, utility infrastructure, and environmental constraints into a unified decision-support tool.",
    icon: Building,
    color: "var(--cyan)",
    techHighlights: ["MapLibre GL", "React", "TanStack Table", "TypeScript"],
    demoUrl: "https://dc-parcel-dashboard.vercel.app/",
  },
  {
    slug: "agent-flow-visualizer",
    title: "Agent Flow Visualizer",
    subtitle: "AI Workflow Intelligence",
    description:
      "A real-time visualization of multi-agent AI orchestration workflows, showing how autonomous agents collaborate to solve complex geospatial analysis tasks through structured reasoning chains.",
    icon: Workflow,
    color: "var(--emerald)",
    techHighlights: ["React", "D3.js", "WebSocket", "TypeScript"],
    demoUrl: "https://agentflow-eaqzkikc.manus.space",
  },
];

export default function Work() {
  return (
    <PageTransition>
      {/* ═══════ WORK HERO ═══════ */}
      <section
        className="relative min-h-[50vh] flex items-end overflow-hidden noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, var(--page-bg) 0%, transparent 70%)",
          }}
        />

        <div className="container relative z-10 pt-40 pb-20">
          <FadeIn delay={0.2} duration={0.8}>
            <span
              className="label-mono inline-block mb-4"
              style={{ color: "var(--amber)", fontSize: "0.7rem" }}
            >
              SELECTED WORK
            </span>
          </FadeIn>
          <FadeIn delay={0.4} duration={0.8}>
            <h1 className="heading-xl mb-4" style={{ color: "var(--heading-color)" }}>
              Production-Grade
              <br />
              <span className="text-glow-cyan" style={{ color: "var(--cyan)" }}>
                Data Platforms.
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.6} duration={0.8}>
            <p
              className="body-lg max-w-2xl"
              style={{ color: "var(--text-muted)" }}
            >
              Each project represents a complete data pipeline &mdash; from raw
              ingestion through spatial analysis to interactive, executive-level
              visualization. Navigate the carousel to explore each case study.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ 3D PROJECT CAROUSEL ═══════ */}
      <section
        className="relative py-32 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.7}>
            <Carousel3D projects={projects} />
          </FadeIn>
        </div>
      </section>

      {/* ═══════ FEATURED DATA VISUALIZATION ═══════ */}
      <section
        className="relative py-24 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10">
          <FadeIn delay={0.2} duration={0.8}>
            <div className="text-center mb-12">
              <span
                className="label-mono inline-block mb-4"
                style={{ color: "var(--amber)", fontSize: "0.7rem" }}
              >
                FEATURED VISUALIZATION
              </span>
              <h2
                className="heading-lg mb-4"
                style={{ color: "var(--heading-color)" }}
              >
                US PhD Concentration in 2024
              </h2>
              <p
                className="body-lg max-w-2xl mx-auto"
                style={{ color: "var(--text-muted)" }}
              >
                A 3D hexbin map visualizing the geographic distribution of doctoral
                degree holders across the United States, revealing concentration
                corridors along the Boston–DC axis, Research Triangle, and SF Bay Area.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.4} duration={0.8}>
            <div className="work-showcase">
              <div className="work-screenshot-frame" style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <img
                  src="/assets/showcase/hexbin-phd-concentration.png"
                  alt="US PhD Concentration in 2024 — 3D hexbin map showing doctoral degree distribution across the United States"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: "4px",
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
