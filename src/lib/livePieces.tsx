/**
 * livePieces — gallery pieces that render live on their own page.
 * ─────────────────────────────────────────────────────────────
 * Backlog item 8 asked for real interactive pieces embedded in the DOM
 * rather than linked out. This is the seam for that: a piece id maps to a
 * lazily-loaded component, and PieceDetail renders it above the macro stack
 * if one exists.
 *
 * Lazy on purpose — `PieceDetail` is one route shared by all 47 pieces, so a
 * statically imported visualisation would ship its data to every one of them.
 * Split this way, only a visitor who opens that specific piece pays for it.
 *
 * To add one: build the component under `components/live/`, add a line here.
 * Nothing else in the app needs to know.
 */

import { lazy, Suspense, type ComponentType } from "react";

const ChronoSankey = lazy(() => import("@/components/live/ChronoSankey"));

/** Piece id -> the component that renders it, plus how to introduce it. */
export const LIVE_PIECES: Record<
  string,
  { Component: ComponentType; label: string }
> = {
  "chrono-sankey": {
    Component: ChronoSankey,
    label: "Interactive · explore the diagram",
  },
};

export function LivePiece({ id, accent }: { id: string; accent: string }) {
  const entry = LIVE_PIECES[id];
  if (!entry) return null;
  const { Component, label } = entry;
  return (
    <section style={{ marginBottom: "3rem" }}>
      <h2
        className="label-mono"
        style={{
          fontSize: "0.5625rem",
          letterSpacing: "0.2em",
          color: accent,
          marginBottom: "0.85rem",
        }}
      >
        {label}
      </h2>
      {/* A plain height reservation, not a spinner: the fallback is on screen
          for a few hundred milliseconds at most, and a spinner that brief
          reads as a flash of noise. */}
      <Suspense fallback={<div style={{ minHeight: 420 }} aria-hidden="true" />}>
        <Component />
      </Suspense>
    </section>
  );
}
