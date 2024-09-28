"use client";

import React, { useState, useContext, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

interface FileFormProps {
  selectedFileId: string | null;
  resetSelection: () => void;
}

/**
 * FileForm Component
 * -------------------
 * Renders a form for creating a new file or updating an existing one.
 */
const FileForm: React.FC<FileFormProps> = ({ selectedFileId, resetSelection }) => {
  const [slug, setSlug] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [docs, setDocs] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const { addToast } = useContext<ToastContextType>(ToastContext);

  /**
   * Fetches the file data when an existing file is selected.
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
   * Handles saving or updating a file.
   */
  const handleSaveFile = async () => {
    try {
      const slugWithoutSuffix = filePath.split(".").slice(0, -1).join("");
      const newSlug = slugWithoutSuffix.replace(/\//g, "-");
      setSlug(newSlug);

      let result;
      if (selectedFileId && selectedFileId !== "new") {
        // Update existing file
        result = await client.models.CodeAndDocs.update({
          id: selectedFileId,
          filepath: filePath,
          code,
          docs,
          slug: slug,
        });
      } else {
        // Create a new file
        result = await client.models.CodeAndDocs.create({
          filepath: filePath,
          code,
          docs,
          slug: slug,
        });
      }

      const { errors } = result;

      if (errors && errors.length > 0) {
        addToast({ messageType: "error", message: "Failed to save file." });
        console.error("Save errors:", errors);
      } else {
        addToast({
          messageType: "success",
          message:
            selectedFileId && selectedFileId !== "new"
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
   * Handles deletion of the selected file.
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

  return (
    <div className="bg-black bg-opacity-70 p-4 rounded-lg w-full">
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

      <div className="mb-4">
        <label className="block text-sm mb-2">Summary</label>
        <textarea
          value={docs}
          onChange={(e) => setDocs(e.target.value)}
          className="form-input"
          placeholder="Enter file summary"
          rows={4}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-2">Code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="form-input"
          placeholder="Enter code content"
          rows={8}
        />
      </div>

      <div className="flex justify-between">
        {selectedFileId && selectedFileId !== "new" ? (
          <>
            <button className="btn btn-secondary" onClick={handleDeleteFile}>
              Delete
            </button>
            <div className="flex space-x-4">
              <button className="btn btn-secondary" onClick={resetSelection}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveFile}>
                Update File
              </button>
            </div>
          </>
        ) : (
          <div className="flex space-x-4">
            <button className="btn btn-secondary" onClick={resetSelection}>
              Cancel
            </button>
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
