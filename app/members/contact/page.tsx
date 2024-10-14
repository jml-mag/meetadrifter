"use client";

/**
 * File Path: app/members/contact/page.tsx
 * 
 * ContactPage Component
 * ---------------------
 * This component renders a contact form for authenticated users. It retrieves user information using the useAuth hook
 * and allows users to submit a message. Upon submission, the form fades out, and then the thank-you message fades in.
 * The form submission saves the user's first name, last name, email address, and message to the `ContactMessage` data model.
 */

import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data"; // Import Amplify Data Client
import type { Schema } from "@/amplify/data/resource"; // Import the data schema type
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook to access authentication context
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion for animations
import { useRouter } from "next/navigation"; // For redirecting if needed

// Generate an Amplify client instance with the defined schema
const client = generateClient<Schema>();

/**
 * ContactPage Component
 * ---------------------
 * Renders a contact form that allows authenticated users to send messages.
 * The form captures the user's first name, last name, email, and message.
 * On successful submission, the form fades out, and then the thank-you message fades in.
 * 
 * @returns {JSX.Element} The rendered ContactPage component.
 */
export default function ContactPage(): JSX.Element {
  const { user, profile, loading } = useAuth(); // Access user and profile information
  const [message, setMessage] = useState<string>(""); // State to manage the message input
  const [isLoading, setIsLoading] = useState<boolean>(false); // State to manage loading state
  const [error, setError] = useState<string | null>(null); // State to manage error messages
  const [submitted, setSubmitted] = useState<boolean>(false); // State to track form submission

  // Redirect unauthenticated users (optional)
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // If not loading and user is not authenticated, redirect to login
      router.push("/login");
    }
  }, [loading, user, router]);

  /**
   * Helper function to capitalize the first letter of a string.
   * 
   * @param {string} str - The string to capitalize.
   * @returns {string} The capitalized string.
   */
  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  /**
   * Handles form submission by saving the message to the ContactMessage model.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Ensure profile is available
    if (!profile) {
      setError("User profile information is not available.");
      setIsLoading(false);
      return;
    }

    try {
      // Create a new contact message entry
      const { errors } = await client.models.ContactMessage.create({
        firstName: profile.firstName,
        lastName: profile.lastName,
        emailAddress: profile.emailAddress,
        message,
        userId: user?.username || "",
      });

      if (errors && errors.length > 0) {
        console.error("Failed to submit message:", errors);
        setError("An error occurred while sending your message. Please try again.");
      } else {
        // Show thank-you message
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Error submitting message:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state if authentication is still loading
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center py-8 mx-2 sm:mx-1 md:mx-2">
        <div className="w-full max-w-3xl">
          <section className="section-container p-2">
            <h2 className="heading">Contact Us</h2>
            <p className="mb-4">Loading your information...</p>
          </section>
        </div>
      </main>
    );
  }

  // If user is not authenticated, return an empty fragment
  if (!user || !profile) {
    return <></>; // Returning an empty fragment instead of null
  }

  return (
    <main className="flex min-h-screen flex-col items-center py-8 mx-2 sm:mx-1 md:mx-2">
      <div className="w-full max-w-3xl">
        <section className="section-container p-2">
          <h2 className="heading">Contact</h2>
          <div className="bg-black min-h-80 bg-opacity-70 p-4 rounded-lg w-full">
            <div className="relative">
              {/* Wrap both components in a single AnimatePresence */}
              <AnimatePresence mode="wait">
                {!submitted && (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Message Textarea */}
                    <div>
                      <label htmlFor="message" className="block text-white text-xs mb-2">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="form-input"
                        placeholder="Enter your message here..."
                        rows={8}
                        required
                      />
                    </div>
                    {/* Error Message */}
                    {error && <p className="text-red-500">{error}</p>}
                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </motion.form>
                )}
                {submitted && (
                  <motion.div
                    key="thank-you-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-4 text-center"
                  >
                    <p className=" text-white">
                      Thanks for your message, {capitalizeFirstLetter(profile.firstName)}. Expect to hear back via email to {profile.emailAddress}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
