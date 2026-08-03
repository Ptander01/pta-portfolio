/**
 * refs.mjs — parse a reading-plan reference string into weighted segments.
 *
 * Input looks like the Daily Reading Index prints it:
 *
 *   "Genesis 10:1–32; 1 Chronicles 1:5–27 | Genesis 11:1–32"
 *   "Deuteronomy 31:30–34:12 | Psalm 90:1–17"
 *   "Genesis 6:9–9:29"
 *
 * Both separators mean "and then": `;` and `|` both simply continue the day's
 * reading. They are kept distinct only because the printed plan uses `|` where
 * the ESV volume breaks to a new interleaved block, which is the granularity
 * the day-level Sankey wants — the alternation is the story.
 *
 * Output is one segment per contiguous range, in reading order:
 *   { book, startCh, startV, endCh, endV, verses }
 *
 * Deliberately strict. Anything it cannot parse throws rather than being
 * skipped, because a silently dropped segment is exactly how the previous
 * extraction lost 2,992 verses without anyone noticing.
 */

import { CHAPTERS } from "./versification.mjs";

/** Book names as the index prints them, longest first so "1 John" is not
 *  matched by "John" and "Song of Solomon" is not matched by "Song". */
const BOOK_NAMES = Object.keys(CHAPTERS).sort((a, b) => b.length - a.length);

/** The index prints "Psalm 90" (singular) and, in places, "Psalms". */
const ALIASES = { "Psalms": "Psalm", "Song of Songs": "Song of Solomon" };

const canonical = (raw) => ALIASES[raw] ?? raw;

/** Verses in [startCh:startV .. endCh:endV] inclusive. */
export function countRange(book, sc, sv, ec, ev) {
  const ch = CHAPTERS[book];
  if (!ch) throw new Error(`Unknown book: ${book}`);
  if (sc < 1 || sc > ch.length) throw new Error(`${book} has no chapter ${sc}`);
  if (ec < 1 || ec > ch.length) throw new Error(`${book} has no chapter ${ec}`);
  if (sv < 1 || sv > ch[sc - 1]) throw new Error(`${book} ${sc} has ${ch[sc - 1]} verses, asked for v${sv}`);
  if (ev < 1 || ev > ch[ec - 1]) throw new Error(`${book} ${ec} has ${ch[ec - 1]} verses, asked for v${ev}`);
  if (ec < sc || (ec === sc && ev < sv)) throw new Error(`${book} ${sc}:${sv}-${ec}:${ev} runs backwards`);
  if (sc === ec) return ev - sv + 1;
  let n = ch[sc - 1] - sv + 1;                       // rest of the first chapter
  for (let c = sc + 1; c < ec; c++) n += ch[c - 1];  // whole chapters between
  return n + ev;                                     // start of the last
}

/** Normalise the dashes the printed index uses, and drop its footnote
 *  markers — day 141 prints "Psalms 72:1-20; ***127:1-5", where the asterisks
 *  flag the Solomon attribution and are not part of the reference. */
const clean = (s) =>
  s
    .replace(/[‐-―−]/g, "-")
    .replace(/\*/g, "")
    /* "[additional reading: John 7:53-8:11]" — the ESV brackets the two
       disputed passages (the pericope adulterae and Mark's longer ending) but
       the plan still schedules them, and they carry verse numbers in the
       versification this build reconciles against. Folding them in as an
       ordinary continuation is what makes the plan cover the Bible exactly
       once; dropping them would open a 23-verse hole in John and a 12-verse
       hole in Mark. */
    .replace(/\[\s*additional reading:\s*/gi, "; ")
    .replace(/\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Parse one day's reading string.
 * @returns {{book:string,startCh:number,startV:number,endCh:number,endV:number,verses:number,block:number}[]}
 */
export function parseReading(input) {
  const text = clean(input);
  const segments = [];
  // `|` delimits interleave blocks; `;` delimits refs inside one block.
  /* Three levels of separator, each inheriting one step more than the last:
       |  a new interleave block
       ;  a new reference; drops the book name when unchanged
            "1 Chronicles 2:5-55; 4:1-23"  -> 1 Chronicles 4:1-23
       ,  a further range in the SAME book and the same chapter
            "1 Chronicles 6:16-30, 54-81"  -> 1 Chronicles 6:54-81
     The comma case is why chapter is carried as well as book. Getting that
     wrong would silently read 1 Chronicles 54, which does not exist — the
     parser throws rather than guessing. */
  let lastBook = null;
  let lastCh = null;
  text.split("|").forEach((blockText, block) => {
    for (const clause of blockText.split(";")) {
      if (!clause.trim()) continue;
      clause.split(",").forEach((piece, ci) => {
        const ref = piece.trim();
        if (!ref) return;
        const seg = parseRef(ref, lastBook, ci > 0 ? lastCh : null);
        lastBook = seg.book;
        lastCh = seg.endCh;
        segments.push({ ...seg, block });
      });
    }
  });
  if (!segments.length) throw new Error(`No references in: ${JSON.stringify(input)}`);
  return segments;
}

function parseRef(ref, lastBook = null, carryCh = null) {
  /* Match the printed name, longest first, then aliases. A bare "4:1-23" has
     no name and inherits `lastBook` — but only when it really is bare, so a
     genuine "1 Chronicles ..." is never mistaken for chapter 1. */
  const named =
    [...BOOK_NAMES, ...Object.keys(ALIASES)]
      .sort((a, b) => b.length - a.length)
      .find((b) => ref.toLowerCase().startsWith(b.toLowerCase())) ?? null;

  let book, rest;
  if (named) {
    book = canonical(named);
    rest = ref.slice(named.length).trim();
  } else if (lastBook && /^\d+[:\-]/.test(ref)) {
    book = lastBook;
    rest = ref;
  } else {
    throw new Error(`No book in reference: ${JSON.stringify(ref)}`);
  }

  /* Comma continuation: a bare verse range stays in the carried chapter.
     Checked before the single-chapter-book rule below, because "54-81" after
     "1 Chronicles 6:16-30" is chapter 6, not a whole-book verse range. */
  if (carryCh !== null && !named) {
    let cm;
    if ((cm = /^(\d+)-(\d+)$/.exec(rest))) {
      const [, sv, ev] = cm.map(Number);
      return finish(book, carryCh, sv, carryCh, ev);
    }
    if ((cm = /^(\d+)$/.exec(rest))) {
      const v = Number(cm[1]);
      return finish(book, carryCh, v, carryCh, v);
    }
  }

  let m;
  // Genesis 6:9-9:29   (chapter:verse - chapter:verse), verses may carry a
  // split-verse letter: "Luke 3:23b-38", "Luke 3:1-23a".
  if ((m = /^(\d+):(\d+)([ab]?)-(\d+):(\d+)([ab]?)$/.exec(rest))) {
    const [sc, sv, sl, ec, ev, el] = m.slice(1);
    return finish(book, +sc, startV(+sv, sl), +ec, +ev, el, sl);
  }
  // Genesis 10:1-32    (chapter:verse - verse, same chapter)
  if ((m = /^(\d+):(\d+)([ab]?)-(\d+)([ab]?)$/.exec(rest))) {
    const [sc, sv, sl, ev, el] = m.slice(1);
    return finish(book, +sc, startV(+sv, sl), +sc, +ev, el, sl);
  }
  // Obadiah 1-21 / Jude 1-25  (single-chapter book, verse range only)
  if ((m = /^(\d+)-(\d+)$/.exec(rest)) && CHAPTERS[book].length === 1) {
    const [, sv, ev] = m.map(Number);
    return finish(book, 1, sv, 1, ev);
  }
  // Genesis 5:32       (single verse)
  if ((m = /^(\d+):(\d+)$/.exec(rest))) {
    const [, sc, sv] = m.map(Number);
    return finish(book, sc, sv, sc, sv);
  }
  // Philemon 25 (single-chapter book, single verse)
  if ((m = /^(\d+)$/.exec(rest)) && CHAPTERS[book].length === 1) {
    const v = Number(m[1]);
    return finish(book, 1, v, 1, v);
  }
  throw new Error(`Unparseable reference: ${JSON.stringify(ref)} (book=${book}, rest=${JSON.stringify(rest)})`);
}

/**
 * A verse split across two readings — "Luke 3:1-23a" on day 289 and
 * "Luke 3:23b-38" on day 286 — is one verse, and it has to land in exactly
 * one of them or the coverage check reports either an overlap or a gap.
 *
 * The rule is to give it to whichever reading holds the FIRST half: an `a`
 * end stays inclusive, and a `b` start begins at the next verse. That is
 * deterministic and independent of which day comes first in the plan, where
 * "assign it to the earlier reading" would not be — here the `b` half is read
 * three days before the `a` half.
 *
 * It moves at most a handful of verses out of 31,102, and the alternative —
 * fractional verses — would make every node height a decimal for no gain.
 */
const startV = (v, letter) => (letter === "b" ? v + 1 : v);

const finish = (book, sc, sv, ec, ev, endLetter = "", startLetter = "") => ({
  book, startCh: sc, startV: sv, endCh: ec, endV: ev,
  split: Boolean(endLetter || startLetter),
  verses: countRange(book, sc, sv, ec, ev),
});
