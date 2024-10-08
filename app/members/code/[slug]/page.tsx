// File Path: app/members/code/[slug]/page.tsx

import React from "react";
import ReactMarkdown from "react-markdown";
// import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Use your preferred Highlight.js theme
import CodeBlock from "@/components/CodeBlock"; // Ensure this component is correctly implemented
import { cookiesClient } from "@/utils/amplifyServerUtils";
import { LessonContent } from "@/types/LessonContent"; // Ensure this type is correctly defined

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
 * displays the documentation as formatted Markdown, and renders code snippets with
 * TypeScript syntax highlighting.
 *
 * @param {PageProps} props - The component props containing the route parameter `slug`.
 * @returns {Promise<JSX.Element>} The rendered lesson page component.
 */
const LessonPage: React.FC<PageProps> = async ({ params }) => {
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

    return (
      <main className="text-sm text-left">
        {/* Documentation and Code Sections */}
        <div className="p-1 flex flex-col lg:flex-row gap-2">
          {/* Documentation Section */}
          <section className="lg:w-2/5">
            {/* Fixed Documentation Content only for lg and higher */}
            <div className="lg:fixed lg:top-32 lg:left-0 lg:h-[calc(100vh-8rem)] lg:w-2/5 p-4 m-1 bg-black bg-opacity-50 rounded-lg overflow-y-auto">
              <ReactMarkdown className="whitespace-pre-wrap">
                {lesson.docs}
              </ReactMarkdown>
            </div>
          </section>
    
          {/* Code Section */}
          <section className="lg:w-3/5 p-2 bg-black rounded-lg lg:ml-auto">
            {lesson.code && <CodeBlock code={lesson.code} language="typescript" />}
          </section>
        </div>
      </main>
    );
    
    
    
  } catch (error) {
    console.error("Unexpected error:", error);
    return <div className="text-red-500">An unexpected error occurred.</div>;
  }
};

export default LessonPage;
