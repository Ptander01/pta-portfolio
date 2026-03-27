/**
 * Footer — Minimal monolithic footer
 * Design: "Forged Monolith" — understated, monospace labels
 */
export default function Footer() {
  return (
    <footer
      className="border-t py-12"
      style={{
        borderColor: "rgba(255, 255, 255, 0.06)",
        background: "var(--page-bg)",
      }}
    >
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="font-display text-sm font-bold"
            style={{ color: "#ffffff" }}
          >
            PTA
          </span>
          <span
            className="label-mono"
            style={{ color: "var(--glass-text-muted)", fontSize: "0.6rem" }}
          >
            GEOSPATIAL INTELLIGENCE
          </span>
        </div>
        <span
          className="label-mono"
          style={{ color: "var(--glass-text-muted)", fontSize: "0.6rem" }}
        >
          &copy; {new Date().getFullYear()} &mdash; ALL RIGHTS RESERVED
        </span>
      </div>
    </footer>
  );
}
