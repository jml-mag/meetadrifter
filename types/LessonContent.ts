// File Path: types/LessonContent.ts

export interface LessonContent {
    id: string;
    title: string;
    slug: string;
    code: string | null;
    docs: string;
    isOrdered: boolean;
    orderIndex: number | null;
    moreInfoUrl: string | null;
  }
  