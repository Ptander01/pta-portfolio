/**
 * ChronoSankey — the ESV Chronological Bible, drawn.
 * ─────────────────────────────────────────────────────────────────────────
 * Canonical order down the left, chronological order down the right, and a
 * ribbon for every place the two disagree. A ribbon's slope IS the deviation;
 * see chronoSankeyLayout.ts for why this is not d3-sankey.
 *
 * Both axes carry their own resolution control, and every level is a grouping
 * of one atomic table, so no two views can disagree with each other.
 *
 * Patrick Anderson
 */

import { useMemo, useState, useId } from "react";
import {
  BOOKS, DIVISIONS, ERAS, TOTAL_VERSES, TOTAL_READINGS,
} from "@/lib/data/chronoSankey";
import {
  layout, fmt, type LeftRes, type RightRes,
} from "./chronoSankeyLayout";

/** One CSS custom property per division, in canonical order. */
const DIV_VAR = [
  "--div-law", "--div-history", "--div-wisdom", "--div-major",
  "--div-minor", "--div-gospels", "--div-epistles",
];
const divColor = (i: number) => `var(${DIV_VAR[i] ?? "--div-law"})`;

const LEFT_LABEL: Record<LeftRes, string> = {
  division: "Division", book: "Book", chapter: "Chapter",
};
const RIGHT_LABEL: Record<RightRes, string> = { era: "Era", day: "Day" };

/* Drawing geometry. The viewBox is fixed; the SVG scales to its container. */
const W = 1000;
/* Gutters sized to the longest label at the 8px label size, not guessed:
   "The Early Church & Paul's Letters" is 33 characters, and Space Mono's
   advance is ~0.6em, so it needs ~160 units plus the bar and its offset. The
   wrapper scrolls on overflow, so a label that does not fit is not merely
   ugly — it is cut off. */
const GUTTER_L = 140;      // longest book name: "1 Thessalonians"
const GUTTER_R = 238;      // longest era name, + bar + 6px offset
const BAR = 9;
const PAD_TOP = 8;

type Focus = { side: "left" | "right"; index: number } | null;

export default function ChronoSankey() {
  const [leftRes, setLeftRes] = useState<LeftRes>("book");
  const [rightRes, setRightRes] = useState<RightRes>("era");
  const [hover, setHover] = useState<Focus>(null);
  const [pinned, setPinned] = useState<Focus>(null);
  const titleId = useId();

  const focus = hover ?? pinned;

  /* Height follows the denser axis: every node needs at least a couple of
     pixels or the column reads as a solid block. Capped so the page does not
     become unscrollable at chapter × day. */
  const nodeCount = Math.max(
    leftRes === "division" ? 7 : leftRes === "book" ? 66 : 1189,
    rightRes === "era" ? 14 : 365
  );
  const height = Math.round(Math.min(2400, Math.max(520, nodeCount * 2.1)));
  const span = W - GUTTER_L - GUTTER_R;

  const L = useMemo(
    () => layout({ leftRes, rightRes, height, span, gap: 2 }),
    [leftRes, rightRes, height, span]
  );

  /* A ribbon is lit when it touches the focused node. Nothing focused means
     everything is lit, so the default view is the whole braid. */
  const isLit = (source: number, target: number) =>
    !focus || (focus.side === "left" ? source === focus.index : target === focus.index);

  const focusedNode =
    focus && (focus.side === "left" ? L.left[focus.index] : L.right[focus.index]);
  const focusedRibbons = focus
    ? L.ribbons.filter((r) => isLit(r.source, r.target))
    : [];

  /* Labels are only drawn where the node is tall enough to hold one. At
     chapter resolution that is a minority of nodes, which is correct: the
     alternative is 1,189 overlapping 7px labels and an unreadable column. */
  const labelMin = 7;

  return (
    <figure className="chrono-sankey" style={{ margin: "0 0 2rem" }}>
      <Controls
        leftRes={leftRes} rightRes={rightRes}
        setLeftRes={setLeftRes} setRightRes={setRightRes}
        onClear={() => setPinned(null)} pinned={!!pinned}
      />

      <Readout
        node={focusedNode ?? null}
        side={focus?.side ?? null}
        ribbons={focusedRibbons}
        leftRes={leftRes}
        rightRes={rightRes}
      />

      <div className="chrono-sankey__scroll">
        <svg
          viewBox={`0 0 ${W} ${height + PAD_TOP * 2}`}
          width="100%"
          role="img"
          aria-labelledby={titleId}
          style={{ display: "block", overflow: "visible" }}
          onMouseLeave={() => setHover(null)}
        >
          <title id={titleId}>
            {`Sankey diagram: the ${TOTAL_VERSES.toLocaleString()} verses of the Bible flowing from `}
            {`canonical ${LEFT_LABEL[leftRes].toLowerCase()} order on the left to the ESV `}
            {`Chronological Bible's ${RIGHT_LABEL[rightRes].toLowerCase()} order on the right.`}
          </title>

          <g transform={`translate(0,${PAD_TOP})`}>
            {/* Ribbons first, so the bars sit on top of them. */}
            <g>
              {L.ribbons.map((r) => {
                const lit = isLit(r.source, r.target);
                return (
                  <path
                    key={r.key}
                    d={r.path}
                    transform={`translate(${GUTTER_L},0)`}
                    fill={divColor(r.division)}
                    opacity={focus ? (lit ? 0.62 : 0.045) : 0.3}
                    style={{ transition: "opacity 0.18s ease" }}
                  />
                );
              })}
            </g>

            {/* Left column */}
            <g>
              {L.left.map((n, i) => {
                const h = Math.max(1, n.y1 - n.y0);
                const lit = !focus || (focus.side === "left" && focus.index === i);
                return (
                  <g key={n.key}>
                    <rect
                      x={GUTTER_L - BAR} y={n.y0} width={BAR} height={h}
                      fill={divColor(n.division)}
                      opacity={lit ? 1 : 0.3}
                      style={{ cursor: "pointer", transition: "opacity 0.18s ease" }}
                      onMouseEnter={() => setHover({ side: "left", index: i })}
                      onClick={() =>
                        setPinned((p) =>
                          p && p.side === "left" && p.index === i ? null : { side: "left", index: i }
                        )
                      }
                    >
                      <title>{`${n.label} — ${fmt(n.value)} verses`}</title>
                    </rect>
                    {h >= labelMin && (
                      <text
                        x={GUTTER_L - BAR - 6} y={n.y0 + h / 2}
                        textAnchor="end" dominantBaseline="middle"
                        className="chrono-sankey__label"
                        opacity={lit ? 1 : 0.35}
                      >
                        {h < 12 ? n.short : n.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Right column */}
            <g>
              {L.right.map((n, i) => {
                const h = Math.max(1, n.y1 - n.y0);
                const lit = !focus || (focus.side === "right" && focus.index === i);
                return (
                  <g key={n.key}>
                    <rect
                      x={W - GUTTER_R} y={n.y0} width={BAR} height={h}
                      fill="rgb(var(--fg-rgb) / 0.55)"
                      opacity={lit ? 1 : 0.3}
                      style={{ cursor: "pointer", transition: "opacity 0.18s ease" }}
                      onMouseEnter={() => setHover({ side: "right", index: i })}
                      onClick={() =>
                        setPinned((p) =>
                          p && p.side === "right" && p.index === i ? null : { side: "right", index: i }
                        )
                      }
                    >
                      <title>{`${n.label} — ${fmt(n.value)} verses`}</title>
                    </rect>
                    {h >= labelMin && (
                      <text
                        x={W - GUTTER_R + BAR + 6} y={n.y0 + h / 2}
                        dominantBaseline="middle"
                        className="chrono-sankey__label"
                        opacity={lit ? 1 : 0.35}
                      >
                        {h < 12 ? n.short : n.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      </div>

      <Legend />

      <figcaption className="chrono-sankey__caption">
        {`${fmt(TOTAL_VERSES)} verses · ${fmt(TOTAL_READINGS)} readings · 365 days. `}
        {`Ribbon thickness is verse count; ribbon slope is how far the ESV moves a passage from its canonical place.`}
      </figcaption>
    </figure>
  );
}

/* ── controls ────────────────────────────────────────────────────────── */

function Controls({
  leftRes, rightRes, setLeftRes, setRightRes, onClear, pinned,
}: {
  leftRes: LeftRes; rightRes: RightRes;
  setLeftRes: (r: LeftRes) => void; setRightRes: (r: RightRes) => void;
  onClear: () => void; pinned: boolean;
}) {
  return (
    <div className="chrono-sankey__controls">
      <fieldset className="chrono-sankey__group">
        <legend>Canonical</legend>
        {(["division", "book", "chapter"] as LeftRes[]).map((r) => (
          <button
            key={r} type="button"
            className={`chrono-sankey__opt${leftRes === r ? " is-on" : ""}`}
            aria-pressed={leftRes === r}
            onClick={() => setLeftRes(r)}
          >
            {LEFT_LABEL[r]}
          </button>
        ))}
      </fieldset>

      <fieldset className="chrono-sankey__group">
        <legend>Chronological</legend>
        {(["era", "day"] as RightRes[]).map((r) => (
          <button
            key={r} type="button"
            className={`chrono-sankey__opt${rightRes === r ? " is-on" : ""}`}
            aria-pressed={rightRes === r}
            onClick={() => setRightRes(r)}
          >
            {RIGHT_LABEL[r]}
          </button>
        ))}
      </fieldset>

      {pinned && (
        <button type="button" className="chrono-sankey__opt" onClick={onClear}>
          Clear selection
        </button>
      )}
    </div>
  );
}

/* ── readout ─────────────────────────────────────────────────────────── */

function Readout({
  node, side, ribbons, leftRes, rightRes,
}: {
  node: { label: string; value: number } | null;
  side: "left" | "right" | null;
  ribbons: { value: number; slope: number }[];
  leftRes: LeftRes; rightRes: RightRes;
}) {
  if (!node || !side) {
    return (
      <p className="chrono-sankey__readout chrono-sankey__readout--idle">
        Hover a bar to trace where its verses go; click to hold it.
      </p>
    );
  }
  const destinations = ribbons.length;
  const otherAxis = side === "left" ? RIGHT_LABEL[rightRes] : LEFT_LABEL[leftRes];
  const widest = ribbons.reduce((a, r) => (r.value > a.value ? r : a), ribbons[0]);
  return (
    <p className="chrono-sankey__readout">
      <strong>{node.label}</strong>
      <span>{fmt(node.value)} verses</span>
      <span>
        {destinations} {otherAxis.toLowerCase()}
        {destinations === 1 ? "" : "s"}
      </span>
      {widest && <span>largest strand {fmt(widest.value)}</span>}
    </p>
  );
}

/* ── legend ──────────────────────────────────────────────────────────── */

function Legend() {
  return (
    <ul className="chrono-sankey__legend" aria-label="Divisions">
      {DIVISIONS.map((d, i) => (
        <li key={d.name}>
          <span className="chrono-sankey__swatch" style={{ background: divColor(i) }} />
          {d.name}
        </li>
      ))}
    </ul>
  );
}

/* Referenced so the imports stay honest about what the component depends on. */
void BOOKS; void ERAS;
