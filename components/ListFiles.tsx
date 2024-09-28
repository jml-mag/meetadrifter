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
 * Displays a list of files and allows selection for updating.
 */
const ListFiles: React.FC<ListFilesProps> = ({ onSelectFile }) => {
  const [fileList, setFileList] = useState<FileData[]>([]);
  const { addToast } = useContext<ToastContextType>(ToastContext);

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, errors } = await client.models.CodeAndDocs.list();

      if (errors && errors.length > 0) {
        addToast({ messageType: "error", message: "Failed to fetch files." });
        console.error("Fetch errors:", errors);
      } else {
        setFileList(data || []);
      }
    };

    fetchFiles();
  }, [addToast]);

  return (
    <div className="bg-black bg-opacity-70 p-2 rounded-lg w-full mb-4">
      <h2 className="heading text-lg">Files</h2>
      <ul className="text-sm">
        {fileList.map((file) => (
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
  );
};

export default ListFiles;
