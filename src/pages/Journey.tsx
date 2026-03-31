/**
 * Journey Page — Legacy Gallery / Origin Story + X-Ray Reveal
 * Design: "Forged Monolith" — chronological timeline with neumorphic image cards
 * Content sourced from Tier_2_Journey_Gallery.md
 * S-5: Added XRayReveal component for GIS data transformation showcase
 */
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import XRayReveal from "@/components/XRayReveal";
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

/* ── Custom raw/processed content for the X-Ray reveals ── */
function SatelliteRawContent() {
  // Simulated raw satellite data grid — bland grayscale numbers
  const rows = 10;
  const cols = 14;
  return (
    <div className="w-full h-full p-6 overflow-hidden flex flex-col">
      <div className="label-mono mb-3" style={{ color: "var(--text-muted)", fontSize: "0.5rem" }}>
        RAW SATELLITE RASTER — BAND 4 (NIR) VALUES
      </div>
      <div className="flex-1 grid gap-px" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows * cols }, (_, i) => {
          const val = 40 + Math.floor(Math.random() * 180);
          return (
            <div
              key={i}
              className="flex items-center justify-center font-mono"
              style={{
                fontSize: "0.45rem",
                color: "var(--text-muted)",
                opacity: 0.25 + (val / 255) * 0.35,
                background: `rgba(128, 128, 128, ${val / 800})`,
                borderRadius: 1,
              }}
            >
              {val}
            </div>
          );
        })}
      </div>
      <div className="mt-2 font-mono" style={{ fontSize: "0.45rem", color: "var(--text-muted)", opacity: 0.4 }}>
        CRS: EPSG:4326 | Resolution: 10m | Source: Sentinel-2 L2A
      </div>
    </div>
  );
}

function SatelliteProcessedContent() {
  // Vibrant NDVI-style heatmap
  const rows = 10;
  const cols = 14;
  return (
    <div className="w-full h-full p-6 overflow-hidden flex flex-col">
      <div className="label-mono mb-3" style={{ color: "var(--cyan)", fontSize: "0.5rem" }}>
        PROCESSED NDVI CLASSIFICATION — VEGETATION HEALTH INDEX
      </div>
      <div className="flex-1 grid gap-px" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows * cols }, (_, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          // Create organic vegetation pattern
          const cx = cols * 0.4;
          const cy = rows * 0.5;
          const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2);
          const noise = Math.sin(col * 1.2) * Math.cos(row * 0.8) * 0.3;
          const ndvi = Math.max(0, Math.min(1, 1 - dist / 8 + noise));

          let bg: string;
          let glow = false;
          if (ndvi > 0.7) {
            bg = `oklch(0.55 0.18 145)`; // Dense vegetation — green
            glow = true;
          } else if (ndvi > 0.4) {
            bg = `oklch(0.50 0.12 120)`; // Moderate — yellow-green
          } else if (ndvi > 0.2) {
            bg = `oklch(0.45 0.10 85)`; // Sparse — amber
          } else {
            bg = `oklch(0.25 0.03 280)`; // Bare — dark
          }

          return (
            <div
              key={i}
              className="rounded-sm"
              style={{
                background: bg,
                boxShadow: glow ? `0 0 6px oklch(0.6 0.18 145 / 0.5)` : "none",
              }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-4">
        <div className="flex items-center gap-6">
          {[
            { label: "Dense", color: "oklch(0.55 0.18 145)" },
            { label: "Moderate", color: "oklch(0.50 0.12 120)" },
            { label: "Sparse", color: "oklch(0.45 0.10 85)" },
            { label: "Bare", color: "oklch(0.25 0.03 280)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: item.color }} />
              <span className="font-mono" style={{ fontSize: "0.4rem", color: "var(--text-muted)" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GISRawContent() {
  // Simulated raw coordinate/attribute table
  const records = [
    { id: "001", lat: "34.0522", lon: "-118.2437", val: "NULL", src: "vendor_a" },
    { id: "002", lat: "34.0519", lon: "-118.2441", val: "150MW", src: "vendor_b" },
    { id: "003", lat: "34.0525", lon: "-118.2433", val: "200MW", src: "vendor_c" },
    { id: "004", lat: "34.0520", lon: "-118.2439", val: "NULL", src: "vendor_a" },
    { id: "005", lat: "34.0523", lon: "-118.2435", val: "175MW", src: "vendor_d" },
    { id: "006", lat: "34.0518", lon: "-118.2442", val: "150MW", src: "vendor_b" },
    { id: "007", lat: "34.0526", lon: "-118.2431", val: "NULL", src: "vendor_e" },
    { id: "008", lat: "34.0521", lon: "-118.2438", val: "180MW", src: "vendor_c" },
  ];
  return (
    <div className="w-full h-full p-6 overflow-hidden flex flex-col">
      <div className="label-mono mb-3" style={{ color: "var(--text-muted)", fontSize: "0.5rem" }}>
        RAW VENDOR DATA — CONFLICTING RECORDS
      </div>
      <div className="flex-1 overflow-hidden">
        <table className="w-full font-mono" style={{ fontSize: "0.5rem" }}>
          <thead>
            <tr style={{ color: "var(--text-muted)", opacity: 0.5 }}>
              <th className="text-left pb-2">ID</th>
              <th className="text-left pb-2">LAT</th>
              <th className="text-left pb-2">LON</th>
              <th className="text-left pb-2">CAPACITY</th>
              <th className="text-left pb-2">SOURCE</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} style={{ color: "var(--text-muted)", opacity: r.val === "NULL" ? 0.25 : 0.4 }}>
                <td className="py-1">{r.id}</td>
                <td>{r.lat}</td>
                <td>{r.lon}</td>
                <td style={{ color: r.val === "NULL" ? "var(--coral)" : "var(--text-muted)" }}>{r.val}</td>
                <td>{r.src}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 font-mono" style={{ fontSize: "0.4rem", color: "var(--coral)", opacity: 0.5 }}>
        WARNING: 3 NULL values detected | 5 conflicting coordinates within 50m radius
      </div>
    </div>
  );
}

function GISProcessedContent() {
  // Harmonized consensus view
  return (
    <div className="w-full h-full p-6 overflow-hidden flex flex-col">
      <div className="label-mono mb-3" style={{ color: "var(--cyan)", fontSize: "0.5rem" }}>
        UCID CONSENSUS — HARMONIZED INTELLIGENCE
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="relative" style={{ width: 280, height: 200 }}>
          {/* Consensus point */}
          <div
            className="absolute rounded-full"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 16,
              height: 16,
              background: "var(--cyan)",
              boxShadow: "0 0 20px var(--cyan), 0 0 40px rgba(0,212,255,0.3)",
            }}
          />
          {/* Confidence rings */}
          {[40, 70, 100].map((r, i) => (
            <div
              key={r}
              className="absolute rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: r * 2,
                height: r * 2,
                border: `1px solid var(--cyan)`,
                opacity: 0.15 + (1 - i / 3) * 0.15,
              }}
            />
          ))}
          {/* Vendor source dots */}
          {[
            { x: 45, y: 42, color: "var(--emerald)" },
            { x: 53, y: 48, color: "var(--amber)" },
            { x: 48, y: 55, color: "var(--coral)" },
            { x: 55, y: 45, color: "var(--emerald)" },
            { x: 47, y: 50, color: "var(--amber)" },
          ].map((dot, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                width: 6,
                height: 6,
                background: dot.color,
                opacity: 0.7,
              }}
            />
          ))}
          {/* Stats overlay */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            <div>
              <div className="font-mono" style={{ fontSize: "0.55rem", color: "var(--cyan)" }}>
                CONSENSUS
              </div>
              <div className="font-display font-bold" style={{ fontSize: "1.2rem", color: "var(--heading-color)" }}>
                94.2%
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono" style={{ fontSize: "0.55rem", color: "var(--amber)" }}>
                CAPACITY
              </div>
              <div className="font-display font-bold" style={{ fontSize: "1.2rem", color: "var(--heading-color)" }}>
                175 MW
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 font-mono" style={{ fontSize: "0.4rem", color: "var(--emerald)" }}>
        UCID-LA-0042 | 5/5 sources agree | High confidence | Last updated: 2024-12-15
      </div>
    </div>
  );
}

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

        <div className="container relative z-10 pt-40 pb-20">
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

      {/* ═══════ X-RAY REVEAL: Data Transformation Showcase ═══════ */}
      <section
        className="relative py-32 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <div className="text-center mb-12">
              <span
                className="label-mono inline-block mb-4"
                style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
              >
                DATA TRANSFORMATION
              </span>
              <h2
                className="heading-lg mb-4"
                style={{ color: "var(--heading-color)" }}
              >
                From Messy Data to
                <br />
                <span className="text-glow-cyan" style={{ color: "var(--cyan)" }}>
                  Visual Intelligence.
                </span>
              </h2>
              <p
                className="body-lg max-w-2xl mx-auto"
                style={{ color: "var(--text-muted)" }}
              >
                Every visualization begins as raw, unstructured data. Hover over
                each panel to see the transformation from chaotic inputs to
                executive-level intelligence.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FadeIn direction="left" duration={0.7}>
              <XRayReveal
                title="Satellite Imagery → Vegetation Analysis"
                rawLabel="RAW RASTER"
                processedLabel="NDVI CLASSIFICATION"
                accentColor="var(--emerald)"
                lensRadius={100}
                height={360}
                rawContent={<SatelliteRawContent />}
                processedContent={<SatelliteProcessedContent />}
              />
            </FadeIn>

            <FadeIn direction="right" duration={0.7} delay={0.2}>
              <XRayReveal
                title="Vendor Records → Consensus Intelligence"
                rawLabel="CONFLICTING SOURCES"
                processedLabel="UCID CONSENSUS"
                accentColor="var(--cyan)"
                lensRadius={100}
                height={360}
                rawContent={<GISRawContent />}
                processedContent={<GISProcessedContent />}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ GALLERY GRID ═══════ */}
      <section
        className="relative py-32 noise-bg"
        style={{ background: "var(--surface-sunken)" }}
      >
        <div className="container relative z-10">
          <FadeIn duration={0.6}>
            <div className="text-center mb-12">
              <span
                className="label-mono inline-block mb-4"
                style={{ color: "var(--amber)", fontSize: "0.65rem" }}
              >
                FOUNDATIONAL WORK
              </span>
              <h2
                className="heading-lg"
                style={{ color: "var(--heading-color)" }}
              >
                The Origin Gallery
              </h2>
            </div>
          </FadeIn>

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
