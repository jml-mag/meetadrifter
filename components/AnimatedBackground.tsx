/**
 * File Path: @/components/AnimatedBackground.tsx
 * 
 * AnimatedBackground Component
 * ----------------------------
 * This component displays an animated grid of colored boxes that change color 
 * at random intervals, creating a dynamic and responsive background. The grid 
 * layout adapts to the window size, with boxes cycling through three colors: 
 * black, blue, and orange. 
 * 
 * The component leverages Framer Motion for smooth animations and ensures 
 * responsiveness by adjusting box sizes based on screen width.
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * AnimatedBackground Component
 * ----------------------------
 * Renders a responsive, animated background of colored boxes that change color 
 * at random intervals. The grid layout and box sizes adapt to the window's dimensions.
 * 
 * @returns {JSX.Element | null} The rendered AnimatedBackground component, or null 
 * if grid dimensions are not yet ready.
 */
export function AnimatedBackground(): JSX.Element | null {
  /**
   * Defines a type for color states, allowing only values of 0, 1, or 2.
   */
  type ColorState = 0 | 1 | 2;

  // State variables for managing grid dimensions, box size, total boxes, and color states.
  const [boxSize, setBoxSize] = useState<number>(75); // Default size for larger screens.
  const [gridColumns, setGridColumns] = useState<number>(0); // Number of columns in the grid.
  const [gridRows, setGridRows] = useState<number>(0); // Number of rows in the grid.
  const [totalBoxes, setTotalBoxes] = useState<number>(0); // Total number of boxes in the grid.
  const [colorStates, setColorStates] = useState<ColorState[]>([]); // Array holding color states for each box.

  /**
   * Maps color states to their corresponding color values.
   */
  const colorMap: { [key in ColorState]: string } = {
    0: "#000000", // Black
    1: "#1e3a8a", // Blue (bg-blue-800)
    2: "#F97316", // Orange (bg-orange-500)
  };

  /**
   * updateDimensions Function
   * -------------------------
   * Updates the grid's number of columns and rows based on the current window dimensions.
   * Sets the box size dynamically depending on the screen width for responsiveness.
   */
  const updateDimensions = () => {
    const newBoxSize = window.innerWidth <= 768 ? 50 : 75;
    setBoxSize(newBoxSize);

    const columns = Math.ceil(window.innerWidth / newBoxSize);
    const rows = Math.ceil(window.innerHeight / newBoxSize);
    const total = columns * rows;

    setGridColumns(columns);
    setGridRows(rows);
    setTotalBoxes(total);
    setColorStates(Array(total).fill(0)); // Initialize all boxes with black color.
  };

  /**
   * useEffect Hook - Grid Setup
   * ---------------------------
   * Initializes the grid dimensions and sets up an event listener to update them on window resize.
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      updateDimensions();
      window.addEventListener("resize", updateDimensions);

      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  /**
   * useEffect Hook - Animate Color States
   * -------------------------------------
   * Animates the color states of the grid boxes at random intervals, 
   * cycling through black, blue, and orange. 
   * Cleans up the interval when the component is unmounted.
   */
  useEffect(() => {
    if (totalBoxes === 0) return; // Exit if grid size is not yet determined.

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * totalBoxes);
      setColorStates((prevColorStates) => {
        const newColorStates = [...prevColorStates];
        // Cycle color: 0 (black) -> 1 (blue) -> 2 (orange) -> 0 (black).
        newColorStates[randomIndex] = ((prevColorStates[randomIndex] + 1) % 3) as ColorState;
        return newColorStates;
      });
    }, 100); // Color change interval (milliseconds).

    return () => clearInterval(intervalId);
  }, [totalBoxes]);

  if (gridColumns === 0 || gridRows === 0) {
    return null; // Return null if grid dimensions are not set yet.
  }

  // Render the animated grid of boxes.
  return (
    <section
      aria-label="Animated background"
      className="inset-0 grid gap-2 opacity-70"
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, ${boxSize}px)`,
        gridTemplateRows: `repeat(${gridRows}, ${boxSize}px)`,
      }}
    >
      {colorStates.map((colorState, index) => (
        <motion.div
          key={index}
          className="rounded-xl w-full h-full"
          animate={{ backgroundColor: colorMap[colorState] }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </section>
  );
}
