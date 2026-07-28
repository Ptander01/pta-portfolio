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
import { useEffect, useState } from "react";

const PDF_HREF = "/resume/Patrick-Anderson-Resume.pdf";

/** Newest first — `entries` is authored oldest-first for the timeline axis. */
const history = [...entries].reverse();

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
          <FadeIn duration={0.6}>
            <span
              className="label-mono inline-block mb-4"
              style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
            >
              Resume
            </span>
            <h1 className="heading-xl" style={{ marginBottom: "1rem" }}>
              Patrick J Anderson
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
              Experience &amp; Education
            </h2>
          </FadeIn>

          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {history.map((e) => (
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
    </PageTransition>
  );
}
