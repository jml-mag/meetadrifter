// File Path: app/members/code/[slug]/layout.tsx

import React from "react";
import Link from "next/link";
import { cookiesClient } from "@/utils/amplifyServerUtils";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import TableOfContents from "@/components/TableOfContents";
import SetLessonStage from "@/components/SetLessonStage";
import { LessonContent } from "@/types/LessonContent"; // Ensure this type is correctly defined

/**
 * Interface for the layout properties, containing route parameters and children.
 */
interface LayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

/**
 * Layout Component
 * ----------------
 * This server component fetches the ordered list of lessons, determines the current lesson's
 * position, and renders the Table of Contents and Lesson Navigation alongside the page content.
 *
 * @param {LayoutProps} props - The component props containing route parameters and children.
 * @returns {JSX.Element} The rendered Layout component.
 */
const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  const { slug } = params;

  try {
    // Fetch all ordered lessons without using the unsupported 'sort' property
    const { data: lessonOrderData, errors: orderErrors } =
      await cookiesClient.models.LessonContent.list({
        filter: { isOrdered: { eq: true } },
      });

    if (orderErrors || !lessonOrderData) {
      console.error("Error fetching lesson order data:", orderErrors);
      return <div className="text-red-500">Error loading lessons.</div>;
    }

    // Normalize and manually sort the lesson data by 'orderIndex'
    const sortedLessonOrder: LessonContent[] = lessonOrderData
      .map((lessonData) => ({
        id: lessonData.id,
        title: lessonData.title,
        slug: lessonData.slug,
        code: lessonData.code,
        docs: lessonData.docs,
        isOrdered: lessonData.isOrdered,
        orderIndex: lessonData.orderIndex,
        moreInfoUrl: lessonData.moreInfoUrl,
      }))
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

    // Determine the current lesson's position
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

    return (
      <>
        {/* Set Lesson Stage in Local Storage */}
        <SetLessonStage slug={slug} />
        <div className="relative w-full min-h-screen bg-gray-900 text-white">
          {/* Fixed Lesson Navigation */}
          <div className="fixed top-32 sm:top-28 md:top-20 left-0 right-0 bg-sky-950 bg-opacity-80 px-4 py-1 z-20">
            <div className="max-w-xl mx-auto grid grid-cols-3 items-center gap-2 rounded-lg">
              {/* Previous Lesson Link */}
              <div className="justify-self-start">
                {prevLesson && (
                  <Link
                    href={`/members/code/${prevLesson.slug}`}
                    className="text-white hover:text-green-400 transition-colors duration-200"
                    aria-label={`Go to previous lesson: ${prevLesson.title}`}
                  >
                    <ArrowLeftCircleIcon className="size-10" />
                  </Link>
                )}
              </div>

              {/* Current Lesson Title */}
              <h1 className="font-bold text-center text-sm">
                {currentLesson.title}
              </h1>

              {/* Next Lesson Link */}
              <div className="justify-self-end">
                {nextLesson && (
                  <Link
                    href={`/members/code/${nextLesson.slug}`}
                    className="text-white hover:text-green-400 transition-colors duration-200"
                    aria-label={`Go to next lesson: ${nextLesson.title}`}
                  >
                    <ArrowRightCircleIcon className="size-10" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <aside className="fixed top-20 left-4 w-64 lg:block z-20">
            <TableOfContents sortedLessonOrder={sortedLessonOrder} />
          </aside>

          {/* Main Content */}
          <main className="ml-0 mt-44 sm:mt-40 md:mt-32">
            <div className="bg-sky-950">{children}</div>
          </main>
        </div>
      </>
    );
  } catch (error) {
    console.error("Unexpected error in layout:", error);
    return <div className="text-red-500">An unexpected error occurred.</div>;
  }
};

export default Layout;
