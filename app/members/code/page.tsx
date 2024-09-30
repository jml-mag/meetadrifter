// @/members/code/page.tsx

"use client";

import React, { useState, useEffect } from "react";
// import necessary Amplify and context utilities
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "@/amplify/data/resource";
// const client = generateClient<Schema>();

/**
 * MemberCodePage Component
 * ------------------------
 * Displays file summaries and content for members in a side-by-side layout for
 * larger screens, and a stacked layout for smaller screens.
 */
export default function MemberCodePage(): JSX.Element {
  const [files, setFiles] = useState<Array<{ summary: string; content: string }>>([]);

  useEffect(() => {
    // Fetch files data from Amplify datastore
    // const fetchFiles = async () => {
    //   const filesData = await client.list('File');
    //   setFiles(filesData.items);
    // };
    // fetchFiles();
    setFiles([{ summary: "Sample Summary", content: "Sample Content" }]);
  }, []);

  return (
    <main className="w-full flex justify-center">
      <div className="w-full p-6 mt-16">
        {files.map((file, index) => (
          <div key={index} className="flex flex-col md:flex-row md:space-x-4 mb-6">
            {/* File Summary Section */}
            <div className="w-full md:w-1/2 bg-white bg-opacity-50 p-4 rounded-lg overflow-auto">
              <h2 className="text-xl font-bold mb-2">Summary</h2>
              <p>{file.summary}</p>
            </div>

            {/* File Content Section */}
            <div className="w-full md:w-1/2 bg-gray-100 bg-opacity-50 p-4 rounded-lg overflow-auto">
              <h2 className="text-xl font-bold mb-2">Code</h2>
              <pre className="whitespace-pre-wrap">{file.content}</pre>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
