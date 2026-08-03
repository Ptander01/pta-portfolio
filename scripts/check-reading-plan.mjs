#!/usr/bin/env node
/**
 * check-reading-plan.mjs — does the transcribed plan cover the Bible exactly?
 *
 *   node scripts/check-reading-plan.mjs [--partial]
 *
 * The ESV Chronological Bible rearranges all 66 books into 365 readings, so
 * every verse should appear exactly once. That single property turns a
 * hand-transcription into a self-correcting one: a mis-read chapter or verse
 * shows up as a gap or an overlap, and the report names the book and the
 * chapter, so the fix is a re-read of one line rather than a re-read of the
 * page.
 *
 * `--partial` allows books to be incompletely covered — for checking a
 * transcription that is still in progress. Overlaps and out-of-range
 * references are still errors under `--partial`; only "not finished yet" is
 * tolerated.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { CHAPTERS, BOOK_TOTALS, GRAND_TOTAL, ESV_OMITTED, verify } from "./lib/versification.mjs";
import { parseReading } from "./lib/refs.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PARTIAL = process.argv.includes("--partial");

verify();   // the lookup table itself must reconcile before anything else

const lines = readFileSync(resolve(ROOT, "data/chrono-sankey/reading-plan.tsv"), "utf8")
  .split("\n")
  .map((l) => l.replace(/\r$/, ""))
  .filter((l) => l.trim() && !l.startsWith("#"));

/** book -> Set of "ch:v" already read, so a second reading is detectable. */
const seen = new Map(Object.keys(CHAPTERS).map((b) => [b, new Set()]));
const overlaps = [];
const parseErrors = [];
const days = [];

for (const line of lines) {
  const [dayStr, reading] = line.split("\t");
  const day = Number(dayStr);
  if (!Number.isFinite(day) || !reading) {
    parseErrors.push(`malformed line: ${JSON.stringify(line)}`);
    continue;
  }
  let segs;
  try { segs = parseReading(reading); }
  catch (e) { parseErrors.push(`day ${day}: ${e.message}`); continue; }

  for (const s of segs) {
    const ch = CHAPTERS[s.book];
    for (let c = s.startCh; c <= s.endCh; c++) {
      const from = c === s.startCh ? s.startV : 1;
      const to = c === s.endCh ? s.endV : ch[c - 1];
      for (let v = from; v <= to; v++) {
        const key = `${c}:${v}`;
        if (seen.get(s.book).has(key)) overlaps.push(`day ${day}: ${s.book} ${key} read twice`);
        seen.get(s.book).add(key);
      }
    }
  }
  days.push({ day, segs, verses: segs.reduce((a, s) => a + s.verses, 0) });
}

/* ── report ──────────────────────────────────────────────────────────── */

const dayNums = days.map((d) => d.day);
const expectedDays = PARTIAL ? Math.max(...dayNums) : 365;
const missingDays = [];
for (let d = 1; d <= expectedDays; d++) if (!dayNums.includes(d)) missingDays.push(d);
const dupDays = dayNums.filter((d, i) => dayNums.indexOf(d) !== i);

const totalRead = [...seen.values()].reduce((a, s) => a + s.size, 0);
const totalSegs = days.reduce((a, d) => a + d.segs.length, 0);

console.log(`\ndays ${days.length}   segments ${totalSegs}   distinct verses ${totalRead}`);
console.log(`reference ${GRAND_TOTAL}   delta ${totalRead - GRAND_TOTAL >= 0 ? "+" : ""}${totalRead - GRAND_TOTAL}`);

const gaps = [];
for (const [book, total] of Object.entries(BOOK_TOTALS)) {
  const got = seen.get(book).size;
  if (got === total) continue;
  if (got === 0) { if (!PARTIAL) gaps.push(`${book}: not read at all`); continue; }
  /* Name the specific missing verses, collapsed into ranges — that is what
     makes the fix a one-line re-read rather than a page re-read. */
  const ch = CHAPTERS[book];
  /* A verse the ESV does not print cannot be scheduled, so it is not a gap. */
  const omitted = new Set(ESV_OMITTED[book] ?? []);
  const missing = [];
  for (let c = 1; c <= ch.length; c++)
    for (let v = 1; v <= ch[c - 1]; v++)
      if (!seen.get(book).has(`${c}:${v}`) && !omitted.has(`${c}:${v}`)) missing.push([c, v]);
  if (!missing.length) continue;
  const ranges = [];
  for (const [c, v] of missing) {
    const last = ranges[ranges.length - 1];
    if (last && last.c === c && last.to === v - 1) last.to = v;
    else ranges.push({ c, from: v, to: v });
  }
  const label = ranges.map((r) => `${r.c}:${r.from}${r.to > r.from ? `-${r.to}` : ""}`).join(", ");
  gaps.push(`${book}: ${got}/${total}, missing ${ranges.length > 8 ? `${missing.length} verses in ${ranges.length} ranges, first: ` : ""}${ranges.slice(0, 8).map((r) => `${r.c}:${r.from}${r.to > r.from ? `-${r.to}` : ""}`).join(", ")}${ranges.length > 8 ? " …" : ""}`);
  void label;
}

const complete = Object.keys(BOOK_TOTALS).filter((b) => seen.get(b).size === BOOK_TOTALS[b]);
console.log(`books fully covered: ${complete.length}/66`);

let bad = false;
const section = (title, items) => {
  if (!items.length) return;
  bad = true;
  console.log(`\n  ${title} (${items.length}):`);
  for (const i of items.slice(0, 25)) console.log(`    ${i}`);
  if (items.length > 25) console.log(`    … and ${items.length - 25} more`);
};

section("PARSE ERRORS", parseErrors);
section("OVERLAPS — a verse read twice", overlaps);
section("DUPLICATE DAY NUMBERS", dupDays.map(String));
section("MISSING DAY NUMBERS", missingDays.map(String));
if (!PARTIAL) section("GAPS — verses never read", gaps);
else if (gaps.length) {
  console.log(`\n  in progress: ${gaps.length} book(s) partially covered (expected while transcribing)`);
  for (const g of gaps.slice(0, 6)) console.log(`    ${g}`);
  if (gaps.length > 6) console.log(`    … and ${gaps.length - 6} more`);
}

console.log(`\n  ${bad ? "PROBLEMS FOUND" : PARTIAL ? "no errors in what is transcribed so far" : "PLAN COVERS THE BIBLE EXACTLY ONCE"}\n`);
process.exit(bad ? 1 : 0);
