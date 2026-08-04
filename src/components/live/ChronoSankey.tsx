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

import { Fragment, useMemo, useRef, useState, useId } from "react";
import {
  BOOKS, DIVISIONS, ERAS, TOTAL_VERSES, TOTAL_READINGS,
} from "@/lib/data/chronoSankey";
import {
  layout, fmt, heightForGaps, type LeftRes, type RightRes,
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

/* Below this thickness the glass treatment costs marks and buys nothing —
   a gradient across 1px is a flat colour, and a 0.75px specular stroke on a
   1px band is just a lighter band. Set at 4px because that is roughly where
   the three-part gradient starts to be separable by eye. */
const GLASS_MIN = 4;

/* A stacked node needs enough height for its bands to be separable. Below
   this it falls back to the division contributing most of its verses —
   still true, just coarser, and better than a grey bar that says nothing. */
const STACK_MIN = 6;

type Focus = { side: "left" | "right"; index: number } | null;

export default function ChronoSankey() {
  const [leftRes, setLeftRes] = useState<LeftRes>("book");
  const [rightRes, setRightRes] = useState<RightRes>("era");
  const [hover, setHover] = useState<Focus>(null);
  const [pinned, setPinned] = useState<Focus>(null);
  /* Optional scope. Chapter x Day is 1,189 bars against 365 and every ribbon
     between them — true, and unreadable. Narrowing to one division or one era
     is what makes the fine resolutions usable rather than decorative. */
  const [scopeDivision, setScopeDivision] = useState<number | null>(null);
  const [scopeEra, setScopeEra] = useState<number | null>(null);
  const titleId = useId();
  /* SVG ids are document-global, so they get a per-instance prefix. Two of
     these on one page would otherwise share gradients and fight. */
  const gid = useId().replace(/:/g, "");

  const focus = hover ?? pinned;

  /* Height follows the denser axis: every node needs at least a couple of
     pixels or the column reads as a solid block. Capped so the page does not
     become unscrollable at chapter × day. */
  /* Height is sized so the columns can afford the breathing room they ask
     for, rather than the gap being squeezed to whatever is left over.

     Measured, not estimated. A first pass at a nominal height reports how
     many nodes actually survive the scope — which no formula can predict,
     because "Chapter, scoped to Exile" depends on which chapters happen to
     fall in those 58 days. The second pass lays out at a height that affords
     the gap for that real count. Two passes over 1,397 atoms is nothing, and
     it is the difference between a scoped view that is calm and one that is
     stretched over height it does not need. */
  const span = W - GUTTER_L - GUTTER_R;

  const L = useMemo(() => {
    const probe = layout({ leftRes, rightRes, height: 600, span, scopeDivision, scopeEra });
    const nL = probe.left.length;
    const nR = probe.right.length;
    const h = Math.round(
      Math.min(
        2400,
        Math.max(
          420,
          heightForGaps(nL), heightForGaps(nR),
          nL * 2.1, nR * 2.1
        )
      )
    );
    return layout({ leftRes, rightRes, height: h, span, scopeDivision, scopeEra });
  }, [leftRes, rightRes, span, scopeDivision, scopeEra]);

  const height = L.height;

  /* A scope that hides the focused node would leave a selection pinned to
     something no longer on screen. */
  const scopeKey = `${scopeDivision}|${scopeEra}|${leftRes}|${rightRes}`;
  const lastScope = useRef(scopeKey);
  if (lastScope.current !== scopeKey) {
    lastScope.current = scopeKey;
    if (pinned) setPinned(null);
    if (hover) setHover(null);
  }

  /* A ribbon is lit when it touches the focused node. Nothing focused means
     everything is lit, so the default view is the whole braid. */
  const isLit = (source: number, target: number) =>
    !focus || (focus.side === "left" ? source === focus.index : target === focus.index);

  const focusedNode =
    focus && (focus.side === "left" ? L.left[focus.index] : L.right[focus.index]);
  const focusedRibbons = useMemo(
    () => (focus ? L.ribbons.filter((r) => isLit(r.source, r.target)) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [focus, L]
  );

  /* Both ends light, not just the one under the pointer.
     Selecting Job and seeing only Job light is the question half-answered —
     the whole point of the piece is where a passage LANDS, so the destination
     has to light with the origin. These are the far-end nodes reached by the
     focused ribbons, and the labels follow the same sets. */
  const [litLeft, litRight] = useMemo(() => {
    if (!focus) return [null, null] as const;
    const l = new Set<number>();
    const r = new Set<number>();
    for (const rb of focusedRibbons) { l.add(rb.source); r.add(rb.target); }
    return [l, r] as const;
  }, [focus, focusedRibbons]);

  /* Labels are only drawn where the node is tall enough to hold one. At
     chapter resolution that is a minority of nodes, which is correct: the
     alternative is 1,189 overlapping 7px labels and an unreadable column. */
  const labelMin = 7;

  return (
    <figure className="chrono-sankey" style={{ margin: "0 0 2rem" }}>
      <Controls
        leftRes={leftRes} rightRes={rightRes}
        setLeftRes={setLeftRes} setRightRes={setRightRes}
        scopeDivision={scopeDivision} setScopeDivision={setScopeDivision}
        scopeEra={scopeEra} setScopeEra={setScopeEra}
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
          <Defs gid={gid} stacks={L.rightStacks} minH={STACK_MIN} heights={L.right.map((n) => n.y1 - n.y0)} />

          <title id={titleId}>
            {`Sankey diagram: the ${TOTAL_VERSES.toLocaleString()} verses of the Bible flowing from `}
            {`canonical ${LEFT_LABEL[leftRes].toLowerCase()} order on the left to the ESV `}
            {`Chronological Bible's ${RIGHT_LABEL[rightRes].toLowerCase()} order on the right.`}
          </title>

          <g transform={`translate(0,${PAD_TOP})`}>
            {/* Ribbons first, so the bars sit on top of them.
                The glass is three marks, not one: a body filled with a
                vertical gradient (bright just under the leading edge, base
                through the middle, shaded at the underside), a 1px specular
                stroke along the top curve only, and a contact shadow carried
                by one group filter rather than 1,339 individual ones.

                It is applied per ribbon, by thickness, not globally. Material
                reads at 40px and vanishes at 1px, so below GLASS_MIN a ribbon
                drops to a flat fill — at Chapter x Day almost everything does,
                which is why that view looks like fibre optics rather than
                like mud. One rule, no mode switch. */}
            <g className="chrono-sankey__ribbons" filter={`url(#${gid}-contact)`} transform={`translate(${GUTTER_L},0)`}>
              {L.ribbons.map((r) => {
                const lit = isLit(r.source, r.target);
                const glass = r.thickness >= GLASS_MIN;
                const o = focus ? (lit ? 0.92 : 0.05) : 0.62;
                return (
                  <g key={r.key} style={{ transition: "opacity 0.18s ease" }} opacity={o}>
                    <path
                      d={r.path}
                      fill={glass ? `url(#${gid}-g${r.division})` : divColor(r.division)}
                    />
                    {glass && (
                      <path
                        d={r.topPath}
                        fill="none"
                        stroke="rgba(255,255,255,0.55)"
                        strokeWidth={0.75}
                      />
                    )}
                  </g>
                );
              })}
            </g>

            {/* Left column */}
            <g>
              {L.left.map((n, i) => {
                const h = Math.max(1, n.y1 - n.y0);
                const lit = !litLeft || litLeft.has(i);
                return (
                  <g key={n.key}>
                    <rect
                      x={GUTTER_L - BAR} y={n.y0} width={BAR} height={h}
                      fill={h >= 3 ? `url(#${gid}-g${n.division})` : divColor(n.division)}
                      stroke={h >= 5 ? "rgba(255,255,255,0.5)" : "none"}
                      strokeWidth={h >= 5 ? 0.6 : 0}
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
                const lit = !litRight || litRight.has(i);
                return (
                  <g key={n.key}>
                    <rect
                      x={W - GUTTER_R} y={n.y0} width={BAR} height={h}
                      fill={h >= STACK_MIN ? `url(#${gid}-r${i})` : divColor(L.rightDominant[i])}
                      stroke={h >= 5 ? "rgba(255,255,255,0.42)" : "none"}
                      strokeWidth={h >= 5 ? 0.6 : 0}
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

/* ── material ────────────────────────────────────────────────────────────
   The glass, defined once and referenced by every ribbon and bar.

   These are the four things the career timeline's rails already do, ported
   from CSS box-shadow to SVG: a bright band just below the leading edge, the
   base colour through the body, a shaded underside, and a contact shadow that
   sits the mark on the ground. Same physics as the reference render, and the
   same language as the rest of the site, so the diagram reads as native
   rather than as a guest.

   `gradientUnits="objectBoundingBox"` means each ribbon gets its own vertical
   ramp regardless of where it sits or how thick it is, which is what keeps a
   1,500-verse band and a 40-verse band looking like the same material.

   Theme-aware throughout: the ramp is built with color-mix against the
   division token, so it re-solves itself in light mode instead of carrying
   dark-mode highlights onto parchment. */
function Defs({
  gid, stacks, heights, minH,
}: {
  gid: string;
  stacks: { division: number; from: number; to: number }[][];
  heights: number[];
  minH: number;
}) {
  return (
    <defs>
      {DIV_VAR.map((v, i) => (
        <linearGradient key={v} id={`${gid}-g${i}`} x1="0" y1="0" x2="0" y2="1"
          gradientUnits="objectBoundingBox">
          {/* Bright band sits at 18%, not 0%: a highlight exactly on the edge
              reads as a stroke, one just below it reads as a rounded surface
              catching the key light. Same offset the timeline rails use. */}
          <stop offset="0%"   stopColor={`color-mix(in srgb, var(${v}) 62%, white)`} />
          <stop offset="18%"  stopColor={`color-mix(in srgb, var(${v}) 84%, white)`} />
          <stop offset="55%"  stopColor={`var(${v})`} />
          <stop offset="100%" stopColor={`color-mix(in srgb, var(${v}) 72%, black)`} />
        </linearGradient>
      ))}

      {/* The chronological nodes were grey, which was a cop-out. An era is a
          MIXTURE of divisions — that mixing is the entire reason the two
          orders differ — so grey threw away the most interesting fact about
          each node. Each one now stacks by composition, in canonical division
          order, with hard stops.

          It lines up exactly: the ribbons already arrive at a node sorted by
          source, so the bands in the bar and the ribbons landing on it are in
          the same order. Every node becomes a legend for itself, and "Exile
          is mostly Major Prophets but has a seam of History" is readable
          without hovering anything.

          Only built for nodes tall enough to show it — at Day resolution most
          are ~1px and take the dominant division flat instead. */}
      {stacks.map((bands, i) =>
        heights[i] >= minH ? (
          <linearGradient key={i} id={`${gid}-r${i}`} x1="0" y1="0" x2="0" y2="1"
            gradientUnits="objectBoundingBox">
            {bands.map((b, j) => (
              <Fragment key={j}>
                <stop offset={`${b.from * 100}%`} stopColor={divColor(b.division)} />
                <stop offset={`${b.to * 100}%`} stopColor={divColor(b.division)} />
              </Fragment>
            ))}
          </linearGradient>
        ) : null
      )}

      {/* ONE contact shadow for the whole ribbon group. Per-ribbon filters
          would be 1,339 of them and drop the frame rate through the floor;
          at this offset the group shadow is indistinguishable anyway, because
          what sells the effect is the mark sitting a little above the ground,
          not each band shadowing its neighbour. */}
      <filter id={`${gid}-contact`} x="-2%" y="-2%" width="104%" height="106%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.6"
          floodColor="#000" floodOpacity="0.34" />
      </filter>
    </defs>
  );
}

/* ── controls ────────────────────────────────────────────────────────── */

function Controls({
  leftRes, rightRes, setLeftRes, setRightRes,
  scopeDivision, setScopeDivision, scopeEra, setScopeEra,
  onClear, pinned,
}: {
  leftRes: LeftRes; rightRes: RightRes;
  setLeftRes: (r: LeftRes) => void; setRightRes: (r: RightRes) => void;
  scopeDivision: number | null; setScopeDivision: (v: number | null) => void;
  scopeEra: number | null; setScopeEra: (v: number | null) => void;
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
        {/* The scope sits inside the group it scopes — same spatial argument
            as putting the chronological controls on the right. */}
        <Scope
          label="all divisions"
          value={scopeDivision}
          onChange={setScopeDivision}
          options={DIVISIONS.map((d, i) => ({ value: i, label: d.name }))}
        />
      </fieldset>

      {/* Pushed to the far right so it sits over the column it controls.
          Two identical-looking pill groups side by side gave no clue which
          axis each one drove; the association is spatial, so the control
          should be too. */}
      <fieldset className="chrono-sankey__group chrono-sankey__group--right">
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
        <Scope
          label="all eras"
          value={scopeEra}
          onChange={setScopeEra}
          options={ERAS.map((e, i) => ({ value: i, label: e.name }))}
        />
      </fieldset>

      {pinned && (
        <button type="button" className="chrono-sankey__opt" onClick={onClear}>
          Clear selection
        </button>
      )}
    </div>
  );
}

/** A narrowing control, styled as one of the pills rather than as a browser
 *  select — the native control cannot be made to match the chrome language,
 *  and this sits in a row of pills. The <select> is kept as the real control
 *  underneath for keyboard and screen-reader behaviour, and the pill is
 *  simply what it looks like. */
function Scope({
  label, value, onChange, options,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  options: { value: number; label: string }[];
}) {
  const active = value !== null;
  const current = active ? options[value]?.label ?? label : label;
  return (
    <span className={`chrono-sankey__scope${active ? " is-on" : ""}`}>
      <span aria-hidden="true">{current}</span>
      <select
        aria-label={`Narrow to one ${label.replace("all ", "").replace(/s$/, "")}`}
        value={value === null ? "" : String(value)}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </span>
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
