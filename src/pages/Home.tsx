/**
 * Home Page — Hero + About section
 * Design: "Forged Monolith" — monolithic hero with forge glow,
 * massive typography, noise texture, neumorphic stat cards
 */
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { ArrowRight, BarChart3, Globe, Layers } from "lucide-react";
import { Link } from "wouter";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663348511113/cgabRkVvvkEeRS4uPt589p/hero-bg-VjjDCXXy793fpu7LHF6Q7T.webp";

const stats = [
  { value: "59K+", label: "LINES OF CODE", icon: Layers },
  { value: "10+", label: "CHART COMPONENTS", icon: BarChart3 },
  { value: "30", label: "MLS TEAMS TRACKED", icon: Globe },
];

export default function Home() {
  return (
    <PageTransition>
      {/* ═══════ HERO SECTION ═══════ */}
      <section
        className="relative min-h-screen flex items-center justify-start overflow-hidden noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.6,
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(18,18,32,0.95) 0%, rgba(18,18,32,0.7) 50%, rgba(18,18,32,0.4) 100%)",
          }}
        />

        <div className="container relative z-10 pt-32 pb-24">
          <div className="max-w-3xl">
            <FadeIn delay={0.2} duration={0.8}>
              <span
                className="label-mono inline-block mb-6"
                style={{ color: "var(--cyan)", fontSize: "0.7rem" }}
              >
                DATA VISUALIZATION &middot; ANALYTICS &middot; GEOSPATIAL
              </span>
            </FadeIn>

            <FadeIn delay={0.4} duration={0.8}>
              <h1 className="heading-xl mb-6" style={{ color: "#ffffff" }}>
                Building the
                <br />
                <span className="text-glow-cyan" style={{ color: "var(--cyan)" }}>
                  future of sports
                </span>
                <br />
                analytics.
              </h1>
            </FadeIn>

            <FadeIn delay={0.6} duration={0.8}>
              <p
                className="body-lg max-w-xl mb-10"
                style={{ color: "var(--glass-text-muted)" }}
              >
                PTA Geospatial Intelligence crafts high-performance data
                dashboards and visualization platforms. Our flagship MLS
                Analytics Dashboard transforms raw league data into actionable
                insights through 3D charts, interactive maps, and real-time
                statistics.
              </p>
            </FadeIn>

            <FadeIn delay={0.8} duration={0.8}>
              <div className="flex flex-wrap gap-4">
                <Link href="/projects">
                  <span
                    className="neu-raised inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold text-sm transition-all"
                    style={{
                      color: "var(--primary-foreground)",
                      background: "var(--cyan)",
                    }}
                  >
                    VIEW PROJECTS
                    <ArrowRight size={16} />
                  </span>
                </Link>
                <Link href="/contact">
                  <span
                    className="neu-flat inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-medium text-sm"
                    style={{ color: "#8892b0" }}
                  >
                    GET IN TOUCH
                  </span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ STATS BAR ═══════ */}
      <section
        className="relative py-16 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <StaggerChildren
            staggerDelay={0.15}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="neu-raised rounded-xl p-6 flex items-center gap-5">
                  <div
                    className="neu-concave rounded-lg p-3 flex items-center justify-center"
                    style={{ minWidth: 48, minHeight: 48 }}
                  >
                    <stat.icon size={22} style={{ color: "var(--cyan)" }} />
                  </div>
                  <div>
                    <div
                      className="font-display text-2xl font-bold text-glow-cyan"
                      style={{ color: "#ffffff" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="label-mono mt-1"
                      style={{
                        color: "var(--glass-text-muted)",
                        fontSize: "0.6rem",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══════ ABOUT SECTION ═══════ */}
      <section
        className="relative py-28 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left" duration={0.7}>
              <div>
                <span
                  className="label-mono mb-4 inline-block"
                  style={{ color: "var(--amber)", fontSize: "0.65rem" }}
                >
                  ABOUT
                </span>
                <h2 className="heading-lg mb-6" style={{ color: "#ffffff" }}>
                  Precision-crafted
                  <br />
                  data experiences.
                </h2>
                <p
                  className="body-lg mb-6"
                  style={{ color: "var(--glass-text-muted)" }}
                >
                  We specialize in transforming complex datasets into intuitive,
                  visually striking interfaces. Every chart, every interaction,
                  every pixel is engineered with the same rigor applied to the
                  data itself.
                </p>
                <p
                  className="body-lg"
                  style={{ color: "var(--glass-text-muted)" }}
                >
                  Our design philosophy — "Dark Forge Industrial Neumorphism" —
                  blends the tactile depth of neumorphic surfaces with the
                  clarity of modern data visualization, creating dashboards that
                  feel as substantial as the insights they deliver.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="right" duration={0.7} delay={0.2}>
              <div className="neu-raised rounded-2xl p-8">
                <div
                  className="label-mono mb-6"
                  style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
                >
                  TECH STACK
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "React 19",
                    "TypeScript",
                    "Tailwind CSS 4",
                    "Three.js",
                    "Recharts",
                    "Framer Motion",
                    "Vite 7",
                    "Vercel",
                  ].map((tech) => (
                    <div
                      key={tech}
                      className="neu-concave rounded-lg px-4 py-3"
                    >
                      <span
                        className="font-mono text-sm"
                        style={{ color: "#e2e8f0" }}
                      >
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
