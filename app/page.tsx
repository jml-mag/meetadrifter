/**
 * File Path: app/page.tsx
 *
 * Home Component
 * --------------
 * This file defines the Home component, which serves as the main landing page of the application.
 * It includes interactive elements such as login links and implements animations using Framer Motion.
 */

"use client";

import { useEffect } from "react";
import { motion, useAnimation, AnimationControls } from "framer-motion";
import { climate_crisis } from "@/app/fonts";
import Link from "next/link";
import { Background } from "@/components/Background";

export default function Home(): JSX.Element {
  // Animation controls for the center div, top div, button, lines, and footer.
  const centerControls: AnimationControls = useAnimation();
  const topControls: AnimationControls = useAnimation();
  const buttonControls: AnimationControls = useAnimation();
  const line1Controls: AnimationControls = useAnimation();
  const line2Controls: AnimationControls = useAnimation();
  const line3Controls: AnimationControls = useAnimation();
  const footerControls: AnimationControls = useAnimation();

  // useEffect to sequence the animations.
  useEffect(() => {
    async function sequenceAnimations() {
      // Wait 500ms after page load.
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Slide in the center div with a reduced bounce effect.
      await centerControls.start("visible");

      // Wait for 2 seconds.
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Slide out the center div to the right at a faster rate.
      await centerControls.start("slideOut");

      // Start fading in the top div 500ms after slide-out begins.
      setTimeout(async () => {
        await topControls.start("visible");

        // After the top div has fully appeared, start fading in the button.
        await buttonControls.start("visible");
      }, 500);

      // Animate the lines with delays
      await line1Controls.start("visible");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await line2Controls.start("visible");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await line3Controls.start("visible");

      // Fade in the footer after the lines
      await footerControls.start("visible");
    }

    sequenceAnimations();
  }, [
    centerControls,
    topControls,
    buttonControls,
    line1Controls,
    line2Controls,
    line3Controls,
    footerControls,
  ]);

  // Variants for the center div animations.
  const centerVariants = {
    hidden: {
      x: "-100vw", // Start completely off-screen to the left.
      opacity: 1,
    },
    visible: {
      x: 0, // Slide to center with a reduced bounce effect.
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300, // Reduced stiffness to lessen the bounce.
        damping: 25, // Increased damping to reduce oscillations.
      },
    },
    slideOut: {
      x: "100vw", // Slide off-screen to the right.
      opacity: 1,
      transition: {
        duration: 0.3, // Slide out faster than slide-in.
        ease: "easeIn",
      },
    },
  };

  // Variants for the top div animations.
  const topVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1, // Fade in over 1s.
        ease: "easeIn",
      },
    },
  };

  // Variants for the button animations.
  const buttonVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3, // Fade in quickly over 0.3s.
        ease: "easeOut",
      },
    },
  };

  // Variants for the lines animations.
  const lineVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5, // Fade in over 0.5s.
        ease: "easeIn",
      },
    },
  };

  // Variants for the footer animation.
  const footerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5, // Fade in over 0.5s.
        ease: "easeIn",
      },
    },
  };

  // Render the main structure of the home page.
  return (
    <>
      <Background />
      <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div>
          {/* Navigation link for joining or logging in. */}
          <div className="fixed top-2">
            <div>
              {/* Top div with fade-in animation. */}
              <motion.div
                className={`${climate_crisis.className} fixed top-6 left-4 text-white text-base sm:text-xl md:text-2xl lg:text-3xl`}
                variants={topVariants}
                initial="hidden"
                animate={topControls}
              >
                Meet A Drifter
              </motion.div>
              {/* Button with fade-in animation. */}
              <motion.div
                className="fixed top-4 right-4 text-center bg-yellow-600 hover:bg-yellow-500 bg-opacity-50 hover:bg-opacity-50 border border-yellow-300 text-yellow-400 hover:text-yellow-200 p-2 px-3 rounded-lg shadow-sm shadow-yellow-700 "
                variants={buttonVariants}
                initial="hidden"
                animate={buttonControls}
              >
                <Link href="/members">Login</Link>
              </motion.div>
            </div>
          </div>
          {/* Center div that slides in with reduced bounce and slides out faster to the right. */}
          <motion.div
            className={`${climate_crisis.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white`}
            variants={centerVariants}
            initial="hidden"
            animate={centerControls}
          >
            Meet A Drifter
          </motion.div>
        </div>
        <div>
          {/* Animate each line with fade-in and delay */}
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
        {/* Footer with fade-in animation */}
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
