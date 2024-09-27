"use client";

import React, { useState } from "react";

/**
 * AdminCodePage Component
 * -----------------------
 * Provides an interface for admins to add, update, and delete file information,
 * including file summaries and content, saved to the Amplify datastore.
 */
export default function AdminCodePage(): JSX.Element {
  const [fileName, setFileName] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSaveFile = async () => {
    // Save file data to Amplify datastore
    // await client.create('File', { fileName, filePath, summary, content });
  };

  return (
    <main className="w-full flex justify-center">
      {/* Use the section-container class for a standardized container style */}
      <div className="section-container mt-16">
        {/* Use the heading class to align with global heading styles */}
        <h1 className="heading mb-4">Manage Code Files</h1>
        
        {/* Form to input file details */}
        <div className="mb-4">
          <label className="block text-sm mb-2">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="form-input"
            placeholder="Enter file name"
          />
        </div>

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
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="form-input"
            placeholder="Enter file summary"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Code Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-input"
            placeholder="Enter code content"
            rows={8}
          />
        </div>

        {/* Use btn-primary for button styling */}
        <button
          className="btn btn-primary"
          onClick={handleSaveFile}
        >
          Save File
        </button>
      </div>
    </main>
  );
}
