/**
 * File Path: app/members/page.tsx
 * 
 * Member Home Component
 * ---------------------
 * This component defines the Home page for member-specific areas of the application. It displays 
 * personalized user information, handles site notifications, and integrates authentication context 
 * to provide user-specific actions such as signing out. Additionally, the Poll component is rendered 
 * to allow users to interact with active polls.
 */

"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data"; // Import Amplify Data Client
import type { Schema } from "@/amplify/data/resource"; // Import the data schema type
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook to access authentication context
import Poll from "@/components/Poll"; // Import Poll component for rendering active polls

/**
 * Interface representing a Site Notification.
 */
interface SiteNotification {
  message: string; // The message content of the notification
}

// Generate an Amplify client instance with the defined schema
const client = generateClient<Schema>();

/**
 * Home Component
 * --------------
 * The Home component serves as the member's landing page, displaying profile information, site notifications,
 * and other personalized content based on authentication context.
 * 
 * @returns {JSX.Element} The rendered Home component for member areas.
 */
export default function Home(): JSX.Element {
  // Access user details, profile, and loading state from authentication context
  const { user, profile, loading, isAdmin } = useAuth();
  const [notification, setNotification] = useState<string | null>(null); // State to manage site notification

  // Fetch the current site notification when the component mounts
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const { data, errors } = await client.models.SiteNotification.list({});
        if (errors) {
          console.error("Failed to fetch notification", errors);
          return;
        }
        // Assume there's only one active notification
        const currentNotification = data[0] as SiteNotification | undefined;
        setNotification(currentNotification?.message || null);
      } catch (err) {
        console.error("Error fetching notification:", err);
      }
    };

    fetchNotification();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center py-8 mx-2 sm:mx-1 md:mx-2 text-sm">
      <div className="w-full max-w-5xl">
        {/* Display the site notification if available */}
        {notification && (
          <div className="section-container pb-4 sm:p-4">
            <div className="heading">Notifications</div>
            <div className="bg-black bg-opacity-70 p-8 md:p-12 rounded-lg flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="text-left leading-loose">{notification}
                </div>
              
            </div>
          </div>
        )}
      </div>
      <div className="w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row md:space-x-8">
          {/* Render Profile Section */}
          <div className="section-container sm:mr-1 md:mr-0 pb-4 sm:p-4 h-min">
            <h2 className="heading">Profile</h2>
            {loading ? (
              <p className="text-center text-gray-700">Loading profile...</p>
            ) : profile ? (
              <div className="bg-black bg-opacity-70 p-4 rounded-lg text-xs text-left">
                <div className="">
                  <p className="mb-2">
                    <strong>Username:</strong> {profile.username}
                  </p>
                  <p className="mb-2">
                    <strong>Name:</strong> {profile.firstName} {profile.lastName}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {profile.emailAddress}
                  </p>
                  <p className="mb-2">
                    <strong>ID:</strong> {user?.username}
                  </p>
                  {isAdmin && (
                    <p className="mt-2 text-red-700 font-bold">Administrator</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-700">
                Loading Profile Information...
              </p>
            )}
          </div>
          {/* Render Poll Component */}
          <Poll />
        </div>
      </div>
    </main>
  );
}
