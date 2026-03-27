/**
 * FadeIn — Reusable entrance animation component
 * Design: "Forged Monolith" — slow upward drift with opacity fade
 * Uses ease-out-quint curve for weighty, deliberate motion
 */
import { motion, type Variants } from "framer-motion";
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
