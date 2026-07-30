/**
 * SectionRail — a fixed table of contents for long pages.
 * ─────────────────────────────────────────────────────────────
 * /about runs to nine sections and several thousand words, which is past the
 * point where a reader can tell where they are or get back to something they
 * scrolled past. This puts the headings on the edge of the viewport and marks
 * the one currently in view.
 *
 * Hidden below 1200px rather than reflowed: on a narrow screen the rail
 * either overlaps the text or steals a third of the width, and the mobile
 * answer to a long page is a shorter scroll, not a floating menu.
 *
 * The active section is tracked with IntersectionObserver rather than scroll
 * maths so it stays cheap, and the whole rail is a <nav> of real anchors —
 * it works, degraded, with JavaScript broken and is reachable by keyboard.
 *
 * Patrick Anderson — PTA Geospatial Intelligence
 */

import { useEffect, useState } from "react";

export type RailSection = { id: string; label: string };

export default function SectionRail({
  sections,
}: {
  sections: RailSection[];
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    /* Bias the detection band toward the upper third. Using the whole
       viewport means a tall section stays "active" long after its heading
       has scrolled away, which reads as the rail lagging behind. */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="section-rail" aria-label="On this page">
      <ul>
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={
                active === s.id ? "rail-link rail-link--on" : "rail-link"
              }
              aria-current={active === s.id ? "true" : undefined}
            >
              <span className="rail-tick" aria-hidden="true" />
              <span className="rail-label">{s.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
