"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { XCircleIcon } from "@heroicons/react/24/solid";

interface Lesson {
  slug: string;
  title: string;
}

interface TableOfContentsProps {
  sortedLessonOrder: Lesson[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  sortedLessonOrder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Toggle the open state
  const toggleOpen = () => setIsOpen((prev) => !prev);

  // Close TOC when clicking outside
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

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close TOC when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
    // Return focus to the toggle button after closing
    buttonRef.current?.focus();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={toggleOpen}
        className="fixed w-16 top-24 left-0 z-40 text-yellow-400 bg-black bg-opacity-50 p-1 py-2 border-r border-b border-t border-yellow-400 text-xs rounded-tr-lg rounded-br-lg"
        aria-label={isOpen ? "Close Table of Contents" : "Show Table of Contents"}
        aria-expanded={isOpen}
        aria-controls="toc-panel"
      >
        {isOpen ? "" : "Table of Contents" }
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
            className="fixed top-0 left-0 h-full w-full max-w-md bg-gradient-to-br from-black to-slate-950 z-40 shadow-lg overflow-y-auto"
            ref={tocRef}
            aria-labelledby="toc-title"
          >
            {/* Header Inside TOC */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 id="toc-title" className="text-lg font-extralight">
                Table of Contents
              </h2>
              {/* Close Button Inside TOC */}
              <button
                onClick={toggleOpen}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
                aria-label="Close Table of Contents"
              >
                <XCircleIcon className="size-6 text-white" />
              </button>
            </div>

            {/* TOC Links */}
            <nav className="p-4">
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
