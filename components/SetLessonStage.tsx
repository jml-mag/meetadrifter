/**
 * File Path: components/SetLessonStage.tsx
 *
 * SetLessonStage Component
 * ------------------------
 * This component is responsible for updating the 'lessonStage' value in localStorage 
 * to reflect the current lesson's slug. The component does not render any UI 
 * and operates entirely through its side effect using the useEffect hook.
 *
 * It ensures the lesson state is preserved across page reloads by storing the slug 
 * in the browser's localStorage.
 */

"use client";

import { useEffect } from 'react';

/**
 * Props interface for SetLessonStage component.
 */
interface SetLessonStageProps {
  /**
   * The slug representing the current lesson stage.
   */
  slug: string;
}

/**
 * SetLessonStage Component
 * ------------------------
 * Updates the 'lessonStage' value in localStorage based on the provided lesson slug.
 * This component is used to track the user's current lesson stage persistently across sessions.
 * 
 * @param {SetLessonStageProps} props - The component props containing the current lesson's slug.
 * @returns {null} This component does not render any visible UI.
 */
const SetLessonStage: React.FC<SetLessonStageProps> = ({ slug }) => {
  useEffect(() => {
    // Ensure window object is available before accessing localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('lessonStage', slug);
    }
  }, [slug]);

  return null; // No visible UI
};

export default SetLessonStage;
