"use client";

/**
 * File Path: app/page.tsx
 *
 * Home Component
 * --------------
 * This component renders the home page of the application, including animated text elements and a footer.
 * It leverages Framer Motion for animations that are triggered when the component is mounted. The animations
 * include text sliding in, lines appearing sequentially, and the footer fading in.
 */

import { useEffect, useState, MouseEvent } from "react";
import {
  motion,
  useAnimation,
  AnimationControls,
  Variants,
} from "framer-motion";
import { climate_crisis, tiltWarp } from "@/app/fonts"; // Import custom fonts
import Link from "next/link";
import { Background } from "@/components/Background";
import  Pitch from "@/components/Pitch";

/**
 * Home Component
 *
 * @remarks
 * This component sets up the main layout for the home page and integrates various animations
 * using Framer Motion. It ensures that the animations play sequentially on component mount.
 * The home page contains animated lines of text, a clickable footer, and a background component.
 *
 * @returns {JSX.Element} The rendered home page with animations and interactive elements.
 */
export default function Home(): JSX.Element {
  // Animation controls for different elements of the home page.
  const centerControls: AnimationControls = useAnimation();
  const topControls: AnimationControls = useAnimation();
  const line1Controls: AnimationControls = useAnimation();
  const line2Controls: AnimationControls = useAnimation();
  const line3Controls: AnimationControls = useAnimation();
  const footerControls: AnimationControls = useAnimation();
  const pitchControls: AnimationControls = useAnimation(); // New animation controls for "pitch goes here"

  // State to track if the component has mounted and if animations have completed.
  const [mounted, setMounted] = useState<boolean>(false);
  const [animationsComplete, setAnimationsComplete] = useState<boolean>(false);

  // Set the component as mounted after initial render.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger the animation sequence once the component is mounted.
  useEffect(() => {
    if (!mounted) return;

    const sequenceAnimations = async () => {
      // Start the animations with delays between different elements.
      await new Promise((resolve) => setTimeout(resolve, 500));
      await centerControls.start("visible");

      await new Promise((resolve) => setTimeout(resolve, 2000));
      await centerControls.start("slideOut");

      setTimeout(async () => {
        await topControls.start("visible");
      }, 500);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      await line1Controls.start("visible");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await line2Controls.start("visible");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await line3Controls.start("visible");

      await footerControls.start("visible");
      setAnimationsComplete(true);

      // After footer animation is done, wait for 750ms and fade out the lines.
      await new Promise((resolve) => setTimeout(resolve, 750));
      await Promise.all([
        line1Controls.start("hidden"),
        line2Controls.start("hidden"),
        line3Controls.start("hidden"),
      ]);

      // Quickly fade in the "pitch goes here" div
      await pitchControls.start("visible");
    };

    sequenceAnimations();
  }, [
    mounted,
    centerControls,
    topControls,
    line1Controls,
    line2Controls,
    line3Controls,
    footerControls,
    pitchControls,
  ]);

  /**
   * Handles clicks on links and prevents navigation until animations are complete.
   *
   * @param e - The mouse event triggered by clicking a link.
   */
  const handleClick = (e: MouseEvent<HTMLAnchorElement>): void => {
    if (!animationsComplete) e.preventDefault();
  };

  // Animation variants for the center text.
  const centerVariants: Variants = {
    hidden: { x: "-100vw", opacity: 1 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    slideOut: {
      x: "100vw",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  // Animation variants for the top text.
  const topVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: "easeIn" } },
  };

  // Animation variants for the footer.
  const footerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeIn" } },
  };

  // Animation variants for the animated lines of text.
  const lineVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeIn" } },
  };

  // Animation variants for the "pitch" div.
  const pitchVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeIn" } },
  };

  // Render the home page structure.
  return (
    <>
      <Background />
      <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* Top text with fade-in animation */}
        <motion.div
          className={`${climate_crisis.className} fixed top-6 left-4 text-white text-base sm:text-xl md:text-2xl lg:text-3xl`}
          variants={topVariants}
          initial="hidden"
          animate={topControls}
        >
          Meet A Drifter
        </motion.div>

        {/* Center text with slide-in and slide-out animations */}
        <motion.div
          className={`${climate_crisis.className} fixed top-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white text-center`}
          variants={centerVariants}
          initial="hidden"
          animate={centerControls}
        >
          Meet A Drifter
        </motion.div>

        {/* Animated lines of text with fade-in effect */}
        <div
          className={`${tiltWarp.className} fixed top-1/3 left-4 lg:left-1/3 lg-left-0 w-full text-xl sm:text-3xl md:text-4xl md:leading-loose text-left`}
        >
          <motion.div
            variants={lineVariants}
            initial="hidden"
            animate={line1Controls}
          >
            The website you join
          </motion.div>
          <motion.div
            variants={lineVariants}
            initial="hidden"
            animate={line2Controls}
          >
            so that you can build for yourself
          </motion.div>
          <motion.div
            variants={lineVariants}
            initial="hidden"
            animate={line3Controls}
          >
            the website you just joined.
          </motion.div>
        </div>
        <div className="fixed top-16 bottom-10 left-0 right-0 overflow-y-scroll overflow-x-auto">
          {/* Pitch text fade in animation */}
          <motion.div
            className="w-full text-sm"
            variants={pitchVariants}
            initial="hidden"
            animate={pitchControls}
          >
            <Pitch />
          </motion.div>
        </div>
        {/* Login button with fade-in animation */}
        <motion.div
          className="fixed top-4 right-4 text-center bg-yellow-500 hover:bg-yellow-300  border-2 border-yellow-50 text-black font-bold p-2 px-3 rounded-lg shadow shadow-yellow-300"
          variants={footerVariants}
          initial="hidden"
          animate={footerControls}
        >
          <Link href="/members" onClick={handleClick}>
            Join/Login
          </Link>
        </motion.div>

        {/* Attribution link with fade-in animation */}
        <motion.a
          href="https://www.matterandgas.com"
          className="text-white p-2 fixed bottom-2 right-3 text-xs"
          variants={footerVariants}
          initial="hidden"
          animate={footerControls}
        >
          © {new Date().getFullYear()} MeetADrifter
        </motion.a>
      </main>
    </>
  );
}
