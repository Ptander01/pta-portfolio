/**
 * build-sitemap.mjs — GENERATES public/sitemap.xml and public/robots.txt.
 * ─────────────────────────────────────────────────────────────
 * Run by `pnpm build`, so the sitemap cannot go stale the way a hand-written
 * one does the first time a piece is added. Ids and case-study slugs are read
 * out of src/lib/projects.ts rather than duplicated here, for the same reason
 * accent is derived from domain: two lists of the same thing drift.
 *
 * BASE is the fourth place the .vercel.app host is hardcoded (index.html has
 * og:url, og:image and twitter:image). All of them have to change together on
 * a custom domain — grep the host, do not trust this comment to be complete.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://pta-portfolio.vercel.app";

const src = fs.readFileSync(path.join(ROOT, "src/lib/projects.ts"), "utf8");
const ids = [...src.matchAll(/^\s{4}id: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
const slugs = [...new Set([...src.matchAll(/caseStudy: "([a-z0-9-]+)"/g)].map((m) => m[1]))];

if (!ids.length) {
  console.error("build-sitemap: found no project ids — refusing to emit a sitemap that omits every piece.");
  process.exit(1);
}

/* Static routes only. /work and /journey are redirects and /404 is an error
   page; listing either would ask a crawler to index a non-destination. */
const staticRoutes = ["/", "/projects", "/about", "/resume", "/contact"];

const urls = [
  ...staticRoutes.map((u) => ({ loc: u, priority: u === "/" ? "1.0" : "0.8" })),
  ...ids.map((id) => ({ loc: `/projects/${id}`, priority: "0.6" })),
  ...slugs.map((s) => ({ loc: `/work/${s}`, priority: "0.6" })),
];

const today = new Date().toISOString().slice(0, 10);
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n    <loc>${BASE}${u.loc}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;

fs.writeFileSync(path.join(ROOT, "public/sitemap.xml"), xml);

fs.writeFileSync(
  path.join(ROOT, "public/robots.txt"),
  `# ${BASE}\nUser-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`,
);

console.log(`build-sitemap: ${urls.length} urls (${ids.length} pieces, ${slugs.length} case studies)`);
