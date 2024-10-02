"use client";

/**
 * File Path: @/app/members/code/page.tsx
 *
 * Member Code Page Component
 * --------------------------
 * This component displays a centralized table of contents for all dynamically generated pages
 * from the `LessonContent` model, with each lesson linked for easy navigation.
 */

import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import TableOfContents from "@/components/TableOfContents";

// Generate the Amplify client
const client = generateClient<Schema>();

interface LessonContentData {
  slug: string;
  title: string;
  orderIndex: number; // Ensure this is always a number
}

/**
 * MemberCodePage Component
 * ------------------------
 * Fetches all lessons from `LessonContent` and displays a centralized table of contents.
 * The lessons are sorted by `orderIndex` and each lesson is linked for navigation.
 *
 * @component
 * @returns {JSX.Element} The rendered component displaying the table of contents.
 */
export default function MemberCodePage(): JSX.Element {
  const [lessons, setLessons] = useState<LessonContentData[]>([]);

  // Fetch lessons from the `LessonContent` model on component mount
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data: lessonsData } = await client.models.LessonContent.list({
          filter: { isOrdered: { eq: true } },
        });

        // Normalize and sort lessons by `orderIndex`
        const formattedLessons = (lessonsData || [])
          .map((item) => ({
            slug: item.slug,
            title: item.title,
            orderIndex: item.orderIndex ?? 0, // Ensure `orderIndex` is always a number
          }))
          .sort((a, b) => a.orderIndex - b.orderIndex); // Sort by `orderIndex`

        setLessons(formattedLessons);
      } catch (error) {
        console.error("Error fetching lesson data:", error);
      }
    };

    fetchLessons();
  }, []);

  return (
    <main className="w-full flex justify-center">
      <div className="w-full p-6 mt-16 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Centralized Table of Contents
        </h1>
        {/* Pass the `lessons` to `TableOfContents` for rendering */}
        <TableOfContents sortedLessonOrder={lessons} />
      </div>
    </main>
  );
}
