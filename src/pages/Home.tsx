/**
 * Home Page — Hero + Stats + About section
 * Design: "Forged Monolith" — monolithic hero with forge glow,
 * massive typography, noise texture, neumorphic stat cards
 * Content: Personal portfolio voice for Patrick Anderson
 */
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { ArrowRight, BookOpen, Code2, Globe, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

/* ── Animated Counter Component ── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
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
    <div ref={ref} className="font-display text-2xl font-bold text-glow-cyan" style={{ color: "var(--heading-color)" }}>
      {count.toLocaleString()}{suffix}
    </div>
  );
}

const stats = [
  { value: 233, suffix: "K+", label: "LINES OF CODE", icon: Code2 },
  { value: 5, suffix: "+", label: "INDUSTRIES", icon: Globe },
  { value: 3, suffix: "", label: "PUBLICATIONS", icon: BookOpen },
  { value: 6, suffix: "", label: "LIVE DASHBOARDS", icon: Layers },
];

const techStack = [
  "Python",
  "ArcGIS Pro",
  "SQL",
  "React / TypeScript",
  "Three.js",
  "MapLibre GL",
  "Tailwind CSS",
  "FastAPI",
  "Tableau",
  "GSAP",
  "Vite",
  "Vercel",
];

export default function Home() {
  return (
    <PageTransition>
      {/* ═══════ HERO SECTION ═══════ */}
      <section
        className="relative min-h-screen flex items-center justify-start overflow-hidden noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(0,212,255,0.06) 0%, transparent 60%)",
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
              <h1 className="heading-xl mb-6" style={{ color: "var(--heading-color)" }}>
                Patrick Anderson
                <br />
                <span className="text-glow-cyan" style={{ color: "var(--cyan)" }}>
                  Geospatial Data Scientist
                </span>
                <br />
                <span style={{ fontSize: "0.6em", fontWeight: 500, color: "var(--text-secondary)" }}>
                  &amp; AI Infrastructure Engineer
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.6} duration={0.8}>
              <p
                className="body-lg max-w-xl mb-10"
                style={{ color: "var(--text-muted)" }}
              >
                I build production-grade data pipelines and interactive spatial
                dashboards that transform complex geospatial data into
                executive-level intelligence. From satellite imagery analysis to
                full-stack 3D visualization platforms, I bridge rigorous
                scientific analysis with modern engineering.
              </p>
            </FadeIn>

            <FadeIn delay={0.8} duration={0.8}>
              <div className="flex flex-wrap gap-4">
                <Link href="/work">
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
                    style={{ color: "var(--text-muted)" }}
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
            className="grid grid-cols-2 sm:grid-cols-4 gap-6"
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
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    <div
                      className="label-mono mt-1"
                      style={{
                        color: "var(--text-muted)",
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
                <h2 className="heading-lg mb-6" style={{ color: "var(--heading-color)" }}>
                  From the Soil
                  <br />
                  to the Server.
                </h2>
                <p
                  className="body-lg mb-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  I am a Geospatial Data Scientist and AI Infrastructure
                  Engineer who specializes in building complex, production-grade
                  data pipelines and interactive spatial dashboards. With a
                  foundation in agricultural science and environmental physics, I
                  spent the early part of my career analyzing energy efficiency
                  and healthcare utilization.
                </p>
                <p
                  className="body-lg"
                  style={{ color: "var(--text-muted)" }}
                >
                  Most recently, I led the GIS and remote sensing intelligence
                  work for Meta&rsquo;s AI infrastructure expansion, where I built a
                  233,000-line automated geospatial data pipeline from scratch. I
                  bridge the gap between rigorous scientific analysis and modern
                  full-stack engineering, turning massive, messy datasets into
                  executive-level visual intelligence.
                </p>
                <Link href="/about">
                  <span
                    className="inline-flex items-center gap-2 mt-6 font-display font-medium text-sm transition-colors"
                    style={{ color: "var(--cyan)" }}
                  >
                    Read my full story
                    <ArrowRight size={14} />
                  </span>
                </Link>
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
                  {techStack.map((tech) => (
                    <div
                      key={tech}
                      className="neu-concave rounded-lg px-4 py-3"
                    >
                      <span
                        className="font-mono text-sm"
                        style={{ color: "var(--text-secondary)" }}
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
