#!/usr/bin/env node
/**
 * build-chrono-sankey.mjs
 * ─────────────────────────────────────────────────────────────────────────
 * Generate the ChronoSankey data module from the transcribed reading plan.
 *
 *   node scripts/build-chrono-sankey.mjs
 *
 * Emits ONE atomic table — every (book, chapter, day) pairing, 1,397 rows —
 * rather than a pre-aggregated view per resolution. Every zoom level is a
 * grouping of that table computed in the browser, so the views cannot
 * disagree with each other, and adding a resolution later is a change to the
 * component rather than to the data.
 *
 * That mattered here: the two exports this replaces were independent
 * extractions of the same plan. The era file totalled 31,296 (+194, Psalm 421
 * too high), the day file 28,110 (−2,992 across 39 books), and only 24 of 66
 * books reconciled in both. One table cannot drift from itself.
 *
 * The build refuses to emit unless the plan covers the Bible exactly once.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { CHAPTERS, BOOK_TOTALS, GRAND_TOTAL, ESV_OMITTED, verify } from "./lib/versification.mjs";
import { parseReading } from "./lib/refs.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/lib/data/chronoSankey.ts");

verify();

/* ── the left axis: canonical order, and its two coarser groupings ───── */

const ORDER = Object.keys(BOOK_TOTALS);
const DIVISIONS = [
  { name: "The Law", books: ORDER.slice(0, 5) },
  { name: "History", books: ORDER.slice(5, 17) },
  { name: "Wisdom & Poetry", books: ORDER.slice(17, 22) },
  { name: "Major Prophets", books: ORDER.slice(22, 27) },
  { name: "Minor Prophets", books: ORDER.slice(27, 39) },
  { name: "Gospels & Acts", books: ORDER.slice(39, 44) },
  { name: "Epistles & Revelation", books: ORDER.slice(44, 66) },
];
const DIVISION_OF = new Map();
DIVISIONS.forEach((d, i) => d.books.forEach((b) => DIVISION_OF.set(b, i)));

/* ── the right axis: fourteen eras as day ranges ──────────────────────────
   An editorial grouping, not something the plan states — Patrick's fourteen
   from the original Flourish version. Defined as day ranges so the era view
   is a strict grouping of the day view; the retired era export assigned them
   per passage instead, which is how Psalm 90 ended up filed under Conquest &
   Judges there. Boundaries sit where the subject turns, so no day is split.
   Eras 13 and 14 reproduce the old export's book membership exactly. */
const ERAS = [
  { name: "Genesis & Patriarchs",              from: 1,   to: 16 },
  { name: "Job",                               from: 17,  to: 29 },
  { name: "Exodus & The Law",                  from: 30,  to: 71 },
  { name: "Conquest & Judges",                 from: 72,  to: 89 },
  { name: "United Kingdom (Saul & David)",     from: 90,  to: 119 },
  { name: "Psalms & Wisdom (Davidic)",         from: 120, to: 139 },
  { name: "Solomon & Wisdom",                  from: 140, to: 162 },
  { name: "Divided Kingdom",                   from: 163, to: 177 },
  { name: "Prophets to Israel & Judah",        from: 178, to: 197 },
  { name: "Exile",                             from: 198, to: 255 },
  { name: "Return from Exile",                 from: 256, to: 285 },
  { name: "Life of Christ",                    from: 286, to: 324 },
  { name: "The Early Church & Paul's Letters", from: 325, to: 349 },
  { name: "General Epistles & Revelation",     from: 350, to: 365 },
];

/* ── parse ───────────────────────────────────────────────────────────── */

const lines = readFileSync(resolve(ROOT, "data/chrono-sankey/reading-plan.tsv"), "utf8")
  .split("\n").map((l) => l.replace(/\r$/, ""))
  .filter((l) => l.trim() && !l.startsWith("#"));

const segments = [];
for (const line of lines) {
  const [dayStr, reading] = line.split("\t");
  const day = Number(dayStr);
  if (!Number.isFinite(day)) throw new Error(`bad day in: ${line}`);
  for (const s of parseReading(reading)) segments.push({ day, ...s });
}

/* ── coverage gate ───────────────────────────────────────────────────── */

const seen = new Map(ORDER.map((b) => [b, new Set()]));
for (const s of segments) {
  const ch = CHAPTERS[s.book];
  for (let c = s.startCh; c <= s.endCh; c++) {
    const from = c === s.startCh ? s.startV : 1;
    const to = c === s.endCh ? s.endV : ch[c - 1];
    for (let v = from; v <= to; v++) {
      const key = `${c}:${v}`;
      if (seen.get(s.book).has(key)) throw new Error(`${s.book} ${key} read twice (day ${s.day})`);
      seen.get(s.book).add(key);
    }
  }
}
for (const b of ORDER) {
  const omitted = new Set(ESV_OMITTED[b] ?? []);
  const ch = CHAPTERS[b];
  for (let c = 1; c <= ch.length; c++)
    for (let v = 1; v <= ch[c - 1]; v++) {
      const key = `${c}:${v}`;
      if (!seen.get(b).has(key) && !omitted.has(key))
        throw new Error(`${b} ${key} is never read — plan does not cover the Bible`);
    }
}
const dayCount = new Set(segments.map((s) => s.day)).size;
if (dayCount !== 365) throw new Error(`${dayCount} days, expected 365`);

/* ── atoms ───────────────────────────────────────────────────────────────
   Split every reading at chapter boundaries, so the finest node the left
   axis can offer — a chapter — is expressible, and every coarser level is a
   sum over these. Verse-level *nodes* are deliberately not emitted: 31,102
   of them would be sub-pixel at any plausible height, and the ribbons are
   already weighted by verse, so the precision is present without pretending
   each verse can be a distinct mark. */
const atoms = [];   // [bookIndex, chapter, day, verses]
for (const s of segments) {
  const ch = CHAPTERS[s.book];
  const bi = ORDER.indexOf(s.book);
  for (let c = s.startCh; c <= s.endCh; c++) {
    const from = c === s.startCh ? s.startV : 1;
    const to = c === s.endCh ? s.endV : ch[c - 1];
    atoms.push([bi, c, s.day, to - from + 1]);
  }
}
atoms.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);

const totalVerses = atoms.reduce((a, x) => a + x[3], 0);
const segTotal = segments.reduce((a, s) => a + s.verses, 0);
if (totalVerses !== segTotal) throw new Error(`atoms lost verses: ${totalVerses} vs ${segTotal}`);

/* ── report ──────────────────────────────────────────────────────────── */

const omittedCount = Object.values(ESV_OMITTED).flat().length;
const chaptersTouched = new Set(atoms.map((a) => `${a[0]}:${a[1]}`)).size;
const ribbons = (l, r) => new Set(atoms.map((a) => `${l(a)}|${r(a)}`)).size;
const eraOf = (a) => ERAS.findIndex((e) => a[2] >= e.from && a[2] <= e.to);

console.log(`readings ${segments.length}   atoms ${atoms.length}   verses ${totalVerses}`);
console.log(`chapters touched ${chaptersTouched}/1189   days ${dayCount}`);
console.log(`ESV omits ${omittedCount} verse numbers; the plan's ranges span all but Mark 11:26\n`);
console.log("ribbons per resolution pair:");
for (const [ln, lf] of [["division", (a) => DIVISION_OF.get(ORDER[a[0]])], ["book", (a) => a[0]], ["chapter", (a) => `${a[0]}:${a[1]}`]])
  for (const [rn, rf] of [["era", eraOf], ["day", (a) => a[2]]])
    console.log(`  ${ln.padEnd(8)} x ${rn.padEnd(4)} -> ${String(ribbons(lf, rf)).padStart(5)}`);

/* ── emit ────────────────────────────────────────────────────────────── */

const j = (v) => JSON.stringify(v);
const out = `/**
 * chronoSankey.ts — GENERATED, do not edit by hand.
 *
 * Source:     data/chrono-sankey/reading-plan.tsv
 * Generator:  scripts/build-chrono-sankey.mjs
 * Regenerate: \`node scripts/build-chrono-sankey.mjs\`
 *
 * ONE atomic table. \`ATOMS\` holds every (book, chapter, day) pairing in the
 * ESV Chronological Bible's 365-day plan; every zoom level the component
 * offers is a grouping of it, computed in the browser. Two views of one table
 * cannot disagree — which is the point, because the two exports this replaces
 * were separate extractions of the same plan and agreed on only 24 of 66
 * books.
 *
 * The build refuses to emit unless the plan covers every verse of all 66
 * books exactly once, with no gaps and no overlaps.
 *
 * ${totalVerses} counts verse *numbers*. The ESV omits ${omittedCount} bracketed verses; all but
 * Mark 11:26 fall inside larger ranges, so the count of verses actually
 * printed is about fifteen lower. Stated rather than rounded away.
 */

export type Division = ${DIVISIONS.map((d) => j(d.name)).join("\n  | ")};

export type Book = {
  name: string;
  /** Canonical position, 1 (Genesis) to 66 (Revelation). */
  pos: number;
  /** Index into DIVISIONS. */
  division: number;
  /** Verses per chapter, so a chapter node knows its own height. */
  chapters: readonly number[];
};

export type Era = { name: string; from: number; to: number };

/**
 * [bookIndex, chapter, day, verses] — one row per (book, chapter, day).
 * Sorted by book, then chapter, then day.
 */
export type Atom = readonly [number, number, number, number];

export const TOTAL_VERSES = ${totalVerses};
export const REFERENCE_TOTAL = ${GRAND_TOTAL};
export const TOTAL_READINGS = ${segments.length};

export const DIVISIONS: readonly { name: Division; from: number; to: number }[] = ${j(
  DIVISIONS.map((d) => ({
    name: d.name,
    from: ORDER.indexOf(d.books[0]) + 1,
    to: ORDER.indexOf(d.books[d.books.length - 1]) + 1,
  }))
)};

export const BOOKS: readonly Book[] = ${j(
  ORDER.map((b, i) => ({
    name: b,
    pos: i + 1,
    division: DIVISION_OF.get(b),
    chapters: CHAPTERS[b],
  }))
)};

/** Fourteen chronological eras, as day ranges over the plan. */
export const ERAS: readonly Era[] = ${j(ERAS)};

export const ATOMS: readonly Atom[] = ${j(atoms)};
`;

writeFileSync(OUT, out);
console.log(`\nwrote ${OUT.replace(ROOT + "/", "")} (${(out.length / 1024).toFixed(1)} kB)`);
