"use client";

/**
 * File Path: @/app/members/code/[slug]/page.tsx
 * 
 * Lesson Page Component
 * ---------------------
 * This file defines the LessonPage component, which renders content and code for a lesson
 * based on the slug provided in the dynamic route. It uses Prism.js for syntax highlighting
 * and supports a copy functionality for code blocks.
 */

import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Prism from "prismjs";
import Link from "next/link";
import "prismjs/themes/prism-twilight.css";

// Generate the Amplify client
const client = generateClient<Schema>();

interface PageProps {
  params: { slug: string };
}

interface LessonContent {
  id: string;
  title: string;
  slug: string;
  code?: string;
  docs: string;
  isOrdered: boolean;
  orderIndex?: number;
}

/**
 * LessonPage Component
 * --------------------
 * Fetches lesson data based on the slug and renders it, including code and documentation.
 * Uses Prism.js for code highlighting and provides a copy-to-clipboard button for code sections.
 */
export default function LessonPage({ params }: PageProps): JSX.Element {
  const { slug } = params;

  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [sortedLessonOrder, setSortedLessonOrder] = useState<LessonContent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch the lesson data based on the slug
      const { data: lessons } = await client.models.LessonContent.list({
        filter: { slug: { eq: slug } },
      });
    
      // Fetch ordered lessons
      const { data: lessonOrderData } = await client.models.LessonContent.list({
        filter: { isOrdered: { eq: true } },
      });
    
      // Normalize the lesson data to handle nullable fields
      const normalizedLessons = (lessons || []).map((lesson) => ({
        ...lesson,
        code: lesson.code || undefined, // Convert `null` to `undefined` for the `code` field
        moreInfoUrl: lesson.moreInfoUrl || undefined, // Normalize `moreInfoUrl` field
        orderIndex: lesson.orderIndex ?? undefined, // Convert `null` to `undefined` for `orderIndex`
      }));
    
      // Sort lessons by orderIndex
      const sortedOrder = (lessonOrderData || []).map((lesson) => ({
        ...lesson,
        code: lesson.code || undefined, // Normalize `code` field
        moreInfoUrl: lesson.moreInfoUrl || undefined, // Normalize `moreInfoUrl` field
        orderIndex: lesson.orderIndex ?? undefined, // Convert `null` to `undefined` for `orderIndex`
      })).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    
      setLesson(normalizedLessons[0] || null);
      setSortedLessonOrder(sortedOrder);
    };
  
    fetchData();
  }, [slug]);
  
  

  useEffect(() => {
    Prism.highlightAll();
  }, [lesson]);

  if (!lesson) return <div>Lesson not found</div>;

  const currentLessonIndex = sortedLessonOrder.findIndex((item) => item.slug === slug);
  const nextLesson = sortedLessonOrder[currentLessonIndex + 1];
  const prevLesson = sortedLessonOrder[currentLessonIndex - 1];

  const handleCopy = () => {
    if (lesson?.code) {
      navigator.clipboard.writeText(lesson.code);
      alert("Code copied to clipboard!");
    }
  };

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
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded"
          >
            Copy
          </button>
          <pre className="overflow-x-auto">
            <code className="language-javascript">{lesson.code}</code>
          </pre>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        {prevLesson && (
          <Link href={`/members/code/${prevLesson.slug}`}>
            Previous: {prevLesson.title}
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
