"use client";

/**
 * File Path: @/app/members/admin/code/page.tsx
 * 
 * Admin Code Page Component
 * -------------------------
 * This file defines the AdminCodePage component, which serves as the main interface for managing files and setup/prerequisite data in the admin area.
 * It allows administrators to create, update, and view both files and setup/prerequisite items through two dynamically rendered sections.
 * The layout adjusts for different screen sizes to ensure a responsive and user-friendly experience.
 */

import React, { useState } from "react";
import ListFiles from "@/components/ListFiles"; // Import ListFiles component for file management.
import FileForm from "@/components/FileForm"; // Import FileForm component for file creation/updating.
import SetupAndPrereqsForm from "@/components/SetupAndPrereqsForm"; // Import SetupAndPrereqsForm component for setup/prereqs creation/updating.
import ListSetupAndPrereqs from "@/components/ListSetupAndPrereqs"; // Import ListSetupAndPrereqs component for setup/prereqs management.

/**
 * DisplayState Type
 * -----------------
 * Enum type to track whether to display a list view or a form view.
 */
type DisplayState = "list" | "form";

/**
 * AdminCodePage Component
 * -----------------------
 * Provides functionality for managing files and setup/prerequisite data.
 * Displays lists or forms based on user interactions, allowing creation, updating, and viewing of records.
 * 
 * @component
 * @returns {JSX.Element} The rendered AdminCodePage component.
 */
export default function AdminCodePage(): JSX.Element {
  // State for managing selected file ID and current view state for file management.
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [displayState, setDisplayState] = useState<DisplayState>("list");

  // State for managing selected setup/prerequisite ID and current view state for setup/prereqs management.
  const [selectedSetupAndPrereqId, setSelectedSetupAndPrereqId] = useState<string | null>(null);
  const [setupAndPrereqsState, setSetupAndPrereqsState] = useState<DisplayState>("list");

  /**
   * Show the file form for creating or updating.
   * 
   * @param {string | null} fileId - The ID of the file to edit, or "new" for creating a new file.
   */
  const showFileForm = (fileId: string | null): void => {
    setSelectedFileId(fileId);
    setDisplayState("form");
  };

  /**
   * Show the list of files.
   */
  const showFileList = (): void => {
    setDisplayState("list");
  };

  /**
   * Show the setup/prerequisite form for creating or updating.
   * 
   * @param {string | null} id - The ID of the setup/prerequisite to edit, or "new" for creating a new entry.
   */
  const showSetupAndPrereqsForm = (id: string | null): void => {
    setSelectedSetupAndPrereqId(id);
    setSetupAndPrereqsState("form");
  };

  /**
   * Show the list of setup/prerequisites.
   */
  const showSetupAndPrereqsList = (): void => {
    setSetupAndPrereqsState("list");
  };

  // Render the main layout for managing files and setup/prerequisites.
  return (
    <main className="w-full">
      {/* Section for managing setup/prerequisites */}
      <div className="section-container flex flex-col md:flex-row md:space-x-6 w-full">
        {setupAndPrereqsState === "list" ? (
          <div className="w-full">
            <ListSetupAndPrereqs onSelectItem={showSetupAndPrereqsForm} />
            <button
              className="btn btn-primary mt-4"
              onClick={() => showSetupAndPrereqsForm("new")}
            >
              Add New Setup/Prerequisite
            </button>
          </div>
        ) : (
          <div className="w-full">
            <SetupAndPrereqsForm
              selectedId={selectedSetupAndPrereqId}
              resetSelection={showSetupAndPrereqsList}
            />
          </div>
        )}
      </div>

      {/* Section for managing files */}
      <div className="section-container flex flex-col md:flex-row md:space-x-6 w-full">
        {displayState === "list" ? (
          <div className="w-full">
            <ListFiles onSelectFile={showFileForm} />
            <button
              className="btn btn-primary mt-4"
              onClick={() => showFileForm("new")}
            >
              Add New File
            </button>
          </div>
        ) : (
          <div className="w-full">
            <FileForm
              selectedFileId={selectedFileId}
              resetSelection={showFileList}
            />
          </div>
        )}
      </div>
    </main>
  );
}
