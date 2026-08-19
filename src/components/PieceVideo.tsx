/**
 * PieceVideo — a screen recording of a piece, on its detail page.
 * ─────────────────────────────────────────────────────────────
 * Some pieces only make sense in motion. "Click a histogram bar and the map
 * filters to that score range" and "infrastructure re-queries as you pan" are
 * invisible in a still, and for a piece whose live demo is deliberately
 * frontend-only the recording is the ONLY artifact that can show the backend
 * doing its work at all.
 *
 * Three rules, each of which is about not making the gallery pay for it:
 *
 * 1. Detail pages only, never gallery cards. Forty-eight cards autoplaying
 *    video is how a 32 MB image payload becomes a 300 MB one, and a card's
 *    job is to get someone to the piece rather than to play them a film.
 * 2. The source is not attached until the wrapper is near the viewport. A
 *    `<video src>` in the markup is a download whether or not it plays, and
 *    these sit well below the fold. The poster holds the exact same box in
 *    the meantime, so nothing shifts when it swaps.
 * 3. Autoplay IS motion. Under prefers-reduced-motion the video never starts
 *    itself — it renders as a poster with controls and waits to be asked.
 *    The Sankey honours that setting; this has to as well or the site
 *    contradicts itself.
 *
 * Controls stay on in both cases: muted autoplay with no way to pause is a
 * worse experience than the one it is trying to avoid.
 */
import { useEffect, useRef, useState } from "react";

const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export default function PieceVideo({
  src,
  poster,
  title,
  accent,
  label = "Demo · the piece in motion",
}: {
  src: string;
  poster: string;
  title: string;
  accent: string;
  label?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el || near) return;
    /* No IntersectionObserver (or an old browser) should mean the video still
       works, not that it never loads — so failure attaches it immediately. */
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

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
      <div ref={wrap}>
        {near ? (
          <video
            src={src}
            poster={poster}
            controls
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay={!PREFERS_REDUCED_MOTION}
            aria-label={`${title} — screen recording`}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: 4,
              background: "#0A0E14",
            }}
          />
        ) : (
          /* Same box, same radius, same ground — so attaching the real source
             changes what is in the frame and nothing about the layout. */
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: 4,
              background: "#0A0E14",
            }}
          />
        )}
      </div>
    </section>
  );
}
