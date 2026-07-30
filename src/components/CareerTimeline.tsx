/**
 * CareerTimeline — Minimal horizontal timeline visualization
 * Hover reveals popup with description + tech/skills
 * Click navigates to the relevant narrative section on the About page
 *
 * Below 768px the horizontal track is replaced by a vertical list. The track
 * positions entries proportionally by year, so at 375px the seven role labels
 * overlapped each other five times over and the last one ran off-screen —
 * the career arc, which is the point of the component, became unreadable.
 * Positions are inline `left: %` styles, so this has to branch in the
 * component; a media query cannot reach them.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";

export interface TimelineEntry {
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

/** Single source of truth for career history — also consumed by /resume. */
export const entries: TimelineEntry[] = [
  {
    id: "clemson-bs",
    startYear: 2014,
    endYear: 2014,
    label: "2014",
    role: "B.S. Agricultural Science",
    org: "Clemson University · Minor in Business Management · GPA 3.6/4.0",
    color: "var(--emerald)",
    description:
      "A wholistic agribusiness education — soil science, erosion control, mobile power, hydraulics, fabrication, livestock housing, economics, and precision agriculture. The starting point for a career built on solving tangible, real-world problems.",
    skills: ["Agricultural Science", "Environmental Physics", "Business"],
    anchor: "#soil-to-server",
  },
  {
    id: "extension",
    startYear: 2015,
    endYear: 2020,
    label: "2015–2020",
    role: "Environmental Data Analyst",
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
    id: "clemson-cafls",
    startYear: 2016,
    endYear: 2020,
    label: "2016–2020",
    role: "GIS & Remote Sensing Researcher",
    org: "Clemson University — CAFLS",
    color: "var(--emerald)",
    description:
      "Landscape-scale spatial analysis across 90,000+ km² for SCDNR, integrating elevation, land cover, forest density, soils, and NHD hydrology. Modeled PV site suitability across 88 agricultural sites from UAV and satellite imagery — published in Drones (MDPI, 2020).",
    skills: [
      "Remote Sensing",
      "UAV / Photogrammetry",
      "LiDAR (HTC)",
      "Hydrology",
      "Python",
    ],
    anchor: "#spatial-awakening",
  },
  {
    // Ran alongside the Clemson research years. Restored 2026-07-29 — it was
    // missing from both the timeline and the "authoritative" career table in
    // Portfolio-Docs, which left the licensed-remote-pilot capability with no
    // employment history behind it.
    id: "freelance-uav",
    startYear: 2018,
    endYear: 2020,
    label: "2018–2020",
    role: "Freelance Drone Pilot",
    org: "Independent · FAA Part 107",
    color: "var(--cyan)",
    description:
      "Flew UAV missions for local clients as a licensed remote pilot, delivering imagery, video, and photogrammetric 3D models. The habit of collecting my own data rather than inheriting someone else's started here.",
    skills: [
      "FAA Part 107",
      "UAV Operations",
      "Photogrammetry",
      "Orthomosaics",
      "3D Modeling",
    ],
    anchor: "#soil-to-server",
  },
  {
    id: "clemson-ms",
    startYear: 2020,
    endYear: 2020,
    label: "2020",
    role: "M.S. Environmental Science",
    org: "Clemson University · GPA 3.7/4.0",
    color: "var(--emerald)",
    description:
      "Emphasis in GIS and remote sensing for natural resources, statistics, and energy efficiency. Discovered the power of spatial data through GIS, remote sensing, and photogrammetry, and published three academic papers in spatial data analysis and environmental science.",
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
    endYear: 2025,
    label: "2021–2025",
    role: "Lead Spatial Data Scientist",
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
    role: "Lead Spatial Data Scientist / Remote Sensing Researcher",
    org: "Meta (AI Research Labs)",
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

/* Vertical rhythm, in px, measured from the axis outward. */
const ROW_H = 78;           // one lane: bar + the label stacked beyond it
const LABEL_H = 60;
const MILESTONE_BAND = 58;  // reserved above the axis for degrees
const MILESTONE_INSET = 12; // clearance so degree labels clear the lane-0 bar
const TICK_BAND = 30;       // reserved below the axis for year ticks

/**
 * Greedy interval packing — assign each role the first lane it does not
 * collide in.
 *
 * Lanes used to be `idx % 2`: even entries above the axis, odd below, with no
 * reference to dates at all. That put Clemson Extension (2015–2020) and the
 * Freelance Drone Pilot years (2018–2020) both below the line, so the FAA bar
 * painted straight over the Extension bar's last two years and the role
 * looked two years shorter than it was. Three roles genuinely overlap across
 * 2018–2020, so two lanes were never going to be enough regardless of how
 * they were assigned.
 *
 * The comparison is strict: two bars that merely touch at a year go in
 * different lanes, because sharing one would render them as a single
 * continuous bar (Booz Allen ending and Meta beginning in 2025).
 */
function packLanes(roles: TimelineEntry[]): Map<string, number> {
  const laneEnds: number[] = [];
  const laneOf = new Map<string, number>();

  [...roles]
    .sort((a, b) => a.startYear - b.startYear)
    .forEach((role) => {
      let lane = laneEnds.findIndex((end) => role.startYear > end);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = role.endYear;
      laneOf.set(role.id, lane);
    });

  return laneOf;
}

export default function CareerTimeline() {
  const [active, setActive] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const activeEntry = entries.find((e) => e.id === active) ?? null;

  const goToAnchor = (anchor: string) => {
    const el = document.querySelector(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* Degrees are point events (start === end) and take the milestone band on
     the axis; everything with real duration competes for a lane. */
  const milestones = entries.filter((e) => e.startYear === e.endYear);
  const roles = entries.filter((e) => e.startYear !== e.endYear);
  const laneOf = useMemo(() => packLanes(roles), []);

  const laneCount = Math.max(...Array.from(laneOf.values()), 0) + 1;
  const aboveRows = Math.ceil(laneCount / 2); // lanes 0, 2, 4… sit above
  const belowRows = Math.floor(laneCount / 2);
  const axisY = MILESTONE_BAND + Math.max(aboveRows - 1, 0) * ROW_H + LABEL_H;
  const trackHeight = axisY + TICK_BAND + belowRows * ROW_H + LABEL_H;

  if (isMobile) {
    return (
      <div className="w-full">
        <ol className="ct-list">
          {entries.map((entry) => {
            const isOpen = active === entry.id;
            return (
              <li
                key={entry.id}
                className="ct-list-item"
                style={{ borderLeftColor: entry.color }}
              >
                <button
                  className="ct-list-head"
                  aria-expanded={isOpen}
                  onClick={() => setActive(isOpen ? null : entry.id)}
                >
                  <span
                    className="label-mono ct-list-years"
                    style={{ color: entry.color }}
                  >
                    {entry.label}
                  </span>
                  <span className="ct-list-role">{entry.role}</span>
                  <span className="ct-list-org">{entry.org}</span>
                </button>

                {isOpen && (
                  <div className="ct-list-detail">
                    <p className="ct-list-desc">{entry.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {entry.skills.map((skill) => (
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
                      onClick={() => goToAnchor(entry.anchor)}
                      className="inline-flex items-center gap-1.5 font-display font-medium text-xs"
                      style={{ color: entry.color }}
                    >
                      Read more &rarr;
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ── Horizontal track ── */}
      <div className="relative ct-track" style={{ height: trackHeight }}>
        {/* Base line — a lit rail rather than a hairline. See .ct-axis. */}
        <div className="absolute left-0 right-0 ct-axis" style={{ top: axisY }} />

        {/* Year tick marks along the bottom */}
        {[2014, 2016, 2018, 2020, 2022, 2024, 2026].map((yr) => (
          <div
            key={yr}
            className="absolute -translate-x-1/2"
            style={{ left: `${pct(yr)}%`, top: axisY + 14 }}
          >
            <div
              className="w-px mx-auto mb-1"
              style={{ height: 8, background: "var(--glass-border)" }}
            />
            <span
              className="label-mono block text-center"
              style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}
            >
              {yr}
            </span>
          </div>
        ))}

        {/* Degrees — point events, marked on the axis itself in their own
            band. A credential is a milestone, not a duration; giving them
            bars would mean either starting the axis in 2010 for a four-year
            B.S. or dropping another interval into 2018–2020, already the
            most congested stretch. Patrick's call, 2026-07-30. */}
        {milestones.map((entry) => {
          const isActive = active === entry.id;
          return (
            <div
              key={entry.id}
              className="absolute cursor-pointer"
              style={{
                left: `${pct(entry.startYear)}%`,
                top: axisY - MILESTONE_BAND + MILESTONE_INSET,
                width: 150,
                marginLeft: -6,
              }}
              onMouseEnter={() => setActive(entry.id)}
              onMouseLeave={() => setActive(null)}
              onClick={() => goToAnchor(entry.anchor)}
            >
              <p
                className="font-display font-semibold leading-tight transition-opacity duration-200"
                style={{
                  color: "var(--heading-color)",
                  fontSize: "0.68rem",
                  opacity: isActive ? 1 : 0.75,
                }}
              >
                {entry.role}
              </p>
              <span
                className="label-mono"
                style={{ color: entry.color, fontSize: "0.55rem" }}
              >
                {entry.label}
              </span>
              {/* Diamond sitting on the axis */}
              <div
                className={`absolute ct-diamond${isActive ? " ct-diamond--on" : ""}`}
                style={
                  {
                    "--entry": entry.color,
                    left: 0,
                    top: MILESTONE_BAND - MILESTONE_INSET - 5,
                  } as React.CSSProperties
                }
              />
            </div>
          );
        })}

        {/* Role duration bars, one per packed lane */}
        {roles.map((entry) => {
          const lane = laneOf.get(entry.id) ?? 0;
          const isAbove = lane % 2 === 0;
          const row = Math.floor(lane / 2);
          const isActive = active === entry.id;

          const barY = isAbove
            ? axisY - MILESTONE_BAND - row * ROW_H
            : axisY + TICK_BAND + row * ROW_H;
          const groupTop = isAbove ? barY - LABEL_H : barY;

          return (
            <div
              key={entry.id}
              className="absolute group cursor-pointer"
              style={{
                left: `${pct(entry.startYear)}%`,
                width: `${pct(entry.endYear) - pct(entry.startYear)}%`,
                top: groupTop,
                height: LABEL_H + 6,
              }}
              onMouseEnter={() => setActive(entry.id)}
              onMouseLeave={() => setActive(null)}
              onClick={() => goToAnchor(entry.anchor)}
            >
              {/* Bar */}
              <div
                className={`absolute left-0 right-0 ct-bar${isActive ? " ct-bar--on" : ""}`}
                style={
                  {
                    "--entry": entry.color,
                    top: isAbove ? LABEL_H : 0,
                  } as React.CSSProperties
                }
              />

              {/* Cap on the start year */}
              <div
                className={`absolute z-10 ct-cap${isActive ? " ct-cap--on" : ""}`}
                style={
                  {
                    "--entry": entry.color,
                    left: 0,
                    top: isAbove ? LABEL_H : 0,
                  } as React.CSSProperties
                }
              />

              {/* Label (company + role) */}
              <div
                className="absolute left-0 transition-opacity duration-200"
                style={{
                  top: isAbove ? 0 : 12,
                  maxWidth: 170,
                  opacity: isActive ? 1 : 0.75,
                }}
              >
                <p
                  className="font-display font-semibold leading-tight"
                  style={{ color: "var(--heading-color)", fontSize: "0.7rem" }}
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
