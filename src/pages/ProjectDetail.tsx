/**
 * Project Detail / Case Study Page
 * Design: "Forged Monolith" — split-screen narrative with neumorphic feature cards
 * Template for all Tier 1 project case studies
 */
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Link, useParams } from "wouter";

/* ── Project Data ── */
interface ProjectData {
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  problem: string;
  outcome: string;
  approach: string;
  techStack: { label: string; items: string }[];
  features: { title: string; description: string }[];
  demoUrl: string;
  githubUrl: string;
}

const projectData: Record<string, ProjectData> = {
  "mls-dashboard": {
    slug: "mls-dashboard",
    title: "MLS Analytics Dashboard",
    subtitle: "SPORTS ANALYTICS PLATFORM",
    color: "var(--cyan)",
    problem:
      "How do you make sense of an entire professional sports league's worth of data — player stats, team budgets, attendance, travel logistics — in a single, intuitive interface?",
    outcome:
      "A 6-tab interactive dashboard with 3D visualizations, auto-generated data journalism, and a custom \"Industrial Neumorphic 3D\" design system. The platform covers all 30 MLS teams with 619+ players, featuring real-time data integration and a comprehensive analytics engine.",
    approach:
      "I designed a modular tab-based architecture where each view serves a distinct analytical purpose — from individual player performance to league-wide travel logistics. The data pipeline combines static datasets with live API feeds, processed through a Python backend that normalizes and enriches the raw data. The frontend leverages Three.js for 3D visualizations and Recharts for traditional charting, unified under a custom neumorphic design system.",
    techStack: [
      { label: "FRONTEND", items: "React 19 · TypeScript · Tailwind CSS 4" },
      { label: "VISUALIZATION", items: "Three.js · Recharts · deck.gl · Framer Motion" },
      { label: "INFRASTRUCTURE", items: "Vite 7 · Vercel · Python Data Pipeline" },
      { label: "DESIGN SYSTEM", items: "Industrial Neumorphism · Glassmorphism · 3D Extruded Charts" },
    ],
    features: [
      {
        title: "Three.js 3D Travel Globe",
        description:
          "An interactive 3D globe with animated route arcs showing team travel patterns across North America, with distance calculations and schedule density overlays.",
      },
      {
        title: "Auto-Generating Insight Engine",
        description:
          "An AI-powered narrative generator that produces data journalism articles from live statistics, creating human-readable insights from complex datasets.",
      },
      {
        title: "3D Extruded Chart Elements",
        description:
          "Custom Three.js-rendered bar charts and data elements with depth, lighting, and shadow — going beyond flat 2D charting to create a tactile data experience.",
      },
      {
        title: "Player Heatmaps & Passing Networks",
        description:
          "Tactical visualization with glass-node passing networks, positional heatmaps, and formation analysis overlays for deep player performance analysis.",
      },
      {
        title: "Hybrid Static + Live API Architecture",
        description:
          "A dual-source data pipeline that combines curated static datasets with real-time API feeds, ensuring both reliability and freshness of data.",
      },
    ],
    demoUrl: "https://mls-dashboard-psi.vercel.app/",
    githubUrl: "https://github.com/Ptander01/mls-dashboard",
  },
  "consensus-viewer": {
    slug: "consensus-viewer",
    title: "AI Data Center Consensus Tracker",
    subtitle: "GEOSPATIAL INTELLIGENCE PLATFORM",
    color: "var(--emerald)",
    problem:
      "When multiple data sources disagree on the location, capacity, and status of data center campuses worldwide, how do you establish a single source of truth?",
    outcome:
      "An interactive geospatial dashboard that harmonizes data from 9 vendor sources into a unified consensus view across 120 campuses and 280 buildings, providing the definitive reference for AI infrastructure intelligence.",
    approach:
      "I developed a custom Universal Consensus ID (UCID) spatial clustering algorithm to reconcile conflicting geospatial records from disparate vendors. The system scores each data point for consensus confidence, then visualizes the harmonized results through an interactive map with statistical dashboards for regional analysis.",
    techStack: [
      { label: "FRONTEND", items: "React 18 · TypeScript · Vite" },
      { label: "MAPPING", items: "MapLibre GL JS · Custom Tile Layers" },
      { label: "CHARTS", items: "Apache ECharts · Statistical Dashboards" },
      { label: "DATA", items: "TanStack Table · CSV Export · Multi-Source Harmonization" },
    ],
    features: [
      {
        title: "Multi-Source Data Harmonization",
        description:
          "A custom UCID algorithm that reconciles conflicting records from 9 vendor sources, scoring each data point for consensus confidence and reliability.",
      },
      {
        title: "Interactive Campus/Building Drill-Down",
        description:
          "Map-based exploration from regional overview to individual building detail, with synchronized data panels showing capacity, status, and vendor attribution.",
      },
      {
        title: "Statistical Regional Dashboards",
        description:
          "Apache ECharts-powered analytics showing capacity distribution, growth trends, and vendor coverage across geographic regions.",
      },
      {
        title: "Filterable Data Tables with Export",
        description:
          "TanStack Table integration with advanced filtering, sorting, and CSV export for downstream analysis and reporting.",
      },
    ],
    demoUrl: "https://aidatacentertracker.vercel.app/",
    githubUrl: "https://github.com/Ptander01/consensus-viewer",
  },
  "dc-graveyard": {
    slug: "dc-graveyard",
    title: "Data Center Graveyard Dashboard",
    subtitle: "RISK INTELLIGENCE PLATFORM",
    color: "var(--coral)",
    problem:
      "When a data center project fails — due to community opposition, regulatory hurdles, or environmental concerns — is that land permanently 'contaminated' for future development, or is it an opportunity?",
    outcome:
      "A risk intelligence dashboard tracking 28 at-risk or failed data center projects across 11 US states, analyzing opposition factors, regulatory status, and residual investment potential to inform strategic land acquisition decisions.",
    approach:
      "I compiled a comprehensive dataset of failed and at-risk data center projects, categorizing each by failure stage, opposition type, and residual value. The dashboard provides a stage-gate analysis framework that tracks projects from proposal through permitting, construction, and failure, with community sentiment overlays.",
    techStack: [
      { label: "FRONTEND", items: "React 18 · TypeScript · Vite" },
      { label: "MAPPING", items: "MapLibre GL JS · Risk Factor Overlays" },
      { label: "CHARTS", items: "Apache ECharts · Stage-Gate Analysis" },
      { label: "DATA", items: "TanStack Table · Opposition Categorization · Case Profiles" },
    ],
    features: [
      {
        title: "Interactive Risk Map",
        description:
          "MapLibre GL-powered map with opposition factor overlays, showing geographic distribution and risk clustering of failed projects.",
      },
      {
        title: "Stage-Gate Analysis",
        description:
          "A pipeline visualization tracking each project through proposal, permitting, construction, and failure stages with timeline analysis.",
      },
      {
        title: "Community Opposition Tracking",
        description:
          "Categorization and sentiment tracking of opposition factors — environmental, regulatory, community, and infrastructure concerns.",
      },
      {
        title: "Detailed Case Profiles",
        description:
          "Filterable project database with comprehensive case profiles including investment amounts, failure causes, and residual development potential.",
      },
    ],
    demoUrl: "https://dc-graveyard-dashboard.vercel.app/",
    githubUrl: "https://github.com/Ptander01/dc-graveyard-dashboard",
  },
  "satellite-explorer": {
    slug: "satellite-explorer",
    title: "Satellite Time-Series Explorer",
    subtitle: "REMOTE SENSING PLATFORM",
    color: "var(--amber)",
    problem:
      "How do you monitor the physical construction progress of data centers across dozens of sites using satellite imagery, and quantify what you see?",
    outcome:
      "A time-series satellite imagery viewer that tracks construction progress across 5 sites with 53 historical snapshots, featuring infrastructure detection overlays and capacity forecasting models.",
    approach:
      "I built a temporal analysis platform that ingests satellite imagery across multiple time periods, enabling visual comparison and quantitative measurement of construction progress. The system includes automated infrastructure feature detection and capacity projection algorithms based on observed physical changes.",
    techStack: [
      { label: "FRONTEND", items: "React 18 · TypeScript · Vite" },
      { label: "MAPPING", items: "MapLibre GL JS · Satellite Imagery Layers" },
      { label: "CHARTS", items: "Apache ECharts · Time-Series Analysis" },
      { label: "DATA", items: "TanStack Table · Infrastructure Detection · Capacity Forecasting" },
    ],
    features: [
      {
        title: "Historical Imagery Swipe Tool",
        description:
          "A before/after comparison tool that lets users swipe between satellite snapshots to visually assess construction progress over time.",
      },
      {
        title: "Infrastructure Feature Detection",
        description:
          "Automated detection of infrastructure features with graphical overlays highlighting new construction, cleared land, and utility connections.",
      },
      {
        title: "Construction Progress Quantification",
        description:
          "Algorithmic measurement of construction progress with capacity forecasting based on observed physical changes and industry benchmarks.",
      },
      {
        title: "Synchronized Timeline Scrubber",
        description:
          "A unified timeline control that synchronizes imagery, charts, and data tables across all monitored sites for comparative temporal analysis.",
      },
    ],
    demoUrl: "https://satellite-explorer-seven.vercel.app/",
    githubUrl: "https://github.com/Ptander01/satellite-explorer",
  },
};

export default function ProjectDetail() {
  const params = useParams<{ slug: string }>();
  const project = projectData[params.slug || ""];

  if (!project) {
    return (
      <PageTransition>
        <section
          className="min-h-screen flex items-center justify-center"
          style={{ background: "var(--page-bg)" }}
        >
          <div className="text-center">
            <h1 className="heading-lg mb-4" style={{ color: "var(--heading-color)" }}>
              Project Not Found
            </h1>
            <Link href="/work">
              <span
                className="inline-flex items-center gap-2 font-display font-medium text-sm"
                style={{ color: "var(--cyan)" }}
              >
                <ArrowLeft size={14} />
                Back to Work
              </span>
            </Link>
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {/* ═══════ CASE STUDY HERO ═══════ */}
      <section
        className="relative min-h-[60vh] flex items-end overflow-hidden noise-bg"
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
              "linear-gradient(to top, var(--page-bg) 0%, transparent 60%)",
          }}
        />

        <div className="container relative z-10 pt-32 pb-16">
          <FadeIn delay={0.1} duration={0.6}>
            <Link href="/work">
              <span
                className="inline-flex items-center gap-2 font-display font-medium text-sm mb-8 block"
                style={{ color: "var(--text-muted)" }}
              >
                <ArrowLeft size={14} />
                Back to Work
              </span>
            </Link>
          </FadeIn>
          <FadeIn delay={0.2} duration={0.8}>
            <span
              className="label-mono inline-block mb-4"
              style={{ color: project.color, fontSize: "0.7rem" }}
            >
              {project.subtitle}
            </span>
          </FadeIn>
          <FadeIn delay={0.4} duration={0.8}>
            <h1 className="heading-xl mb-6" style={{ color: "var(--heading-color)" }}>
              {project.title.split(" ").slice(0, -1).join(" ")}
              <br />
              <span className="text-glow-cyan" style={{ color: project.color }}>
                {project.title.split(" ").slice(-1)[0]}
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.6} duration={0.8}>
            <div className="flex flex-wrap gap-4">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-raised inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold text-sm transition-all"
                style={{
                  color: "var(--primary-foreground)",
                  background: project.color,
                }}
              >
                LIVE DEMO
                <ExternalLink size={14} />
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-flat inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-medium text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <Github size={14} />
                VIEW SOURCE
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ PROBLEM & OUTCOME (Split Screen) ═══════ */}
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
                  style={{ color: "var(--coral)", fontSize: "0.65rem" }}
                >
                  THE PROBLEM
                </span>
                <h2 className="heading-lg mb-6" style={{ color: "var(--heading-color)" }}>
                  The Challenge
                </h2>
                <p
                  className="body-lg"
                  style={{ color: "var(--text-muted)" }}
                >
                  {project.problem}
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="right" duration={0.7} delay={0.2}>
              <div>
                <span
                  className="label-mono mb-4 inline-block"
                  style={{ color: "var(--emerald)", fontSize: "0.65rem" }}
                >
                  THE OUTCOME
                </span>
                <h2 className="heading-lg mb-6" style={{ color: "var(--heading-color)" }}>
                  The Result
                </h2>
                <p
                  className="body-lg"
                  style={{ color: "var(--text-muted)" }}
                >
                  {project.outcome}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ APPROACH & TECH STACK ═══════ */}
      <section
        className="relative py-28 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <FadeIn direction="left" duration={0.7}>
              <div>
                <span
                  className="label-mono mb-4 inline-block"
                  style={{ color: "var(--amber)", fontSize: "0.65rem" }}
                >
                  THE APPROACH
                </span>
                <h2 className="heading-lg mb-6" style={{ color: "var(--heading-color)" }}>
                  Methodology
                </h2>
                <p
                  className="body-lg"
                  style={{ color: "var(--text-muted)" }}
                >
                  {project.approach}
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="right" duration={0.7} delay={0.2}>
              <div>
                <span
                  className="label-mono mb-4 inline-block"
                  style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
                >
                  TECH STACK
                </span>
                <div className="space-y-4">
                  {project.techStack.map((row) => (
                    <div key={row.label} className="neu-raised rounded-xl p-5">
                      <div
                        className="label-mono mb-2"
                        style={{ color: project.color, fontSize: "0.6rem" }}
                      >
                        {row.label}
                      </div>
                      <div
                        className="font-mono text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {row.items}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ KEY FEATURES ═══════ */}
      <section
        className="relative py-20 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <div className="text-center mb-16">
              <span
                className="label-mono inline-block mb-4"
                style={{ color: project.color, fontSize: "0.65rem" }}
              >
                KEY FEATURES
              </span>
              <h2 className="heading-lg" style={{ color: "var(--heading-color)" }}>
                What Makes It Work
              </h2>
            </div>
          </FadeIn>

          <StaggerChildren
            staggerDelay={0.1}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {project.features.map((feature, index) => (
              <StaggerItem key={index}>
                <div className="neu-raised rounded-xl p-6 h-full">
                  <div
                    className="font-display text-4xl font-bold mb-4"
                    style={{ color: project.color, opacity: 0.3 }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3
                    className="heading-md mb-3"
                    style={{ color: "var(--heading-color)", fontSize: "1.1rem" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {feature.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Bottom CTA */}
          <FadeIn delay={0.3} duration={0.6}>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-16">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-raised inline-flex items-center gap-2 px-8 py-3 rounded-lg font-display font-semibold text-sm transition-all"
                style={{
                  color: "var(--primary-foreground)",
                  background: project.color,
                }}
              >
                EXPLORE LIVE DEMO
                <ExternalLink size={14} />
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-flat inline-flex items-center gap-2 px-8 py-3 rounded-lg font-display font-medium text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <Github size={14} />
                VIEW SOURCE CODE
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
