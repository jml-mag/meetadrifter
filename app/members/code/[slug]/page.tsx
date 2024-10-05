// File Path: app/members/code/[slug]/page.tsx

import React from "react";
import Link from "next/link";
import { cookiesClient } from "@/utils/amplifyServerUtils";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Use your preferred Highlight.js theme
import CodeBlock from "@/components/CodeBlock"; // Ensure this component is correctly implemented
import SetLessonStage from "@/components/SetLessonStage"; // Import the SetLessonStage client component
import TableOfContents from "@/components/TableOfContents";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

/**
 * Interface representing the structure of a lesson.
 */
interface LessonContent {
  id: string;
  title: string;
  slug: string;
  code: string | null;
  docs: string;
  isOrdered: boolean;
  orderIndex: number | null;
  moreInfoUrl: string | null;
}

/**
 * Interface for the page properties, containing route parameters.
 */
interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * LessonPage Component
 * --------------------
 * Renders a lesson page based on the provided slug. It fetches the lesson content,
 * displays the documentation as formatted Markdown, renders code snippets with
 * TypeScript syntax highlighting, and includes navigation links to adjacent lessons.
 *
 * Additionally, it updates the `lessonStage` in localStorage to reflect the current lesson.
 *
 * @param {PageProps} props - The component props containing the route parameter `slug`.
 * @returns {Promise<JSX.Element>} The rendered lesson page component.
 */
export default async function LessonPage({
  params,
}: PageProps): Promise<JSX.Element> {
  const { slug } = params;

  try {
    // Fetch the lesson data based on the slug
    const { data: lessons, errors } =
      await cookiesClient.models.LessonContent.list({
        filter: { slug: { eq: slug } },
      });

    if (errors || !lessons || lessons.length === 0) {
      console.error("Error fetching lessons:", errors);
      return <div className="text-red-500">Error loading lesson.</div>;
    }

    // Fetch ordered lessons for navigation and table of contents
    const { data: lessonOrderData, errors: orderErrors } =
      await cookiesClient.models.LessonContent.list({
        filter: { isOrdered: { eq: true } },
      });

    if (orderErrors || !lessonOrderData) {
      console.error("Error fetching lesson order data:", orderErrors);
      <SetLessonStage slug=''/>
      return <div className="text-red-500">Error loading lessons.</div>;
      
    }

    // Normalize the lesson data
    const lessonData = lessons[0];
    const lesson: LessonContent = {
      id: lessonData.id,
      title: lessonData.title,
      slug: lessonData.slug,
      code: lessonData.code, // string | null
      docs: lessonData.docs,
      isOrdered: lessonData.isOrdered,
      orderIndex: lessonData.orderIndex, // number | null
      moreInfoUrl: lessonData.moreInfoUrl, // string | null
    };

    // Sort lessons by `orderIndex` to maintain the intended order
    const sortedLessonOrder = lessonOrderData.sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
    );

    // Determine the current lesson's position to set up navigation
    const currentLessonIndex = sortedLessonOrder.findIndex(
      (item) => item.slug === slug
    );
    const nextLesson = sortedLessonOrder[currentLessonIndex + 1];
    const prevLesson = sortedLessonOrder[currentLessonIndex - 1];

    return (
      <main className="text-sm">
        {/* Set Lesson Stage in Local Storage */}
        <SetLessonStage slug={slug} />

        {/* Container to constrain the layout */}
        <div className="container">
          {/* Grid container for TOC and main content */}
          <div className="">
            {/* Table of Contents */}
            <aside className="">
              <div className="rounded-lg">
                <TableOfContents sortedLessonOrder={sortedLessonOrder} />
              </div>
            </aside>
            {/* Main Content and Navigation */}
            <div className="md:col-span-3">
              {/* Lesson Navigation */}
              <div className="fixed top-32 left-0 right-0 bg-gradient-to-br from-blue-950 to-stone-950 via-black px-1 py-0.5">
                <div className="grid grid-cols-[auto,1fr,auto] items-center gap-0.5 rounded-lg">
                  {/* Previous Lesson Link */}
                  <div className="justify-self-start">
                    {prevLesson && (
                      <Link
                        href={`/members/code/${prevLesson.slug}`}
                        className="text-white hover:text-green-100 px-2"
                      >
                        <ArrowLeftCircleIcon className="size-8" />
                      </Link>
                    )}
                  </div>

                  {/* Lesson Title */}
                  <h1 className="font-bold text-xs text-center leading-none m-0 justify-self-center">
                    {lesson.title}
                  </h1>

                  {/* Next Lesson Link */}
                  <div className="justify-self-end">
                    {nextLesson && (
                      <Link
                        href={`/members/code/${nextLesson.slug}`}
                        className="text-white hover:text-green-100 px-2"
                      >
                        <ArrowRightCircleIcon className="size-8" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Documentation and Code Sections */}
              <div className="m-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Documentation Section */}
                <section className="lg:col-span-2">
                  {/* Documentation Content */}
                  <div className="mt-20 p-4 bg-black bg-opacity-70 rounded-lg">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                      {lesson.docs}
                    </ReactMarkdown>
                  </div>
                </section>

                {/* Code Section */}
                {lesson.code && (
                  <section>
                    <CodeBlock code={lesson.code} language="typescript" />
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    <SetLessonStage slug=''/>
    return <div className="text-red-500">An unexpected error occurred.</div>;
  }
}
