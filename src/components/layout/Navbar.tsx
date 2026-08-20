/**
 * Navbar — Fixed top navigation
 * Design: "Forged Monolith" — glassmorphic nav bar with monospace labels
 * Updated: Personal branding + theme toggle + new routes
 */
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "PORTFOLIO", href: "/projects" },
  { label: "ABOUT ME", href: "/about" },
  { label: "RESUME", href: "/resume" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();

  const isActiveRoute = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  /* `initial={false}` is framer-motion's own way of saying "mount already at
     the animate state" — the chrome is simply there, rather than arriving
     faster. The mobile menu keeps its enter/exit so AnimatePresence still
     unmounts it correctly; only the duration goes to zero. */
  const reduced = useReducedMotion();

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav
        className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
      >
        <div
          className="glass-sm flex items-center justify-between px-6 py-3"
          style={{ background: "var(--nav-bg)" }}
        >
          {/* Logo / Brand — theme-aware monogram */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img
              src={theme === "dark"
                ? "/assets/brand/logo-dark.png"
                : "/assets/brand/logo-light.png"
              }
              alt="PTA"
              className="h-9 w-9 rounded-sm object-contain transition-opacity duration-300"
            />
            <span
              className="label-mono hidden sm:inline"
              style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
            >
              SPATIAL DATA SCIENCE
            </span>
          </Link>

          {/* Desktop Nav + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <div className="nav-pill-group">
              {navItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={`nav-pill${isActive ? " nav-pill--active" : ""}`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <ThemeToggle />
          </div>

          {/* Mobile: Theme Toggle + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X size={20} style={{ color: "var(--text-muted)" }} />
              ) : (
                <Menu size={20} style={{ color: "var(--text-muted)" }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduced ? 0 : undefined }}
            className="glass-sm mt-2 p-4 md:hidden"
            style={{ background: "var(--nav-bg)" }}
          >
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <span
                    className="label-mono block py-3 px-4 rounded-md transition-colors"
                    style={{
                      color: isActive ? "var(--cyan)" : "var(--text-muted)",
                      background: isActive
                        ? "rgba(0, 212, 255, 0.08)"
                        : "transparent",
                      fontSize: "0.7rem",
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
