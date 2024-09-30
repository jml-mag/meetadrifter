/**
 * File Path: @/components/ListFiles.tsx
 * 
 * ListFiles Component
 * -------------------
 * Renders a searchable list of file entries retrieved from an Amplify datastore.
 * Users can filter files by their file paths, and select a file to view or edit its details.
 * 
 * The component interacts with Amplify for data fetching and uses a toast notification system
 * for handling success or error messages during operations.
 */

"use client";

import React, { useState, useEffect, useContext } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

/**
 * FileData Interface
 * ------------------
 * Defines the shape of an individual file data object.
 * 
 * @interface FileData
 * @property {string} id - Unique identifier of the file.
 * @property {string} filepath - Path where the file is stored.
 */
interface FileData {
  id: string;
  filepath: string;
}

/**
 * ListFilesProps Interface
 * ------------------------
 * Defines the props accepted by the `ListFiles` component.
 * 
 * @interface ListFilesProps
 * @property {(fileId: string) => void} onSelectFile - Callback function to handle selection of a file for editing or viewing.
 */
interface ListFilesProps {
  onSelectFile: (fileId: string) => void;
}

/**
 * ListFiles Component
 * -------------------
 * Displays a list of files, provides a search box for filtering, and allows selection for editing.
 * The list is searchable, and users can filter files by file path.
 * 
 * @component
 * @param {ListFilesProps} props - The component props.
 * @returns {JSX.Element} The rendered `ListFiles` component.
 */
const ListFiles: React.FC<ListFilesProps> = ({ onSelectFile }) => {
  // State variables for managing the list and search functionality
  const [fileList, setFileList] = useState<FileData[]>([]); // Stores the complete list of files fetched from the datastore.
  const [filteredFiles, setFilteredFiles] = useState<FileData[]>([]); // Stores the filtered list based on the search term.
  const [searchTerm, setSearchTerm] = useState<string>(""); // Manages the search term input value.
  const { addToast } = useContext<ToastContextType>(ToastContext); // Access the toast context for notifications.

  /**
   * useEffect Hook - Fetch Files
   * ----------------------------
   * Fetches the list of files from the Amplify datastore on component mount.
   * If fetching fails, a toast error notification is displayed.
   */
  useEffect(() => {
    const fetchFiles = async () => {
      const { data, errors } = await client.models.CodeAndDocs.list();

      if (errors && errors.length > 0) {
        addToast({ messageType: "error", message: "Failed to fetch files." });
        console.error("Fetch errors:", errors);
      } else {
        // Update state with fetched file data
        setFileList(data || []);
        setFilteredFiles(data || []);
      }
    };

    fetchFiles();
  }, [addToast]);

  /**
   * handleSearch Function
   * ---------------------
   * Updates the filtered file list based on the search term input.
   * Only shows files where the filepath includes the search term (case-insensitive).
   * Resets to the full list if the search term is shorter than 3 characters.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input event for the search term.
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Perform filtering only if search term length is at least 3 characters
    if (term.length >= 3) {
      setFilteredFiles(
        fileList.filter((file) => file.filepath.toLowerCase().includes(term))
      );
    } else {
      // Reset to the full list if search term is less than 3 characters
      setFilteredFiles(fileList);
    }
  };

  // Render the list of files and search functionality
  return (
    <div className="bg-black bg-opacity-70 p-2 rounded-lg w-full mb-4">
      {/* Header and search box container */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="heading text-lg mb-2 md:mb-0">Files - Code and Documentation</h2>
        {/* Search box */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search files..."
          className="form-input max-w-3xl mt-2 md:mt-0 md:ml-4 p-2 rounded"
        />
      </div>
      <div className="overflow-scroll">
        {/* Render the filtered list of files */}
        <ul className="text-sm mt-4 ml-6">
          {filteredFiles.map((file) => (
            <li
              key={file.id}
              className="my-1 py-1 cursor-pointer text-blue-100 hover:text-blue-50"
              onClick={() => onSelectFile(file.id)}
            >
              {file.filepath}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListFiles;
