// components/TableOfContents.tsx

import React from "react";
import Link from "next/link";

interface TableOfContentsProps {
  sortedLessonOrder: Array<{ slug: string; title: string }>;
}

/**
 * TableOfContents Component
 * -------------------------
 * Displays a list of lessons based on the sorted order passed as a prop.
 */
const TableOfContents: React.FC<TableOfContentsProps> = ({ sortedLessonOrder }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
    <ul className="space-y-2">
      {sortedLessonOrder.map((item, index) => (
        <li key={item.slug}>
          <Link href={`/members/code/${item.slug}`}>
            {index + 1}. {item.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default TableOfContents;
