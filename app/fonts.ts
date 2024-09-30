// app/fonts.ts
// Purpose: This module configures the Google fonts used throughout the application.
// It sets up 'Inter' and 'Josefin Slab' fonts with specific subsets and display settings.
// These fonts are imported and configured using the new font API from Next.js.

import { Inter, Josefin_Slab, Climate_Crisis, Tilt_Warp } from 'next/font/google';  // Import specific fonts from the Google fonts library provided by Next.js.

// Configure the 'Inter' font.
// 'subsets' specifies which subsets of the font to include, focusing here on 'latin'.
// 'display' is set to 'swap' to ensure text remains visible during font loading, enhancing the perceived performance.
export const inter = Inter({
  subsets: ['latin'],  // Targets the Latin character set for broad compatibility.
  display: 'swap',      // Uses font-display: swap to provide a fast rendering path for text.
});

// Configure the 'Josefin Slab' font similarly to 'Inter'.
// This font also targets the Latin subset and uses the 'swap' strategy for consistency across the application's typography.
export const josefin_slab = Josefin_Slab({
  subsets: ['latin'],  // Consistent with 'inter', targeting the Latin subset.
  display: 'swap',      // Ensures text is visible early, swapping with the web font once it loads.
});

// Configure the 'Climate_Crisis'.
// This font also targets the Latin subset and uses the 'swap' strategy for consistency across the application's typography.
export const climate_crisis = Climate_Crisis({
  subsets: ['latin'],  // Consistent with 'inter', targeting the Latin subset.
  display: 'swap',      // Ensures text is visible early, swapping with the web font once it loads.
});

// Configure the 'Tilt_Warp'.
// This font also targets the Latin subset and uses the 'swap' strategy for consistency across the application's typography.
export const tiltWarp = Tilt_Warp({
  subsets: ['latin'],  // Consistent with 'inter', targeting the Latin subset.
  display: 'swap',      // Ensures text is visible early, swapping with the web font once it loads.
});

// These configured fonts can then be used throughout the application to ensure a consistent and performant typography experience.
