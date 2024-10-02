// components/TableOfContents.tsx

import React from "react";
import Link from "next/link";

interface Lesson {
  slug: string;
  title: string;
}

interface TableOfContentsProps {
  sortedLessonOrder: Lesson[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ sortedLessonOrder }) => {
  return (
    <div className="bg-white shadow p-4">
      <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
      <ul className="space-y-2">
        {sortedLessonOrder.map((lesson, index) => (
          <li key={lesson.slug}>
            <Link href={`/members/code/${lesson.slug}`}>
              {index + 1}. {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
