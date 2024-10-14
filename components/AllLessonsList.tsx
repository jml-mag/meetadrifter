"use client";

/**
 * File Path: @/components/AllLessonsList.tsx
 * 
 * AllLessonsList Component
 * ------------------------
 * Renders a searchable list of all lessons from the `LessonContent` model.
 * Allows selection of an item for viewing or editing, and integrates with Amplify
 * to fetch data while utilizing toast notifications for error handling.
 */

import React, { useState, useEffect, useContext } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

/**
 * LessonData Interface
 * --------------------
 * Represents the structure of a lesson fetched from the `LessonContent` model.
 */
interface LessonData {
  id: string;   // Unique identifier for the lesson
  type: string; // The type of the lesson (e.g., tutorial, guide)
  title: string; // The title of the lesson
  docs: string; // The documentation content of the lesson
  code?: string; // Optional code content associated with the lesson
  slug: string;  // URL-friendly identifier for the lesson
}

/**
 * AllLessonsListProps Interface
 * -----------------------------
 * Defines the props expected by the `AllLessonsList` component.
 *
 * @interface AllLessonsListProps
 * @property {(id: string | null) => void} onSelectItem - Callback function to handle selection of a lesson item for viewing or editing.
 */
interface AllLessonsListProps {
  onSelectItem: (id: string | null) => void; // Callback for selecting a lesson
}

/**
 * AllLessonsList Component
 * ------------------------
 * Displays a searchable list of all lessons from the `LessonContent` model.
 * Provides filtering functionality based on user input and utilizes toast notifications
 * for displaying any errors encountered during data fetching.
 *
 * @param {AllLessonsListProps} props - The component props.
 * @returns {JSX.Element} The rendered component displaying a list of lessons.
 */
const AllLessonsList: React.FC<AllLessonsListProps> = ({ onSelectItem }) => {
  const [lessons, setLessons] = useState<LessonData[]>([]); // State for storing all lessons
  const [filteredLessons, setFilteredLessons] = useState<LessonData[]>([]); // State for filtered lessons based on search
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for managing the search term input
  const { addToast } = useContext<ToastContextType>(ToastContext); // Access the toast context

  /**
   * Fetches all lessons from the `LessonContent` model and normalizes the data.
   * If errors are encountered, a toast notification is displayed.
   */
  useEffect(() => {
    const fetchLessons = async () => {
      const { data, errors } = await client.models.LessonContent.list();

      if (errors && errors.length > 0) {
        addToast({ messageType: "error", message: "Failed to fetch lessons." });
        console.error("Fetch errors:", errors);
      } else {
        // Normalize the lesson data
        const normalizedData = (data || []).map((lesson) => ({
          ...lesson,
          code: lesson.code || undefined, // Normalize code field
        }));

        setLessons(normalizedData);
        setFilteredLessons(normalizedData); // Initialize filtered lessons with all lessons
      }
    };

    fetchLessons();
  }, [addToast]);

  /**
   * Handles changes in the search input field and filters the lessons accordingly.
   * Lessons can be filtered by title, type, or slug.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event for the search field.
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Perform filtering when the search term is at least 3 characters long
    if (term.length >= 3) {
      setFilteredLessons(
        lessons.filter(
          (lesson) =>
            lesson.title.toLowerCase().includes(term) ||
            lesson.type.toLowerCase().includes(term) ||
            lesson.slug.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredLessons(lessons); // Reset to all lessons if the search term is less than 3 characters
    }
  };

  return (
    <section className="bg-black bg-opacity-70 p-4 rounded-lg w-full mb-4 flex flex-col h-[calc(100%-70px)]">
      <div className="flex p-2 flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="heading text-lg mb-2 md:mb-0">All Lessons</h2>
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search lessons..."
          aria-label="Search lessons by title, type, or slug"
          className="form-input max-w-sm md:mt-0 md:ml-4 p-2 rounded"
        />
      </div>
      {/* List of Lessons */}
      <div className="flex-grow overflow-y-auto">
        <ul className="text-sm mt-4 ml-6">
          {filteredLessons.map((lesson) => (
            <li
              key={lesson.id}
              className="my-1 py-1 cursor-pointer text-blue-100 hover:text-blue-50"
              onClick={() => onSelectItem(lesson.id)}
              aria-label={`Select lesson: ${lesson.title}`}
            >
              {lesson.title} ({lesson.type})
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AllLessonsList;
