// File Path: components/SetLessonStage.tsx

"use client";

import { useEffect } from 'react';

interface SetLessonStageProps {
  slug: string;
}

/**
 * SetLessonStage Component
 * -------------------------
 * This component updates the `lessonStage` in localStorage to reflect the current lesson's slug.
 *
 * @param {SetLessonStageProps} props - The component props containing the current lesson's slug.
 * @returns {null} This component does not render any visible UI.
 */
const SetLessonStage: React.FC<SetLessonStageProps> = ({ slug }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lessonStage', slug);
    }
  }, [slug]);

  return null; // This component doesn't render anything visible
};

export default SetLessonStage;
