/**
 * File Path: components/Toast.tsx
 *
 * Toast Component
 * ---------------
 * This file defines the Toast component, which is responsible for displaying toast notifications.
 * It leverages animations for showing and hiding toasts and listens to the ToastContext for any updates.
 */

"use client";

import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import motion components for animations.
import { ToastContext, ToastContextType } from "@/contexts/ToastContext"; // Import ToastContext to access toast logic and state.

/**
 * Animation Variants
 * ------------------
 * Define the animation variants for the toast notifications.
 * These control how the toast will appear, behave, and disappear.
 */
const variants = {
  hidden: { y: "-100%", opacity: 0 }, // Start from above and fade in.
  visible: { y: 0, opacity: 1 }, // End at the original position fully visible.
  exit: { y: "-100%", opacity: 0 }, // Exit by moving up and fading out.
};

/**
 * Toast Component
 * ---------------
 * This functional component renders toast notifications by mapping over the toasts array in the context.
 * It uses framer-motion for smooth animations when the toasts appear or disappear.
 *
 * @component
 * @returns {JSX.Element} The rendered Toast component.
 */
const Toast: React.FC = (): JSX.Element => {
  // Access the toasts array and removeToast function from the ToastContext.
  const { toasts, removeToast } = useContext<ToastContextType>(ToastContext);

  // Render the toast notifications with animations.
  return (
    <div className="fixed top-0 w-full z-50">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id} // Use unique key for each toast for React list rendering.
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants} // Apply the defined variants for animation.
            transition={{ duration: 0.5 }} // Set the animation duration to 0.5 seconds.
            className={`text-lg p-3 max-w-md m-auto rounded-lg shadow bg-opacity-90 mt-1 ${
              toast.messageType === "success"
                ? "shadow-green-900 bg-green-600 text-green-50" // Style for success messages using existing classes.
                : "shadow-red-900 bg-red-600 text-red-50" // Style for error messages using existing classes.
            }`}
          >
            <div className="p-3 grid grid-cols-[auto,1fr] gap-2 items-center font-extralight">
              <div className="flex-grow">{toast.message}</div>
              <button
                onClick={() => toast.id && removeToast(toast.id)} // Remove toast when the close button is clicked.
                className="justify-self-end"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
