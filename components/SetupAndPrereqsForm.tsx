/**
 * File Path: @/components/SetupAndPrereqsForm.tsx
 *
 * SetupAndPrereqsForm Component
 * -----------------------------
 * This file defines a form component for creating and updating "setup" and "prerequisite"
 * data items. It manages form state, data fetching, and updates using AWS Amplify's data store.
 * The form provides fields for setting up titles, documentation, optional code, and URLs.
 * The component also allows for item deletion and uses toast notifications for feedback.
 */

"use client";

import React, { useState, useContext, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client with the provided schema.
const client = generateClient<Schema>();

/**
 * SetupAndPrereqsFormProps Interface
 * ----------------------------------
 * Specifies the props required by the SetupAndPrereqsForm component.
 * 
 * @interface SetupAndPrereqsFormProps
 * @property {string | null} selectedId - The ID of the setup/prereq item being edited, or "null" for new items.
 * @property {() => void} resetSelection - Callback function to reset selection and return to the list view.
 */
interface SetupAndPrereqsFormProps {
  selectedId: string | null;
  resetSelection: () => void;
}

/**
 * SetupAndPrereqsForm Component
 * -----------------------------
 * Renders a form for creating or updating setup and prerequisite data for the `SetupAndPrereqs` model.
 * This component handles the input fields, saving, and deletion of items, with proper toast notifications.
 * 
 * @component
 * @param {SetupAndPrereqsFormProps} props - The component props.
 * @returns {JSX.Element} The rendered SetupAndPrereqsForm component.
 */
const SetupAndPrereqsForm: React.FC<SetupAndPrereqsFormProps> = ({ selectedId, resetSelection }) => {
  const { addToast } = useContext<ToastContextType>(ToastContext);

  // State variables for form fields
  const [type, setType] = useState<"setup" | "prereq">("setup");
  const [title, setTitle] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [docs, setDocs] = useState<string>("");
  const [moreInfoUrl, setMoreInfoUrl] = useState<string>("");

  /**
   * useEffect Hook - Fetch Data
   * ---------------------------
   * Fetches the setup or prerequisite data when an existing item is selected
   * and populates form fields. Clears form for new entries.
   */
  useEffect(() => {
    if (selectedId && selectedId !== "new") {
      // Load existing setup/prereq for editing.
      const fetchItem = async () => {
        const { data, errors } = await client.models.SetupAndPrereqs.get({ id: selectedId });

        if (errors && errors.length > 0) {
          addToast({ messageType: "error", message: "Failed to load item." });
          console.error("Fetch item errors:", errors);
        } else if (data) {
          setType(data.type as "setup" | "prereq");
          setTitle(data.title);
          setDocs(data.docs);
          setCode(data.code || "");
          setMoreInfoUrl(data.moreInfoUrl || ""); // Set moreInfoUrl if it exists.
        }
      };

      fetchItem();
    } else {
      // Clear form fields for new setup/prereq creation.
      setType("setup");
      setTitle("");
      setDocs("");
      setCode("");
      setMoreInfoUrl("");
    }
  }, [selectedId, addToast]);

  /**
   * handleSave Function
   * -------------------
   * Handles saving or updating the form data in the Amplify data store.
   * It constructs a slug from the type and title and uses the Amplify client to save the item.
   */
  const handleSave = async () => {
    try {
      // Generate slug by concatenating type and formatted title.
      const formattedSlug = `${type}/${title.trim().toLowerCase().replace(/\s+/g, "-")}`;

      let result;
      if (selectedId && selectedId !== "new") {
        // Update existing setup/prereq without modifying lesson_order.
        result = await client.models.SetupAndPrereqs.update({
          id: selectedId,
          type,
          title,
          code,
          docs,
          moreInfoUrl, // Include moreInfoUrl in the update.
          slug: formattedSlug,
        });
      } else {
        // Create a new setup/prereq with lesson_order defaulted to 0.
        result = await client.models.SetupAndPrereqs.create({
          type,
          title,
          code,
          docs,
          moreInfoUrl, // Include moreInfoUrl in the creation.
          slug: formattedSlug,
          lesson_order: 0, // Default lesson_order to 0 for new items.
        });
      }

      // Handle potential save errors.
      if (result.errors && result.errors.length > 0) {
        addToast({ messageType: "error", message: "Failed to save data." });
        console.error("Save errors:", result.errors);
      } else {
        addToast({ messageType: "success", message: "Data saved successfully!" });
        resetSelection(); // Switch back to list view after saving.
      }
    } catch (error) {
      addToast({ messageType: "error", message: "An unexpected error occurred." });
      console.error("Save error:", error);
    }
  };

  /**
   * handleDeleteItem Function
   * -------------------------
   * Deletes the currently selected setup/prereq item from the Amplify data store.
   */
  const handleDeleteItem = async () => {
    if (!selectedId) return;

    const { errors } = await client.models.SetupAndPrereqs.delete({ id: selectedId });

    if (errors && errors.length > 0) {
      addToast({ messageType: "error", message: "Failed to delete item." });
      console.error("Delete errors:", errors);
    } else {
      addToast({ messageType: "success", message: "Item deleted successfully!" });
      resetSelection(); // Switch back to list view after deletion.
    }
  };

  // Render form layout and input fields.
  return (
    <div className="bg-black bg-opacity-70 p-2 rounded-lg w-full mb-4">
      {/* Form Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="heading text-lg mb-2 md:mb-0">Setup & Prerequisites</h2>
      </div>

      {/* Form Fields */}
      <div className="mt-4">
        {/* Type Selection */}
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
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input p-2 rounded w-full"
            placeholder="Enter title"
          />
        </div>

        {/* Documentation Input */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Documentation</label>
          <textarea
            value={docs}
            onChange={(e) => setDocs(e.target.value)}
            className="form-input p-2 rounded w-full"
            placeholder="Enter documentation"
            rows={4}
          />
        </div>

        {/* More Info URL Input */}
        <div className="mb-4">
          <label className="block text-sm mb-2">More Info URL (Optional)</label>
          <input
            type="url"
            value={moreInfoUrl}
            onChange={(e) => setMoreInfoUrl(e.target.value)}
            className="form-input p-2 rounded w-full"
            placeholder="Enter URL for more information"
          />
        </div>

        {/* Code Input */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Code (Optional)</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="form-input p-2 rounded w-full"
            placeholder="Enter code content"
            rows={8}
          />
        </div>

        {/* Save and Delete Buttons */}
        <div className="flex justify-between">
          {selectedId && selectedId !== "new" ? (
            <>
              <button className="btn btn-secondary" onClick={handleDeleteItem}>
                Delete
              </button>
              <div className="flex space-x-4">
                <button className="btn btn-secondary" onClick={resetSelection}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Update
                </button>
              </div>
            </>
          ) : (
            <div className="flex space-x-4">
              <button className="btn btn-secondary" onClick={resetSelection}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupAndPrereqsForm;
