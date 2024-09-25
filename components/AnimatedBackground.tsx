// @/components/AnimatedBackground.tsx

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  // Define the ColorState type
  type ColorState = 0 | 1 | 2;

  // State variables
  const [boxSize, setBoxSize] = useState<number>(75); // Default size for larger screens
  const [gridColumns, setGridColumns] = useState<number>(0);
  const [gridRows, setGridRows] = useState<number>(0);
  const [totalBoxes, setTotalBoxes] = useState<number>(0);
  const [colorStates, setColorStates] = useState<ColorState[]>([]); // Explicitly define as ColorState array

  // Mapping from color state to color value
  const colorMap: { [key in ColorState]: string } = {
    0: "#000000", // black
    1: "#1e3a8a", // bg-blue-800
    2: "#F97316", // bg-orange-500
  };

  // Function to update dimensions based on window size
  const updateDimensions = () => {
    const newBoxSize = window.innerWidth <= 768 ? 50 : 75;
    setBoxSize(newBoxSize);

    const columns = Math.ceil(window.innerWidth / newBoxSize);
    const rows = Math.ceil(window.innerHeight / newBoxSize);
    const total = columns * rows;

    setGridColumns(columns);
    setGridRows(rows);
    setTotalBoxes(total);

    // Initialize colorStates array with zeros
    setColorStates(Array(total).fill(0));
  };

  // useEffect to handle window resize and initial setup
  useEffect(() => {
    // Only run if window is defined
    if (typeof window !== "undefined") {
      updateDimensions();

      // Add event listener for window resize
      window.addEventListener("resize", updateDimensions);

      // Cleanup on unmount
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  // useEffect for animating color states
  useEffect(() => {
    if (totalBoxes === 0) return; // Avoid running if totalBoxes is not set

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * totalBoxes);
      setColorStates((prevColorStates) => {
        const newColorStates = [...prevColorStates];
        // Cycle through colors: 0 (black) -> 1 (blue) -> 2 (orange) -> 0 (black)
        newColorStates[randomIndex] = ((prevColorStates[randomIndex] + 1) % 3) as ColorState;
        return newColorStates;
      });
    }, 100); // Adjust interval as needed

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [totalBoxes]);

  // Don't render until gridColumns and gridRows are set
  if (gridColumns === 0 || gridRows === 0) {
    return null; // Or a loading indicator
  }

  return (
    <div
      className="inset-0 grid gap-2 opacity-70"
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, ${boxSize}px)`, // Define grid columns based on screen width and box size
        gridTemplateRows: `repeat(${gridRows}, ${boxSize}px)`, // Define grid rows based on screen height and box size
      }}
    >
      {colorStates.map((colorState, index) => (
        <motion.div
          key={index}
          className="rounded-xl w-full h-full"
          animate={{ backgroundColor: colorMap[colorState] }}
          transition={{ duration: 0.5 }} // Fade effect duration
        />
      ))}
    </div>
  );
}
