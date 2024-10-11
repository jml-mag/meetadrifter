// @/components/LessonForm.tsx
"use client";

/**
 * File Path: @/components/LessonForm.tsx
 *
 * LessonForm Component
 * --------------------
 * This component provides a form interface for creating or updating lesson entries.
 * The form includes fields for metadata such as type, title, documentation, code, slug, and links.
 * If a lesson ID is selected, the form dynamically loads the lesson for editing.
 * On successful operations, toast notifications are triggered and the user can return to the lesson list.
 */

import React, { useState, useContext, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

/**
 * Props interface for the LessonForm component.
 */
interface LessonFormProps {
  /**
   * The ID of the selected lesson or null if no lesson is selected.
   */
  selectedLessonId: string | null;

  /**
   * A function to reset the current selection (e.g., after saving or deleting).
   */
  resetSelection: () => void;
}

/**
 * Interface for representing a link with text and URL.
 */
interface Link {
  text: string;
  url: string;
}

/**
 * LessonForm Component
 * --------------------
 * Renders a form for creating a new lesson or updating an existing one.
 * The form includes fields for type, title, documentation, code, slug, and links.
 * Users can save, update, or delete lessons.
 * 
 * @param {LessonFormProps} props - The props include the selected lesson ID and a reset function.
 * @returns {JSX.Element} The rendered form for lesson management.
 */
const LessonForm: React.FC<LessonFormProps> = ({ selectedLessonId, resetSelection }) => {
  // Form state for managing lesson properties
  const [type, setType] = useState<"setup" | "prereq" | "code">("setup");
  const [title, setTitle] = useState<string>("");
  const [docs, setDocs] = useState<string>("");
  const [code, setCode] = useState<string | undefined>(undefined);
  const [slug, setSlug] = useState<string>("");
  const [links, setLinks] = useState<Link[]>([{ text: "", url: "" }]);
  const { addToast } = useContext<ToastContextType>(ToastContext);

  useEffect(() => {
    if (selectedLessonId && selectedLessonId !== "new") {
      // Load the existing lesson for editing
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

          const cleanedLinks: Link[] = (data.links || [])
            .filter((link): link is NonNullable<typeof link> => link != null)
            .map((link) => ({
              text: link.text ?? "",
              url: link.url ?? "",
            }));

          setLinks(cleanedLinks.length > 0 ? cleanedLinks : [{ text: "", url: "" }]);
        }
      };

      fetchLesson();
    } else {
      // Clear form for new lesson creation
      setType("setup");
      setTitle("");
      setDocs("");
      setCode(undefined);
      setSlug("");
      setLinks([{ text: "", url: "" }]);
    }
  }, [selectedLessonId, addToast]);

  const handleSaveLesson = async () => {
    try {
      const formattedSlug = `${title
        .trim()
        .toLowerCase()
        .replace(/\//g, "-")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")}`;

      let result;
      setSlug(formattedSlug);

      if (selectedLessonId && selectedLessonId !== "new") {
        result = await client.models.LessonContent.update({
          id: selectedLessonId,
          type,
          title,
          docs,
          code,
          slug,
          links,
        });
      } else {
        result = await client.models.LessonContent.create({
          type,
          title,
          docs,
          code,
          slug: formattedSlug,
          links,
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

  /**
   * Adds a new link field to the form.
   */
  const addLink = (): void => {
    setLinks([...links, { text: "", url: "" }]);
  };

  /**
   * Updates a link's text or URL based on the field type.
   *
   * @param {number} index - The index of the link to update.
   * @param {string} field - The field to update ("text" or "url").
   * @param {string} value - The new value for the specified field.
   */
  const handleLinkChange = (index: number, field: "text" | "url", value: string): void => {
    const updatedLinks = [...links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setLinks(updatedLinks);
  };

  /**
   * Removes a link from the form.
   *
   * @param {number} index - The index of the link to remove.
   */
  const removeLink = (index: number): void => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks.length > 0 ? updatedLinks : [{ text: "", url: "" }]);
  };

  return (
    <section className="bg-black bg-opacity-70 rounded-lg w-full p-2" aria-labelledby="lesson-form-title">
      {/* Type Selection using Radio Buttons */}
      <header id="lesson-form-title" className="mb-4">
        <h2 className="block text-sm mb-2">Lesson Type</h2>
      </header>
      <div className="flex space-x-4 mb-4">
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

      {/* Title Input */}
      <div className="mb-4">
        <label className="block text-sm mb-2" htmlFor="lesson-title">Title</label>
        <input
          id="lesson-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          placeholder="Enter lesson title"
        />
      </div>

      {/* Documentation Input */}
      <div className="mb-4">
        <label className="block text-sm mb-2" htmlFor="lesson-docs">Documentation</label>
        <textarea
          id="lesson-docs"
          value={docs}
          onChange={(e) => setDocs(e.target.value)}
          className="form-input"
          placeholder="Enter documentation"
          rows={8}
        />
      </div>

      {/* Code Input (Optional) */}
      <div className="mb-4">
        <label className="block text-sm mb-2" htmlFor="lesson-code">Code (Optional)</label>
        <textarea
          id="lesson-code"
          value={code || ""}
          onChange={(e) => setCode(e.target.value)}
          className="form-input"
          placeholder="Enter code content"
          rows={8}
        />
      </div>

      {/* Links Section */}
      <div className="mb-6">
        <label className="block text-sm mb-2">Links</label>
        {links.map((link, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={link.text}
              onChange={(e) => handleLinkChange(index, "text", e.target.value)}
              className="form-input w-1/2"
              placeholder="Link Text"
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              className="form-input w-1/2"
              placeholder="Link URL"
            />
            <button
              className="btn btn-secondary ml-2 mb-3"
              type="button"
              onClick={() => removeLink(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button className="btn btn-primary" type="button" onClick={addLink}>
          Add Link
        </button>
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
    </section>
  );
};

export default LessonForm;
