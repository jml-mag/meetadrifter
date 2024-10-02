import React from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

interface LessonNavigationLinksProps {
  prevLesson?: { slug: string; title: string };
  nextLesson?: { slug: string; title: string };
}

const LessonNavigationLinks: React.FC<LessonNavigationLinksProps> = ({
  prevLesson,
  nextLesson,
}) => (
  <div className="section-container mt-8 flex justify-around text-lg font-bold">
    {prevLesson && (
      <Link href={`/members/code/${prevLesson.slug}`}>
        <div className="bg-green-900 p-2 px-4 text-xs rounded-lg shadow-lg flex items-center">
          <ArrowLeftIcon className="size-8 mr-2" />
          {prevLesson.title}
        </div>
      </Link>
    )}
    {nextLesson && (
      <Link href={`/members/code/${nextLesson.slug}`}>
        <div className="bg-green-900 p-2 text-xs rounded-lg shadow-lg flex items-center">
          {nextLesson.title}
          <ArrowRightIcon className="size-8 ml-2" />
        </div>
      </Link>
    )}
  </div>
);

export default LessonNavigationLinks;
