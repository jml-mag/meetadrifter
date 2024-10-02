// app/members/code/layout.tsx

'use client';

import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import TableOfContents from "@/components/TableOfContents";
import LessonNavigationLinks from "@/components/LessonNavigationLinks";

// Generate the Amplify client
const client = generateClient<Schema>();

interface LessonContentData {
  id: string;
  title: string;
  slug: string;
  isOrdered: boolean;
  orderIndex: number;
  // Add `docs` and `code` as optional in case they are null
  docs?: string | null;
  code?: string | null;
}

interface LayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

/**
 * Layout Component
 * ----------------
 * Fetches all lessons data and provides it to child components as props.
 */
const Layout: React.FC<LayoutProps> = ({ children, params }) => {
  const [sortedLessonOrder, setSortedLessonOrder] = useState<LessonContentData[]>([]);

  // Fetch lessons on mount and set them in state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: lessonOrderData } = await client.models.LessonContent.list({
          filter: { isOrdered: { eq: true } },
        });

        // Normalize and sort lessons
        const sortedOrder = (lessonOrderData || [])
          .map((lesson) => ({
            ...lesson,
            orderIndex: lesson.orderIndex ?? 0,
            docs: lesson.docs || "", // Handle potential null values for `docs`
            code: lesson.code || "", // Handle potential null values for `code`
          }))
          .sort((a, b) => a.orderIndex - b.orderIndex);

        setSortedLessonOrder(sortedOrder);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchData();
  }, [params.slug]);

  return (
    <div className="relative min-h-screen">
      {/* Table of Contents */}
      <div className="fixed top-0 w-full z-20">
        <TableOfContents sortedLessonOrder={sortedLessonOrder} />
      </div>
      {/* Main Content */}
      <div className="mt-32 p-6 max-w-3xl mx-auto">
        {/* Clone children and pass the sortedLessonOrder as prop */}
        {React.isValidElement(children) &&
          React.cloneElement(children, { lessons: sortedLessonOrder })}
      </div>
    </div>
  );
};

export default Layout;
