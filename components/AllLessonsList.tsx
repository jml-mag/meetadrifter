"use client";

/**
 * File Path: @/components/AllLessonsList.tsx
 *
 * AllLessonsList Component
 * ------------------------
 * Renders a searchable list of all lessons from the `LessonContent` model.
 * Allows selection of an item for viewing or editing.
 *
 * This component interacts with Amplify to fetch data and uses the toast notification system
 * for handling messages during data operations.
 */

import React, { useState, useEffect, useContext } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

interface LessonData {
  id: string;
  type: string;
  title: string;
  docs: string;
  code?: string;
  slug: string;
}

/**
 * AllLessonsListProps Interface
 * -----------------------------
 * Defines the props expected by the `AllLessonsList` component.
 *
 * @interface AllLessonsListProps
 * @property {(id: string | null) => void} onSelectItem - Callback function to handle selection of an item for viewing or editing.
 */
interface AllLessonsListProps {
  onSelectItem: (id: string | null) => void;
}

/**
 * AllLessonsList Component
 * ------------------------
 * Displays a list of all lessons from `LessonContent`.
 * Provides search functionality for filtering items by title, type, or slug.
 */
const AllLessonsList: React.FC<AllLessonsListProps> = ({ onSelectItem }) => {
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<LessonData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { addToast } = useContext<ToastContextType>(ToastContext);

  // Fetch all lessons from the `LessonContent` model
  useEffect(() => {
    const fetchLessons = async () => {
      const { data, errors } = await client.models.LessonContent.list();

      if (errors && errors.length > 0) {
        addToast({ messageType: "error", message: "Failed to fetch lessons." });
        console.error("Fetch errors:", errors);
      } else {
        // Normalize data by converting `null` to `undefined` for optional fields
        const normalizedData = (data || []).map((lesson) => ({
          ...lesson,
          code: lesson.code || undefined, // Normalize code field
          // Normalize any other fields if necessary
        }));

        setLessons(normalizedData);
        setFilteredLessons(normalizedData);
      }
    };

    fetchLessons();
  }, [addToast]);

  // Update the filtered lesson list based on the search term input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length >= 3) {
      setFilteredLessons(
        lessons.filter((lesson) =>
          lesson.title.toLowerCase().includes(term) ||
          lesson.type.toLowerCase().includes(term) ||
          lesson.slug.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredLessons(lessons);
    }
  };

  return (
    <div className="bg-black bg-opacity-70 rounded-lg w-full">
      <div className="flex p-2 flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="heading text-lg mb-2 md:mb-0">All Lessons</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search lessons..."
          className="form-input max-w-sm md:mt-0 md:ml-4 p-2 rounded"
        />
      </div>
      <div className="h-fit overflow-scroll">
        <ul className="text-sm mt-4 ml-6">
          {filteredLessons.map((lesson) => (
            <li
              key={lesson.id}
              className="my-1 py-1 cursor-pointer text-blue-100 hover:text-blue-50"
              onClick={() => onSelectItem(lesson.id)}
            >
              {lesson.title} ({lesson.type})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllLessonsList;
