"use client";

/**
 * File Path: @/app/members/admin/code/page.tsx
 * 
 * AdminCodePage Component
 * -----------------------
 * This component provides an interface for administrators to manage lessons. Administrators can create new lessons,
 * update existing ones, and reorder lesson items. The page integrates several components to handle these operations,
 * including lesson listing, CRUD operations, and lesson ordering.
 */

import React, { useState } from "react";
import AllLessonsList from "@/components/AllLessonsList"; // Component for listing all lessons
import LessonForm from "@/components/LessonForm"; // Component for creating or updating lessons
import LessonOrder from "@/components/LessonOrder"; // Component for managing lesson order

/**
 * DisplayState Type
 * -----------------
 * Defines the possible states for displaying content on the page: either the lesson list or the lesson form.
 */
type DisplayState = "list" | "form";

/**
 * AdminCodePage Component
 * 
 * @remarks
 * This component is designed for administrators to manage lessons within the application. It provides
 * functionalities to display a list of all lessons, handle CRUD operations through a lesson form, and
 * manage the order of lessons via a dedicated section. The display state alternates between the list view
 * and the form view based on user interaction.
 * 
 * @returns {JSX.Element} The rendered AdminCodePage component for managing lessons and lesson order.
 */
export default function AdminCodePage(): JSX.Element {
  // State to track the currently selected lesson ID for update or null for creating a new lesson.
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // State to determine whether to display the list of lessons or the lesson form for CRUD operations.
  const [displayState, setDisplayState] = useState<DisplayState>("list");

  /**
   * Displays the lesson form for creating a new lesson or editing an existing lesson.
   * 
   * @param {string | null} lessonId - The ID of the lesson to edit, or "new" for creating a new lesson.
   */
  const showLessonForm = (lessonId: string | null): void => {
    setSelectedLessonId(lessonId);
    setDisplayState("form");
  };

  /**
   * Displays the list of all lessons.
   */
  const showLessonList = (): void => {
    setDisplayState("list");
  };

  // Render the main layout with sections for managing lessons and lesson order.
  return (
    <main className="section-container w-full lg:flex">
      {/* Section for managing the list of lessons or displaying the lesson form */}
      <div className="text-left flex flex-col md:flex-row md:space-x-6 md:mr-1 w-full">
        {displayState === "list" ? (
          <div className="w-full">
            <AllLessonsList onSelectItem={showLessonForm} /> {/* Render the list of all lessons */}
            <button
              className="btn btn-primary mt-4 lg:mt-2"
              onClick={() => showLessonForm("new")}
            >
              Add New Lesson
            </button>
          </div>
        ) : (
          <div className="w-full">
            <LessonForm
              selectedLessonId={selectedLessonId} // Pass the selected lesson ID for updating or null for creating a new lesson.
              resetSelection={showLessonList} // Reset to the lesson list view after form submission or cancellation.
            />
          </div>
        )}
      </div>

      {/* Section for managing the order of lessons */}
      <div className="flex flex-col md:flex-row md:space-x-6 w-full md:mr-1 mt-8 lg:mt-0">
        <LessonOrder /> {/* Render the LessonOrder component for reordering lessons */}
      </div>
    </main>
  );
}
