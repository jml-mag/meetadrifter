// components/LessonContentDisplay.tsx

import React from "react";

interface LessonContentProps {
  title: string;
  docs: string;
  code: string;
}

const LessonContentDisplay: React.FC<LessonContentProps> = ({ title, docs, code }) => (
  <>
    {/* Title */}
    <h1 className="text-3xl font-bold mb-6">{title}</h1>

    {/* Documentation Section */}
    <div className="prose lg:prose-xl max-w-none">
      <div dangerouslySetInnerHTML={{ __html: docs }} />
    </div>

    {/* Code Section */}
    <div className="bg-gray-800 text-white p-4 rounded mt-6 relative">
      <pre className="overflow-x-auto">
        <code className="language-javascript">{code}</code>
      </pre>
    </div>
  </>
);

export default LessonContentDisplay;
