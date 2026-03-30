/**
 * XRayReveal — GIS X-Ray Hover Reveal Component
 * A "magic lens" hover effect using CSS clip-path tied to mouse tracking.
 * Base layer: raw, bland, unstyled data representation
 * Reveal layer: processed, vibrant, high-contrast visualization
 * Glowing cyan/amber border on the clipping circle for a high-tech scanner look.
 */
import { useCallback, useRef, useState } from "react";

interface XRayRevealProps {
  /** Title displayed above the reveal */
  title?: string;
  /** Description of the raw data layer */
  rawLabel?: string;
  /** Description of the processed layer */
  processedLabel?: string;
  /** Radius of the reveal lens in pixels */
  lensRadius?: number;
  /** Color accent for the lens glow */
  accentColor?: string;
  /** Content for the "raw data" layer (before) */
  rawContent?: React.ReactNode;
  /** Content for the "processed" layer (after) */
  processedContent?: React.ReactNode;
  /** Height of the reveal area */
  height?: number;
}

export default function XRayReveal({
  title = "Data Transformation",
  rawLabel = "RAW DATA",
  processedLabel = "EXECUTIVE INTELLIGENCE",
  lensRadius = 120,
  accentColor = "var(--cyan)",
  rawContent,
  processedContent,
  height = 400,
}: XRayRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setMousePos({ x: -999, y: -999 });
  }, []);

  const clipPath = isHovering
    ? `circle(${lensRadius}px at ${mousePos.x}px ${mousePos.y}px)`
    : `circle(0px at ${mousePos.x}px ${mousePos.y}px)`;

  return (
    <div className="neu-raised rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h3
            className="font-display font-semibold text-lg"
            style={{ color: "var(--heading-color)" }}
          >
            {title}
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--text-muted)", opacity: 0.5 }}
              />
              <span
                className="label-mono"
                style={{ color: "var(--text-muted)", fontSize: "0.5rem" }}
              >
                {rawLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: accentColor }}
              />
              <span
                className="label-mono"
                style={{ color: accentColor, fontSize: "0.5rem" }}
              >
                {processedLabel}
              </span>
            </div>
          </div>
        </div>
        <p
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Hover to reveal the processed visualization beneath the raw data.
        </p>
      </div>

      {/* Reveal area */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{
          height,
          cursor: "none",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Raw data layer (base — always visible) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, var(--neu-bg-concave-from), var(--neu-bg-concave-to))",
          }}
        >
          {rawContent || <DefaultRawContent />}
        </div>

        {/* Processed layer (revealed on hover via clip-path) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            clipPath,
            transition: isHovering ? "clip-path 0.05s ease-out" : "clip-path 0.3s ease-out",
            background: "var(--page-bg)",
          }}
        >
          {processedContent || <DefaultProcessedContent accentColor={accentColor} />}
        </div>

        {/* Lens border glow */}
        {isHovering && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: mousePos.x - lensRadius - 3,
              top: mousePos.y - lensRadius - 3,
              width: (lensRadius + 3) * 2,
              height: (lensRadius + 3) * 2,
              borderRadius: "50%",
              border: `2px solid ${accentColor}`,
              boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}40, inset 0 0 20px ${accentColor}20`,
              transition: "left 0.05s ease-out, top 0.05s ease-out",
            }}
          />
        )}

        {/* Crosshair at cursor */}
        {isHovering && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: mousePos.x - 12,
              top: mousePos.y - 12,
              width: 24,
              height: 24,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke={accentColor} strokeWidth="1" opacity="0.8" />
              <line x1="12" y1="0" x2="12" y2="8" stroke={accentColor} strokeWidth="0.5" opacity="0.5" />
              <line x1="12" y1="16" x2="12" y2="24" stroke={accentColor} strokeWidth="0.5" opacity="0.5" />
              <line x1="0" y1="12" x2="8" y2="12" stroke={accentColor} strokeWidth="0.5" opacity="0.5" />
              <line x1="16" y1="12" x2="24" y2="12" stroke={accentColor} strokeWidth="0.5" opacity="0.5" />
            </svg>
          </div>
        )}

        {/* Hover hint */}
        {!isHovering && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="neu-raised rounded-lg px-4 py-2 flex items-center gap-2"
              style={{ opacity: 0.8 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span
                className="label-mono"
                style={{ color: accentColor, fontSize: "0.55rem" }}
              >
                HOVER TO REVEAL
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Default raw data visualization (grid of bland numbers/dots) ── */
function DefaultRawContent() {
  const rows = 12;
  const cols = 16;
  return (
    <div className="w-full h-full p-4 overflow-hidden">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows * cols }, (_, i) => {
          const val = Math.random();
          return (
            <div
              key={i}
              className="flex items-center justify-center font-mono"
              style={{
                fontSize: "0.5rem",
                color: "var(--text-muted)",
                opacity: 0.3 + val * 0.3,
                height: 24,
              }}
            >
              {Math.floor(val * 100)
                .toString()
                .padStart(2, "0")}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Default processed visualization (vibrant heatmap-style grid) ── */
function DefaultProcessedContent({ accentColor }: { accentColor: string }) {
  const rows = 12;
  const cols = 16;
  return (
    <div className="w-full h-full p-4 overflow-hidden">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows * cols }, (_, i) => {
          const val = Math.random();
          const row = Math.floor(i / cols);
          const col = i % cols;
          // Create a radial gradient pattern
          const cx = cols / 2;
          const cy = rows / 2;
          const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2);
          const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
          const intensity = 1 - dist / maxDist;
          const hue = intensity > 0.6 ? 200 : intensity > 0.3 ? 85 : 0;
          return (
            <div
              key={i}
              className="rounded-sm"
              style={{
                height: 24,
                background:
                  intensity > 0.5
                    ? `oklch(${0.4 + intensity * 0.4} 0.16 ${hue})`
                    : `oklch(${0.2 + val * 0.15} 0.05 280)`,
                opacity: 0.6 + intensity * 0.4,
                boxShadow:
                  intensity > 0.6
                    ? `0 0 8px oklch(0.7 0.16 ${hue} / 0.4)`
                    : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
