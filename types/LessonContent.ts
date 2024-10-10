// File Path: types/LessonContent.ts

/**
 * Link Interface
 * --------------
 * Represents a link object with its display text and URL.
 */
export interface Link {
  text: string; // The display text for the link
  url: string;  // The URL for the link
}

/**
 * LessonContent Interface
 * -----------------------
 * Represents the structure of a lesson, including metadata such as title, slug, code, docs,
 * ordering information, and a list of related links.
 */
export interface LessonContent {
  id: string;
  title: string;
  slug: string;
  code: string | null;
  docs: string;
  isOrdered: boolean;
  orderIndex: number | null;
  links: Link[]; // An array of links related to the lesson
}
