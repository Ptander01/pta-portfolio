/**
 * Photo — an image that only renders once the file actually exists.
 * ─────────────────────────────────────────────────────────────
 * The photo slots were built before the files were available, so each one
 * probes for its source and renders nothing until the file is dropped in.
 * No code change is needed to light them up — add the file, reload.
 *
 * Why a probe rather than a plain <img> with onError: `vercel.json` rewrites
 * every unmatched path to /index.html, so a missing image answers 200 with
 * text/html rather than 404. A normal <img> would not fire onError reliably —
 * it would attempt to decode HTML as an image. Checking content-type is the
 * only trustworthy signal. Same reasoning as the résumé PDF probe.
 *
 * Patrick Anderson — PTA Geospatial Intelligence
 */

import { useEffect, useState } from "react";

export default function Photo({
  src,
  alt,
  className,
  style,
  /** Rendered in place of the image while absent — omit for silent absence. */
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}) {
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    let live = true;
    fetch(src, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (live) setReady(r.ok && type.startsWith("image/"));
      })
      .catch(() => live && setReady(false));
    return () => {
      live = false;
    };
  }, [src]);

  if (ready === null) return null; // probing — render nothing rather than flash
  if (!ready) return <>{fallback ?? null}</>;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      style={style}
    />
  );
}
