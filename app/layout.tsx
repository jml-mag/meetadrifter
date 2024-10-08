/**
 * File Path: app/layout.tsx
 *
 * RootLayout Component
 * --------------------
 * This component provides the top-level layout for the application, integrating global styles,
 * toast notifications, and Amplify configuration. It wraps around all child components, setting
 * foundational elements such as document metadata and accessibility attributes.
 */

import type { Metadata } from "next";
import { ToastProvider } from "@/contexts/ToastContext";
import Toast from "@/components/Toast";
import { inter } from "@/app/fonts";
import ConfigureAmplifyClientSide from '@/components/ConfigureAmplify';
import "./globals.css";

/**
 * Metadata configuration for SEO, defining the title and description of the application.
 */
export const metadata: Metadata = {
  title: "Meet A Drifter", 
  description: "A website that exists solely as the base of a tutorial of sorts, for now.",
};

/**
 * RootLayout Component
 * 
 * This component serves as the root layout of the application. It wraps the entire app with global styles,
 * configures Amplify on the client side, and integrates toast notifications. It ensures accessibility
 * and SEO enhancements by setting the document's language and metadata.
 * 
 * @param {Readonly<{ children: React.ReactNode }>} props - The component's properties.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * 
 * @returns {JSX.Element} The root layout component wrapping the provided children.
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
          <main>
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
