import React from 'react';
import Link from 'next/link';
import CodeBlock from '@/components/CodeBlock';
import { cookiesClient } from '@/utils/amplifyServerUtils';

interface PageProps {
  params: { slug: string };
}
/*
interface LessonContent {
  id: string;
  title: string;
  slug: string;
  code?: string;
  docs: string;
  isOrdered: boolean;
  orderIndex?: number;
  moreInfoUrl?: string;
}
  */

export default async function LessonPage({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = params;

  // Fetch the lesson data based on the slug
  const { data: lessons, errors } = await cookiesClient.models.LessonContent.list({
    filter: { slug: { eq: slug } },
  });

  if (errors) {
    console.error('Error fetching lessons:', errors);
    return <div>Error loading lesson.</div>;
  }

  // Fetch ordered lessons
  const { data: lessonOrderData, errors: orderErrors } = await cookiesClient.models.LessonContent.list({
    filter: { isOrdered: { eq: true } },
  });

  if (orderErrors) {
    console.error('Error fetching lesson order data:', orderErrors);
    return <div>Error loading lessons.</div>;
  }

  // Normalize the lesson data
  const lesson = (lessons || [])[0] || null;

  if (!lesson) return <div>Lesson not found</div>;

  const sortedLessonOrder = (lessonOrderData || []).sort(
    (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
  );

  const currentLessonIndex = sortedLessonOrder.findIndex((item) => item.slug === slug);
  const nextLesson = sortedLessonOrder[currentLessonIndex + 1];
  const prevLesson = sortedLessonOrder[currentLessonIndex - 1];

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {/* Table of Contents */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
        <ul className="space-y-2">
          {sortedLessonOrder.map((item, index) => (
            <li key={item.slug}>
              <Link href={`/members/code/${item.slug}`}>
                {index + 1}. {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>

      {/* Documentation Section */}
      <div className="prose lg:prose-xl max-w-none">
        <div dangerouslySetInnerHTML={{ __html: lesson.docs }} />
      </div>

      {/* Code Section */}
      {lesson.code && (
        <div className="bg-gray-800 text-white p-4 rounded mt-6 relative">
          <CodeBlock code={lesson.code} language="javascript" />
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        {prevLesson && (
          <Link href={`/members/code/${prevLesson.slug}`}>
            &larr; Previous: {prevLesson.title}
          </Link>
        )}
        {nextLesson && (
          <Link href={`/members/code/${nextLesson.slug}`}>
            Next: {nextLesson.title} &rarr;
          </Link>
        )}
      </div>
    </main>
  );
}
