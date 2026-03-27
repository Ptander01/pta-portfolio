/**
 * Navbar — Fixed top navigation
 * Design: "Forged Monolith" — glassmorphic nav bar with monospace labels
 */
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "PROJECTS", href: "/projects" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <span
              className="font-display text-lg font-bold tracking-tight"
              style={{ color: "#ffffff" }}
            >
              PTA
            </span>
            <span
              className="label-mono hidden sm:inline"
              style={{ color: "var(--cyan)", fontSize: "0.65rem" }}
            >
              GEOSPATIAL INTELLIGENCE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className="label-mono relative px-4 py-2 rounded-md transition-all duration-200"
                    style={{
                      color: isActive ? "#00d4ff" : "#8892b0",
                      background: isActive
                        ? "rgba(0, 212, 255, 0.08)"
                        : "transparent",
                      fontSize: "0.7rem",
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-[2px]"
                        style={{ background: "#00d4ff" }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={20} style={{ color: "#8892b0" }} />
            ) : (
              <Menu size={20} style={{ color: "#8892b0" }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-sm mt-2 p-4 md:hidden"
            style={{ background: "var(--nav-bg)" }}
          >
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <span
                    className="label-mono block py-3 px-4 rounded-md transition-colors"
                    style={{
                      color: isActive ? "#00d4ff" : "#8892b0",
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
