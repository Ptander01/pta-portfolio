/**
 * PageTransition — Wraps page content with enter/exit animations
 * Design: "Forged Monolith" — fade with subtle vertical shift
 */
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export default function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  /* See FadeIn — inline transforms are unreachable from CSS, so the branch
     lives here. A page that slides on every navigation is exactly the motion
     this setting exists to switch off. */
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
