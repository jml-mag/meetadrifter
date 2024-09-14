"use client";

import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export function Background() {
 

  // Background animation variants for other routes
  const backgroundVariants = {
    enter: { opacity: 0.5 },
    active: { opacity: 1, transition: { duration: 25, ease: "easeInOut" } },
    exit: { opacity: 0.5, transition: { duration: 25, ease: "easeInOut" } },
  };

  return (
    <motion.div
      initial="enter"
      animate="active"
      exit="exit"
      variants={backgroundVariants}
      className="fixed inset-0 -z-50 overflow-hidden h-screen w-screen"
    >
      <AnimatedBackground />
    </motion.div>
  );
}
