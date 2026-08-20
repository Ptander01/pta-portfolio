/**
 * Resume — career history + PDF download
 * ─────────────────────────────────────────────────────────────
 * Career entries are imported from CareerTimeline rather than duplicated,
 * so this page and the About-page timeline can never drift apart.
 *
 * The PDF lives at /resume/Patrick-Anderson-Resume.pdf (public/). Until
 * that file exists the download button reports it as unavailable rather
 * than handing the visitor a 404.
 *
 * Patrick Anderson — PTA Geospatial Intelligence
 */

import PageTransition from "@/components/animations/PageTransition";
import FadeIn from "@/components/animations/FadeIn";
import { entries } from "@/components/CareerTimeline";
import Photo from "@/components/Photo";
import { useEffect, useState } from "react";

const PDF_HREF = "/resume/Patrick-Anderson-Resume.pdf";

/** Newest first — `entries` is authored oldest-first for the timeline axis. */
const history = [...entries].reverse();

/* Split on the same rule the timeline uses: a role has duration, a degree is
   a point in time. Keeping them in one list made the resume read as though
   the M.S. were a job, and buried the employment history among credentials. */
const experience = history.filter((e) => e.startYear !== e.endYear);
const education = history.filter((e) => e.startYear === e.endYear);

/** Peer-reviewed and academic work. The About page and career timeline both
 *  referred to "three academic publications" in prose without ever linking
 *  them; an unlinked claim is weaker than a citation. Verified against
 *  Crossref and the publishers on 2026-07-29 — note the Clemson thesis has
 *  moved from tigerprints.clemson.edu to open.clemson.edu (301). */
const publications = [
  {
    year: "2020",
    title:
      "Evaluating Photovoltaics in a Peak-Shaving Supply Management Role in Rural Communities",
    authors: "Patrick Anderson",
    venue: "M.S. Thesis · Clemson University, Division of Agriculture (SAFES)",
    href: "https://open.clemson.edu/all_theses/3380/",
    kind: "Thesis",
  },
  {
    year: "2020",
    title: "Estimating Rooftop Areas of Poultry Houses Using UAV and Satellite Images",
    authors: "A. Bulent Koc, Patrick T. Anderson, John P. Chastain, Christopher Post",
    venue: "Drones (MDPI) · Vol. 4, Issue 4 · doi:10.3390/drones4040076",
    href: "https://www.mdpi.com/2504-446X/4/4/76",
    kind: "Peer-reviewed",
  },
  {
    year: "2017",
    title:
      "Analysis of Available Efficiency and Performance Data for Axial Flow Agricultural Ventilation Fans",
    authors: "John P. Chastain, Patrick T. Anderson, Michael Vassalos",
    venue:
      "2017 ASABE Annual International Meeting · Paper 1700116 · doi:10.13031/aim.201700116",
    href: "https://elibrary.asabe.org/abstract.asp?JID=5&AID=48384&CID=spo2017&T=1",
    kind: "Conference",
  },
];

const technicalWriting = [
  {
    year: "2024",
    title: "Catchment Area Population and Access — Executive Summary",
    authors: "Prepared for the VHA SCI/D National Program Office",
    venue:
      "Client deliverable · 25 catchment areas · network-weighted catchments, FY2019–FY2023 change analysis",
    href: "/writing/Anderson-VHA-SCID-Catchment-Area-Executive-Summary.pdf",
    kind: "Report (PDF)",
  },
];

/** Licences and certificates. The FAA rating is listed first because it is the
 *  only one that is a live, renewable licence rather than course completion —
 *  and it is what backs the remote-pilot capability described on /about. */
const credentials = [
  {
    year: "2021–2025",
    title: "Public Trust Clearance — U.S. Federal Government",
    authors: "Held while supporting the Veterans Health Administration",
    venue: "Handling HIPAA/PHI and PII on nationally deployed systems",
    href: null,
    kind: "Clearance",
  },
  {
    year: "Current",
    title: "FAA Part 107 — Remote Pilot Certificate (sUAS)",
    authors: "Federal Aviation Administration",
    venue: "Commercial small unmanned aircraft operations",
    href: null,
    kind: "License",
  },
  {
    year: "2017",
    title: "Cartography",
    authors: "ESRI",
    venue: "Online certificate · map design and symbology",
    href: null,
    kind: "Certificate",
  },
  {
    year: "2017",
    title: "Python Automation for GIS",
    authors: "ESRI",
    venue: "Online certificate · scripting and geoprocessing automation",
    href: null,
    kind: "Certificate",
  },
  {
    year: "2017",
    title: "Imaging and Remote Sensing",
    authors: "ESRI",
    venue: "Online certificate · imagery analysis",
    href: null,
    kind: "Certificate",
  },
  {
    year: "2016",
    title: "Geospatial Certificate",
    authors: "Clemson University — Center for Geospatial Technologies",
    venue:
      "Semester-long interdisciplinary course · database management, spatial analysis, remote sensing, LiDAR",
    href: null,
    kind: "Certificate",
  },
];

/** Technical skills, merged from Patrick's four targeted résumés (software
 *  engineering, data science research, remote sensing, general) and deduped.
 *
 *  Deliberately a different register from /about's "What I work with", which
 *  is plain English by design and stays that way — this list is the tool-dense
 *  version a résumé reader and an ATS both expect. Two lists, two audiences;
 *  the risk is drift, so anything factual (roles, dates, publications) stays
 *  in one place and only the vocabulary differs.
 *
 *  Not carried over from the source résumés: the "500K+ lines of production
 *  Python/React" line that appears in two of their skills blocks. The site
 *  publishes 233,000 for the named Meta system and 170,900 counted across 13
 *  public repos, both with their method stated; an unmethodful larger number
 *  next to them invites exactly the arithmetic question the piece pages exist
 *  to survive. */
const skillGroups = [
  {
    label: "Remote Sensing & Imagery",
    items:
      "Satellite and UAV imagery processing · georectification · orthorectification · image mosaicking · radiometric and colour correction · change detection · feature extraction · LiDAR · multispectral analysis",
  },
  {
    label: "GIS Platforms",
    items:
      "ArcGIS Pro · ArcGIS Online / Portal / Enterprise · ArcGIS API for Python · QGIS · Google Earth Engine · enterprise geodatabases",
  },
  {
    label: "Python & Geospatial Tooling",
    items:
      "GeoPandas · Rasterio · GDAL · Shapely · ArcPy · xarray · boto3 · NumPy · Pandas · SciPy",
  },
  {
    label: "Data Formats",
    items:
      "GeoTIFF including Cloud Optimized GeoTIFF · LiDAR (LAS/LAZ) · Shapefile · GeoJSON · NetCDF · raster and vector formats · coordinate reference systems and projection management",
  },
  {
    label: "Statistics & Machine Learning",
    items:
      "Geographically weighted regression · spatial statistics · spatial autocorrelation · hypothesis testing · experimental design · supervised and unsupervised ML · feature engineering · predictive modelling",
  },
  {
    label: "Front-End & Visualisation",
    items:
      "React · TypeScript · Three.js · D3.js · MapLibre GL · deck.gl · Recharts · Framer Motion · ArcGIS Dashboards · executive briefing design",
  },
  {
    label: "Cloud & Engineering",
    items:
      "AWS (S3, EC2, Lambda, IAM, Batch) · Docker · Git/GitHub · CI/CD-aware practices · REST API design · system architecture · PostgreSQL · developing PostGIS proficiency",
  },
  {
    label: "AI-Assisted Development",
    items:
      "Agentic LLM coding tools in production workflows · prompt engineering · agentic pipeline design",
  },
];

const speaking = [
  {
    year: "2023",
    title:
      "United States Veterans with Spinal Cord Injuries & Disorders: Geospatial Analysis of Cases and Characteristics",
    authors: "Academy of Spinal Cord Injury Professionals (ASCIP) Annual Meeting",
    venue: "September 5, 2023 · San Diego, California",
    href: "https://www.linkedin.com/pulse/spatial-data-science-display-spinal-cord-injury-medical-anderson-kadke/",
    kind: "Conference talk",
  },
  {
    year: "2021–2023",
    title: "VHA Enterprise Data Warehouse — invited annual speaker, three consecutive years",
    authors: "Veterans Health Administration",
    venue: "VHA-wide audience · spatial data products for the SCI/D National Program Office",
    href: null,
    kind: "Invited talk",
  },
];

type Citation = {
  year: string;
  title: string;
  authors: string;
  venue: string;
  href: string | null;
  kind: string;
};

/** Shared renderer for publications, writing, and talks — same shape, so the
 *  three lists stay visually identical rather than drifting apart. An entry
 *  without an `href` renders as plain text instead of a dead link. */
function CitationList({
  heading,
  items,
  accent,
}: {
  heading: string;
  items: Citation[];
  accent: string;
}) {
  return (
    <div style={{ marginBottom: "3.5rem" }}>
      <FadeIn duration={0.6}>
        <h2 className="heading-md" style={{ marginBottom: "1.75rem" }}>
          {heading}
        </h2>
      </FadeIn>
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((c) => (
          <li
            key={c.title}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(5rem, 6rem) 1fr",
              gap: "1.5rem",
              padding: "1.25rem 0",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <div
              className="label-mono"
              style={{ color: accent, fontSize: "0.65rem", paddingTop: "0.2rem" }}
            >
              {c.year}
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--heading-color)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {c.href ? (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }}
                    className="citation-link"
                  >
                    {c.title} <span style={{ color: accent }}>↗</span>
                  </a>
                ) : (
                  c.title
                )}
              </h3>
              <p
                style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  margin: "0.4rem 0 0.3rem",
                }}
              >
                {c.authors}
              </p>
              <div
                className="label-mono"
                style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}
              >
                {c.kind} · {c.venue}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Resume() {
  const [pdfReady, setPdfReady] = useState<boolean | null>(null);

  // Probe rather than assume — avoids offering a download that isn't there.
  // vercel.json rewrites every unmatched path to /index.html, so a missing
  // PDF still answers 200 with text/html. Checking status alone would always
  // pass and hand the visitor an HTML file named .pdf — hence the type check.
  useEffect(() => {
    let live = true;
    fetch(PDF_HREF, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (live) setPdfReady(r.ok && type.includes("pdf"));
      })
      .catch(() => live && setPdfReady(false));
    return () => {
      live = false;
    };
  }, []);

  return (
    <PageTransition>
      <section
        className="relative py-32 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10" style={{ maxWidth: 860 }}>
          {/* Slot: public/images/me/headshot.jpg */}
          <FadeIn duration={0.6}>
            <Photo
              src="/images/me/headshot.jpg"
              alt="Patrick Anderson"
              className="resume-headshot"
              style={{ marginBottom: "1.75rem" }}
            />
          </FadeIn>
          <FadeIn duration={0.6}>
            <span
              className="label-mono inline-block mb-4"
              style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
            >
              Resume
            </span>
            <h1 className="heading-xl" style={{ marginBottom: "1rem" }}>
              Patrick T Anderson
            </h1>
            <p
              className="body-lg"
              style={{ color: "var(--text-secondary)", maxWidth: "60ch", margin: 0 }}
            >
              Spatial data scientist working across geospatial analysis, remote
              sensing, and AI infrastructure — from field soil sampling to
              production dashboards and volumetric 3D pipelines.
            </p>

            <div style={{ marginTop: "2rem" }}>
              {pdfReady === false ? (
                <span
                  className="label-mono"
                  style={{
                    display: "inline-block",
                    padding: "0.75rem 1.25rem",
                    border: "1px solid var(--border)",
                    borderRadius: 999,
                    color: "var(--text-muted)",
                    fontSize: "0.65rem",
                  }}
                >
                  PDF coming soon
                </span>
              ) : (
                <a
                  href={PDF_HREF}
                  download
                  className="label-mono"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.75rem 1.25rem",
                    border: `1px solid var(--cyan)`,
                    borderRadius: 999,
                    color: "var(--cyan)",
                    textDecoration: "none",
                    fontSize: "0.65rem",
                  }}
                >
                  Download PDF ↓
                </a>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      <section
        className="relative py-24 noise-bg"
        style={{ background: "var(--surface-deep)" }}
      >
        <div className="container relative z-10" style={{ maxWidth: 860 }}>
          <FadeIn duration={0.6}>
            <h2 className="heading-md" style={{ marginBottom: "2.5rem" }}>
              Experience
            </h2>
          </FadeIn>

          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {experience.map((e) => (
              <li
                key={e.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(6.5rem, 8rem) 1fr",
                  gap: "1.5rem",
                  padding: "1.5rem 0",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  className="label-mono"
                  style={{
                    color: e.color,
                    fontSize: "0.65rem",
                    paddingTop: "0.2rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.label}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Cinzel', Georgia, serif",
                      fontSize: "1.0625rem",
                      fontWeight: 600,
                      color: "var(--heading-color)",
                      margin: 0,
                    }}
                  >
                    {e.role}
                  </h3>
                  <div
                    className="label-mono"
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.6rem",
                      margin: "0.35rem 0 0.75rem",
                    }}
                  >
                    {e.org}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.9375rem",
                      lineHeight: 1.7,
                      color: "var(--text-secondary)",
                      margin: "0 0 0.9rem",
                    }}
                  >
                    {e.description}
                  </p>
                  {/* Résumé bullets, from the same entries array the timeline
                      uses — see TimelineEntry.highlights. Only /resume renders
                      them; the timeline popup keeps the one-sentence version. */}
                  {e.highlights && (
                    <ul
                      style={{
                        listStyle: "none",
                        margin: "0 0 1rem",
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.55rem",
                      }}
                    >
                      {e.highlights.map((h) => (
                        <li
                          key={h}
                          style={{
                            fontFamily: "'Lora', Georgia, serif",
                            fontSize: "0.875rem",
                            lineHeight: 1.65,
                            color: "var(--text-secondary)",
                            paddingLeft: "1rem",
                            position: "relative",
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              position: "absolute",
                              left: 0,
                              top: "0.55em",
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: e.color,
                              opacity: 0.75,
                            }}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {e.skills.map((s) => (
                      <span
                        key={s}
                        className="label-mono"
                        style={{
                          fontSize: "0.55rem",
                          padding: "0.25rem 0.6rem",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: 3,
                          color: "var(--text-muted)",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <FadeIn duration={0.6}>
            <h2
              className="heading-md"
              style={{ marginTop: "4rem", marginBottom: "2.5rem" }}
            >
              Education
            </h2>
          </FadeIn>

          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {education.map((e) => (
              <li
                key={e.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(6.5rem, 8rem) 1fr",
                  gap: "1.5rem",
                  padding: "1.5rem 0",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  className="label-mono"
                  style={{
                    color: e.color,
                    fontSize: "0.65rem",
                    paddingTop: "0.2rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.label}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Cinzel', Georgia, serif",
                      fontSize: "1.0625rem",
                      fontWeight: 600,
                      color: "var(--heading-color)",
                      margin: 0,
                    }}
                  >
                    {e.role}
                  </h3>
                  <div
                    className="label-mono"
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.6rem",
                      margin: "0.35rem 0 0.75rem",
                    }}
                  >
                    {e.org}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.9375rem",
                      lineHeight: 1.7,
                      color: "var(--text-secondary)",
                      margin: "0 0 0.9rem",
                    }}
                  >
                    {e.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {e.skills.map((s) => (
                      <span
                        key={s}
                        className="label-mono"
                        style={{
                          fontSize: "0.55rem",
                          padding: "0.25rem 0.6rem",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: 3,
                          color: "var(--text-muted)",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="relative py-24 noise-bg"
        style={{ background: "var(--page-bg)" }}
      >
        <div className="container relative z-10" style={{ maxWidth: 860 }}>
          <div id="skills" style={{ scrollMarginTop: "6rem", marginBottom: "4rem" }}>
            <FadeIn duration={0.6}>
              <h2 className="heading-md" style={{ marginBottom: "2rem" }}>
                Technical Skills
              </h2>
            </FadeIn>
            <dl style={{ margin: 0 }}>
              {skillGroups.map((g) => (
                <div
                  key={g.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(9rem, 12rem) 1fr",
                    gap: "1.5rem",
                    padding: "1rem 0",
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  <dt
                    className="label-mono"
                    style={{ fontSize: "0.6rem", color: "var(--cyan)", paddingTop: "0.15rem" }}
                  >
                    {g.label}
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {g.items}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div id="credentials" style={{ scrollMarginTop: "6rem" }}>
            <CitationList
              heading="Licenses &amp; Certificates"
              items={credentials}
              accent="var(--coral)"
            />
          </div>
          <div id="publications" style={{ scrollMarginTop: "6rem" }}>
            <CitationList
              heading="Publications"
              items={publications}
              accent="var(--cyan)"
            />
          </div>
          <CitationList
            heading="Technical Writing"
            items={technicalWriting}
            accent="var(--emerald)"
          />
          {/* Slot: public/images/me/speaking.jpg — the conference shot belongs
              next to the talks rather than in a generic photo strip. */}
          <Photo
            src="/images/me/speaking.jpg"
            alt="Patrick Anderson presenting at a conference"
            className="speaking-photo"
          />
          <CitationList
            heading="Speaking &amp; Presenting"
            items={speaking}
            accent="var(--amber)"
          />
        </div>
      </section>
    </PageTransition>
  );
}
