/**
 * Journey Page — Legacy Gallery / Origin Story
 * Design: "Forged Monolith" — chronological timeline with neumorphic image cards
 * Content sourced from Tier_2_Journey_Gallery.md
 */
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import {
  BookOpen,
  Compass,
  Globe,
  Heart,
  Sprout,
  Sun,
} from "lucide-react";

const galleryItems = [
  {
    title: "Solar Applications in Agriculture",
    caption:
      "Mapping Solar Irradiance for Agricultural Efficiency. As part of my thesis work and role as an agricultural extension agent, I modeled the physical interactions between sunlight, topography, and farming infrastructure to determine the economic viability of renewable energy upgrades.",
    icon: Sun,
    color: "var(--amber)",
    period: "2014–2018",
  },
  {
    title: "3D Hillshade & Illumination Study",
    caption:
      "Temporal Terrain Analysis. A multi-panel cartographic study rendering hourly solar illumination changes across complex topography. This early focus on light, shadow, and 3D spatial relationships laid the groundwork for my current interest in Three.js and programmatic 3D visualizations.",
    icon: Compass,
    color: "var(--cyan)",
    period: "2018–2019",
  },
  {
    title: "Mapping Ocean Currents",
    caption:
      "Visualizing Global Fluid Dynamics. A dark-themed remote sensing visualization tracking massive environmental systems.",
    icon: Globe,
    color: "var(--emerald)",
    period: "2019",
  },
  {
    title: "Precision in Row Cropping & Vegetation from Space",
    caption:
      "Agricultural Remote Sensing. Utilizing NDVI and satellite imagery to monitor crop health and yield potential. This early experience with multispectral satellite data directly translated to my later work monitoring global data center construction via satellite tasking.",
    icon: Sprout,
    color: "var(--emerald)",
    period: "2019–2020",
  },
  {
    title: "Healthcare Spatial Analytics",
    caption:
      "Modernizing Veteran Healthcare Access. At Booz Allen Hamilton, I developed spatial models for the Veterans Health Administration's spinal cord injury program, analyzing the relationship between patient proximity and healthcare utilization. My findings were presented alongside the program's executive director at the ASCIP medical conference in San Diego.",
    icon: Heart,
    color: "var(--coral)",
    period: "2021–2024",
  },
  {
    title: "Academic Publications",
    caption:
      "Peer-Reviewed Environmental Science. During my master's program, I authored three academic publications focusing on spatial data analysis, environmental science, and agricultural systems. This academic rigor remains the foundation of my current data engineering methodologies.",
    icon: BookOpen,
    color: "var(--amber)",
    period: "2020",
  },
];

export default function Journey() {
  return (
    <PageTransition>
      {/* ═══════ JOURNEY HERO ═══════ */}
      <section
        className="relative min-h-[50vh] flex items-end overflow-hidden noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,200,151,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,151,0.03) 1px, transparent 1px)",
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
              THE JOURNEY
            </span>
          </FadeIn>
          <FadeIn delay={0.4} duration={0.8}>
            <h1 className="heading-xl mb-4" style={{ color: "var(--heading-color)" }}>
              The Foundation
              <br />
              <span
                className="text-glow-cyan"
                style={{ color: "var(--cyan)" }}
              >
                of Spatial Science.
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.6} duration={0.8}>
            <p
              className="body-lg max-w-2xl"
              style={{ color: "var(--text-muted)" }}
            >
              Before building automated data pipelines and full-stack AI
              dashboards, my career was rooted in the rigorous, hands-on science
              of the physical world. This gallery showcases the foundational work
              that shaped my analytical approach &mdash; from calculating
              agricultural energy efficiency and publishing environmental
              research, to producing traditional cartographic products and
              geographically weighted healthcare models. This is the journey from
              the soil to the server.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ GALLERY GRID ═══════ */}
      <section
        className="relative py-20 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <StaggerChildren
            staggerDelay={0.12}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {galleryItems.map((item) => (
              <StaggerItem key={item.title}>
                <div className="neu-raised rounded-2xl overflow-hidden h-full flex flex-col">
                  {/* Image placeholder */}
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      height: 220,
                      background: `linear-gradient(135deg, var(--neu-bg-concave-from), var(--neu-bg-concave-to))`,
                    }}
                  >
                    <div
                      className="neu-concave rounded-full flex items-center justify-center"
                      style={{ width: 80, height: 80 }}
                    >
                      <item.icon size={36} style={{ color: item.color }} />
                    </div>
                    <span
                      className="absolute top-4 right-4 label-mono"
                      style={{ color: item.color, fontSize: "0.55rem" }}
                    >
                      {item.period}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3
                      className="font-display font-semibold text-lg mb-3"
                      style={{ color: "var(--heading-color)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed flex-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.caption}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </PageTransition>
  );
}
