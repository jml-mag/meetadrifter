/**
 * File Path: components/Toast.tsx
 *
 * Toast Component
 * ---------------
 * This component is responsible for rendering toast notifications with animation effects.
 * It listens to the ToastContext for any updates and uses Framer Motion for smooth 
 * transitions when toasts appear or disappear. Toasts can be either success or error messages.
 */

"use client";

import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

/**
 * Animation Variants
 * ------------------
 * Defines the animation states for toasts. Controls how the toasts will enter, 
 * behave, and exit the screen with specific motion patterns.
 */
const variants = {
  hidden: { y: "-100%", opacity: 0 },  // Hidden state, starting from above with no opacity.
  visible: { y: 0, opacity: 1 },       // Visible state, fully opaque and in position.
  exit: { y: "-100%", opacity: 0 },    // Exit state, moving up and fading out.
};

/**
 * Toast Component
 * ---------------
 * This functional component renders a list of toast notifications from the ToastContext.
 * Each toast is animated using framer-motion and can be dismissed by clicking the close button.
 * 
 * @returns {JSX.Element} The rendered Toast component containing toast notifications.
 */
const Toast: React.FC = (): JSX.Element => {
  // Access the toasts array and removeToast function from the ToastContext.
  const { toasts, removeToast } = useContext<ToastContextType>(ToastContext);

  return (
    <section className="fixed top-0 w-full z-50" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}  // Use a unique key for each toast notification.
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}  // Apply the animation variants.
            transition={{ duration: 0.5 }}  // Set the animation duration.
            className={`text-lg p-3 max-w-md m-auto rounded-lg shadow bg-opacity-90 mt-1 ${
              toast.messageType === "success"
                ? "shadow-green-900 bg-green-600 text-green-50"  // Styling for success toasts.
                : "shadow-red-900 bg-red-600 text-red-50"        // Styling for error toasts.
            }`}
          >
            <div className="p-3 grid grid-cols-[auto,1fr] gap-2 items-center font-extralight">
              <div className="flex-grow">{toast.message}</div>
              <button
                onClick={() => toast.id && removeToast(toast.id)}  // Remove the toast when the close button is clicked.
                className="justify-self-end"
                aria-label="Close notification"
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
    </section>
  );
};

export default Toast;
