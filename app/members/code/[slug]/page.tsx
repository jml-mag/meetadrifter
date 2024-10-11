// File Path: app/members/code/[slug]/page.tsx

import React from "react";
import ReactMarkdown from "react-markdown";
import "highlight.js/styles/github-dark.css"; // Use your preferred Highlight.js theme
import CodeBlock from "@/components/CodeBlock"; // Ensure this component is correctly implemented
import { cookiesClient } from "@/utils/amplifyServerUtils";
import { LessonContent, Link } from "@/types/LessonContent"; // Ensure this type is correctly defined

/**
 * PageProps Interface
 * -------------------
 * Defines the structure of the route parameters passed to the page component.
 */
interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * LessonPage Component
 * --------------------
 * Renders a lesson page based on the provided slug. It fetches the lesson content from the backend,
 * displays the documentation as formatted Markdown, renders code snippets with TypeScript syntax highlighting,
 * and displays any relevant lesson links.
 * 
 * @param {PageProps} props - The component props containing the route parameter `slug`.
 * @returns {Promise<JSX.Element>} The rendered lesson page component.
 */
const LessonPage: React.FC<PageProps> = async ({ params }) => {
  const { slug } = params;

  try {
    // Fetch the lesson data based on the slug
    const { data: lessons, errors } = await cookiesClient.models.LessonContent.list({
      filter: { slug: { eq: slug } },
    });

    // Handle errors or missing lessons
    if (errors || !lessons || lessons.length === 0) {
      console.error("Error fetching lessons:", errors);
      return <div className="text-red-500">Error loading lesson.</div>;
    }

    // Normalize the lesson data for rendering
    const lessonData = lessons[0];
    const lesson: LessonContent = {
      id: lessonData.id,
      title: lessonData.title,
      slug: lessonData.slug,
      code: lessonData.code || null, // Ensure code is either a string or null
      docs: lessonData.docs,
      isOrdered: lessonData.isOrdered,
      orderIndex: lessonData.orderIndex || null,
      links: (lessonData.links || [])
        .filter((link): link is Link => link !== null) // Filter out null values
        .map((link) => ({
          text: link.text || "", // Default to an empty string if text is null
          url: link.url || "", // Default to an empty string if URL is null
        })),
    };

    return (
      <main className="text-sm text-left">
        <div className="p-1 flex flex-col lg:flex-row gap-2">
          {/* Documentation Section */}
          <section className="lg:w-2/5">
            <div className="lg:fixed lg:top-32 lg:left-0 lg:h-[calc(100vh-8rem)] lg:w-2/5 p-4 m-1 bg-gradient-to-br from-sky-950 to-slate-950 rounded-lg overflow-y-auto pb-8">
              <ReactMarkdown className="whitespace-pre-wrap">
                {lesson.docs}
              </ReactMarkdown>

              {/* Links Section */}
              {lesson.links.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-white font-semibold mb-2">Related Links:</h3>
                  <ul className="list-disc list-inside text-blue-400">
                    {lesson.links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {link.text || link.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Code Section */}
         { (lesson.code && <section className="lg:w-3/5 p-2 bg-black rounded-lg lg:ml-auto">
            {lesson.code && <CodeBlock code={lesson.code} language="typescript" />}
          </section>)}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return <div className="text-red-500">An unexpected error occurred.</div>;
  }
};

export default LessonPage;
