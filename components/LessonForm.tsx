"use client";

/**
 * File Path: @/components/LessonForm.tsx
 *
 * LessonForm Component
 * --------------------
 * Provides a form interface for creating or updating lesson entries with metadata like type, title, docs, code, and slug.
 * This form dynamically loads lesson data for editing if a lesson ID is selected.
 * On successful operations, the component triggers toast notifications and provides a way to return to the lesson list view.
 */

import React, { useState, useContext, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

interface LessonFormProps {
  selectedLessonId: string | null;
  resetSelection: () => void;
}

/**
 * LessonForm Component
 * --------------------
 * Renders a form for creating a new lesson or updating an existing one, with fields for type, title, docs, and code.
 * It also provides options for saving, updating, and deleting lesson entries.
 */
const LessonForm: React.FC<LessonFormProps> = ({
  selectedLessonId,
  resetSelection,
}) => {
  const [type, setType] = useState<"setup" | "prereq" | "code">("setup");
  const [title, setTitle] = useState<string>("");
  const [docs, setDocs] = useState<string>("");
  const [code, setCode] = useState<string | undefined>(undefined);
  const [slug, setSlug] = useState<string>("");
  const { addToast } = useContext<ToastContextType>(ToastContext);

  useEffect(() => {
    if (selectedLessonId && selectedLessonId !== "new") {
      // Load existing lesson for editing
      const fetchLesson = async () => {
        const { data, errors } = await client.models.LessonContent.get({
          id: selectedLessonId,
        });

        if (errors && errors.length > 0) {
          addToast({ messageType: "error", message: "Failed to load lesson." });
          console.error("Fetch lesson errors:", errors);
        } else if (data) {
          setType(data.type as "setup" | "prereq" | "code");
          setTitle(data.title);
          setDocs(data.docs);
          setCode(data.code || undefined);
          setSlug(data.slug);
        }
      };

      fetchLesson();
    } else {
      // Clear form fields for new lesson creation
      setType("setup");
      setTitle("");
      setDocs("");
      setCode(undefined);
      setSlug("");
    }
  }, [selectedLessonId, addToast]);

  const handleSaveLesson = async () => {
    try {
      const formattedSlug = `${title
        .trim()
        .toLowerCase()
        .replace(/\//g, "-") // Replace all '/' characters with '-'
        .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
        .replace(/^-|-$/g, "")}`; // Remove leading or trailing hyphens

      let result;
      setSlug(formattedSlug);
      if (selectedLessonId && selectedLessonId !== "new") {
        // Update existing lesson
        result = await client.models.LessonContent.update({
          id: selectedLessonId,
          type,
          title,
          docs,
          code,
          slug: slug,
        });
      } else {
        // Create a new lesson
        result = await client.models.LessonContent.create({
          type,
          title,
          docs,
          code,
          slug: formattedSlug,
          isOrdered: false,
          orderIndex: null,
        });
      }

      if (result.errors && result.errors.length > 0) {
        addToast({ messageType: "error", message: "Failed to save lesson." });
        console.error("Save errors:", result.errors);
      } else {
        addToast({
          messageType: "success",
          message:
            selectedLessonId && selectedLessonId !== "new"
              ? "Lesson updated successfully!"
              : "Lesson created successfully!",
        });
        resetSelection();
      }
    } catch (error) {
      addToast({
        messageType: "error",
        message: "An unexpected error occurred.",
      });
      console.error("Save error:", error);
    }
  };

  const handleDeleteLesson = async () => {
    if (!selectedLessonId) return;

    const { errors } = await client.models.LessonContent.delete({
      id: selectedLessonId,
    });

    if (errors && errors.length > 0) {
      addToast({ messageType: "error", message: "Failed to delete lesson." });
      console.error("Delete errors:", errors);
    } else {
      addToast({
        messageType: "success",
        message: "Lesson deleted successfully!",
      });
      resetSelection();
    }
  };

  return (
    <div className="bg-black bg-opacity-70 rounded-lg w-full">
      {/* Type Selection using Radio Buttons */}
      <div className="mb-4">
        <label className="block text-sm mb-2">Type</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="setup"
              checked={type === "setup"}
              onChange={() => setType("setup")}
              className="mr-2"
            />
            Setup
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="prereq"
              checked={type === "prereq"}
              onChange={() => setType("prereq")}
              className="mr-2"
            />
            Prerequisite
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="code"
              checked={type === "code"}
              onChange={() => setType("code")}
              className="mr-2"
            />
            Code
          </label>
        </div>
      </div>

      {/* Title Input */}
      <div className="mb-4">
        <label className="block text-sm mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          placeholder="Enter lesson title"
        />
      </div>

      {/* Documentation Input */}
      <div className="mb-4">
        <label className="block text-sm mb-2">Documentation</label>
        <textarea
          value={docs}
          onChange={(e) => setDocs(e.target.value)}
          className="form-input"
          placeholder="Enter documentation"
          rows={8}
        />
      </div>

      {/* Code Input (Optional) */}
      <div className="mb-4">
        <label className="block text-sm mb-2">Code (Optional)</label>
        <textarea
          value={code || ""}
          onChange={(e) => setCode(e.target.value)}
          className="form-input"
          placeholder="Enter code content"
          rows={8}
        />
      </div>

      {/* Form Buttons */}
      <div className="flex justify-between">
        {selectedLessonId && selectedLessonId !== "new" ? (
          <>
            <button className="btn btn-secondary" onClick={handleDeleteLesson}>
              Delete
            </button>
            <div className="flex space-x-4">
              <button className="btn btn-secondary" onClick={resetSelection}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveLesson}>
                Update Lesson
              </button>
            </div>
          </>
        ) : (
          <div className="flex space-x-4">
            <button className="btn btn-secondary" onClick={resetSelection}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveLesson}>
              Save Lesson
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonForm;
