/**
 * Project Detail / Case Study Page
 * Design: "Forged Monolith" — split-screen narrative with neumorphic feature cards
 * Template for all Tier 1 project case studies
 * S-5: Added structured "Methodology & Workflow" section with end-to-end loop
 * S-8: Added Hero Image, Process Gallery, Impact Metrics, and 2 missing projects
 */
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import {
  ArrowLeft,
  ArrowRight,
  Beaker,
  Brain,
  ExternalLink,
  Github,
  Layers,
  MessageSquare,
  Search,
} from "lucide-react";
import { Link, useParams } from "wouter";

/* ── Methodology step type ── */
interface MethodologyStep {
  phase: string;
  title: string;
  description: string;
}

/* ── Gallery image type ── */
interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

/* ── Impact metric type ── */
interface ImpactMetric {
  value: string;
  label: string;
}

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
  methodology: MethodologyStep[];
  demoUrl: string;
  githubUrl: string;
  heroImage?: string;
  gallery?: GalleryImage[];
  impactMetrics?: ImpactMetric[];
}

const methodologyIcons = [Search, Layers, Brain, Beaker, MessageSquare];
const methodologyColors = [
  "var(--coral)",
  "var(--amber)",
  "var(--cyan)",
  "var(--emerald)",
  "var(--amber)",
];

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
    methodology: [
      {
        phase: "PROBLEM FRAMING",
        title: "Defining the Analytical Scope",
        description:
          "MLS lacks a unified analytics platform that serves both casual fans and data-driven analysts. I defined six distinct analytical dimensions — team overview, player performance, financial analysis, travel logistics, tactical analysis, and league-wide comparisons — each requiring different data structures and visualization approaches.",
      },
      {
        phase: "DATA COLLECTION & PREP",
        title: "Multi-Source Data Pipeline",
        description:
          "Data was sourced from public MLS APIs, web-scraped statistics, and manually curated datasets. I built a Python normalization pipeline that harmonized player stats, salary data, stadium coordinates, and schedule information into a unified JSON schema consumed by the frontend.",
      },
      {
        phase: "ANALYSIS & ARCHITECTURE",
        title: "Modular Tab-Based Analytics Engine",
        description:
          "Each tab was architected as an independent analytical module with its own data transformations, chart configurations, and interaction patterns. Three.js handles 3D visualizations (travel globe, extruded charts), while Recharts powers traditional 2D analytics. A custom design system ensures visual consistency across all modules.",
      },
      {
        phase: "INTERPRETATION & COMMUNICATION",
        title: "Auto-Generated Data Journalism",
        description:
          "Rather than leaving interpretation to the user, I built an AI-powered insight engine that generates narrative summaries from live data — producing human-readable articles that contextualize statistical patterns, identify outliers, and surface actionable insights for each team and player.",
      },
    ],
    demoUrl: "https://mls-dashboard-one.vercel.app/",
    githubUrl: "https://github.com/Ptander01/mls-dashboard",
    heroImage: "/assets/projects/mls-dashboard/hero.webp",
    gallery: [
      { src: "/assets/projects/mls-dashboard/3d-pitch.webp", alt: "3D Pitch Visualization", caption: "THREE.JS 3D PITCH — TACTICAL FORMATION OVERLAY" },
      { src: "/assets/projects/mls-dashboard/budget-chart.webp", alt: "Stacked Bar Budget Chart", caption: "TEAM BUDGET — STACKED BAR SALARY BREAKDOWN" },
      { src: "/assets/projects/mls-dashboard/scatter-plot.webp", alt: "Player Scatter Plot", caption: "PLAYER PERFORMANCE — MULTI-AXIS SCATTER ANALYSIS" },
    ],
    impactMetrics: [
      { value: "619+", label: "Players Tracked" },
      { value: "30", label: "MLS Teams Covered" },
      { value: "6", label: "Analytical Modules" },
    ],
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
    methodology: [
      {
        phase: "PROBLEM FRAMING",
        title: "The Consensus Challenge",
        description:
          "Meta's infrastructure intelligence team needed a single source of truth for global data center locations, but 9 different vendor sources provided conflicting coordinates, capacity figures, and operational statuses. The business question: which sources are reliable, and how do we reconcile disagreements?",
      },
      {
        phase: "DATA COLLECTION & PREP",
        title: "9-Source Geospatial Harmonization",
        description:
          "I ingested geospatial records from 9 commercial data vendors, each with different schemas, coordinate systems, and naming conventions. A custom ETL pipeline normalized all records into a unified spatial schema, preserving source attribution for downstream confidence scoring.",
      },
      {
        phase: "ANALYSIS & ARCHITECTURE",
        title: "UCID Spatial Clustering Algorithm",
        description:
          "I designed and implemented a Universal Consensus ID (UCID) algorithm that clusters nearby records from different sources, scores agreement levels, and generates confidence-weighted consensus positions. The algorithm handles edge cases like overlapping campuses, renamed facilities, and decommissioned sites.",
      },
      {
        phase: "INTERPRETATION & COMMUNICATION",
        title: "Interactive Consensus Dashboard",
        description:
          "Results were delivered through an interactive MapLibre GL dashboard where stakeholders can explore consensus confidence at the campus and building level, drill into vendor disagreements, and export filtered datasets for strategic planning and land acquisition decisions.",
      },
    ],
    demoUrl: "https://aidatacentertracker.vercel.app/",
    githubUrl: "https://github.com/Ptander01/consensus-viewer",
    heroImage: "/assets/projects/consensus-viewer/hero.webp",
    gallery: [
      { src: "/assets/projects/consensus-viewer/map-view.webp", alt: "Main Map View", caption: "CONSENSUS MAP — CAMPUS-LEVEL CONFIDENCE SCORING" },
      { src: "/assets/projects/consensus-viewer/harmonization-table.webp", alt: "Source Harmonization Table", caption: "SOURCE HARMONIZATION — 9-VENDOR RECONCILIATION TABLE" },
    ],
    impactMetrics: [
      { value: "9", label: "Vendor Sources Harmonized" },
      { value: "120", label: "Campuses Mapped" },
      { value: "280", label: "Buildings Tracked" },
    ],
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
    methodology: [
      {
        phase: "PROBLEM FRAMING",
        title: "Turning Failure into Opportunity",
        description:
          "When data center projects fail, billions in infrastructure investment and years of permitting work may still hold residual value. The question: can we systematically identify which failed sites represent acquisition opportunities versus permanently compromised locations?",
      },
      {
        phase: "DATA COLLECTION & PREP",
        title: "Comprehensive Failure Database",
        description:
          "I compiled data from regulatory filings, news archives, community opposition groups, and industry reports to build a comprehensive database of 28 failed or at-risk projects. Each record was enriched with geographic coordinates, failure stage classification, opposition categorization, and estimated investment figures.",
      },
      {
        phase: "ANALYSIS & ARCHITECTURE",
        title: "Stage-Gate Risk Framework",
        description:
          "I designed a multi-dimensional risk analysis framework that categorizes projects by failure stage (proposal, permitting, construction), opposition type (environmental, regulatory, community, infrastructure), and residual value potential. The framework enables systematic comparison across geographic regions and failure patterns.",
      },
      {
        phase: "INTERPRETATION & COMMUNICATION",
        title: "Strategic Risk Intelligence Dashboard",
        description:
          "The dashboard translates complex risk data into actionable intelligence for land acquisition teams. Interactive maps show geographic clustering of failures, stage-gate visualizations reveal common failure patterns, and detailed case profiles provide the context needed for strategic decision-making.",
      },
    ],
    demoUrl: "https://dc-graveyard-dashboard.vercel.app/",
    githubUrl: "https://github.com/Ptander01/dc-graveyard-dashboard",
    heroImage: "/assets/projects/dc-graveyard/hero.webp",
    gallery: [
      { src: "/assets/projects/dc-graveyard/stage-gate.webp", alt: "Stage-Gate Visualization", caption: "STAGE-GATE ANALYSIS — PROJECT FAILURE PIPELINE" },
      { src: "/assets/projects/dc-graveyard/case-profile.webp", alt: "Detailed Case Profile", caption: "CASE PROFILE — OPPOSITION FACTOR BREAKDOWN" },
    ],
    impactMetrics: [
      { value: "28", label: "At-Risk Projects Tracked" },
      { value: "11", label: "US States Covered" },
      { value: "$4.2B+", label: "Investment Analyzed" },
    ],
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
    methodology: [
      {
        phase: "PROBLEM FRAMING",
        title: "Quantifying Physical Progress from Space",
        description:
          "Competitive intelligence teams needed to track data center construction progress across multiple global sites, but lacked a systematic way to quantify what satellite imagery revealed. The challenge: transform visual observations into measurable, comparable metrics.",
      },
      {
        phase: "DATA COLLECTION & PREP",
        title: "Satellite Imagery Tasking & Ingestion",
        description:
          "I coordinated satellite imagery tasking across 5 priority sites, collecting 53 historical snapshots spanning multiple construction phases. Each image was georeferenced, color-balanced, and organized into a temporal sequence for systematic comparison.",
      },
      {
        phase: "ANALYSIS & ARCHITECTURE",
        title: "Temporal Change Detection Pipeline",
        description:
          "I built an automated pipeline that detects infrastructure changes between temporal snapshots — identifying cleared land, foundation work, structural steel, and completed buildings. A capacity forecasting model projects completion timelines based on observed construction velocity and industry benchmarks.",
      },
      {
        phase: "INTERPRETATION & COMMUNICATION",
        title: "Interactive Temporal Explorer",
        description:
          "The platform delivers insights through an interactive swipe tool for visual comparison, synchronized timeline controls for multi-site analysis, and automated progress reports that translate pixel-level changes into executive-level construction intelligence.",
      },
    ],
    demoUrl: "https://satellite-explorer-seven.vercel.app/",
    githubUrl: "https://github.com/Ptander01/satellite-explorer",
    heroImage: "/assets/projects/satellite-explorer/hero.webp",
    gallery: [
      { src: "/assets/projects/satellite-explorer/swipe-tool.webp", alt: "Historical Imagery Swipe Tool", caption: "TEMPORAL SWIPE — BEFORE/AFTER CONSTRUCTION COMPARISON" },
      { src: "/assets/projects/satellite-explorer/timeline.webp", alt: "Timeline Scrubber", caption: "SYNCHRONIZED TIMELINE — MULTI-SITE TEMPORAL ANALYSIS" },
    ],
    impactMetrics: [
      { value: "53", label: "Historical Snapshots" },
      { value: "5", label: "Sites Monitored" },
      { value: "3yr", label: "Temporal Coverage" },
    ],
  },
  "dc-parcel-dashboard": {
    slug: "dc-parcel-dashboard",
    title: "DC Parcel Dashboard",
    subtitle: "REAL ESTATE INTELLIGENCE PLATFORM",
    color: "var(--cyan)",
    problem:
      "How do you evaluate hundreds of potential data center sites simultaneously — comparing zoning, utility access, environmental constraints, and acquisition timelines — without drowning in spreadsheets?",
    outcome:
      "An interactive parcel-level intelligence dashboard for data center site evaluation, combining zoning data, utility infrastructure, environmental constraints, and acquisition timelines into a unified decision-support tool covering multiple metro areas.",
    approach:
      "I built a geospatial decision-support platform that layers parcel-level zoning data, utility infrastructure maps, and environmental constraint overlays into a single interactive interface. The system includes a Gantt-style acquisition timeline tracker and dual-panel comparison tools for side-by-side site evaluation.",
    techStack: [
      { label: "FRONTEND", items: "React 18 · TypeScript · Vite" },
      { label: "MAPPING", items: "MapLibre GL JS · Parcel Boundary Layers" },
      { label: "CHARTS", items: "Apache ECharts · Gantt Timeline · Comparison Panels" },
      { label: "DATA", items: "TanStack Table · Zoning Classification · Utility Scoring" },
    ],
    features: [
      {
        title: "Parcel-Level Symbology Map",
        description:
          "Interactive map with custom symbology showing zoning classifications, utility proximity scores, and environmental constraint overlays for each parcel.",
      },
      {
        title: "Acquisition Timeline Gantt",
        description:
          "A Gantt-style visualization tracking acquisition milestones across multiple sites, with 36+ milestone markers per project and critical path highlighting.",
      },
      {
        title: "Dual-Panel Site Comparison",
        description:
          "Side-by-side comparison tool for evaluating competing sites across acreage, zoning, utility access, and environmental risk dimensions.",
      },
      {
        title: "Site Intelligence Tables",
        description:
          "Filterable data tables with parcel-level detail including ownership records, zoning history, utility distance calculations, and environmental assessments.",
      },
    ],
    methodology: [
      {
        phase: "PROBLEM FRAMING",
        title: "Systematizing Site Selection",
        description:
          "Data center site selection involves evaluating dozens of variables across hundreds of parcels — zoning compatibility, utility access, environmental risk, and acquisition complexity. The challenge: replace ad hoc spreadsheet analysis with a systematic, map-driven decision framework.",
      },
      {
        phase: "DATA COLLECTION & PREP",
        title: "Multi-Layer Geospatial Assembly",
        description:
          "I assembled parcel boundary data, zoning classifications, utility infrastructure maps, environmental constraint layers, and ownership records from county GIS systems, utility providers, and public records databases. Each layer was georeferenced and normalized into a unified spatial schema.",
      },
      {
        phase: "ANALYSIS & ARCHITECTURE",
        title: "Composite Site Scoring Engine",
        description:
          "I designed a multi-criteria scoring framework that weights zoning compatibility, utility proximity, environmental risk, and acquisition complexity into a composite site score. The system supports custom weight profiles for different evaluation scenarios and stakeholder priorities.",
      },
      {
        phase: "INTERPRETATION & COMMUNICATION",
        title: "Interactive Decision-Support Dashboard",
        description:
          "The dashboard delivers site intelligence through an interactive map with parcel-level drill-down, Gantt-style acquisition timelines, dual-panel comparison tools, and exportable data tables — enabling land acquisition teams to make data-driven site selection decisions.",
      },
    ],
    demoUrl: "https://dc-parcel-dashboard.vercel.app/",
    githubUrl: "https://github.com/Ptander01/dc-parcel-dashboard",
    heroImage: "/assets/projects/dc-parcel-dashboard/hero.webp",
    gallery: [
      { src: "/assets/projects/dc-parcel-dashboard/symbology-map.webp", alt: "Parcel Symbology Map", caption: "PARCEL SYMBOLOGY — ZONING & UTILITY OVERLAY" },
      { src: "/assets/projects/dc-parcel-dashboard/gantt-timeline.webp", alt: "Acquisition Timeline Gantt", caption: "ACQUISITION GANTT — 36 MILESTONE TRACKER" },
      { src: "/assets/projects/dc-parcel-dashboard/compare-sites.webp", alt: "Dual-Panel Site Comparison", caption: "SITE COMPARISON — DUAL-PANEL ACREAGE ANALYSIS" },
    ],
    impactMetrics: [
      { value: "36+", label: "Milestones per Site" },
      { value: "4", label: "Metro Areas Covered" },
      { value: "158K", label: "Lines of Code" },
    ],
  },
  "agent-flow-visualizer": {
    slug: "agent-flow-visualizer",
    title: "Agent Flow Visualizer",
    subtitle: "AI WORKFLOW INTELLIGENCE",
    color: "var(--emerald)",
    problem:
      "When multiple AI agents collaborate on complex geospatial analysis tasks, how do you observe, debug, and understand the reasoning chains that produce the final output?",
    outcome:
      "A real-time visualization of multi-agent AI orchestration workflows, showing how autonomous agents collaborate through structured reasoning chains to solve complex geospatial analysis tasks — with chronological replay and node-graph exploration.",
    approach:
      "I built a dual-view visualization system that captures and replays multi-agent workflows in real time. The chronological timeline view shows the temporal sequence of agent actions, while the node-graph view reveals the dependency structure and data flow between agents. Both views are synchronized and support interactive exploration.",
    techStack: [
      { label: "FRONTEND", items: "React 18 · TypeScript · Vite" },
      { label: "VISUALIZATION", items: "D3.js · Custom Node Graph · Timeline Engine" },
      { label: "DATA", items: "WebSocket · Real-Time Event Stream · JSON Replay" },
      { label: "DESIGN", items: "Neumorphic UI · Animated Transitions · Framer Motion" },
    ],
    features: [
      {
        title: "Chronological Replay Timeline",
        description:
          "A scrubable timeline that replays multi-agent workflows step by step, showing the exact sequence of reasoning, tool calls, and data transformations.",
      },
      {
        title: "Interactive Node Graph",
        description:
          "A D3.js-powered directed graph showing agent dependencies, data flow paths, and reasoning chain connections with animated edge traversal.",
      },
      {
        title: "Agent Action Detail Panels",
        description:
          "Expandable detail panels for each agent action showing input/output data, reasoning context, tool invocations, and execution timing.",
      },
      {
        title: "Real-Time Event Streaming",
        description:
          "WebSocket-based live event capture that streams agent actions as they occur, enabling real-time monitoring of active orchestration workflows.",
      },
    ],
    methodology: [
      {
        phase: "PROBLEM FRAMING",
        title: "Making AI Reasoning Visible",
        description:
          "Multi-agent AI systems produce complex, branching reasoning chains that are nearly impossible to debug from log files alone. The challenge: create an intuitive visual interface that makes agent collaboration patterns, decision points, and data transformations immediately comprehensible.",
      },
      {
        phase: "DATA COLLECTION & PREP",
        title: "Agent Event Schema Design",
        description:
          "I designed a structured event schema that captures every agent action — tool calls, reasoning steps, data transformations, and inter-agent messages — with precise timestamps and dependency metadata. This schema enables both real-time streaming and historical replay.",
      },
      {
        phase: "ANALYSIS & ARCHITECTURE",
        title: "Dual-View Visualization Engine",
        description:
          "I architected a synchronized dual-view system: a chronological timeline for temporal analysis and a node graph for structural analysis. Both views share a common data model and respond to the same interaction events, enabling seamless switching between temporal and structural perspectives.",
      },
      {
        phase: "INTERPRETATION & COMMUNICATION",
        title: "Interactive Workflow Explorer",
        description:
          "The visualizer delivers insights through interactive replay controls, expandable detail panels, and animated graph traversal — enabling developers and stakeholders to understand exactly how AI agents collaborate, where bottlenecks occur, and how reasoning chains produce final outputs.",
      },
    ],
    demoUrl: "https://agentflow-eaqzkikc.manus.space",
    githubUrl: "https://github.com/Ptander01/agent-flow-visualizer",
    heroImage: "/assets/projects/agent-flow-visualizer/hero.webp",
    gallery: [
      { src: "/assets/projects/agent-flow-visualizer/timeline.webp", alt: "Chronological Replay Timeline", caption: "CHRONOLOGICAL REPLAY — STEP-BY-STEP AGENT ACTIONS" },
      { src: "/assets/projects/agent-flow-visualizer/node-graph.webp", alt: "Interactive Node Graph", caption: "NODE GRAPH — AGENT DEPENDENCY & DATA FLOW" },
    ],
    impactMetrics: [
      { value: "5", label: "Agent Types Visualized" },
      { value: "Real-Time", label: "Event Streaming" },
      { value: "2", label: "Synchronized Views" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════
   HERO IMAGE SECTION
   Full-width screenshot at the top of the case study.
   Uses the .work-screenshot-frame class from the texture addendum.
   ═══════════════════════════════════════════════════════════════ */
function HeroImage({ src, alt, color }: { src: string; alt: string; color: string }) {
  return (
    <section
      className="relative py-12 noise-bg"
      style={{ background: "var(--surface-sunken)" }}
    >
      <div className="container relative z-10">
        <FadeIn duration={0.8}>
          <div className="work-screenshot-frame rounded-lg" style={{ borderTopColor: color }}>
            <img
              src={src}
              alt={alt}
              className="w-full h-auto"
              loading="eager"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   IMPACT METRICS ROW
   3-column stats row with neumorphic cards.
   ═══════════════════════════════════════════════════════════════ */
function ImpactMetricsRow({ metrics, color }: { metrics: ImpactMetric[]; color: string }) {
  return (
    <section
      className="relative py-20 noise-bg"
      style={{ background: "var(--page-bg)" }}
    >
      <div className="container relative z-10">
        <FadeIn duration={0.6}>
          <div className="text-center mb-12">
            <span
              className="label-mono inline-block mb-4"
              style={{ color, fontSize: "0.65rem" }}
            >
              IMPACT AT A GLANCE
            </span>
          </div>
        </FadeIn>
        <StaggerChildren
          staggerDelay={0.12}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          {metrics.map((metric, i) => (
            <StaggerItem key={i}>
              <div className="stat-card rounded-xl text-center py-8 px-4">
                <div
                  className="data-value mb-2"
                  style={{ color }}
                >
                  {metric.value}
                </div>
                <div
                  className="label-mono"
                  style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}
                >
                  {metric.label}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROCESS GALLERY
   Grid gallery with .work-screenshot-frame artifact framing.
   ═══════════════════════════════════════════════════════════════ */
function ProcessGallery({ images, color }: { images: GalleryImage[]; color: string }) {
  return (
    <section
      className="work-showcase noise-bg"
      style={{ background: "var(--surface-deep)", padding: "5rem 6vw" }}
    >
      <div className="container relative z-10">
        <FadeIn duration={0.6}>
          <div className="mb-12">
            <span
              className="work-showcase-label"
              style={{ color }}
            >
              VISUAL EVIDENCE
            </span>
            <h2 className="work-showcase-title">
              Process <em>&amp; Output</em>
            </h2>
          </div>
        </FadeIn>
        <StaggerChildren
          staggerDelay={0.15}
          className={`grid gap-6 ${
            images.length === 1
              ? "grid-cols-1"
              : images.length === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {images.map((img, i) => (
            <StaggerItem key={i}>
              <div>
                <div className="work-screenshot-frame rounded-lg">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
                <div className="work-screenshot-caption mt-3">
                  <span>{img.caption}</span>
                  <span style={{ opacity: 0.5 }}>
                    {String(i + 1).padStart(2, "0")}/{String(images.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
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

        <div className="container relative z-10 pt-40 pb-20">
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

      {/* ═══════ HERO IMAGE (S-8) ═══════ */}
      {project.heroImage && (
        <HeroImage src={project.heroImage} alt={`${project.title} — Hero Screenshot`} color={project.color} />
      )}

      {/* ═══════ IMPACT METRICS (S-8) ═══════ */}
      {project.impactMetrics && project.impactMetrics.length > 0 && (
        <ImpactMetricsRow metrics={project.impactMetrics} color={project.color} />
      )}

      {/* ═══════ PROBLEM & OUTCOME (Split Screen) ═══════ */}
      <section
        className="relative py-32 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
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

      {/* ═══════ PROCESS GALLERY (S-8) ═══════ */}
      {project.gallery && project.gallery.length > 0 && (
        <ProcessGallery images={project.gallery} color={project.color} />
      )}

      {/* ═══════ METHODOLOGY & WORKFLOW (End-to-End Loop) ═══════ */}
      <section
        className="relative py-40 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <div className="text-center mb-20">
              <span
                className="label-mono inline-block mb-4"
                style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
              >
                METHODOLOGY &amp; WORKFLOW
              </span>
              <h2 className="heading-lg" style={{ color: "var(--heading-color)" }}>
                End-to-End Ownership
              </h2>
              <p
                className="body-lg max-w-2xl mx-auto mt-4"
                style={{ color: "var(--text-muted)" }}
              >
                Every project follows a complete analytical loop &mdash; from
                understanding the business problem through building the
                infrastructure to delivering actionable intelligence.
              </p>
            </div>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            <StaggerChildren staggerDelay={0.12} className="space-y-0">
              {project.methodology.map((step, index) => {
                const Icon = methodologyIcons[index % methodologyIcons.length];
                const color = methodologyColors[index % methodologyColors.length];
                return (
                  <StaggerItem key={step.phase}>
                    <div className="flex items-start gap-6 mb-2">
                      {/* Step icon + connector */}
                      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 48 }}>
                        <div
                          className="neu-concave rounded-full flex items-center justify-center"
                          style={{ width: 48, height: 48 }}
                        >
                          <Icon size={20} style={{ color }} />
                        </div>
                        {index < project.methodology.length - 1 && (
                          <div
                            className="w-px flex-1 my-2"
                            style={{
                              minHeight: 32,
                              background: `linear-gradient(to bottom, ${color}, transparent)`,
                              opacity: 0.4,
                            }}
                          />
                        )}
                      </div>

                      {/* Content card */}
                      <div className="neu-raised rounded-xl p-6 flex-1 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className="label-mono"
                            style={{ color, fontSize: "0.55rem" }}
                          >
                            {step.phase}
                          </span>
                        </div>
                        <h3
                          className="font-display font-semibold text-lg mb-3"
                          style={{ color: "var(--heading-color)" }}
                        >
                          {step.title}
                        </h3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* ═══════ APPROACH & TECH STACK ═══════ */}
      <section
        className="relative py-40 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
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
                  Technical Architecture
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
        className="relative py-32 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <div className="text-center mb-20">
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
