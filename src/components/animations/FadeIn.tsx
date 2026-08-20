/**
 * FadeIn — Reusable entrance animation component
 * Design: "Forged Monolith" — slow upward drift with opacity fade
 * Uses ease-out-quint curve for weighty, deliberate motion
 */
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
  once?: boolean;
}

const getInitial = (direction: string, distance: number) => {
  switch (direction) {
    case "up":
      return { opacity: 0, y: distance };
    case "down":
      return { opacity: 0, y: -distance };
    case "left":
      return { opacity: 0, x: distance };
    case "right":
      return { opacity: 0, x: -distance };
    default:
      return { opacity: 0 };
  }
};

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 30,
  className = "",
  once = true,
}: FadeInProps) {
  /* A media query cannot reach this: framer-motion writes the transform as an
     inline style, and inline styles outrank any stylesheet rule. Honouring the
     setting has to happen in the component, so it happens here — and the
     honest answer to "reduce motion" on an entrance animation is to have no
     entrance at all rather than a faster one. Content is simply present. */
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  const variants: Variants = {
    hidden: getInitial(direction, distance),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // ease-out-quint
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
