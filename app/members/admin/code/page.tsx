"use client";

import React, { useState } from "react";
import ListFiles from "@/components/ListFiles"; // Import ListFiles component to handle file listing.
import FileForm from "@/components/FileForm"; // Import FileForm component to handle file creation and updating.

type DisplayState = "list" | "form";

/**
 * AdminCodePage Component
 * -----------------------
 * Displays either the file list or the file form based on the display state.
 * Provides functionality to add, view, update, and delete files.
 */
export default function AdminCodePage(): JSX.Element {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [displayState, setDisplayState] = useState<DisplayState>("list");

  /**
   * Switch to the form view with a specific file ID or for adding a new file.
   */
  const showForm = (fileId: string | null) => {
    setSelectedFileId(fileId);
    setDisplayState("form");
  };

  /**
   * Switch to the file list view and clear form data.
   */
  const showList = () => {
    setDisplayState("list");
  };

  return (
    <main className="w-full">
      <div className="section-container flex flex-col md:flex-row md:space-x-6 w-full">
        {displayState === "list" ? (
          // Show file list and "Add New File" button
          <div className="w-full">
            <ListFiles onSelectFile={(fileId) => showForm(fileId)} />
            <button
              className="btn btn-primary mt-4"
              onClick={() => showForm("new")}
            >
              Add New File
            </button>
          </div>
        ) : (
          // Show file form for creating or updating a file
          <div className="w-full">
            <FileForm selectedFileId={selectedFileId} resetSelection={showList} />
          </div>
        )}
      </div>
    </main>
  );
}
