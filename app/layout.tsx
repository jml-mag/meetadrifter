/**
 * File Path: app/layout.tsx
 *
 * RootLayout Component
 * --------------------
 * This component defines the root layout for the application. It integrates global styles, toast notifications,
 * and Amplify client-side configuration. It also ensures that all child components are wrapped with
 * foundational elements such as SEO metadata, accessibility features, and general styling.
 */

import type { Metadata } from "next"; // Import Next.js metadata type
import { ToastProvider } from "@/contexts/ToastContext"; // Import ToastProvider for toast notifications
import Toast from "@/components/Toast"; // Import Toast component for displaying notifications
import { inter } from "@/app/fonts"; // Import custom fonts (Inter) for global styling
import ConfigureAmplifyClientSide from "@/components/ConfigureAmplify"; // Import Amplify configuration for client-side setup
import "./globals.css"; // Import global CSS styles

/**
 * Metadata configuration for the entire application.
 *
 * @remarks
 * This configuration defines the metadata for SEO purposes, such as the title and description of the site.
 */
export const metadata: Metadata = {
  title: "Meet A Drifter",
  description:
    "A website that exists solely as the base of a tutorial of sorts, for now.",
  creator: "Matter and Gas",
  applicationName: "Meet A Drifter",
  keywords: [
    "tutorial",
    "nextjs",
    "react",
    "typescript",
    "tailwindcss",
    "aws",
    "amplify",
    "serverless",
    "gen 2",
    "amplify gen 2",
    "AWS CDK",
    "matter and gas",
    "meet a drifter",
    "meetadrifter",
    "web application",
  ],
};

/**
 * RootLayout Component
 *
 * @remarks
 * The RootLayout component serves as the main wrapper for the entire application. It ensures that global styles,
 * Amplify client-side configuration, and toast notifications are applied across all pages. Additionally, it
 * provides accessibility improvements by setting the document language and ensures that metadata for SEO is applied.
 *
 * @param {Readonly<{ children: React.ReactNode }>} props - The properties of the RootLayout component.
 * @param {React.ReactNode} props.children - The child components that will be rendered within the layout.
 *
 * @returns {JSX.Element} Returns the root layout component, wrapping all child components in the application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplifyClientSide />
        <ToastProvider>
          <Toast />
          <main>{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
