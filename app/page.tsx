"use client";

/**
 * File Path: app/page.tsx
 * 
 * Home Component
 * --------------------
 * Renders the main structure of the home page with animations for various elements.
 * Integrates animations for the center text, top text, lines, and footer.
 * Handles the sequence of animations on component mount.
 */

import { useEffect, useState, MouseEvent } from "react";
import { motion, useAnimation, AnimationControls, Variants } from "framer-motion";
import { climate_crisis, tiltWarp } from "@/app/fonts";
import Link from "next/link";
import { Background } from "@/components/Background";

export default function Home(): JSX.Element {
  // Animation controls for various elements.
  const centerControls: AnimationControls = useAnimation();
  const topControls: AnimationControls = useAnimation();
  const line1Controls: AnimationControls = useAnimation();
  const line2Controls: AnimationControls = useAnimation();
  const line3Controls: AnimationControls = useAnimation();
  const footerControls: AnimationControls = useAnimation();

  // State to track if component has mounted and if animations are complete.
  const [mounted, setMounted] = useState<boolean>(false);
  const [animationsComplete, setAnimationsComplete] = useState<boolean>(false);

  // Ensure component is mounted before triggering animations.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sequence the animations upon mounting.
  useEffect(() => {
    if (!mounted) return;

    const sequenceAnimations = async () => {
      // Wait before starting animations.
      await new Promise((resolve) => setTimeout(resolve, 500));
      await centerControls.start("visible");

      // Wait before sliding out center text.
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await centerControls.start("slideOut");

      // Fade in top text after slide out begins.
      setTimeout(async () => {
        await topControls.start("visible");
      }, 500);

      // Animate lines sequentially.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await line1Controls.start("visible");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await line2Controls.start("visible");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await line3Controls.start("visible");

      // Fade in footer elements.
      await footerControls.start("visible");

      // Mark animations as complete.
      setAnimationsComplete(true);
    };

    sequenceAnimations();
  }, [mounted, centerControls, topControls, line1Controls, line2Controls, line3Controls, footerControls]);

  // Handle click events only when animations are complete.
  const handleClick = (e: MouseEvent<HTMLAnchorElement>): void => {
    if (!animationsComplete) e.preventDefault();
  };

  // Variants for animations.
  const centerVariants: Variants = {
    hidden: { x: "-100vw", opacity: 1 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    slideOut: { x: "100vw", opacity: 1, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const topVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: "easeIn" } },
  };

  const footerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeIn" } },
  };

  const lineVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeIn" } },
  };

  // Render the home page structure.
  return (
    <>
      <Background />
      <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* Top text with fade-in animation. */}
        <motion.div
          className={`${climate_crisis.className} fixed top-6 left-4 text-white text-base sm:text-xl md:text-2xl lg:text-3xl`}
          variants={topVariants}
          initial="hidden"
          animate={topControls}
        >
          Meet A Drifter
        </motion.div>

        {/* Center text that slides in and slides out. */}
        <motion.div
          className={`${climate_crisis.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white`}
          variants={centerVariants}
          initial="hidden"
          animate={centerControls}
        >
          Meet A Drifter
        </motion.div>

        {/* Animated lines with fade-in effect. */}
        <div className={`${tiltWarp.className} leading-relaxed text-xl sm:text-3xl md:text-4xl md:leading-loose`}>
          <motion.div variants={lineVariants} initial="hidden" animate={line1Controls}>
            The website you join
          </motion.div>
          <motion.div variants={lineVariants} initial="hidden" animate={line2Controls}>
            so that you can build for yourself
          </motion.div>
          <motion.div variants={lineVariants} initial="hidden" animate={line3Controls}>
            the website you just joined.
          </motion.div>
        </div>

        {/* Footer and button with fade-in animation. */}
        <motion.div
          className="fixed top-4 right-4 text-center bg-yellow-600 hover:bg-yellow-500 bg-opacity-50 hover:bg-opacity-50 border border-yellow-300 text-yellow-400 hover:text-yellow-200 p-2 px-3 rounded-lg shadow-sm shadow-yellow-700"
          variants={footerVariants}
          initial="hidden"
          animate={footerControls}
        >
          <Link href="/members" onClick={handleClick}>
            Join/Login
          </Link>
        </motion.div>
        
        {/* Attribution link with fade-in animation. */}
        <motion.a
          href="https://www.matterandgas.com"
          className="text-white p-2 fixed bottom-2 right-3 text-xs"
          variants={footerVariants}
          initial="hidden"
          animate={footerControls}
        >
          © {new Date().getFullYear()} matterandgas
        </motion.a>
      </main>
    </>
  );
}
