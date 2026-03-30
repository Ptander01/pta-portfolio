/**
 * Carousel3D — 3D Project Carousel for the Work Page
 * Perspective-based carousel with glassmorphism cards and glowing borders.
 * Active card is front-and-center, inactive cards fade with 3D tilt.
 * Uses Framer Motion for smooth transitions and CSS 3D transforms.
 */
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";
import type { ProjectSummary } from "@/pages/Work";

interface Carousel3DProps {
  projects: ProjectSummary[];
}

export default function Carousel3D({ projects }: Carousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const count = projects.length;

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setActiveIndex(((index % count) + count) % count);
    },
    [count]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1, 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1, -1), [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Calculate card positions for 3D layout
  const getCardStyle = (index: number) => {
    const diff = ((index - activeIndex + count) % count);
    const normalizedDiff = diff > count / 2 ? diff - count : diff;

    const isActive = normalizedDiff === 0;
    const absOffset = Math.abs(normalizedDiff);

    // Position, rotation, and scale based on offset from active
    const translateX = normalizedDiff * 320;
    const translateZ = isActive ? 0 : -150 - absOffset * 50;
    const rotateY = normalizedDiff * -15;
    const scale = isActive ? 1 : Math.max(0.7, 1 - absOffset * 0.15);
    const opacity = absOffset > 2 ? 0 : isActive ? 1 : Math.max(0.3, 1 - absOffset * 0.3);

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: 10 - absOffset,
      pointerEvents: (absOffset <= 1 ? "auto" : "none") as React.CSSProperties["pointerEvents"],
    };
  };

  return (
    <div className="relative">
      {/* 3D Perspective Container */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
          height: 520,
        }}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {projects.map((project, index) => {
            const style = getCardStyle(index);
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={project.slug}
                className="absolute"
                style={{
                  width: 380,
                  ...style,
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="rounded-2xl overflow-hidden h-full flex flex-col"
                  style={{
                    background: "var(--glass-bg)",
                    backdropFilter: `blur(${isActive ? 20 : 12}px) saturate(1.4)`,
                    WebkitBackdropFilter: `blur(${isActive ? 20 : 12}px) saturate(1.4)`,
                    border: `1px solid ${isActive ? project.color : "var(--glass-border)"}`,
                    boxShadow: isActive
                      ? `0 0 30px ${project.color}30, 0 8px 32px rgba(0,0,0,0.4), var(--glass-highlight)`
                      : "var(--glass-shadow), var(--glass-highlight)",
                    transition: "border-color 0.4s ease, box-shadow 0.4s ease",
                  }}
                >
                  {/* Card header */}
                  <div
                    className="relative p-8 flex items-center gap-5"
                    style={{
                      background: `linear-gradient(135deg, var(--neu-bg-concave-from), var(--neu-bg-concave-to))`,
                    }}
                  >
                    <div
                      className="neu-concave rounded-xl p-4 flex items-center justify-center flex-shrink-0"
                      style={{ minWidth: 56, minHeight: 56 }}
                    >
                      <project.icon
                        size={24}
                        style={{ color: project.color }}
                      />
                    </div>
                    <div>
                      <span
                        className="label-mono mb-1 block"
                        style={{ color: project.color, fontSize: "0.5rem" }}
                      >
                        {project.subtitle}
                      </span>
                      <h3
                        className="font-display font-bold text-lg"
                        style={{ color: "var(--heading-color)" }}
                      >
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p
                      className="text-sm leading-relaxed mb-5 flex-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {project.description}
                    </p>

                    {/* Tech pills */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.techHighlights.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md px-2.5 py-1 font-mono text-xs"
                          style={{
                            color: "var(--text-secondary)",
                            background: "var(--neu-bg-concave-from)",
                            border: "1px solid var(--glass-border)",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-3">
                      <Link href={`/work/${project.slug}`}>
                        <span
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display font-semibold text-xs transition-all"
                          style={{
                            color: "var(--primary-foreground)",
                            background: project.color,
                          }}
                        >
                          CASE STUDY
                          <ArrowRight size={12} />
                        </span>
                      </Link>
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display font-medium text-xs transition-all"
                        style={{
                          color: "var(--text-muted)",
                          border: "1px solid var(--glass-border)",
                        }}
                      >
                        LIVE DEMO
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>

                  {/* Active glow bar at bottom */}
                  {isActive && (
                    <div
                      style={{
                        height: 2,
                        background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
                        boxShadow: `0 0 10px ${project.color}`,
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          onClick={goPrev}
          className="neu-raised rounded-full p-3 transition-all hover:scale-105"
          style={{ color: "var(--text-muted)" }}
          aria-label="Previous project"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Dots */}
        <div className="flex gap-3">
          {projects.map((project, index) => (
            <button
              key={project.slug}
              onClick={() => goTo(index, index > activeIndex ? 1 : -1)}
              className="rounded-full transition-all duration-300"
              style={{
                width: index === activeIndex ? 28 : 8,
                height: 8,
                background:
                  index === activeIndex
                    ? project.color
                    : "var(--text-muted)",
                opacity: index === activeIndex ? 1 : 0.3,
              }}
              aria-label={`Go to ${project.title}`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="neu-raised rounded-full p-3 transition-all hover:scale-105"
          style={{ color: "var(--text-muted)" }}
          aria-label="Next project"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Project counter */}
      <div className="text-center mt-4">
        <span
          className="label-mono"
          style={{ color: "var(--text-muted)", fontSize: "0.55rem" }}
        >
          {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
