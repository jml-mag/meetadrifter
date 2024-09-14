/**
 * File Path: app/page.tsx
 *
 * Home Component
 * --------------
 * This file defines the Home component, which serves as the main landing page of the application.
 * It includes interactive elements such as login links and toast notifications to demonstrate
 * dynamic user interactions.
 */

"use client";

import { useContext } from "react";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext"; // Import ToastContext to manage toast notifications.
import { josefin_slab } from "@/app/fonts"; // Import the Josefin Slab font for styling.
import Link from "next/link"; // Import Link component from Next.js for client-side navigation.
import { Background } from "@/components/Background";

/**
 * Home Component
 * --------------
 * This component represents the main landing page of the application. It includes links for
 * user authentication and buttons to demonstrate toast notifications (success and error).
 *
 * @component
 * @returns {JSX.Element} The rendered Home component.
 */
export default function Home(): JSX.Element {
  // Access the addToast function from ToastContext to trigger notifications.
  const { addToast } = useContext<ToastContextType>(ToastContext);

  // Render the main structure of the home page.
  return (
    <>
      <Background />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
          {/* Navigation link for joining or logging in, demonstrating Next.js's Link component usage. */}
          <div className="fixed top-4 right-4 hover:text-blue-100">
            <Link href="/members">Join / Login</Link>
          </div>
          {/* Display welcoming message using the Josefin Slab font. */}
          <span className={`${josefin_slab.className} text-lg`}>
            Welcome to{" "}
          </span>
          Meet A Drifter
        </div>
        <div>
          {/* Buttons to show success and error toasts as an example of dynamic user feedback. */}
          <button
            className="mt-4 bg-green-600 text-white py-2 m-4 px-4 rounded"
            onClick={() => {
              addToast({
                messageType: "success",
                message:
                  "Success! See app/page.tsx for addToast() example use.",
              });
            }}
          >
            Test Success Toast
          </button>

          <button
            className="mt-4 bg-red-700 text-white py-2 m-4 px-4 rounded"
            onClick={() => {
              addToast({
                messageType: "error",
                message: "Error! See app/page.tsx for addToast() example use.",
              });
            }}
          >
            Test Error Toast
          </button>
        </div>
      </main>
    </>
  );
}
