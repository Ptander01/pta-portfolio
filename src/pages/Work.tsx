/**
 * Work Page — Project index showing all Tier 1 projects
 * Design: "Forged Monolith" — grid of project cards with neumorphic styling
 */
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import {
  ArrowRight,
  BarChart3,
  Globe,
  Map,
  Satellite,
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
    demoUrl: "https://mls-dashboard-psi.vercel.app/",
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

        <div className="container relative z-10 pt-32 pb-12">
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
              visualization. Click any project to explore the full case study.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ PROJECT GRID ═══════ */}
      <section
        className="relative py-20 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <StaggerChildren
            staggerDelay={0.12}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {projects.map((project) => (
              <StaggerItem key={project.slug}>
                <Link href={`/work/${project.slug}`}>
                  <div className="neu-raised rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer group">
                    {/* Card header with icon */}
                    <div
                      className="relative p-8 flex items-center gap-6"
                      style={{
                        background: `linear-gradient(135deg, var(--neu-bg-concave-from), var(--neu-bg-concave-to))`,
                      }}
                    >
                      <div
                        className="neu-concave rounded-xl p-4 flex items-center justify-center flex-shrink-0"
                        style={{ minWidth: 64, minHeight: 64 }}
                      >
                        <project.icon
                          size={28}
                          style={{ color: project.color }}
                        />
                      </div>
                      <div>
                        <span
                          className="label-mono mb-1 block"
                          style={{ color: project.color, fontSize: "0.55rem" }}
                        >
                          {project.subtitle}
                        </span>
                        <h3
                          className="font-display font-bold text-xl group-hover:text-glow-cyan transition-all"
                          style={{ color: "var(--heading-color)" }}
                        >
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-8 flex-1 flex flex-col">
                      <p
                        className="text-sm leading-relaxed mb-6 flex-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {project.description}
                      </p>

                      {/* Tech pills */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techHighlights.map((tech) => (
                          <span
                            key={tech}
                            className="neu-concave rounded-md px-3 py-1.5 font-mono text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div
                        className="flex items-center gap-2 font-display font-medium text-sm group-hover:gap-3 transition-all"
                        style={{ color: project.color }}
                      >
                        View Case Study
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </PageTransition>
  );
}
