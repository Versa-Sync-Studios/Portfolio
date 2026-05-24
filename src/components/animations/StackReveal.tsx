"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type StackRevealProps = {
  children: ReactNode;
};

export function StackReveal({ children }: StackRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.45,
            ease: "easeOut",
            staggerChildren: 0.08,
          },
        },
      }}
      className="space-y-8"
    >
      {children}
    </motion.div>
  );
}

export function StackRevealItem({ children }: StackRevealProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}
