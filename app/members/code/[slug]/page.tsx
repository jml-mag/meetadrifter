// File Path: app/members/code/[slug]/page.tsx

import React from "react";
import ReactMarkdown from "react-markdown";
import "highlight.js/styles/github-dark.css"; // Use your preferred Highlight.js theme
import CodeBlock from "@/components/CodeBlock"; // Ensure this component is correctly implemented
import { cookiesClient } from "@/utils/amplifyServerUtils";
import { LessonContent, Link } from "@/types/LessonContent"; // Ensure these types are correctly defined

/**
 * Interface for the page route parameters.
 */
interface PageProps {
  params: {
    /**
     * The slug of the lesson to be displayed.
     */
    slug: string;
  };
}

/**
 * Component to render the Related Links section.
 *
 * @param {Object} props - Component props.
 * @param {Link[]} props.links - Array of link objects.
 * @returns {JSX.Element | null} The rendered Related Links section or null if no links.
 */
const LinksSection: React.FC<{ links: Link[] }> = ({ links }) => {
  if (links.length === 0) return null;
  return (
    <div className="mt-4">
      <h3 className="text-white font-semibold mb-2">Related Links:</h3>
      <ul className="list-disc list-inside text-blue-400">
        {links.map((link, index) => (
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
  );
};

/**
 * LessonPage Component
 * --------------------
 * Renders a lesson page based on the provided slug. It fetches the lesson content from the backend,
 * displays the documentation as formatted Markdown, renders code snippets with syntax highlighting,
 * and displays any relevant lesson links.
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
        .filter((link): link is Link => {
          if (link === null) return false;
          const text = link.text?.trim() ?? "";
          const url = link.url?.trim() ?? "";
          return text.length > 0 || url.length > 0;
        }) // Filter out links where both text and URL are empty or whitespace
        .map((link) => ({
          text: link.text?.trim() ?? "", // Trim whitespace and default to empty string
          url: link.url?.trim() ?? "",   // Trim whitespace and default to empty string
        })),
    };

    return (
      <main className="text-sm text-left">
        {lesson.code ? (
          // Layout when code is present
          <div className="p-1 flex flex-col lg:flex-row gap-2">
            {/* Documentation Section */}
            <section className="lg:w-2/5">
              <div className="lg:fixed lg:top-32 lg:left-0 lg:h-[calc(100vh-8rem)] lg:w-2/5 p-4 m-1 bg-gradient-to-br from-sky-950 to-slate-950 rounded-lg overflow-y-auto pb-8">
                <ReactMarkdown className="text-inherit whitespace-pre-wrap">
                  {lesson.docs}
                </ReactMarkdown>
                {/* Links Section */}
                <LinksSection links={lesson.links} />
              </div>
            </section>

            {/* Code Section */}
            <section className="lg:w-3/5 p-2 bg-black rounded-lg lg:ml-auto">
              <CodeBlock code={lesson.code} language="typescript" />
            </section>
          </div>
        ) : (
          // Layout when code is absent
          <div className="section-container relative top-12 w-full sm:max-w-md md:max-w-lg lg:max-w-2xl m-auto">
            <div className="p-6 bg-gradient-to-br from-sky-950 to-slate-950 rounded-lg">
              <ReactMarkdown className="text-justify text-sm">
                {lesson.docs}
              </ReactMarkdown>
              {/* Links Section */}
              <LinksSection links={lesson.links} />
            </div>
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return (
      <div className="text-red-500">An unexpected error occurred.</div>
    );
  }
};

export default LessonPage;
