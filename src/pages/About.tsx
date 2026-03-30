/**
 * About Page — Full career narrative + horizontal career timeline + Philosophy section
 * Design: "Forged Monolith" — editorial typography with neumorphic cards
 * Content sourced from About_Me_Narrative.md
 * S-5: Added "Philosophy & Approach" section emphasizing end-to-end ownership
 */
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import CareerTimeline from "@/components/CareerTimeline";
import {
  ArrowRight,
  Beaker,
  Brain,
  Download,
  Layers,
  MapPin,
  MessageSquare,
  Search,
  User,
} from "lucide-react";

/* ── Philosophy workflow steps ── */
const workflowSteps = [
  {
    icon: Search,
    title: "Problem Framing",
    description:
      "Every project begins with understanding the business context. I work directly with stakeholders to define the question before touching any data — ensuring the analysis serves a strategic purpose, not just a technical exercise.",
    color: "var(--coral)",
  },
  {
    icon: Layers,
    title: "Data Collection & Preparation",
    description:
      "From satellite imagery tasking to field-collected soil samples, I source, clean, and harmonize data from disparate origins. My background in agricultural science and environmental physics means I understand the physical reality behind the numbers.",
    color: "var(--amber)",
  },
  {
    icon: Brain,
    title: "Analysis & Architecture",
    description:
      "I design and build the analytical pipeline — whether that's geographically weighted regression models, spatial clustering algorithms, or full-stack React dashboards. The architecture is always purpose-built for the problem at hand.",
    color: "var(--cyan)",
  },
  {
    icon: Beaker,
    title: "Interpretation & Insight",
    description:
      "Raw outputs are not deliverables. I draw conclusions from complex analyses, identify patterns that matter, and translate statistical results into actionable intelligence that drives real decisions.",
    color: "var(--emerald)",
  },
  {
    icon: MessageSquare,
    title: "Communication & Delivery",
    description:
      "The final mile is the most critical. I present findings to both technical and non-technical audiences — from conference presentations alongside VA executive directors to interactive dashboards consumed by C-suite leadership at Meta.",
    color: "var(--amber)",
  },
];

export default function About() {
  return (
    <PageTransition>
      {/* ═══════ ABOUT HERO ═══════ */}
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
              style={{ color: "var(--emerald)", fontSize: "0.7rem" }}
            >
              ABOUT ME
            </span>
          </FadeIn>
          <FadeIn delay={0.4} duration={0.8}>
            <h1 className="heading-xl mb-4" style={{ color: "var(--heading-color)" }}>
              From the Soil
              <br />
              <span
                className="text-glow-cyan"
                style={{ color: "var(--cyan)" }}
              >
                to the Server.
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.6} duration={0.8}>
            <p
              className="body-lg max-w-2xl"
              style={{ color: "var(--text-muted)" }}
            >
              A career built on curiosity, spatial thinking, and the relentless
              drive to turn complex data into actionable intelligence.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ ELEVATOR PITCH ═══════ */}
      <section
        className="relative py-20 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Photo placeholder */}
            <div className="lg:col-span-2">
              <FadeIn direction="left" duration={0.7}>
                <div className="neu-raised rounded-2xl p-8 flex flex-col items-center text-center">
                  <div
                    className="neu-concave rounded-full flex items-center justify-center mb-6"
                    style={{ width: 160, height: 160 }}
                  >
                    <User size={64} style={{ color: "var(--cyan)" }} />
                  </div>
                  <h3
                    className="heading-md mb-2"
                    style={{ color: "var(--heading-color)" }}
                  >
                    Patrick Anderson
                  </h3>
                  <p
                    className="label-mono mb-4"
                    style={{ color: "var(--cyan)", fontSize: "0.6rem" }}
                  >
                    GEOSPATIAL DATA SCIENTIST
                  </p>
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin size={14} style={{ color: "var(--text-muted)" }} />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Clemson, South Carolina
                    </span>
                  </div>
                  <a
                    href="#"
                    className="neu-flat inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-display font-medium text-sm transition-all"
                    style={{ color: "var(--cyan)" }}
                  >
                    <Download size={14} />
                    Download Resume
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Elevator pitch */}
            <div className="lg:col-span-3">
              <FadeIn direction="right" duration={0.7} delay={0.2}>
                <div>
                  <span
                    className="label-mono mb-4 inline-block"
                    style={{ color: "var(--amber)", fontSize: "0.65rem" }}
                  >
                    THE SHORT VERSION
                  </span>
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
                    className="body-lg mb-6"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Most recently, I led the GIS and remote sensing intelligence
                    work for Meta&rsquo;s AI infrastructure expansion, where I built a
                    233,000-line automated geospatial data pipeline from scratch. I
                    bridge the gap between rigorous scientific analysis and modern
                    full-stack engineering, turning massive, messy datasets into
                    executive-level visual intelligence.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PHILOSOPHY & APPROACH ═══════ */}
      <section
        className="relative py-28 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <div className="text-center mb-6">
              <span
                className="label-mono inline-block mb-4"
                style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
              >
                PHILOSOPHY &amp; APPROACH
              </span>
              <h2
                className="heading-lg mb-4"
                style={{ color: "var(--heading-color)" }}
              >
                From Messy Data to
                <br />
                <span className="text-glow-cyan" style={{ color: "var(--cyan)" }}>
                  Executive Intelligence.
                </span>
              </h2>
              <p
                className="body-lg max-w-3xl mx-auto"
                style={{ color: "var(--text-muted)" }}
              >
                The industry is shifting from pure technical execution to critical
                thinking, strategic analysis, and stakeholder communication. I
                don&rsquo;t just build tools &mdash; I own the entire workflow from
                experiential design and field data collection through iterative
                complex analysis to drawing conclusions and communicating them to
                both technical and non-technical audiences.
              </p>
            </div>
          </FadeIn>

          {/* Workflow arrow chain */}
          <div className="mt-16 max-w-5xl mx-auto">
            <StaggerChildren staggerDelay={0.12} className="space-y-0">
              {workflowSteps.map((step, index) => (
                <StaggerItem key={step.title}>
                  <div className="flex items-start gap-6 mb-2">
                    {/* Step number + connector line */}
                    <div className="flex flex-col items-center flex-shrink-0" style={{ width: 48 }}>
                      <div
                        className="neu-concave rounded-full flex items-center justify-center"
                        style={{ width: 48, height: 48 }}
                      >
                        <step.icon size={20} style={{ color: step.color }} />
                      </div>
                      {index < workflowSteps.length - 1 && (
                        <div
                          className="w-px flex-1 my-2"
                          style={{
                            minHeight: 32,
                            background: `linear-gradient(to bottom, ${step.color}, transparent)`,
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
                          style={{ color: step.color, fontSize: "0.55rem" }}
                        >
                          STEP {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3
                          className="font-display font-semibold text-lg"
                          style={{ color: "var(--heading-color)" }}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>

          {/* Summary callout */}
          <FadeIn delay={0.4} duration={0.7}>
            <div className="mt-12 max-w-3xl mx-auto text-center">
              <div className="neu-raised rounded-2xl p-8">
                <p
                  className="body-lg"
                  style={{ color: "var(--text-muted)" }}
                >
                  This end-to-end ownership is what separates a data scientist
                  from a data <em>analyst</em>. Every project in my portfolio
                  demonstrates this complete loop &mdash; from understanding the
                  business problem through building the analytical infrastructure
                  to delivering actionable intelligence that drives real
                  decisions.
                </p>
                <a
                  href="/work"
                  className="inline-flex items-center gap-2 mt-6 font-display font-medium text-sm transition-colors"
                  style={{ color: "var(--cyan)" }}
                >
                  See this approach in action
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ CAREER TIMELINE (Horizontal) ═══════ */}
      <section
        className="relative py-20 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <div className="text-center mb-12">
              <span
                className="label-mono inline-block mb-4"
                style={{ color: "var(--amber)", fontSize: "0.65rem" }}
              >
                CAREER TIMELINE
              </span>
              <h2
                className="heading-lg"
                style={{ color: "var(--heading-color)" }}
              >
                Key Milestones
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} duration={0.7}>
            <CareerTimeline />
          </FadeIn>
        </div>
      </section>

      {/* ═══════ LONG NARRATIVE ═══════ */}
      <section
        className="relative py-28 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10 max-w-4xl mx-auto">
          <FadeIn duration={0.6}>
            <span
              className="label-mono mb-4 inline-block"
              style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
            >
              MY JOURNEY
            </span>
          </FadeIn>

          {/* Section 1: From the Soil to the Server */}
          <FadeIn delay={0.2} duration={0.7}>
            <div id="soil-to-server" className="mb-16 scroll-mt-24">
              <h2
                className="heading-lg mb-6"
                style={{ color: "var(--heading-color)" }}
              >
                From the Soil to the Server
              </h2>
              <p
                className="body-lg mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                My career didn&rsquo;t start in a computer science lab; it started in
                the soil. My early background was rooted in agricultural
                mechanization and business, driven by a deep desire to solve
                tangible, real-world problems. Whether I was helping build
                infrastructure in remote mountain villages in Honduras or working
                as an agricultural extension agent, my focus was always on how
                systems interact with their physical environments.
              </p>
              <p
                className="body-lg"
                style={{ color: "var(--text-muted)" }}
              >
                For five years, I audited livestock farms, calculated the physics
                of energy efficiency, and wrote extensive technical reports on
                environmental science and agricultural payback periods.
              </p>
            </div>
          </FadeIn>

          {/* Section 2: The Spatial Awakening */}
          <FadeIn delay={0.3} duration={0.7}>
            <div id="spatial-awakening" className="mb-16 scroll-mt-24">
              <h2
                className="heading-lg mb-6"
                style={{ color: "var(--heading-color)" }}
              >
                The Spatial Awakening
              </h2>
              <p
                className="body-lg mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                While working full-time, I pursued my master&rsquo;s degree and
                discovered the power of spatial data. Classes in GIS, remote
                sensing, and photogrammetry unlocked a new way of seeing the
                world. I realized that the complex environmental physics I had
                been calculating by hand could be modeled, visualized, and
                scaled. This led to three academic publications and a pivot into
                healthcare analytics.
              </p>
              <p
                className="body-lg"
                style={{ color: "var(--text-muted)" }}
              >
                At Booz Allen Hamilton, I contracted with the Veterans Health
                Administration to modernize the spatial context of their spinal
                cord injury program. I built geographically weighted statistical
                models to explore the relationship between patient proximity to
                care and healthcare utilization. The work was highly successful,
                leading to multiple contract renewals, speaking engagements at
                national medical conferences, and a deep embedding within the
                VA&rsquo;s internal GIS teams.
              </p>
            </div>
          </FadeIn>

          {/* Section 3: The AI Infrastructure Leap */}
          <FadeIn delay={0.4} duration={0.7}>
            <div id="ai-infrastructure" className="mb-8 scroll-mt-24">
              <h2
                className="heading-lg mb-6"
                style={{ color: "var(--heading-color)" }}
              >
                The AI Infrastructure Leap
              </h2>
              <p
                className="body-lg mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                The most transformative chapter of my career occurred during my
                recent contract at Meta. Tasked with leading the GIS and remote
                sensing work for their infrastructure competitive intelligence, I
                monitored satellite imagery of global data center sites, built
                complex statistical models for forecasted expansion, and analyzed
                site suitability for multi-billion-dollar land acquisitions.
              </p>
              <p
                className="body-lg mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Faced with massive, disparate datasets, I upskilled rapidly.
                Leveraging AI-assisted development tools, I transitioned from a
                traditional GIS analyst to a full-stack data engineer. In three
                months, I built a 233,000-line production-grade Python and React
                pipeline. I developed a custom Universal Consensus ID (UCID)
                spatial clustering algorithm to harmonize conflicting data
                sources and built an automated suite of 41 validation scripts
                that generated daily diagnostic HTML reports.
              </p>
              <p
                className="body-lg"
                style={{ color: "var(--text-muted)" }}
              >
                Today, I build tools like my custom MLS Analytics Dashboard and
                multi-layered Data Center intelligence platforms. I am passionate
                about applying spatial data science, AI integration, and
                full-stack development to novel contexts, creating tools that
                don&rsquo;t just display data, but tell a compelling, actionable
                story.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
