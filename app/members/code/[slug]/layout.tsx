/**
 * File Path: app/members/code/[slug]/layout.tsx
 * 
 * Layout Component
 * ----------------
 * This component fetches the ordered list of lessons, determines the current lesson's
 * position, and renders the Table of Contents and Lesson Navigation alongside the page content.
 * The component passes `currentSlug` to the `TableOfContents` component for highlighting and srolling
 * into view.
 */

import React from "react";
import Link from "next/link";
import { cookiesClient } from "@/utils/amplifyServerUtils";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import TableOfContents from "@/components/TableOfContents";
import SetLessonStage from "@/components/SetLessonStage";
import { LessonContent } from "@/types/LessonContent";

/**
 * LayoutProps Interface
 * ---------------------
 * Defines the properties for the Layout component, including the route parameters and children.
 */
interface LayoutProps {
  /**
   * The child components to be rendered within the layout.
   */
  children: React.ReactNode;

  /**
   * Route parameters extracted from the URL.
   */
  params: {
    /**
     * The slug of the current lesson.
     */
    slug: string;
  };
}

/**
 * Layout Component
 * ----------------
 * This component serves as the layout for the lesson pages. It fetches the ordered list of lessons,
 * determines the current lesson's position, and renders the Table of Contents and navigation links.
 * 
 * @param {LayoutProps} props - The component props containing the children elements and route parameters.
 * @returns {JSX.Element} The rendered layout with lesson navigation, table of contents, and lesson content.
 */
const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  const { slug } = params;

  try {
    // Fetch the ordered list of lessons
    const { data: lessonOrderData, errors: orderErrors } =
      await cookiesClient.models.LessonContent.list({
        filter: { isOrdered: { eq: true } },
      });

    if (orderErrors || !lessonOrderData) {
      console.error("Error fetching lesson order data:", orderErrors);
      return <div className="text-red-500">Error loading lessons.</div>;
    }

    // Map and sort lessons by orderIndex
    const sortedLessonOrder: LessonContent[] = lessonOrderData
      .map(
        ({
          id,
          title,
          slug,
          code,
          docs,
          isOrdered,
          orderIndex,
          links,
        }): LessonContent => ({
          id,
          title,
          slug,
          code,
          docs,
          isOrdered,
          orderIndex,
          links: (links || []).filter(
            (link): link is { text: string; url: string } =>
              link?.text !== null && link?.url !== null
          ),
        })
      )
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

    // Find the current lesson based on the slug
    const currentLessonIndex = sortedLessonOrder.findIndex(
      (lesson) => lesson.slug === slug
    );

    if (currentLessonIndex === -1) {
      console.error(`Lesson with slug "${slug}" not found.`);
      return <div className="text-red-500">Lesson not found.</div>;
    }

    const currentLesson = sortedLessonOrder[currentLessonIndex];
    const nextLesson = sortedLessonOrder[currentLessonIndex + 1] || null;
    const prevLesson = sortedLessonOrder[currentLessonIndex - 1] || null;

    /**
     * Renders a navigation link to the previous or next lesson.
     * 
     * @param {LessonContent | null} lesson - The lesson to link to.
     * @param {"prev" | "next"} direction - The direction of navigation.
     * @returns {JSX.Element | null} The navigation link element or null if no lesson exists.
     */
    const renderNavLink = (
      lesson: LessonContent | null,
      direction: "prev" | "next"
    ): JSX.Element | null => {
      if (!lesson) return null;

      const isPrev = direction === "prev";
      const Icon = isPrev ? ArrowLeftCircleIcon : ArrowRightCircleIcon;
      const label = isPrev
        ? `Go to previous lesson: ${lesson.title}`
        : `Go to next lesson: ${lesson.title}`;

      return (
        <Link
          href={`/members/code/${lesson.slug}`}
          className="text-white hover:text-green-400 transition-colors duration-200"
          aria-label={label}
        >
          <Icon className="w-10 h-10" />
        </Link>
      );
    };

    return (
      <>
        {/* Sets the lesson stage */}
        <SetLessonStage slug={slug} />

        <div className="relative w-full min-h-screen text-white">
          {/* Navigation Header */}
          <div className="fixed top-32 sm:top-28 md:top-20 left-0 right-0 bg-sky-950 bg-opacity-100 px-4 py-1 z-20 border-b-2 border-t-2 border-white">
            <div className="max-w-xl mx-auto grid grid-cols-[auto,1fr,auto] items-center gap-2 rounded-lg">
              {/* Previous Lesson */}
              <div className="justify-self-start">
                {renderNavLink(prevLesson, "prev")}
              </div>

              {/* Current Lesson Title */}
              <h1 className="font-bold text-center text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                {currentLesson.title}
              </h1>

              {/* Next Lesson */}
              <div className="justify-self-end">
                {renderNavLink(nextLesson, "next")}
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <aside className="fixed top-20 left-4 w-64 lg:block z-20">
            <TableOfContents
              sortedLessonOrder={sortedLessonOrder}
              currentSlug={slug} // Passes the current slug to highlight the current page
            />
          </aside>

          {/* Main Content */}
          <main className="ml-0 mt-44 sm:mt-40 md:mt-32">
            <div>{children}</div>
          </main>
        </div>
      </>
    );
  } catch (error) {
    console.error("Unexpected error in layout:", error);
    return (
      <div className="text-red-500">An unexpected error occurred.</div>
    );
  }
};

export default Layout;
