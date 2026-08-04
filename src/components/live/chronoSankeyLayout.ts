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
  /** The trailing (lower) curve, open. Carries the rim light — in the glass
   *  references the strongest single cue is colour bleeding out along the
   *  bottom edge, brighter and more saturated than the body. */
  bottomPath: string;
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
  /** Per right-hand node: the share of its verses coming from each division,
   *  in canonical division order, as cumulative fractions 0..1. An era is a
   *  MIXTURE — that is the whole reason the two orders differ — so a single
   *  flat colour would be a claim the data does not support. These drive a
   *  hard-stop gradient that stacks the node in the same order its ribbons
   *  arrive, making each node a legend for its own composition. */
  rightStacks: { division: number; from: number; to: number }[][];
  /** The division contributing most verses to each right node — the honest
   *  fallback when a node is too short to show a stack. */
  rightDominant: number[];
};

export type LayoutOptions = {
  leftRes: LeftRes;
  rightRes: RightRes;
  /** Drawing height available for the columns, in px. */
  height: number;
  /** Horizontal distance between the two columns. */
  span: number;
  /** Optional scope. Either or both may be set; they intersect. */
  scopeDivision?: number | null;
  scopeEra?: number | null;
};

/**
 * How much air a column of `n` nodes should get between its bars.
 *
 * Fewer, larger nodes earn more separation — that is what makes them read as
 * distinct slabs rather than a striped column, and it is the quality the
 * reference render gets from having only a handful of categories. Dense
 * columns get almost none, because at 1,189 nodes any real gap would eat the
 * bars it was meant to separate.
 *
 * Exported so the caller can size the drawing to afford the gap it asks for
 * rather than discovering after the fact that it does not fit.
 */
export function gapFor(n: number): number {
  if (n <= 8) return 16;
  if (n <= 20) return 11;
  if (n <= 80) return 5;
  if (n <= 400) return 1.4;
  return 0.6;
}

/** Height at which a column of `n` nodes can pay for `gapFor(n)` without the
 *  gaps taking more than 40% of the drawing. */
export const heightForGaps = (n: number) => (gapFor(n) * Math.max(1, n - 1)) / 0.4;

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
  const scopeDivision = opts.scopeDivision ?? null;
  const scopeEra = opts.scopeEra ?? null;

  const lDesc0 = leftNodes(leftRes);
  const rDesc0 = rightNodes(rightRes);

  /* Aggregate atoms into the requested cells, honouring the scope.
     Filtering here rather than after layout matters: a scoped view rescales
     to its own total, so one era fills the height instead of being drawn as
     the 6% sliver it is of the whole Bible. */
  const cells0 = new Map<number, number>();   // (l * rCount0 + r) -> verses
  const lTotal0 = new Array(lDesc0.length).fill(0);
  const rTotal0 = new Array(rDesc0.length).fill(0);
  const rCount0 = rDesc0.length;

  for (const a of ATOMS) {
    if (scopeDivision !== null && BOOKS[a[0]].division !== scopeDivision) continue;
    if (scopeEra !== null && eraOfDay(a[2]) !== scopeEra) continue;
    const l =
      leftRes === "division" ? BOOKS[a[0]].division
      : leftRes === "book" ? a[0]
      : chapterOrdinal(a[0], a[1]);
    const r = rightIndex(a, rightRes);
    const k = l * rCount0 + r;
    cells0.set(k, (cells0.get(k) ?? 0) + a[3]);
    lTotal0[l] += a[3];
    rTotal0[r] += a[3];
  }

  /* Drop nodes the scope emptied, and reindex. Without this, scoping to one
     era would still draw 1,189 chapter bars, 1,100 of them at zero height —
     the exact clutter the scope exists to remove. */
  const compact = <T,>(desc: T[], totals: number[]) => {
    const keep: number[] = [];
    for (let i = 0; i < desc.length; i++) if (totals[i] > 0) keep.push(i);
    const remap = new Map<number, number>();
    keep.forEach((old, next) => remap.set(old, next));
    return { desc: keep.map((i) => desc[i]), totals: keep.map((i) => totals[i]), remap };
  };
  const cl = compact(lDesc0, lTotal0);
  const cr = compact(rDesc0, rTotal0);
  const lDesc = cl.desc, rDesc = cr.desc;
  const lTotal = cl.totals, rTotal = cr.totals;
  const rCount = rDesc.length;

  const cells = new Map<number, number>();
  cells0.forEach((v, k) => {
    const l = cl.remap.get(Math.floor(k / rCount0));
    const r = cr.remap.get(k % rCount0);
    if (l === undefined || r === undefined) return;
    cells.set(l * rCount + r, v);
  });

  const total = lTotal.reduce((x, y) => x + y, 0);

  /* Breathing room scales with how much each node has to say.
     A flat 2px gap treated seven divisions and 1,189 chapters identically,
     which left the coarse views packed edge to edge — and it is exactly the
     coarse views where there is height to spare and where the gap is what
     makes the bars read as separate objects rather than one striped column.

     So the gap comes from the node count, and the caller sizes the drawing
     to afford it (see ChronoSankey.tsx). Still clamped by what actually
     fits: gaps never take more than 40% of the height, so a resolution that
     asks for more than the drawing can pay for degrades instead of
     collapsing the bars to nothing. */
  const fit = (n: number) => {
    const want = gapFor(n);
    return Math.max(0, Math.min(want, (height * 0.4) / Math.max(1, n - 1)));
  };
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
    const bottom = `M${x0},${y0b}C${xm},${y0b} ${xm},${y1b} ${x1},${y1b}`;
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
      bottomPath: bottom,
    };
  });

  /* Ordered thin-to-thick so a hairline ribbon is never buried under a slab.
     Sorting here rather than at paint time keeps the DOM order stable across
     re-renders, which matters for React reconciliation at 1,339 elements. */
  ribbons.sort((a, b) => b.thickness - a.thickness);

  /* Division composition per right node. Built from the same cells the
     ribbons came from, so the stack and the arriving ribbons cannot disagree. */
  const rightStacks: { division: number; from: number; to: number }[][] = right.map(() => []);
  const perNode = right.map(() => new Map<number, number>());
  entries.forEach(({ l, r, v }) => {
    const d = left[l].division;
    perNode[r].set(d, (perNode[r].get(d) ?? 0) + v);
  });
  const rightDominant = right.map((n, r) => {
    let best = -1, bestV = -1, acc = 0;
    const divs = Array.from(perNode[r].keys()).sort((a, b) => a - b);
    for (const d of divs) {
      const v = perNode[r].get(d) as number;
      if (v > bestV) { bestV = v; best = d; }
    }
    for (const d of divs) {
      const v = perNode[r].get(d) as number;
      const frac = n.value > 0 ? v / n.value : 0;
      rightStacks[r].push({ division: d, from: acc, to: acc + frac });
      acc += frac;
    }
    return best < 0 ? 0 : best;
  });

  return { left, right, ribbons, height, total, rightStacks, rightDominant };
}

/** Verses -> "1,533". Used in every readout. */
export const fmt = (n: number) => n.toLocaleString("en-US");
