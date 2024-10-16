"use client";

/**
 * File Path: @/app/members/code/page.tsx
 * 
 * Member Code Page Component
 * --------------------------
 * This component manages the redirection of users based on their lesson progress stored in `localStorage`.
 * It checks if the `lessonStage` exists in `localStorage` and redirects users accordingly.
 * If no progress is found, the component initializes the `lessonStage` and redirects the user to the welcome page.
 */

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for client-side navigation

/**
 * MemberCodePage Component
 * 
 * @remarks
 * This component checks the user's lesson progress by accessing the `lessonStage` from the browser's
 * localStorage. Based on the `lessonStage`, the user is redirected to the appropriate lesson page.
 * If no lesson progress is found, the component initializes the progress and redirects the user to the
 * welcome lesson page.
 * 
 * @returns {JSX.Element} A rendered component that shows a loading message while the redirection is being handled.
 */
export default function MemberCodePage(): JSX.Element {
  const router = useRouter();

  /**
   * useEffect Hook
   * --------------
   * On component mount, this effect checks the presence of `lessonStage` in localStorage. If it's not found,
   * the hook initializes the stage to "technical-prerequisites" and redirects the user to the technical-prerequisites lesson page.
   * If a lesson stage is found, the user is redirected to the appropriate lesson page based on the stored value.
   */
  useEffect(() => {
    const lessonStage = localStorage.getItem("lessonStage");

    if (!lessonStage) {
      // Initialize `lessonStage` to "technical-prerequisites" if it doesn't exist and redirect to the technical-prerequisites page
      localStorage.setItem("lessonStage", "technical-prerequisites");
      router.push("/members/code/technical-prerequisites");
    } else {
      // Redirect to the lesson corresponding to the current `lessonStage`
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
