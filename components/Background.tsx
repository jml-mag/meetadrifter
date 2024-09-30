/**
 * File Path: @/components/Background.tsx
 * 
 * Background Component
 * --------------------
 * This file defines the `Background` component, which serves as a wrapper around the animated background
 * of the application. It handles the transition effects for the background when navigating between routes.
 * 
 * The component uses Framer Motion for smooth transitions and animations, ensuring a fluid background
 * experience throughout the application.
 */

"use client";

import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";

/**
 * Background Component
 * --------------------
 * Wraps the `AnimatedBackground` component and provides animation variants for transitioning between routes.
 * Controls the opacity and transition of the background as routes change within the application.
 * 
 * @component
 * @returns {JSX.Element} The rendered `Background` component with animation effects.
 */
export function Background(): JSX.Element {
  /**
   * backgroundVariants
   * ------------------
   * Defines animation states for the background's opacity during route transitions.
   * - `enter`: Sets initial opacity when the component mounts or the route changes.
   * - `active`: Gradually increases the opacity to full visibility over 25 seconds.
   * - `exit`: Reduces the opacity back down when the component unmounts or the route changes.
   */
  const backgroundVariants = {
    enter: { opacity: 0.5 }, // Initial opacity when component mounts.
    active: { opacity: 1, transition: { duration: 25, ease: "easeInOut" } }, // Transition to full opacity.
    exit: { opacity: 0.5, transition: { duration: 25, ease: "easeInOut" } }, // Transition to reduced opacity on unmount.
  };

  // Render the animated background with route-based transitions.
  return (
    <motion.div
      initial="enter"
      animate="active"
      exit="exit"
      variants={backgroundVariants}
      className="fixed inset-0 -z-50 overflow-hidden h-screen w-screen"
    >
      {/* Render the animated background grid */}
      <AnimatedBackground />
    </motion.div>
  );
}
