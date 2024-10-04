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
import { useRouter } from "next/navigation"; // Import useRouter for client-side navigation

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
 * Additionally, it checks the `lessonStage` in localStorage to determine the user's progress
 * and redirects them to the appropriate lesson page.
 *
 * @component
 * @returns {JSX.Element} The rendered component displaying the table of contents.
 */
export default function MemberCodePage(): JSX.Element {
  const [lessons, setLessons] = useState<LessonContentData[]>([]);
  const router = useRouter();

  /**
   * useEffect Hook for Handling Local Storage and Redirection
   * ---------------------------------------------------------
   * This effect runs once on component mount to check the `lessonStage` in localStorage.
   * Depending on its presence, it either initializes it and redirects to the welcome page
   * or redirects to the current lesson stage.
   */
  useEffect(() => {
    const lessonStage = localStorage.getItem("lessonStage");

    if (!lessonStage) {
      // If `lessonStage` is not set, initialize it to "welcome" and redirect
      localStorage.setItem("lessonStage", "welcome");
      router.push("/members/code/welcome");
    } else {
      // If `lessonStage` exists, redirect to the corresponding lesson page
      router.push(`/members/code/${lessonStage}`);
    }
  }, [router]);

  /**
   * useEffect Hook for Fetching Lessons
   * ------------------------------------
   * This effect fetches all lessons from the `LessonContent` model, ensuring they are
   * ordered based on `orderIndex`. The fetched lessons are then stored in the component's state.
   */
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
        <span>Checking lesson progress...</span>
        {/* Uncomment the below line to display the Table of Contents when not redirecting */}
        {/* <TableOfContents sortedLessonOrder={lessons} /> */}
      </div>
    </main>
  );
}
