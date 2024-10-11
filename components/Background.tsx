// @/components/Background.tsx
"use client";

import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";

/**
 * Background Component
 * --------------------
 * This component serves as a wrapper for the application's animated background,
 * handling the transition effects between route changes using Framer Motion.
 * It controls the background's opacity and ensures a smooth animation experience
 * as users navigate through different routes in the application.
 *
 * @component
 * @returns {JSX.Element} The animated background with route transition effects.
 */
export function Background(): JSX.Element {
  /**
   * Animation variants for controlling the background opacity during route transitions.
   * - `enter`: Initial state with reduced opacity when the component first renders.
   * - `active`: Gradual transition to full opacity over 25 seconds, providing a smooth fade-in effect.
   * - `exit`: Reverse transition to reduced opacity when the route changes or the component unmounts.
   */
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
      {/* Render the background animation */}
      <AnimatedBackground />
    </motion.div>
  );
}
