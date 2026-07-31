/**
 * About Page — Full career narrative + horizontal career timeline + Philosophy section
 * Design: "Forged Monolith" — editorial typography with neumorphic cards
 * Content sourced from About_Me_Narrative.md
 * S-5: Added "Philosophy & Approach" section emphasizing end-to-end ownership
 */
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import { Link } from "wouter";
import Photo from "@/components/Photo";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import CareerTimeline from "@/components/CareerTimeline";
import SectionRail from "@/components/SectionRail";
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
/** Employers, clients, and venues, grouped honestly — lumping a journal in
 *  with an employer under one "clients" heading would overclaim.
 *
 *  Rendered as typographic wordmarks rather than logo files. That is a
 *  deliberate default: no third-party marks are bundled, so nothing here
 *  implies endorsement, and the band stays visually of a piece with the
 *  rest of the site. `logo` is wired but unset — drop a cleared image into
 *  public/images/logos and set the field to switch any single row over. */
/** Grouped lists rather than proficiency bars. The old site used bars, and
 *  they were dropped deliberately: "Statistics — 85%" invites the reader to
 *  argue with a number that cannot be defended, which undercuts the
 *  credibility the rest of the page is building. A grouped list says more and
 *  claims less. */
const skillGroups = [
  {
    label: "Spatial & Remote Sensing",
    items: [
      "GIS · ArcGIS Pro",
      "Network analysis",
      "Remote sensing",
      "Photogrammetry",
      "LiDAR & point clouds",
      "UAV survey — FAA Part 107",
      "Cartography",
    ],
  },
  {
    label: "Analysis & Statistics",
    items: [
      "Spatial statistics",
      "Change detection over time",
      "Significance testing",
      "Geographically weighted regression",
      "Clustering & hot-spot analysis",
      "R",
      "Python",
    ],
  },
  {
    label: "Building & Delivery",
    items: [
      "React · TypeScript",
      "D3 · MapLibre GL",
      "Tableau",
      "Dashboard architecture",
      "Automation scripting",
      "Technical writing",
      "Public speaking",
    ],
  },
  {
    label: "Domains",
    items: [
      "Healthcare access",
      "AI infrastructure",
      "Environmental science",
      "Agriculture",
      "Civic & public data",
      "Sports analytics",
    ],
  },
];

/** Headings for the fixed rail. /about is the longest page on the site by a
 *  wide margin; this is how a reader keeps their place in it. */
const railSections = [
  { id: "approach", label: "Approach" },
  { id: "timeline", label: "Timeline" },
  { id: "journey", label: "Journey" },
  { id: "skills", label: "Skills" },
  { id: "off-clock", label: "Off the clock" },
  { id: "worked-with", label: "Worked with" },
  { id: "feedback", label: "Feedback" },
];

type Affiliation = { name: string; logo?: string };

/** One flat wall rather than three labelled groups — the grouping was doing
 *  disclosure work the heading now does, and it left short rows stranded.
 *  Order still runs employers → clients → venues so it reads sensibly, but
 *  nothing announces the boundary.
 *
 *  Marks are trimmed to their ink with the white ground knocked out to
 *  transparency, so nothing sits in a box. The two without a mark render as
 *  wordmarks in the same cell. */
const affiliations: Affiliation[] = [
  { name: "Meta", logo: "/images/logos/meta.webp" },
  // Employer of record for the Meta engagement.
  { name: "Tundra Technical Solutions", logo: "/images/logos/tundra.webp" },
  { name: "Booz Allen Hamilton", logo: "/images/logos/booz-allen.webp" },
  { name: "Liberty IT Solutions", logo: "/images/logos/liberty-it.webp" },
  { name: "Clemson University", logo: "/images/logos/clemson.webp" },
  { name: "Veterans Health Administration", logo: "/images/logos/va.webp" },
  { name: "VHA SCI/D National Program Office" },
  { name: "South Carolina DNR", logo: "/images/logos/sc-dnr.webp" },
  {
    name: "Clemson Cooperative Extension",
    logo: "/images/logos/clemson-extension.webp",
  },
  { name: "USDA NRCS", logo: "/images/logos/usda-nrcs.webp" },
  { name: "Town Creek Farms" },
  { name: "ASCIP", logo: "/images/logos/ascip.webp" },
  { name: "ASABE", logo: "/images/logos/asabe.webp" },
  { name: "MDPI · Drones", logo: "/images/logos/mdpi.webp" },
];

/** Anonymized on Patrick's instruction: no names, no dates, no organization
 *  named below the program level. Sourced from private correspondence he
 *  chose to share in generalized form.
 *
 *  Lightly edited for parallelism, with his agreement — emphatic caps and
 *  exclamation runs normalized, colleagues' names and internal identifiers
 *  removed, and each trimmed to the sentence that carries the point.
 *  Attributions follow one shape (role · context) so the set reads as a
 *  collection rather than a pile of forwarded email. What was NOT changed is
 *  the substance: every claim below is one that someone actually made. */
const testimonials = [
  {
    quote: "None of them have seen their data like that, ever.",
    attribution: "Program leadership · on the home-care dashboard",
  },
  {
    quote:
      "I never would have thought about this before. Instead of individual addresses, designing it by groups in hot spots — this is really interesting.",
    attribution: "Program office lead · on a change of analytical approach",
  },
  {
    quote:
      "You not only generated great questions from the Chiefs with what you presented, but expertly navigated answering them and discussing their suggestions.",
    attribution: "Program office lead · after a national leadership summit",
  },
  {
    quote:
      "Your presentation style, tone and pace are very pleasant and effective. This is a non-teachable value-add.",
    attribution: "Program office lead · on presenting to clinical leadership",
  },
  {
    quote:
      "Having directionality for both the visits and the home care caseloads allows a lot of information to be communicated quickly.",
    attribution: "Program leadership · on a flow visualization",
  },
  {
    quote:
      "I'm not sure how we would go about expanding home care without all this data you are generating.",
    attribution: "Program leadership · on a national service-expansion goal",
  },
  {
    quote:
      "We will certainly incorporate some of this in making our business case for expansion of home care services.",
    attribution: "Clinical program lead · on using the analysis in a proposal",
  },
  {
    /* Not a quotation. The source is an AI-generated summary of a private
       1:1, so no one said these words in this order — quote marks would
       misrepresent it. Written as a report of the recognition instead, and
       `plain` suppresses the decorative quotes. */
    plain: true,
    /* Trimmed 2026-07-31 to the recognition itself. The original carried a
       second clause about "marked improvement in organization, project
       management, communication and quality of deliverables" — in a review
       that phrasing reads as a prior deficiency corrected, which is not what
       a reader should take from the one Meta item on the page. */
    quote:
      "Recognized for building the foundation for more rigorous data analysis and modeling.",
    attribution: "Manager review · Meta",
  },
];

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
      "From satellite imagery tasking to field-collected soil samples, I source, clean, and harmonize data from disparate origins. As a licensed remote pilot I can fly the collection mission myself when the imagery doesn't exist yet — and my background in agricultural science and environmental physics means I understand the physical reality behind the numbers.",
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
    // `rail-inset` pads this page's containers clear of the fixed rail —
    // without it, content runs underneath the panel.
    <PageTransition className="rail-inset">
      <SectionRail sections={railSections} />

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

        <div className="container relative z-10 pt-40 pb-20 about-hero-grid">
          <div>
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
              drive to turn complex data into actionable intelligence. I combine
              a scientific background in analytics with the artistic display of
              clean, simple information — focused attention to detail, driven by
              big-picture questions.
            </p>
          </FadeIn>
          </div>

          {/* Slot: fills in when public/images/me/portrait.jpg exists. The
              grid collapses to one column while it is absent, so the hero
              looks intentional either way. */}
          <FadeIn delay={0.5} duration={0.8}>
            <Photo
              src="/images/me/portrait.jpg"
              alt="Patrick Anderson"
              className="about-portrait"
            />
          </FadeIn>
        </div>
      </section>

      {/* ═══════ ELEVATOR PITCH ═══════ */}
      <section
        className="relative py-32 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            {/* Photo placeholder */}
            <div className="lg:col-span-2">
              <FadeIn direction="left" duration={0.7}>
                <div className="neu-raised rounded-2xl p-8 flex flex-col items-center text-center">
                  {/* The generic User glyph used to be unconditional, so the
                      card showed a placeholder avatar even after a real
                      headshot existed. It is now the fallback only. */}
                  <div
                    className="neu-concave rounded-full flex items-center justify-center mb-6 overflow-hidden"
                    style={{ width: 160, height: 160 }}
                  >
                    <Photo
                      src="/images/me/headshot.jpg"
                      alt="Patrick Anderson"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      fallback={<User size={64} style={{ color: "var(--cyan)" }} />}
                    />
                  </div>
                  <h3
                    className="heading-md mb-2"
                    style={{ color: "var(--heading-color)" }}
                  >
                    Patrick T Anderson
                  </h3>
                  <p
                    className="label-mono mb-4"
                    style={{ color: "var(--cyan)", fontSize: "0.6rem" }}
                  >
                    LEAD SPATIAL DATA SCIENTIST
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
                    href="/Patrick_Anderson_Resume.pdf"
                    download
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
                    I am a Lead Spatial Data Scientist who specializes in
                    building complex, production-grade data pipelines and
                    interactive spatial dashboards. With a foundation in
                    agricultural science and environmental physics, I spent the
                    early part of my career analyzing energy efficiency and
                    healthcare utilization.
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
      <section id="approach"
        className="relative py-40 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <div className="text-center mb-8">
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

          {/* The claim above is abstract; this is it happening. The San
              Francisco crime diptych is raw incident points on one side and
              the finished hotspot surface on the other, which is the whole
              "messy data to executive intelligence" argument in one frame. */}
          <FadeIn duration={0.6} delay={0.15}>
            <figure className="process-figure">
              <img
                src="/images/work/process-before-after.webp"
                alt="Before and after — raw crime incident points beside the finished hotspot surface"
                loading="lazy"
                decoding="async"
                className="process-photo"
              />
              <figcaption className="label-mono process-caption">
                Raw incident points, and the same data read as a surface — from
                the San Francisco crime analysis
              </figcaption>
            </figure>
          </FadeIn>

          {/* Workflow arrow chain */}
          <div className="mt-16 max-w-5xl mx-auto">
            <StaggerChildren staggerDelay={0.12} className="space-y-0">
              {workflowSteps.map((step, index) => (
                <StaggerItem key={step.title}>
                  <div className="flex items-start gap-6 mb-2 z-stage">
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
                    <div className="neu-raised rounded-xl p-6 flex-1 mb-4 z-lift">
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
            <div className="mt-12 max-w-3xl mx-auto text-center z-stage">
              <div className="neu-raised rounded-2xl p-8 z-lift">
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
                  href="/projects"
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
      <section id="timeline"
        className="relative py-32 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <div className="text-center mb-16">
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
      <section id="journey"
        className="relative py-40 noise-bg"
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
                scaled. This led to{" "}
                <Link
                  href="/resume#publications"
                  style={{ color: "var(--cyan)", textDecoration: "none" }}
                >
                  three academic publications
                </Link>{" "}
                and a pivot into healthcare analytics.
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

      {/* ═══════ SKILLS & DOMAINS ═══════ */}
      <section id="skills"
        className="relative py-24 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <span
              className="label-mono inline-block mb-3"
              style={{ color: "var(--cyan)", fontSize: "0.7rem" }}
            >
              WHAT I WORK WITH
            </span>
            <h2
              className="heading-lg mb-10"
              style={{ color: "var(--heading-color)" }}
            >
              Skills and domains.
            </h2>
          </FadeIn>

          {/* Counted, not estimated — see the note. A round number would have
              been easier and is the one thing on this page a reader could
              trivially check and find wrong. */}
          <FadeIn duration={0.6}>
            <div className="code-stat">
              <div className="code-stat-figure">
                <span className="code-stat-number">170,900</span>
                <span className="label-mono code-stat-unit">lines of code</span>
              </div>
              <p className="code-stat-note">
                Across 13 public repositories, every one of them created in
                2026. Counted from source — TypeScript, JavaScript, Python, R,
                SQL, CSS and HTML — with dependencies, lockfiles, minified
                bundles and generated output excluded. A further 440,000 lines
                of JSON, GeoJSON and CSV are not included here, because data is
                produced rather than written.
              </p>
            </div>
          </FadeIn>
          <div className="skill-grid">
            {skillGroups.map((g) => (
              <FadeIn key={g.label} duration={0.6}>
                <div className="skill-group">
                  <h3 className="label-mono skill-group__label">{g.label}</h3>
                  <ul>
                    {g.items.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ OFF THE CLOCK ═══════ */}
      <section id="off-clock"
        className="relative py-24 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <span
              className="label-mono inline-block mb-3"
              style={{ color: "var(--amber)", fontSize: "0.7rem" }}
            >
              OFF THE CLOCK
            </span>
            <h2
              className="heading-lg mb-6"
              style={{ color: "var(--heading-color)" }}
            >
              Pendleton, South Carolina.
            </h2>
          </FadeIn>
          {/* Text left, photo right. These were stacked vertically and both
              left-justified, which left a long ragged column against dead
              space. Two columns above 900px, stacked below — see .off-clock
              in index.css. */}
          <div className="off-clock">
            <FadeIn duration={0.6}>
              <div className="off-clock-text">
                <p className="body-lg" style={{ color: "var(--text-muted)" }}>
                  My wife and I own a home in Pendleton, South Carolina, and we
                  had our first child in 2022. We&rsquo;re heavily involved in
                  our local church as small group leaders and mentors to young
                  adults.
                </p>
                <p
                  className="body-lg"
                  style={{ color: "var(--text-muted)", marginTop: "1.25rem" }}
                >
                  Outside of work I&rsquo;m a fitness and outdoors enthusiast and
                  a relentless book worm. A fair amount of what ends up on this
                  site started as curiosity on a walk — the solar and terrain
                  studies are literally the farm next door.
                </p>
              </div>
            </FadeIn>
            {/* Patrick's home office — his pick of the four he sent. */}
            <FadeIn duration={0.6}>
              <figure className="office-figure">
                <Photo
                  src="/images/me/office.webp"
                  alt="Patrick's home office — dual monitors on a dark navy wall, botanical prints above the desk"
                  className="office-photo"
                />
                <figcaption className="label-mono office-caption">
                  The home office in Pendleton — where most of this was built
                </figcaption>
              </figure>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ AFFILIATIONS ═══════ */}
      <section id="worked-with"
        className="relative py-24 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <span
              className="label-mono inline-block mb-3"
              style={{ color: "var(--emerald)", fontSize: "0.7rem" }}
            >
              WORKED WITH
            </span>
            <h2
              className="heading-lg mb-10"
              style={{ color: "var(--heading-color)" }}
            >
              Clients, employers, research partners.
            </h2>
          </FadeIn>

          <FadeIn duration={0.6}>
            <ul className="affiliation-row">
              {affiliations.map((a) => (
                <li key={a.name} className="affiliation">
                  {a.logo ? (
                    <img src={a.logo} alt={a.name} loading="lazy" />
                  ) : (
                    <span>{a.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ FEEDBACK ═══════ */}
      <section id="feedback"
        className="relative py-24 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <span
              className="label-mono inline-block mb-3"
              style={{ color: "var(--amber)", fontSize: "0.7rem" }}
            >
              WHAT CLIENTS SAID
            </span>
            <h2
              className="heading-lg mb-4"
              style={{ color: "var(--heading-color)" }}
            >
              Feedback from the work.
            </h2>
            <p
              className="body-lg mb-10"
              style={{ color: "var(--text-muted)", maxWidth: "48ch" }}
            >
              Shared without names, dates, or attribution beyond the program
              level.
            </p>
          </FadeIn>

          <div className="testimonial-grid">
            {/* Index, not attribution. Two quotes once shared the string
                "Program office lead · after a national leadership summit",
                which made them the same React key; the 2026-07-31 trim removed
                one of that pair, so no attribution currently collides. The key
                stays on the index anyway — attributions are prose and the next
                one added could collide again, and losing a testimonial
                silently is exactly the kind of failure this site keeps
                producing. */}
            {testimonials.map((t, i) => (
              <FadeIn key={i} duration={0.6}>
                <figure className="testimonial">
                  <blockquote>
                    {"plain" in t && t.plain ? t.quote : `\u201C${t.quote}\u201D`}
                  </blockquote>
                  <figcaption className="label-mono">{t.attribution}</figcaption>
                </figure>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
