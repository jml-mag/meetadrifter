/**
 * File Path: @/components/AnimatedBackground.tsx
 * 
 * Animated Background Component
 * -----------------------------
 * This file defines the `AnimatedBackground` component, which displays an animated grid of colored boxes.
 * The boxes change color at random intervals, creating a dynamic animated background.
 * The grid layout adapts to the window size, and each box's color cycles through black, blue, and orange.
 * 
 * The component utilizes Framer Motion for smooth transitions and animations, and adjusts box sizes based
 * on the screen width to maintain responsiveness.
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * AnimatedBackground Component
 * ----------------------------
 * Renders a grid-based animated background where each box cycles through a set of colors.
 * The grid is responsive, adapting its size and number of columns/rows based on the window dimensions.
 * 
 * @component
 * @returns {JSX.Element | null} The rendered AnimatedBackground component, or null if grid dimensions are not ready.
 */
export function AnimatedBackground(): JSX.Element | null {
  // Define the ColorState type, restricting values to 0, 1, or 2.
  type ColorState = 0 | 1 | 2;

  // State variables for managing grid size, number of boxes, and their color states.
  const [boxSize, setBoxSize] = useState<number>(75); // Default size for larger screens.
  const [gridColumns, setGridColumns] = useState<number>(0); // Number of grid columns based on screen width.
  const [gridRows, setGridRows] = useState<number>(0); // Number of grid rows based on screen height.
  const [totalBoxes, setTotalBoxes] = useState<number>(0); // Total number of boxes in the grid.
  const [colorStates, setColorStates] = useState<ColorState[]>([]); // Array holding color states for each box.

  // Mapping from color state to corresponding color value.
  const colorMap: { [key in ColorState]: string } = {
    0: "#000000", // Black
    1: "#1e3a8a", // Blue (bg-blue-800)
    2: "#F97316", // Orange (bg-orange-500)
  };

  /**
   * updateDimensions Function
   * -------------------------
   * Updates the grid dimensions and box size based on the current window size.
   * Initializes the `colorStates` array with zeros to start with the black color for all boxes.
   */
  const updateDimensions = () => {
    // Set box size based on screen width to ensure responsiveness.
    const newBoxSize = window.innerWidth <= 768 ? 50 : 75;
    setBoxSize(newBoxSize);

    // Calculate grid dimensions based on window size and box size.
    const columns = Math.ceil(window.innerWidth / newBoxSize);
    const rows = Math.ceil(window.innerHeight / newBoxSize);
    const total = columns * rows;

    // Update state with new grid and total box information.
    setGridColumns(columns);
    setGridRows(rows);
    setTotalBoxes(total);

    // Initialize `colorStates` with zeros (all boxes start as black).
    setColorStates(Array(total).fill(0));
  };

  /**
   * useEffect Hook - Grid Setup
   * ---------------------------
   * Sets up initial grid dimensions and adds a window resize event listener to update dimensions dynamically.
   * Cleans up the event listener when the component is unmounted.
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      updateDimensions();

      // Add event listener for window resize.
      window.addEventListener("resize", updateDimensions);

      // Cleanup event listener on component unmount.
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  /**
   * useEffect Hook - Animate Color States
   * -------------------------------------
   * Animates the color states of the boxes at random intervals, cycling through black, blue, and orange.
   * A new color is assigned to a random box at a set interval.
   * Cleans up the interval when the component is unmounted.
   */
  useEffect(() => {
    if (totalBoxes === 0) return; // Skip animation if grid size is not yet determined.

    // Interval to update color states at random box positions.
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * totalBoxes);
      setColorStates((prevColorStates) => {
        const newColorStates = [...prevColorStates];
        // Cycle through colors: 0 (black) -> 1 (blue) -> 2 (orange) -> 0 (black).
        newColorStates[randomIndex] = ((prevColorStates[randomIndex] + 1) % 3) as ColorState;
        return newColorStates;
      });
    }, 100); // Interval duration in milliseconds for color change.

    // Cleanup interval on component unmount.
    return () => clearInterval(intervalId);
  }, [totalBoxes]);

  // Don't render until gridColumns and gridRows are set.
  if (gridColumns === 0 || gridRows === 0) {
    return null; // Optionally return a loading indicator.
  }

  // Render the animated grid of boxes with dynamic colors.
  return (
    <div
      className="inset-0 grid gap-2 opacity-70"
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, ${boxSize}px)`, // Define grid columns based on screen width and box size.
        gridTemplateRows: `repeat(${gridRows}, ${boxSize}px)`, // Define grid rows based on screen height and box size.
      }}
    >
      {colorStates.map((colorState, index) => (
        <motion.div
          key={index}
          className="rounded-xl w-full h-full"
          animate={{ backgroundColor: colorMap[colorState] }} // Animate color changes based on color state.
          transition={{ duration: 0.5 }} // Set duration for color fade effect.
        />
      ))}
    </div>
  );
}
