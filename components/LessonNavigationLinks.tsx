/**
 * File Path: app/members/code/[slug]/LessonNavigationLinks.tsx
 * 
 * Lesson Navigation Links Component
 * ---------------------------------
 * This component renders navigation links for previous and next lessons.
 * It ensures a clear and accessible layout for lesson progression, 
 * with appropriate icons indicating the direction of navigation.
 */

import React from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

/**
 * LessonNavigationLinksProps Interface
 * ------------------------------------
 * Defines the structure of the props passed to the `LessonNavigationLinks` component.
 * It includes optional `prevLesson` and `nextLesson` objects containing the slug and title.
 */
interface LessonNavigationLinksProps {
  prevLesson?: { slug: string; title: string }; // Optional previous lesson
  nextLesson?: { slug: string; title: string }; // Optional next lesson
}

/**
 * LessonNavigationLinks Component
 * -------------------------------
 * Renders navigation links for navigating between lessons. If a previous or next lesson is available,
 * a clickable link is rendered, styled as a button with directional arrows and lesson titles.
 * 
 * @param {LessonNavigationLinksProps} props - The props containing previous and next lesson information.
 * @returns {JSX.Element} The rendered component with navigation links.
 */
const LessonNavigationLinks: React.FC<LessonNavigationLinksProps> = ({
  prevLesson,
  nextLesson,
}) => (
  <div className="section-container mt-8 flex justify-around text-lg font-bold">
    {/* Previous Lesson Link */}
    {prevLesson && (
      <Link href={`/members/code/${prevLesson.slug}`} aria-label={`Go to previous lesson: ${prevLesson.title}`}>
        <div className="bg-green-900 p-2 px-4 text-xs rounded-lg shadow-lg flex items-center">
          <ArrowLeftIcon className="size-8 mr-2" />
          {prevLesson.title}
        </div>
      </Link>
    )}
    
    {/* Next Lesson Link */}
    {nextLesson && (
      <Link href={`/members/code/${nextLesson.slug}`} aria-label={`Go to next lesson: ${nextLesson.title}`}>
        <div className="bg-green-900 p-2 text-xs rounded-lg shadow-lg flex items-center">
          {nextLesson.title}
          <ArrowRightIcon className="size-8 ml-2" />
        </div>
      </Link>
    )}
  </div>
);

export default LessonNavigationLinks;
