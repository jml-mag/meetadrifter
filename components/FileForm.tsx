/**
 * File Path: @/components/FileForm.tsx
 * 
 * FileForm Component
 * -------------------
 * Provides a form interface for creating or updating file entries with associated metadata like file path, 
 * summary (docs), and code content. This form dynamically loads file data for editing if a file ID is selected.
 * On successful operations, the component triggers toast notifications and provides a way to return to the 
 * file list view.
 */

"use client";

import React, { useState, useContext, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

/**
 * FileFormProps Interface
 * -----------------------
 * Defines the structure for the props passed to the `FileForm` component.
 * 
 * @interface FileFormProps
 * @property {string | null} selectedFileId - The ID of the file being edited or `null` if creating a new file.
 * @property {() => void} resetSelection - Function to reset the selection and return to the list view.
 */
interface FileFormProps {
  selectedFileId: string | null;
  resetSelection: () => void;
}

/**
 * FileForm Component
 * -------------------
 * Renders a form for creating a new file or updating an existing one, with fields for file path, summary, and code.
 * It also provides options for saving, updating, and deleting file entries.
 * 
 * @component
 * @param {FileFormProps} props - The component props.
 * @returns {JSX.Element} The rendered `FileForm` component.
 */
const FileForm: React.FC<FileFormProps> = ({ selectedFileId, resetSelection }) => {
  // State variables for managing file form inputs
  const [slug, setSlug] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [docs, setDocs] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const { addToast } = useContext<ToastContextType>(ToastContext); // Access toast notifications

  /**
   * useEffect Hook - Fetch File Data
   * --------------------------------
   * Fetches file data if `selectedFileId` is not "new", allowing the form to be pre-filled with existing file details.
   * If `selectedFileId` is "new", the form fields are cleared for a new file creation.
   */
  useEffect(() => {
    if (selectedFileId && selectedFileId !== "new") {
      // Load existing file for editing
      const fetchFile = async () => {
        const { data, errors } = await client.models.CodeAndDocs.get({
          id: selectedFileId,
        });

        if (errors && errors.length > 0) {
          addToast({ messageType: "error", message: "Failed to load file." });
          console.error("Fetch file errors:", errors);
        } else if (data) {
          // Populate form fields with fetched data
          setSlug(data.slug);
          setFilePath(data.filepath);
          setDocs(data.docs);
          setCode(data.code);
        }
      };

      fetchFile();
    } else {
      // Clear form fields for new file creation
      setSlug("");
      setFilePath("");
      setDocs("");
      setCode("");
    }
  }, [selectedFileId, addToast]);

  /**
   * handleSaveFile Function
   * -----------------------
   * Handles saving or updating a file entry. Generates a slug from the file path.
   * Creates a new file if `selectedFileId` is "new", otherwise updates the existing file without modifying `lesson_order`.
   * On successful save or update, triggers a toast notification and resets the view.
   */
  const handleSaveFile = async () => {
    try {
      // Generate a slug by removing the file extension and replacing "/" with "-"
      const slugWithoutSuffix = filePath.split(".").slice(0, -1).join("");
      const newSlug = slugWithoutSuffix.replace(/\//g, "-");

      let result;
      if (selectedFileId && selectedFileId !== "new") {
        // Update existing file
        result = await client.models.CodeAndDocs.update({
          id: selectedFileId,
          filepath: filePath,
          code,
          docs,
          slug: newSlug,
        });
      } else {
        // Create a new file with default `lesson_order` of 0
        result = await client.models.CodeAndDocs.create({
          filepath: filePath,
          code,
          docs,
          slug: newSlug,
          lesson_order: 0, // Default `lesson_order` to 0 for new files
        });
      }

      const { errors } = result;

      if (errors && errors.length > 0) {
        addToast({ messageType: "error", message: "Failed to save file." });
        console.error("Save errors:", errors);
      } else {
        addToast({
          messageType: "success",
          message: selectedFileId && selectedFileId !== "new"
            ? "File updated successfully!"
            : "File saved successfully!",
        });
        resetSelection(); // Switch back to list view after saving
      }
    } catch (error) {
      addToast({
        messageType: "error",
        message: "An unexpected error occurred while saving the file.",
      });
      console.error("Save error:", error);
    }
  };

  /**
   * handleDeleteFile Function
   * -------------------------
   * Deletes the selected file from the database.
   * Triggers a success or error toast notification based on the result.
   */
  const handleDeleteFile = async () => {
    if (!selectedFileId) return;

    const { errors } = await client.models.CodeAndDocs.delete({
      id: selectedFileId,
    });

    if (errors && errors.length > 0) {
      addToast({ messageType: "error", message: "Failed to delete file." });
      console.error("Delete errors:", errors);
    } else {
      addToast({ messageType: "success", message: "File deleted successfully!" });
      resetSelection(); // Switch back to list view after deletion
    }
  };

  // Render the form for file creation or editing
  return (
    <div className="bg-black bg-opacity-70 p-4 rounded-lg w-full">
      {/* File Path Input */}
      <div className="mb-4">
        <label className="block text-sm mb-2">File Path</label>
        <input
          type="text"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          className="form-input"
          placeholder="Enter file path"
        />
      </div>

      {/* Summary Input */}
      <div className="mb-4">
        <label className="block text-sm mb-2">Summary</label>
        <textarea
          value={docs}
          onChange={(e) => setDocs(e.target.value)}
          className="form-input"
          placeholder="Enter file summary"
          rows={8}
        />
      </div>

      {/* Code Input */}
      <div className="mb-4">
        <label className="block text-sm mb-2">Code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="form-input"
          placeholder="Enter code content"
          rows={16}
        />
      </div>

      {/* Form Buttons */}
      <div className="flex justify-between">
        {selectedFileId && selectedFileId !== "new" ? (
          <>
            {/* Delete Button */}
            <button className="btn btn-secondary" onClick={handleDeleteFile}>
              Delete
            </button>
            <div className="flex space-x-4">
              {/* Cancel Button */}
              <button className="btn btn-secondary" onClick={resetSelection}>
                Cancel
              </button>
              {/* Update Button */}
              <button className="btn btn-primary" onClick={handleSaveFile}>
                Update File
              </button>
            </div>
          </>
        ) : (
          <div className="flex space-x-4">
            {/* Cancel Button */}
            <button className="btn btn-secondary" onClick={resetSelection}>
              Cancel
            </button>
            {/* Save Button */}
            <button className="btn btn-primary" onClick={handleSaveFile}>
              Save File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileForm;
