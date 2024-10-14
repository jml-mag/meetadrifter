"use client";

/**
 * File Path: app/members/admin/code/page.tsx
 * 
 * AdminCodePage Component
 * -----------------------
 * This component provides an interface for administrators to manage lessons. Administrators can create new lessons,
 * update existing ones, and reorder lesson items. The page integrates several components to handle these operations,
 * including lesson listing, CRUD operations, and lesson ordering.
 * 
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
    <main className="w-full text-sm text-left min-h-screen">
      <div className="p-2 flex flex-col lg:flex-row gap-4">
        {/* Lesson Management Section */}
        <section className="lg:w-[38%]">
          <div className="lg:fixed lg:top-20 h-[calc(100vh-5rem)] lg:bottom-4 lg:left-4 lg:w-[38%] p-2 section-container rounded-lg">
            {displayState === "list" ? (
              <div className="w-full h-full">
                <AllLessonsList onSelectItem={showLessonForm} />
              </div>
            ) : (
              <div className="w-full h-full">
                <LessonForm
                  selectedLessonId={selectedLessonId}
                  resetSelection={showLessonList}
                />
              </div>
            )}
          </div>
        </section>

        {/* Lesson Order Section */}
        <section className="lg:w-[56%]">
          <div className="lg:fixed lg:top-20 h-[calc(100vh-5rem)] lg:bottom-4 lg:left-[42%] lg:w-[56%] p-2 section-container rounded-lg">
            <div className="w-full h-full">
              <LessonOrder />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
