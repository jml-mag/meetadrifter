"use client";

/**
 * File Path: @/app/members/admin/code/page.tsx
 *
 * Admin Code Page Component
 * -------------------------
 * This file defines the AdminCodePage component, which serves as the main interface for managing all lessons.
 * It allows administrators to create, update, view, and order lesson items in a unified manner.
 */

import React, { useState } from "react";
import AllLessonsList from "@/components/AllLessonsList"; // Import unified lesson list component.
import LessonForm from "@/components/LessonForm"; // Import unified lesson form component.
import LessonOrder from "@/components/LessonOrder"; // Import LessonOrder component for managing lesson order.

type DisplayState = "list" | "form";

/**
 * AdminCodePage Component
 * -----------------------
 * Provides functionality for managing lessons and lesson ordering.
 * Displays a unified list of lessons, a form for CRUD operations, and the lesson ordering component based on user interactions.
 *
 * @component
 * @returns {JSX.Element} The rendered AdminCodePage component.
 */
export default function AdminCodePage(): JSX.Element {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [displayState, setDisplayState] = useState<DisplayState>("list");

  /**
   * Show the lesson form for creating or updating.
   *
   * @param {string | null} lessonId - The ID of the lesson to edit, or "new" for creating a new lesson.
   */
  const showLessonForm = (lessonId: string | null): void => {
    setSelectedLessonId(lessonId);
    setDisplayState("form");
  };

  /**
   * Show the list of all lessons.
   */
  const showLessonList = (): void => {
    setDisplayState("list");
  };

  // Render the main layout for managing lessons and lesson ordering.
  return (
    <main className="w-full">
      {/* Section for managing all lessons */}
      <div className="section-container flex flex-col md:flex-row md:space-x-6 w-full">
        {displayState === "list" ? (
          <div className="w-full">
            <AllLessonsList onSelectItem={showLessonForm} />
            <button
              className="btn btn-primary mt-4"
              onClick={() => showLessonForm("new")}
            >
              Add New Lesson
            </button>
          </div>
        ) : (
          <div className="w-full">
            <LessonForm
              selectedLessonId={selectedLessonId}
              resetSelection={showLessonList}
            />
          </div>
        )}
      </div>

      {/* Section for managing lesson order */}
      <div className="section-container flex flex-col md:flex-row md:space-x-6 w-full mt-8">
        <LessonOrder /> {/* Render the LessonOrder component */}
      </div>
    </main>
  );
}
