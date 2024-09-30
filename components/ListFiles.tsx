"use client";

import React, { useState, useEffect, useContext } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

interface FileData {
  id: string;
  filepath: string;
}

interface ListFilesProps {
  onSelectFile: (fileId: string) => void;
}

/**
 * ListFiles Component
 * -------------------
 * Displays a list of files, provides a search box for filtering, and allows selection for updating.
 */
const ListFiles: React.FC<ListFilesProps> = ({ onSelectFile }) => {
  const [fileList, setFileList] = useState<FileData[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { addToast } = useContext<ToastContextType>(ToastContext);

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, errors } = await client.models.CodeAndDocs.list();

      if (errors && errors.length > 0) {
        addToast({ messageType: "error", message: "Failed to fetch files." });
        console.error("Fetch errors:", errors);
      } else {
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
   * Only shows files where the filepath includes the search term (case insensitive).
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
