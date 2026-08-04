/**
 * chronoSankeyLayout.ts — a fixed two-column Sankey, laid out by hand.
 * ─────────────────────────────────────────────────────────────────────────
 * Deliberately not d3-sankey. That library's job is reordering nodes to
 * MINIMISE link crossings, and on this diagram the crossings are the whole
 * message: a ribbon's slope is the ESV's deviation from canonical order. Both
 * axes have a fixed, meaningful order — canonical on the left, chronological
 * on the right — so there is nothing for a solver to solve, and left to
 * itself it would flatten the one signal the piece exists to show.
 *
 * What remains is arithmetic: stack the nodes, slice each node's height among
 * its ribbons, and draw a band between the two slices.
 *
 * Everything is computed from ATOMS — one row per (book, chapter, day) — so
 * every resolution pair is a grouping of the same table and no two views can
 * disagree.
 */

import {
  ATOMS, BOOKS, DIVISIONS, ERAS,
  type Atom,
} from "@/lib/data/chronoSankey";

export type LeftRes = "division" | "book" | "chapter";
export type RightRes = "era" | "day";

export type Node = {
  key: string;
  label: string;
  /** Short label for tight resolutions, e.g. "Gen" or "12". */
  short: string;
  value: number;
  y0: number;
  y1: number;
  /** Index into DIVISIONS — drives colour on both sides. */
  division: number;
  /** For right-hand nodes: the era they fall in. */
  era: number;
};

export type Ribbon = {
  key: string;
  source: number;
  target: number;
  value: number;
  division: number;
  /** Absolute vertical displacement, in pixels, of the ribbon's midline.
   *  This is the "deviation" the piece is about. */
  slope: number;
  path: string;
  /** Just the leading (upper) curve, open — the specular highlight is stroked
   *  along this. Kept separate because a stroke on the closed `path` would
   *  outline the whole band, including the underside, and kill the extruded
   *  read: light comes from one key light, so only the top edge catches it. */
  topPath: string;
  /** Ribbon thickness, in px. Drives whether the glass treatment is worth
   *  drawing at all — see the note in ChronoSankey.tsx. */
  thickness: number;
};

export type Layout = {
  left: Node[];
  right: Node[];
  ribbons: Ribbon[];
  height: number;
  total: number;
};

export type LayoutOptions = {
  leftRes: LeftRes;
  rightRes: RightRes;
  /** Drawing height available for the columns, in px. */
  height: number;
  /** Horizontal distance between the two columns. */
  span: number;
  /** Gap between stacked nodes, in px. Shrinks automatically when a
   *  resolution has more nodes than the height can afford. */
  gap?: number;
};

/* ── grouping keys ───────────────────────────────────────────────────── */

const eraOfDay = (day: number) =>
  ERAS.findIndex((e) => day >= e.from && day <= e.to);

/** Left-hand group index for an atom, at the requested resolution. */
function leftIndex(a: Atom, res: LeftRes): number {
  const [bookIx, chapter] = a;
  if (res === "division") return BOOKS[bookIx].division;
  if (res === "book") return bookIx;
  /* Chapter: a stable global ordinal, books in canonical order and chapters
     within them. Computed rather than stored — 1,189 entries would be dead
     weight in the payload for something this cheap to derive. */
  let n = 0;
  for (let i = 0; i < bookIx; i++) n += BOOKS[i].chapters.length;
  return n + chapter - 1;
}

const rightIndex = (a: Atom, res: RightRes) =>
  res === "era" ? eraOfDay(a[2]) : a[2] - 1;

/* Chapter ordinals are hot — leftIndex runs once per atom per relayout, and
   the loop above is O(books). Precompute the offsets once. */
const CHAPTER_OFFSET: number[] = [];
{
  let n = 0;
  for (const b of BOOKS) { CHAPTER_OFFSET.push(n); n += b.chapters.length; }
}
const chapterOrdinal = (bookIx: number, chapter: number) =>
  CHAPTER_OFFSET[bookIx] + chapter - 1;

/* ── node descriptors ────────────────────────────────────────────────── */

function leftNodes(res: LeftRes) {
  if (res === "division")
    return DIVISIONS.map((d) => ({ label: d.name, short: d.name, division: DIVISIONS.indexOf(d) }));
  if (res === "book")
    return BOOKS.map((b) => ({ label: b.name, short: abbreviate(b.name), division: b.division }));
  const out: { label: string; short: string; division: number }[] = [];
  BOOKS.forEach((b) => {
    b.chapters.forEach((_, i) =>
      out.push({ label: `${b.name} ${i + 1}`, short: String(i + 1), division: b.division })
    );
  });
  return out;
}

function rightNodes(res: RightRes) {
  if (res === "era")
    return ERAS.map((e, i) => ({ label: e.name, short: e.name, era: i }));
  return Array.from({ length: 365 }, (_, i) => ({
    label: `Day ${i + 1}`,
    short: String(i + 1),
    era: eraOfDay(i + 1),
  }));
}

/** "1 Chronicles" -> "1 Chr", "Genesis" -> "Gen". Used where a full name
 *  cannot fit; never used as the accessible name. */
function abbreviate(name: string) {
  const m = /^(\d)\s+(.*)$/.exec(name);
  if (m) return `${m[1]} ${m[2].slice(0, 3)}`;
  return name.length <= 5 ? name : name.slice(0, 3);
}

/* ── layout ──────────────────────────────────────────────────────────── */

export function layout(opts: LayoutOptions): Layout {
  const { leftRes, rightRes, height, span } = opts;

  const lDesc = leftNodes(leftRes);
  const rDesc = rightNodes(rightRes);

  /* Aggregate atoms into the requested cells. */
  const cells = new Map<number, number>();   // (l * rCount + r) -> verses
  const lTotal = new Array(lDesc.length).fill(0);
  const rTotal = new Array(rDesc.length).fill(0);
  const rCount = rDesc.length;

  for (const a of ATOMS) {
    const l =
      leftRes === "division" ? BOOKS[a[0]].division
      : leftRes === "book" ? a[0]
      : chapterOrdinal(a[0], a[1]);
    const r = rightIndex(a, rightRes);
    const k = l * rCount + r;
    cells.set(k, (cells.get(k) ?? 0) + a[3]);
    lTotal[l] += a[3];
    rTotal[r] += a[3];
  }

  const total = lTotal.reduce((x, y) => x + y, 0);

  /* Gaps have to fit. At chapter resolution 1,189 nodes at even 1px of gap
     would consume more height than exists, so the gap is whatever is left
     after the bars, capped at the requested value and never negative. */
  const want = opts.gap ?? 2;
  const fit = (n: number) => Math.max(0, Math.min(want, (height * 0.35) / Math.max(1, n - 1)));
  const lGap = fit(lDesc.length);
  const rGap = fit(rDesc.length);

  /* ONE verse-to-pixel scale for both columns.
     The obvious thing is to scale each column so it fills the height, which
     is what a generic Sankey does. It is wrong here: the columns hold wildly
     different node counts, so they lose different amounts of height to gaps
     — 65 gaps on the left against 13 on the right at book × era — and a verse
     ends up worth 21% fewer pixels on one side than the other. Every ribbon
     then tapers along its length, which reads as a drawing error and quietly
     contradicts the one thing the caption promises: that thickness is verse
     count. Scaling both columns off whichever loses most to gaps keeps a
     verse the same size everywhere; the sparser column just ends short of the
     bottom and is centred. */
  const gapTotalL = lGap * Math.max(0, lDesc.length - 1);
  const gapTotalR = rGap * Math.max(0, rDesc.length - 1);
  const usable = height - Math.max(gapTotalL, gapTotalR);
  const scale = usable / total;

  const build = (
    desc: { label: string; short: string; division?: number; era?: number }[],
    totals: number[],
    gap: number
  ): Node[] => {
    const extent = usable + gap * Math.max(0, desc.length - 1);
    let y = (height - extent) / 2;
    return desc.map((d, i) => {
      const value = totals[i];
      const h = value * scale;
      const node: Node = {
        key: `${i}`,
        label: d.label,
        short: d.short,
        value,
        y0: y,
        y1: y + h,
        division: d.division ?? -1,
        era: d.era ?? -1,
      };
      y += h + gap;
      return node;
    });
  };

  const left = build(lDesc, lTotal, lGap);
  const right = build(rDesc, rTotal, rGap);

  /* Slice each node's height among its ribbons. Left slices are ordered by
     target so a node's ribbons leave it top-to-bottom in chronological order;
     right slices by source, likewise in canonical order. That ordering is
     what stops ribbons crossing each other *within* a node — the crossings
     that remain are the real ones, between nodes. */
  const lCursor = left.map((n) => n.y0);
  const rCursor = right.map((n) => n.y0);

  const entries: { l: number; r: number; v: number }[] = [];
  /* forEach rather than for-of: the tsconfig target predates downlevel Map
     iteration, and this is not worth changing a compiler flag over. */
  cells.forEach((v, k) => entries.push({ l: Math.floor(k / rCount), r: k % rCount, v }));
  entries.sort((a, b) => a.l - b.l || a.r - b.r);

  const ribbons: Ribbon[] = entries.map(({ l, r, v }) => {
    /* One scale, so a ribbon is a constant-width band end to end. */
    const lh = v * scale;
    const rh = v * scale;
    const y0a = lCursor[l]; lCursor[l] += lh;
    const y0b = y0a + lh;
    const y1a = rCursor[r]; rCursor[r] += rh;
    const y1b = y1a + rh;

    const x0 = 0, x1 = span, xm = span / 2;
    const top = `M${x0},${y0a}C${xm},${y0a} ${xm},${y1a} ${x1},${y1a}`;
    const path =
      top +
      `L${x1},${y1b}` +
      `C${xm},${y1b} ${xm},${y0b} ${x0},${y0b}Z`;

    return {
      key: `${l}-${r}`,
      source: l,
      target: r,
      value: v,
      division: left[l].division,
      slope: Math.abs((y1a + y1b) / 2 - (y0a + y0b) / 2),
      thickness: lh,
      path,
      topPath: top,
    };
  });

  /* Ordered thin-to-thick so a hairline ribbon is never buried under a slab.
     Sorting here rather than at paint time keeps the DOM order stable across
     re-renders, which matters for React reconciliation at 1,339 elements. */
  ribbons.sort((a, b) => b.thickness - a.thickness);

  return { left, right, ribbons, height, total };
}

/** Verses -> "1,533". Used in every readout. */
export const fmt = (n: number) => n.toLocaleString("en-US");
