"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedHeadlineProps = {
  children: ReactNode;
};

export function AnimatedHeadline({ children }: AnimatedHeadlineProps) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mt-5 max-w-4xl font-display text-5xl font-bold leading-tight text-text-primary md:text-6xl"
    >
      {children}
    </motion.h1>
  );
}
