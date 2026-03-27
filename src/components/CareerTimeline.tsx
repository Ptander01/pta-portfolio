/**
 * CareerTimeline — Minimal horizontal timeline visualization
 * Hover reveals popup with description + tech/skills
 * Click navigates to the relevant narrative section on the About page
 */
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface TimelineEntry {
  id: string;
  /** Numeric year for positioning (use start year for ranges) */
  startYear: number;
  endYear: number;
  label: string;
  role: string;
  org: string;
  color: string;
  description: string;
  skills: string[];
  /** Hash anchor to scroll to, e.g. "#soil-to-server" */
  anchor: string;
}

const entries: TimelineEntry[] = [
  {
    id: "clemson-bs",
    startYear: 2014,
    endYear: 2014,
    label: "2014",
    role: "B.S. Agricultural Mechanization & Business",
    org: "Clemson University",
    color: "var(--emerald)",
    description:
      "Graduated with a foundation in agricultural systems, environmental physics, and business — the starting point for a career built on solving tangible, real-world problems.",
    skills: ["Agricultural Science", "Environmental Physics", "Business"],
    anchor: "#soil-to-server",
  },
  {
    id: "extension",
    startYear: 2015,
    endYear: 2020,
    label: "2015–2020",
    role: "Agricultural Extension Agent",
    org: "Clemson Cooperative Extension",
    color: "var(--amber)",
    description:
      "Audited livestock farms, calculated energy efficiency physics, and wrote technical reports on environmental science and agricultural payback periods for five years.",
    skills: [
      "Energy Auditing",
      "Technical Writing",
      "Environmental Science",
      "Field Research",
    ],
    anchor: "#soil-to-server",
  },
  {
    id: "clemson-ms",
    startYear: 2020,
    endYear: 2020,
    label: "2020",
    role: "M.S. Applied Computing (GIS Focus)",
    org: "Clemson University",
    color: "var(--emerald)",
    description:
      "Discovered the power of spatial data through GIS, remote sensing, and photogrammetry. Published three academic papers in spatial data analysis and environmental science.",
    skills: [
      "GIS",
      "Remote Sensing",
      "Photogrammetry",
      "Spatial Statistics",
      "Python",
    ],
    anchor: "#spatial-awakening",
  },
  {
    id: "booz-allen",
    startYear: 2021,
    endYear: 2024,
    label: "2021–2024",
    role: "Geospatial Data Scientist",
    org: "Booz Allen Hamilton / VA",
    color: "var(--cyan)",
    description:
      "Built geographically weighted statistical models for the Veterans Health Administration's spinal cord injury program. Presented findings at the ASCIP national medical conference in San Diego.",
    skills: [
      "ArcGIS Pro",
      "Python",
      "Spatial Statistics",
      "SQL",
      "Tableau",
      "Healthcare Analytics",
    ],
    anchor: "#spatial-awakening",
  },
  {
    id: "meta",
    startYear: 2025,
    endYear: 2026,
    label: "2025–2026",
    role: "GIS & Remote Sensing Intelligence Lead",
    org: "Meta",
    color: "var(--coral)",
    description:
      "Led GIS and remote sensing intelligence for Meta's AI infrastructure expansion. Built a 233,000-line automated geospatial data pipeline, a custom UCID spatial clustering algorithm, and 41 automated validation scripts.",
    skills: [
      "Python",
      "React",
      "TypeScript",
      "MapLibre GL",
      "Satellite Imagery",
      "Data Engineering",
    ],
    anchor: "#ai-infrastructure",
  },
];

/* ── Layout constants ── */
const TIMELINE_START = 2014;
const TIMELINE_END = 2026;
const SPAN = TIMELINE_END - TIMELINE_START; // 12 years

function pct(year: number) {
  return ((year - TIMELINE_START) / SPAN) * 100;
}

export default function CareerTimeline() {
  const [active, setActive] = useState<string | null>(null);

  const activeEntry = entries.find((e) => e.id === active) ?? null;

  return (
    <div className="w-full">
      {/* ── Horizontal track ── */}
      <div className="relative" style={{ height: 180 }}>
        {/* Base line */}
        <div
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
          style={{
            height: 2,
            background: "var(--glass-border)",
          }}
        />

        {/* Year tick marks along the bottom */}
        {[2014, 2016, 2018, 2020, 2022, 2024, 2026].map((yr) => (
          <div
            key={yr}
            className="absolute -translate-x-1/2"
            style={{ left: `${pct(yr)}%`, top: "calc(50% + 16px)" }}
          >
            <div
              className="w-px mx-auto mb-1"
              style={{ height: 8, background: "var(--glass-border)" }}
            />
            <span
              className="label-mono block text-center"
              style={{
                color: "var(--text-muted)",
                fontSize: "0.55rem",
              }}
            >
              {yr}
            </span>
          </div>
        ))}

        {/* Duration bars */}
        {entries.map((entry, idx) => {
          const left = pct(entry.startYear);
          const width = Math.max(
            pct(entry.endYear) - pct(entry.startYear),
            2.5 // minimum width for point events
          );
          const isAbove = idx % 2 === 0;
          const isActive = active === entry.id;

          return (
            <div
              key={entry.id}
              className="absolute group cursor-pointer"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                top: isAbove ? 0 : "50%",
                height: "50%",
              }}
              onMouseEnter={() => setActive(entry.id)}
              onMouseLeave={() => setActive(null)}
              onClick={() => {
                const el = document.querySelector(entry.anchor);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {/* Bar */}
              <div
                className="absolute left-0 right-0 rounded-full transition-all duration-200"
                style={{
                  height: isActive ? 6 : 4,
                  background: entry.color,
                  opacity: isActive ? 1 : 0.7,
                  top: isAbove ? "auto" : 0,
                  bottom: isAbove ? 0 : "auto",
                  transform: isAbove
                    ? "translateY(calc(-50% - 1px))"
                    : "translateY(calc(50% + 1px))",
                }}
              />

              {/* Dot on the main line */}
              <div
                className="absolute left-0 -translate-x-1/2 rounded-full transition-all duration-200 z-10"
                style={{
                  width: isActive ? 12 : 8,
                  height: isActive ? 12 : 8,
                  background: entry.color,
                  top: isAbove ? "auto" : -4,
                  bottom: isAbove ? -4 : "auto",
                  boxShadow: isActive
                    ? `0 0 12px ${entry.color}`
                    : "none",
                }}
              />

              {/* Label (company + role) */}
              <div
                className="absolute left-0 transition-opacity duration-200"
                style={{
                  bottom: isAbove ? "calc(50% + 12px)" : "auto",
                  top: isAbove ? "auto" : "calc(50% + 12px)",
                  maxWidth: 160,
                  opacity: isActive ? 1 : 0.75,
                }}
              >
                <p
                  className="font-display font-semibold leading-tight"
                  style={{
                    color: "var(--heading-color)",
                    fontSize: "0.7rem",
                  }}
                >
                  {entry.org}
                </p>
                <p
                  className="leading-tight mt-0.5"
                  style={{
                    color: entry.color,
                    fontSize: "0.6rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {entry.role}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Hover popup ── */}
      <AnimatePresence mode="wait">
        {activeEntry && (
          <motion.div
            key={activeEntry.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="neu-raised rounded-xl p-5 mt-4"
          >
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span
                className="label-mono"
                style={{ color: activeEntry.color, fontSize: "0.6rem" }}
              >
                {activeEntry.label}
              </span>
              <span
                className="font-display font-semibold text-sm"
                style={{ color: "var(--heading-color)" }}
              >
                {activeEntry.role}
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                — {activeEntry.org}
              </span>
            </div>

            <p
              className="text-sm mb-3 leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {activeEntry.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {activeEntry.skills.map((skill) => (
                <span
                  key={skill}
                  className="neu-concave rounded-md px-2.5 py-1 font-mono"
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.65rem",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            <button
              onClick={() => {
                const el = document.querySelector(activeEntry.anchor);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-1.5 font-display font-medium text-xs transition-all hover:gap-2.5"
              style={{ color: activeEntry.color }}
            >
              Read more &rarr;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default state hint */}
      {!activeEntry && (
        <div
          className="text-center mt-4"
          style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}
        >
          <span className="font-mono">Hover over a role to explore details</span>
        </div>
      )}
    </div>
  );
}
