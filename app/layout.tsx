/**
 * File Path: app/layout.tsx
 *
 * RootLayout Component
 * --------------------
 * This file defines the RootLayout component, which serves as the top-level layout for the entire application.
 * It integrates global styles, the ToastProvider for managing notifications, and sets foundational metadata
 * for SEO optimization.
 */

import type { Metadata } from "next"; // Import type definitions for Metadata from Next.js.
import { ToastProvider } from "@/contexts/ToastContext"; // Import the ToastProvider to manage toast notifications throughout the app.
import Toast from "@/components/Toast"; // Import the Toast component to display toast messages.
import { inter } from "@/app/fonts"; // Import the 'inter' font configuration for consistent typography.
import "./globals.css"; // Import global CSS styles.

/**
 * Metadata configuration for the application.
 * This object provides SEO-related information such as the page title and description.
 *
 * @constant
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: "Meet A Drifter", // Application title used in the browser tab and search engine results.
  description:
    "A website that exists solely as the base of a tutorial of sorts, for now.", // Description of the application for SEO.
};

/**
 * RootLayout Component
 * --------------------
 * This component acts as the root layout wrapper around all other components in the application.
 * It sets the HTML document language, applies global font styles, and integrates the ToastProvider
 * for handling notifications throughout the app.
 *
 * @component
 * @param {Readonly<{ children: React.ReactNode }>} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped within the RootLayout.
 * @returns {JSX.Element} The rendered layout component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Ensure that children are valid React nodes.
}>): JSX.Element {
  return (
    <html lang="en">
      {/* Set the document language to English for accessibility and SEO. */}
      <body className={inter.className}>
        {/* Apply the 'inter' font class to the body for consistent typography across the application. */}
        <ToastProvider>
          {/* Include the ToastProvider to manage toast notifications across the app. */}
          <Toast />
          {/* Render the Toast component to display notifications at the top level. */}
          {children}
          {/* Render child components passed to the RootLayout. */}
        </ToastProvider>
      </body>
    </html>
  );
}
