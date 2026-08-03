#!/usr/bin/env node
/**
 * build-chrono-sankey.mjs
 * ─────────────────────────────────────────────────────────────────────────
 * Generate the ChronoSankey data module from the transcribed reading plan.
 *
 *   node scripts/build-chrono-sankey.mjs
 *
 * Both views come from ONE table. The day view and the era view are two
 * groupings of the same 767 parsed segments, so they cannot disagree — which
 * is the whole reason this was rebuilt. The two exports it replaces were
 * independent extractions: the era file totalled 31,296 (+194, Psalm 421
 * verses too high), the day file 28,110 (−2,992 across 39 books), and only 24
 * of 66 books agreed in both.
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

/* ── canonical book order and genre ──────────────────────────────────── */

const ORDER = Object.keys(BOOK_TOTALS);                 // canonical, Genesis..Revelation
const POSITION = new Map(ORDER.map((b, i) => [b, i + 1]));

/** Seven traditional divisions. The left axis colours by these; they are a
 *  property of the book, not of the plan, so they live here rather than in
 *  the transcription. */
const GENRE_OF = {};
const assign = (genre, books) => books.forEach((b) => (GENRE_OF[b] = genre));
assign("The Law", ORDER.slice(0, 5));
assign("History", ORDER.slice(5, 17));
assign("Wisdom & Poetry", ORDER.slice(17, 22));
assign("Major Prophets", ORDER.slice(22, 27));
assign("Minor Prophets", ORDER.slice(27, 39));
assign("Gospels & Acts", ORDER.slice(39, 44));
assign("Epistles & Revelation", ORDER.slice(44, 66));

/* ── eras ────────────────────────────────────────────────────────────────
   Fourteen chronological eras, defined as day ranges over the same plan.

   These are an editorial grouping, not something the plan states, and they
   are Patrick's fourteen from the original Flourish version. Defining them by
   day range — rather than per passage, as the retired era export did — is
   what makes the era view a strict grouping of the day view. The cost is that
   a day spanning an era boundary lands wholly in one era; the boundaries
   below were placed at days where the subject actually turns, so no day is
   split. Eras 13 and 14 reproduce the original export's book membership
   exactly, which is a useful check that the ranges are sane. */
const ERAS = [
  { name: "Genesis & Patriarchs",        from: 1,   to: 16 },
  { name: "Job",                          from: 17,  to: 29 },
  { name: "Exodus & The Law",             from: 30,  to: 71 },
  { name: "Conquest & Judges",            from: 72,  to: 89 },
  { name: "United Kingdom (Saul & David)",from: 90,  to: 119 },
  { name: "Psalms & Wisdom (Davidic)",    from: 120, to: 139 },
  { name: "Solomon & Wisdom",             from: 140, to: 162 },
  { name: "Divided Kingdom",              from: 163, to: 177 },
  { name: "Prophets to Israel & Judah",   from: 178, to: 197 },
  { name: "Exile",                        from: 198, to: 255 },
  { name: "Return from Exile",            from: 256, to: 285 },
  { name: "Life of Christ",               from: 286, to: 324 },
  { name: "The Early Church & Paul's Letters", from: 325, to: 349 },
  { name: "General Epistles & Revelation",from: 350, to: 365 },
];

const eraOfDay = (d) => {
  const i = ERAS.findIndex((e) => d >= e.from && d <= e.to);
  if (i < 0) throw new Error(`Day ${d} falls in no era`);
  return i;
};

/* ── parse ───────────────────────────────────────────────────────────── */

const lines = readFileSync(resolve(ROOT, "data/chrono-sankey/reading-plan.tsv"), "utf8")
  .split("\n").map((l) => l.replace(/\r$/, ""))
  .filter((l) => l.trim() && !l.startsWith("#"));

/** Every segment, in reading order. The single source both views group. */
const segments = [];
for (const line of lines) {
  const [dayStr, reading] = line.split("\t");
  const day = Number(dayStr);
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
const omittedCount = Object.values(ESV_OMITTED).flat().length;
for (const b of ORDER) {
  const expected = BOOK_TOTALS[b] - (ESV_OMITTED[b]?.length ?? 0);
  const got = seen.get(b).size;
  const missingOmitted = (ESV_OMITTED[b] ?? []).filter((k) => !seen.get(b).has(k)).length;
  if (got + missingOmitted !== BOOK_TOTALS[b])
    throw new Error(`${b}: covers ${got}, expected ${expected}..${BOOK_TOTALS[b]}`);
}

const totalVerses = segments.reduce((a, s) => a + s.verses, 0);
const days = [...new Set(segments.map((s) => s.day))].sort((a, b) => a - b);
if (days.length !== 365) throw new Error(`${days.length} days, expected 365`);

/* ── group ───────────────────────────────────────────────────────────── */

const BOOKS = ORDER.filter((b) => segments.some((s) => s.book === b));
const bookIx = new Map(BOOKS.map((b, i) => [b, i]));

/**
 * Merge repeats of the same (book, target) into one weighted ribbon, keeping
 * how many separate sittings it took. Patrick's own rule from the original:
 * "If there are 10 verses that connect two sections over 5 intervals, they
 * are one ribbon with a weighted value of 10." The alternative is 31,102
 * ribbons and no forest for the trees.
 */
function group(targetOf, targetCount) {
  const merged = new Map();
  for (const s of segments) {
    const t = targetOf(s);
    const key = `${bookIx.get(s.book)}|${t}`;
    const cur = merged.get(key);
    if (cur) { cur[2] += s.verses; cur[3] += 1; }
    else merged.set(key, [bookIx.get(s.book), t, s.verses, 1]);
  }
  const links = [...merged.values()].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const total = links.reduce((a, l) => a + l[2], 0);
  if (total !== totalVerses) throw new Error(`grouping lost verses: ${total} vs ${totalVerses}`);
  void targetCount;
  return links;
}

const eraLinks = group((s) => eraOfDay(s.day), ERAS.length);
const dayLinks = group((s) => s.day - 1, 365);

/* ── report ──────────────────────────────────────────────────────────── */

console.log(`segments ${segments.length}   books ${BOOKS.length}   verses ${totalVerses}`);
console.log(`coverage ${totalVerses}/${GRAND_TOTAL} verse numbers; the ESV omits ${omittedCount}, of which the plan's ranges span all but Mark 11:26`);
console.log(`eras  ${ERAS.length} targets, ${eraLinks.length} ribbons`);
console.log(`days  365 targets, ${dayLinks.length} ribbons`);

/* ── emit ────────────────────────────────────────────────────────────── */

const j = (v) => JSON.stringify(v);
const genres = [...new Set(Object.values(GENRE_OF))];

const out = `/**
 * chronoSankey.ts — GENERATED, do not edit by hand.
 *
 * Source:    data/chrono-sankey/reading-plan.tsv  (build input, not shipped)
 * Generator: scripts/build-chrono-sankey.mjs
 * Regenerate: \`node scripts/build-chrono-sankey.mjs\`
 *
 * Both views are groupings of ONE parsed table of ${segments.length} reading segments, so
 * the era view and the day view cannot disagree. The build refuses to emit
 * unless the plan covers every verse of all 66 books exactly once.
 *
 * Links are [bookIndex, targetIndex, verses, intervals]. Repeats of a pairing
 * merge into one weighted ribbon; \`intervals\` records how many separate
 * sittings it took, so the merge loses nothing.
 *
 * ${totalVerses} is a count of verse *numbers* the plan covers. The ESV omits ${omittedCount}
 * bracketed verses; all but Mark 11:26 fall inside larger ranges, so the true
 * count of verses printed in the ESV is about fifteen lower. Stated rather
 * than rounded away.
 */

export type Genre = ${genres.map(j).join("\n  | ")};
export type Book = { name: string; pos: number; genre: Genre };
/** [bookIndex, targetIndex, verses, intervals] */
export type Link = [number, number, number, number];
export type View = { targets: readonly string[]; links: readonly Link[] };

/** Verse numbers the plan covers, and the canonical total it is checked against. */
export const TOTAL_VERSES = ${totalVerses};
export const REFERENCE_TOTAL = ${GRAND_TOTAL};

export const BOOKS: readonly Book[] = ${j(
  BOOKS.map((b) => ({ name: b, pos: POSITION.get(b), genre: GENRE_OF[b] }))
)};

/** Fourteen chronological eras, as day ranges over the plan. */
export const ERAS: View = {
  targets: ${j(ERAS.map((e) => e.name))},
  links: ${j(eraLinks)},
};

/** The 365 daily readings — the micro view, where the braiding is visible. */
export const DAYS: View = {
  targets: ${j(Array.from({ length: 365 }, (_, i) => `Day ${i + 1}`))},
  links: ${j(dayLinks)},
};

/** Day ranges for each era, so the day view can be banded by era. */
export const ERA_RANGES: readonly { name: string; from: number; to: number }[] =
  ${j(ERAS)};
`;

writeFileSync(OUT, out);
console.log(`\nwrote ${OUT.replace(ROOT + "/", "")} (${(out.length / 1024).toFixed(1)} kB)`);
