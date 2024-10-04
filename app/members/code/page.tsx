"use client";

/**
 * File Path: @/app/members/code/page.tsx
 *
 * Member Code Page Component
 * --------------------------
 * This component checks the user's lesson progress stored in `localStorage` and redirects them
 * to the appropriate lesson page. If no progress is found, it initializes the progress and
 * redirects to the welcome page.
 */

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for client-side navigation

/**
 * MemberCodePage Component
 * ------------------------
 * Handles user redirection based on the `lessonStage` in `localStorage`.
 * If `lessonStage` is not set, initializes it to "welcome" and redirects.
 * If `lessonStage` exists, redirects to the corresponding lesson page.
 *
 * @component
 * @returns {JSX.Element} The rendered component displaying a loading message during redirection.
 */
export default function MemberCodePage(): JSX.Element {
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

  return (
    <main className="w-full flex justify-center">
      <div className="w-full p-6 mt-16 max-w-3xl mx-auto">
        <span>Checking lesson progress...</span>
      </div>
    </main>
  );
}
