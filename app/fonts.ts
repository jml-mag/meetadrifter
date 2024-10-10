/**
 * File Path: app/fonts.ts
 * 
 * Font Configuration
 * ------------------
 * This module configures the Google fonts used throughout the application. It sets up fonts such as
 * 'Inter', 'Josefin Slab', 'Climate Crisis', and 'Tilt Warp' with specific subsets and display settings.
 * These fonts are imported and configured using the Next.js font API for efficient loading and usage.
 */

import { Inter, Josefin_Slab, Climate_Crisis, Tilt_Warp } from 'next/font/google';  // Import Google fonts using the Next.js font API.

/**
 * Configuration for the 'Inter' font.
 * 
 * @remarks
 * The 'Inter' font is set up to include the 'latin' subset, making it suitable for texts using the Latin script.
 * The 'display' property is set to 'swap' to ensure that text is displayed immediately with a fallback font,
 * then swapped with the custom font once it's loaded. This improves perceived performance and user experience.
 * 
 * @returns {ReturnType<typeof Inter>} The configured 'Inter' font.
 */
export const inter = Inter({
  subsets: ['latin'],  // Includes the Latin character set for broad compatibility.
  display: 'swap',     // Uses 'swap' to ensure text remains visible during font loading.
});

/**
 * Configuration for the 'Josefin Slab' font.
 * 
 * @remarks
 * Similar to the 'Inter' font, 'Josefin Slab' is configured to target the 'latin' subset and uses the 'swap' display strategy.
 * This font provides a distinct slab-serif style and is used consistently throughout the application.
 * 
 * @returns {ReturnType<typeof Josefin_Slab>} The configured 'Josefin Slab' font.
 */
export const josefin_slab = Josefin_Slab({
  subsets: ['latin'],  // Targets the Latin character set.
  display: 'swap',     // Ensures the text is displayed with a fallback font until the web font is fully loaded.
});

/**
 * Configuration for the 'Climate Crisis' font.
 * 
 * @remarks
 * 'Climate Crisis' is also configured to use the Latin subset and the 'swap' display strategy, ensuring fast and consistent font rendering.
 * 
 * @returns {ReturnType<typeof Climate_Crisis>} The configured 'Climate Crisis' font.
 */
export const climate_crisis = Climate_Crisis({
  subsets: ['latin'],  // Includes the Latin subset for compatibility.
  display: 'swap',     // Ensures text is visible during font loading.
});

/**
 * Configuration for the 'Tilt Warp' font.
 * 
 * @remarks
 * The 'Tilt Warp' font is included with the Latin subset and uses 'swap' for its display property, maintaining consistency with other fonts in the application.
 * 
 * @returns {ReturnType<typeof Tilt_Warp>} The configured 'Tilt Warp' font.
 */
export const tiltWarp = Tilt_Warp({
  subsets: ['latin'],  // Targets the Latin character set for broad compatibility.
  display: 'swap',     // Uses 'swap' to ensure text is displayed with a fallback font while loading.
});

/**
 * Usage
 * -----
 * These configured fonts can be used throughout the application to ensure a consistent and performant typography experience.
 * By using the 'swap' display strategy, the application provides better perceived performance as text is visible quickly.
 */
