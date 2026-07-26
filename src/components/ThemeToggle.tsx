/**
 * ThemeToggle — physical 3D capsule switch.
 * Press → flip mid-press → spring back, so the swap reads as a thumbed
 * physical action rather than an instant CSS class change.
 */
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [pressed, setPressed] = useState(false);
  const isDark = theme === "dark";

  const handleClick = () => {
    if (PREFERS_REDUCED_MOTION) {
      toggleTheme();
      return;
    }
    setPressed(true);
    setTimeout(() => {
      toggleTheme();
      setTimeout(() => setPressed(false), 400);
    }, 140);
  };

  return (
    <div className={`tt-wrap${isDark ? "" : " tt-wrap--light"}`}>
      <div className="tt-glow-wide" />
      <div className="tt-glow-mid" />
      <div className="tt-glow-core" />
      <button
        className={`tt${isDark ? "" : " tt--light"}${pressed ? " tt--pressed" : ""}`}
        onClick={handleClick}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <span className="tt-track">
          <span className="tt-recess" />
          <span className="tt-floor-glow" />
          <span className="tt-knob">
            <span className={`tt-icon${isDark ? " tt-icon--visible" : ""}`}>
              <Moon size={12} />
            </span>
            <span className={`tt-icon${isDark ? "" : " tt-icon--visible"}`}>
              <Sun size={12} />
            </span>
          </span>
          <span className="tt-rim" />
        </span>
      </button>
      <div className="tt-shadow" />
    </div>
  );
}
