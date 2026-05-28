"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface MotionFadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
}

export function MotionFadeIn({
  delay = 0,
  distance = 16,
  duration = 0.45,
  children,
  className,
}: MotionFadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
