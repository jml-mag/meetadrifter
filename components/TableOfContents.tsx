"use client";

/**
 * File Path: @/components/TableOfContents.tsx
 *
 * TableOfContents Component
 * -------------------------
 * This component provides a slide-in table of contents (TOC) for navigating through a sorted list of lessons.
 * Users can toggle the visibility of the TOC, and it closes when a user clicks outside or selects a lesson link.
 * The component ensures accessibility, prevents body scrolling when open, and handles focus management.
 */

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { XCircleIcon } from "@heroicons/react/24/solid";

/**
 * Interface representing a lesson object.
 */
interface Lesson {
  /**
   * The slug (URL-friendly identifier) for the lesson.
   */
  slug: string;

  /**
   * The title of the lesson.
   */
  title: string;
}

/**
 * Props interface for the TableOfContents component.
 */
interface TableOfContentsProps {
  /**
   * Array of lessons sorted in the desired order.
   */
  sortedLessonOrder: Lesson[];
}

/**
 * TableOfContents Component
 * -------------------------
 * This component renders a slide-in table of contents (TOC) panel that displays a list of lessons.
 * The user can toggle the TOC panel open or closed, and it automatically closes when the user
 * clicks outside of it or selects a lesson link. The TOC panel provides keyboard and screen reader
 * accessibility features and prevents scrolling while the TOC is open.
 *
 * @param {TableOfContentsProps} props - The component props containing a sorted list of lessons.
 * @returns {JSX.Element} The rendered table of contents with a toggle button and interactive lesson links.
 */
const TableOfContents: React.FC<TableOfContentsProps> = ({ sortedLessonOrder }) => {
  const [isOpen, setIsOpen] = useState(false); // State to track the open/closed state of the TOC.
  const tocRef = useRef<HTMLDivElement>(null); // Reference to the TOC panel.
  const buttonRef = useRef<HTMLButtonElement>(null); // Reference to the toggle button.

  /**
   * Toggles the TOC panel open or closed.
   */
  const toggleOpen = () => setIsOpen((prev) => !prev);

  /**
   * Closes the TOC if a click occurs outside the panel.
   * 
   * @param {MouseEvent} event - The click event.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tocRef.current &&
        !tocRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when TOC is open
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      // Restore scrolling when TOC is closed
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  /**
   * Handles closing the TOC when a link is clicked and returns focus to the toggle button.
   */
  const handleLinkClick = () => {
    setIsOpen(false);
    buttonRef.current?.focus(); // Return focus to the toggle button after closing the TOC.
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={toggleOpen}
        className="fixed w-16 md:w-28 top-16 md:top-16 left-0 z-0 text-white bg-black bg-opacity-50 p-1 py-2 border-r border-b border-t border-white text-xs rounded-tr-lg rounded-br-lg"
        aria-label={isOpen ? "Close Table of Contents" : "Show Table of Contents"}
        aria-expanded={isOpen}
        aria-controls="toc-panel"
      >
        {isOpen ? "" : "Table of Contents"}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-30"
          />
        )}
      </AnimatePresence>

      {/* Table of Contents Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="toc-panel"
            id="toc-panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed z-40 top-0 left-0 h-full w-full max-w-md bg-gradient-to-br from-black to-slate-950 shadow-lg overflow-y-auto"
            ref={tocRef}
            aria-labelledby="toc-title"
          >
            {/* Header Inside TOC */}
            <header className="flex justify-between items-center p-4 border-b">
              <h2 id="toc-title" className="text-lg font-extralight">
                Table of Contents
              </h2>
              {/* Close Button Inside TOC */}
              <button
                onClick={toggleOpen}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
                aria-label="Close Table of Contents"
              >
                <XCircleIcon className="size-8 text-white" />
              </button>
            </header>

            {/* TOC Links */}
            <nav className="p-4 text-left">
              <ul>
                {sortedLessonOrder.map((lesson) => (
                  <li key={lesson.slug} className="mb-3">
                    <Link
                      href={`/members/code/${lesson.slug}`}
                      onClick={handleLinkClick}
                      className="text-white text-sm hover:underline"
                    >
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default TableOfContents;
