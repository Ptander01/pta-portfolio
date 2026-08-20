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
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  /** Résumé bullets, rendered on /resume only — the timeline popup keeps the
   *  single `description` sentence, because a hover card is not a CV. Merged
   *  from Patrick's four targeted résumés (software engineering, data science
   *  research, remote sensing, general), deduped where they overlap. Kept
   *  here rather than in Resume.tsx so career facts stay in one file. */
  highlights?: string[];
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
      "A holistic agribusiness education — soil science, erosion control, mobile power, hydraulics, fabrication, livestock housing, economics, and precision agriculture. The starting point for a career built on solving tangible, real-world problems.",
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
    highlights: [
      "Led execution of a $3.4M federal energy grant, completing 150+ agricultural engineering assessments.",
      "Authored 300+ technical reports translating engineering and energy analysis for project managers, engineers and agribusiness clients.",
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
      "Landscape-scale hydrology and stream-sinuosity analysis across 90,000+ km² for the South Carolina Department of Natural Resources, integrating NHD hydrography with elevation, land cover, forest density and soils. Modeled PV site suitability across 88 agricultural sites from UAV and satellite imagery — published in Drones (MDPI, 2020).",
    skills: [
      "Remote Sensing",
      "UAV / Photogrammetry",
      "LiDAR (HTC)",
      "Hydrology",
      "Python",
    ],
    highlights: [
      "Built LiDAR (LAS/LAZ) processing pipelines and hydrology models (NHD, NHD+, USGS 3DHP) for a 90,000 km² landscape-scale stream-sinuosity and hydrography analysis for the South Carolina Department of Natural Resources.",
      "Sourced, aligned and processed orthoimagery, elevation and terrain rasters (DEM/DTM/CHM) and point-cloud data across disparate public and commercial sources.",
      "Conducted MS thesis research on distributed solar siting using UAV photogrammetry and GIS; published PV suitability modelling in Drones (MDPI, 2020).",
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
    highlights: [
      "Geocoded the national SCI/D facility network and a patient registry of 25,157 Veterans, then built facility territories as road-network-weighted Voronoi polygons across 147 hubs and spokes.",
      "Calculated commute variables over the road network and regressed visit behaviour against travel-cost metrics — including modelling actual against expected behaviour, where a Veteran passes their closest facility to seek care further away.",
      "Segmented the population by demographic, region and urban / rural / highly rural classification, and mapped change in population and behaviour over five fiscal years.",
      "Broke utilisation down by care type — general, specialty, home care and telehealth — including broadband and internet access as a constraint on telehealth in remote areas, and contrasted patient visit volume against facility FTE.",
      "Applied geographically weighted regression and spatial autocorrelation across the 147 catchment areas, and reported a null result when an expected relationship did not hold.",
      "Held Public Trust clearance for handling federal HIPAA/PHI and PII data, with data-governance and coverage responsibility on nationally deployed systems.",
      "Worked on the VA's Enterprise Geospatial Team, its centralised GIS technical unit.",
      "Invited speaker three years running at both the VHA Executive Chief's Summit and CDW Insights Day, the Corporate Data Warehouse's annual event for technical analysts across the VA.",
    ],
    anchor: "#spatial-awakening",
  },
  {
    id: "meta",
    /* Positioning stays on whole years. The engagement actually ran Jun 2025 –
       Apr 2026, but narrowing the bar to its true ~10 months squeezes the label
       box that `b6ace9f` had to widen, and shifting TIMELINE_END to fit a
       fractional 2026.25 would move every verified axis tick off
       8.33/16.67/33.33/58.33/91.67. The `label` carries the precision instead —
       it is what the reader actually sees, here and on /resume. */
    startYear: 2025,
    endYear: 2026,
    label: "Jun 2025 – Apr 2026",
    role: "Lead Spatial Data Scientist / Remote Sensing Researcher",
    /* Just "Meta". The team was renamed three times in ten months — Infra
       Intel, Competitive Infra Intel, Infrastructure Industry Intelligence —
       and moved from the economics org to adjacent to MSL, so no single team
       name is defensible. Patrick's résumé says Meta; this is the one place
       career data lives, so /about and /resume both follow. */
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
    highlights: [
      "Designed and built a 233,000-line production geospatial data pipeline and consensus system, from first commit to enterprise deployment in two months.",
      "Processed weekly custom satellite imagery at scale — colour correction, georectification, mosaicing, feature extraction and change detection — delivered to an executive audience.",
      "Built automated tooling to source, align and prepare multi-modal geospatial data (imagery, vector, raster) for downstream AI/ML consumption, including REST API design and deterministic validation logic.",
      "Owned the full pipeline lifecycle: ingestion, processing, quality control, and delivery into production systems used across the organisation.",
    ],
    anchor: "#ai-infrastructure",
  },
];


/* ── Symbology ──────────────────────────────────────────────────────────
   Colour on this timeline was doing something it should not: `--emerald`
   covered both degrees *and* the CAFLS research post, and `--cyan` covered
   both the freelance drone work and five years at Booz Allen on the VA
   contract. Two false groupings, the second worse than the first, since
   those roles have nothing to do with each other.

   Rather than pick one fixed encoding, the reader chooses. The default says
   nothing at all — one neutral rail, position and label carrying everything
   — and each scheme after it makes a specific, defensible claim. Shape is
   independent of all of this: a diamond is always a credential and a bar is
   always a role, whichever scheme is showing.

   Patrick's idea, and the right one; "symbology" is his word for it. */
type Scheme = "minimal" | "org" | "type" | "sector";

const SCHEMES: { id: Scheme; label: string }[] = [
  { id: "minimal", label: "None" },
  { id: "org", label: "Organization" },
  { id: "type", label: "Type" },
  { id: "sector", label: "Sector" },
];

/** id → group, per scheme. Kept as data so the legend and the rails can
 *  never disagree about what a colour means. */
const GROUPS: Record<Exclude<Scheme, "minimal">, Record<string, string>> = {
  org: {
    "clemson-bs": "Clemson",
    extension: "Clemson",
    "clemson-cafls": "Clemson",
    "clemson-ms": "Clemson",
    "freelance-uav": "Independent",
    "booz-allen": "Booz Allen · VA",
    meta: "Meta",
  },
  type: {
    "clemson-bs": "Education",
    "clemson-ms": "Education",
    extension: "Role",
    "clemson-cafls": "Role",
    "freelance-uav": "Role",
    "booz-allen": "Role",
    meta: "Role",
  },
  sector: {
    "clemson-bs": "Academia",
    "clemson-ms": "Academia",
    "clemson-cafls": "Academia",
    extension: "Applied science",
    "freelance-uav": "Independent",
    "booz-allen": "Government",
    meta: "Industry",
  },
};

/** group → colour. Every scheme draws from the four existing accents plus
 *  one gold, rather than inventing a hue per entry. */
const GROUP_COLOR: Record<string, string> = {
  Clemson: "var(--emerald)",
  Independent: "var(--amber)",
  "Booz Allen · VA": "var(--cyan)",
  Meta: "var(--coral)",
  Education: "var(--amber)",
  Role: "var(--cyan)",
  Academia: "var(--emerald)",
  "Applied science": "var(--gold)",
  Government: "var(--cyan)",
  Industry: "var(--coral)",
};

function groupOf(scheme: Scheme, id: string): string | null {
  return scheme === "minimal" ? null : GROUPS[scheme][id] ?? null;
}

function colorFor(scheme: Scheme, id: string): string {
  const g = groupOf(scheme, id);
  return g ? GROUP_COLOR[g] ?? "var(--rail-neutral)" : "var(--rail-neutral)";
}

/** Ordered, de-duplicated groups for the active scheme's legend. */
function legendFor(scheme: Scheme, ids: string[]) {
  if (scheme === "minimal") return [];
  const seen = new Set<string>();
  const out: { label: string; color: string }[] = [];
  ids.forEach((id) => {
    const g = groupOf(scheme, id);
    if (g && !seen.has(g)) {
      seen.add(g);
      out.push({ label: g, color: GROUP_COLOR[g] });
    }
  });
  return out;
}

/* ── Layout constants ── */
const TIMELINE_START = 2014;
const TIMELINE_END = 2026;
const SPAN = TIMELINE_END - TIMELINE_START; // 12 years

function pct(year: number) {
  return ((year - TIMELINE_START) / SPAN) * 100;
}

/* Vertical rhythm, in px, measured from the axis outward. */
const ROW_H = 68;           // one lane: bar + the label stacked beyond it
const LABEL_H = 50;
const MILESTONE_BAND = 58;  // reserved above the axis for degrees
const MILESTONE_INSET = 12; // clearance so degree labels clear the lane-0 bar
const TICK_BAND = 46;       /* reserved below the axis for year ticks. Was 30,
                               which is less than the block actually occupies —
                               an 8px rule plus margin plus the label — so the
                               first below-lane bar painted through the 2016,
                               2018, 2020 and 2026 tick labels. */

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
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [scheme, setScheme] = useState<Scheme>("minimal");
  const isMobile = useIsMobile();
  const hue = (id: string) => colorFor(scheme, id);
  const legend = legendFor(scheme, entries.map((e) => e.id));

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


  /* How much room each label actually has.
     The label lives inside its bar's group, whose width is the bar's span —
     8.33% for Meta — so a maxWidth alone cannot help: the parent is the
     constraint. Meta was being squeezed into 88px and wrapping to eight
     lines. Expressing the width as a percentage OF THE GROUP lets it
     overflow the bar and stay responsive, because group width is itself a
     percentage of the track: a label at (avail / barSpan) × 100 percent of
     the group is exactly `avail` percent of the track.

     Room is measured to the neighbouring entry IN THE SAME LANE, since
     lane packing guarantees those are the only labels it can collide with —
     other lanes sit in their own vertical bands. */
  const laneRoom = useMemo(() => {
    const byLane = new Map<number, TimelineEntry[]>();
    roles.forEach((r) => {
      const l = laneOf.get(r.id) ?? 0;
      if (!byLane.has(l)) byLane.set(l, []);
      byLane.get(l)!.push(r);
    });
    const room = new Map<string, { rightPct: number; leftPct: number }>();
    byLane.forEach((list) => {
      list.sort((a, b) => a.startYear - b.startYear);
      list.forEach((r, i) => {
        const next = list[i + 1];
        const prev = list[i - 1];
        room.set(r.id, {
          rightPct: (next ? pct(next.startYear) : 100) - pct(r.startYear),
          leftPct: pct(r.endYear) - (prev ? pct(prev.endYear) : 0),
        });
      });
    });
    return room;
  }, [laneOf]);

  const laneCount = Math.max(...Array.from(laneOf.values()), 0) + 1;
  const aboveRows = Math.ceil(laneCount / 2); // lanes 0, 2, 4… sit above
  const belowRows = Math.floor(laneCount / 2);
  const axisY = MILESTONE_BAND + Math.max(aboveRows - 1, 0) * ROW_H + LABEL_H;
  const trackHeight = axisY + TICK_BAND + belowRows * ROW_H + LABEL_H;

  const symbology = (
    <div className="ct-symbology">
      <span className="label-mono ct-symbology-label">Symbology</span>
      <div className="ct-symbology-pills" role="group" aria-label="Color scheme">
        {SCHEMES.map((sc) => (
          <button
            key={sc.id}
            className={`ct-scheme${scheme === sc.id ? " ct-scheme--on" : ""}`}
            aria-pressed={scheme === sc.id}
            onClick={() => setScheme(sc.id)}
          >
            {sc.label}
          </button>
        ))}
      </div>
      {legend.length > 0 && (
        <ul className="ct-legend">
          {legend.map((g) => (
            <li key={g.label} className="ct-legend-item">
              <span
                className="ct-legend-swatch"
                style={{ "--entry": g.color } as React.CSSProperties}
              />
              <span className="label-mono">{g.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="w-full">
        {symbology}
        <ol className="ct-list">
          {entries.map((entry) => {
            const isOpen = active === entry.id;
            return (
              <li
                key={entry.id}
                className={`ct-list-item${isOpen ? " ct-list-item--on" : ""}`}
                style={{ "--entry": hue(entry.id) } as React.CSSProperties}
              >
                <button
                  className="ct-list-head"
                  aria-expanded={isOpen}
                  onClick={() => setActive(isOpen ? null : entry.id)}
                >
                  <span className="label-mono ct-list-years">{entry.label}</span>
                  <span className="ct-list-role">{entry.role}</span>
                  <span className="ct-list-org">{entry.org}</span>
                </button>

                {/* Where this entry sits on 2014–2026. Stacking the timeline
                    for mobile threw away the proportional-duration signal,
                    which was the whole argument for a horizontal axis — this
                    gives each row its own miniature of it, so a five-year
                    role still looks longer than a one-year one. Degrees get
                    a minimum width and read as a marker, not a span. */}
                <div className="ct-span" aria-hidden="true">
                  <div
                    className="ct-span-bar"
                    style={{
                      left: `${pct(entry.startYear)}%`,
                      width: `${Math.max(
                        pct(entry.endYear) - pct(entry.startYear),
                        2.5
                      )}%`,
                    }}
                  />
                </div>

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
                      style={{ color: hue(entry.id) }}
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
      {symbology}

      {/* ── Horizontal track ── */}
      <div
        className="relative ct-track"
        style={
          {
            height: trackHeight,
            /* Feeds the horizon light-pool in .ct-track::after so the
               brightest band lands on the axis wherever lane packing puts
               it, rather than assuming the middle. */
            "--axis-pos": `${((axisY / trackHeight) * 100).toFixed(2)}%`,
          } as React.CSSProperties
        }
      >
        {/* Base line — a lit rail rather than a hairline. See .ct-axis. */}
        <div className="absolute left-0 right-0 ct-axis" style={{ top: axisY }} />

        {/* Year tick marks along the bottom */}
        {[2014, 2016, 2018, 2020, 2022, 2024, 2026].map((yr) => (
          <div
            key={yr}
            className="absolute -translate-x-1/2"
            style={{ left: `${pct(yr)}%`, top: axisY + 14 }}
          >
            <div className="ct-tick" />
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
        {milestones.map((entry, mi) => {
          const isActive = active === entry.id;
          /* Same reasoning as the role labels, simpler case: a degree marker
             has no span, so its room runs to the next degree or the edge. */
          const nextMile = milestones[mi + 1];
          const mileRoom =
            (nextMile ? pct(nextMile.startYear) : 100) - pct(entry.startYear);
          return (
            <div
              key={entry.id}
              className="absolute cursor-pointer"
              style={{
                left: `${pct(entry.startYear)}%`,
                top: axisY - MILESTONE_BAND + MILESTONE_INSET,
                width: `${mileRoom - 3}%`,
                minWidth: 150,
                maxWidth: 290,
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
                style={{ color: hue(entry.id), fontSize: "0.55rem" }}
              >
                {entry.label}
              </span>
              {/* Diamond sitting on the axis */}
              <div
                className={`absolute ct-diamond${isActive ? " ct-diamond--on" : ""}`}
                style={
                  {
                    "--entry": hue(entry.id),
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
          /* Past ~78% there is not 170px of track left for a label to run
             into, so anchor it to the bar's right end and set it
             right-aligned. Meta starts at 91.67% and was overflowing. */
          const nearRight = pct(entry.startYear) > 78;
          const barSpan = pct(entry.endYear) - pct(entry.startYear);

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
                    "--entry": hue(entry.id),
                    top: isAbove ? LABEL_H : 0,
                  } as React.CSSProperties
                }
              />

              {/* Cap on the start year */}
              <div
                className={`absolute z-10 ct-cap${isActive ? " ct-cap--on" : ""}`}
                style={
                  {
                    "--entry": hue(entry.id),
                    left: 0,
                    top: isAbove ? LABEL_H : 0,
                  } as React.CSSProperties
                }
              />

              {/* Label (company + role) */}
              <div
                className="absolute transition-opacity duration-200"
                style={{
                  top: isAbove ? 0 : 12,
                  ...(nearRight ? { right: 0 } : { left: 0 }),
                  textAlign: nearRight ? "right" : "left",
                  /* % of the group, which resolves to `avail` % of the track.
                     Capped in px so a role with half the axis to itself does
                     not get a 500px measure — that reads as a paragraph, not
                     a label. */
                  width: `${(
                    ((nearRight
                      ? laneRoom.get(entry.id)?.leftPct
                      : laneRoom.get(entry.id)?.rightPct) ?? barSpan) / barSpan
                  ) * 100 - 6}%`,
                  minWidth: 150,
                  maxWidth: 290,
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
                    color: hue(entry.id),
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
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            className="neu-raised rounded-xl p-5 mt-4"
          >
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span
                className="label-mono"
                style={{ color: hue(activeEntry.id), fontSize: "0.6rem" }}
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
              style={{ color: hue(activeEntry.id) }}
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
