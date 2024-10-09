"use client";

/**
 * File Path: @/app/members/admin/code/page.tsx
 *
 * AdminCodePage Component
 * -----------------------
 * This component provides an interface for administrators to manage lessons.
 * Administrators can create, update, view, and reorder lesson items.
 */

import React, { useState } from "react";
import AllLessonsList from "@/components/AllLessonsList"; // Import unified lesson list component.
import LessonForm from "@/components/LessonForm"; // Import lesson form component for CRUD operations.
import LessonOrder from "@/components/LessonOrder"; // Import component to manage lesson ordering.

/**
 * DisplayState type
 * -----------------
 * Defines the possible states for displaying the content, either the list of lessons or the lesson form.
 */
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
  // State for tracking the currently selected lesson (for update) or "new" (for create).
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  
  // State for determining which view is displayed (list of lessons or form for CRUD operations).
  const [displayState, setDisplayState] = useState<DisplayState>("list");

  /**
   * Show the lesson form for creating or updating a lesson.
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
    <main className="section-container w-full lg:flex ">
      {/* Section for managing all lessons */}
      <div className="text-left flex flex-col md:flex-row md:space-x-6 md:mr-1 w-full">
        {displayState === "list" ? (
          <div className="w-full">
            <AllLessonsList onSelectItem={showLessonForm} />
            <button
              className="btn btn-primary mt-4 lg:mt-0"
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
      <div className="flex flex-col md:flex-row md:space-x-6 w-full md:mr-1 mt-8 lg:mt-0">
        <LessonOrder /> {/* Render the LessonOrder component */}
      </div>
    </main>
  );
}
