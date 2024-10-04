/**
 * File Path: app/members/page.tsx
 *
 * Member Home Component
 * ---------------------
 * This file defines the Home component for member areas. It features personalized user information,
 * actions like sign-out, and demonstrates the integration of authentication context and toast notifications
 * to enhance user experience.
 */

"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data"; // Import Amplify Data Client.
import type { Schema } from "@/amplify/data/resource"; // Import the data schema type.
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook to access authentication context.
import Poll from "@/components/Poll"; // Import Poll component for rendering active polls.

/**
 * Interface for the Site Notification.
 */
interface SiteNotification {
  message: string;
}

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

/**
 * Home Component
 * --------------
 * This component serves as the landing page for members, displaying personalized information
 * and providing actions such as signing out. It also showcases the use of toast notifications.
 *
 * @component
 * @returns {JSX.Element} The rendered Home component for member areas.
 */
export default function Home(): JSX.Element {
  // Destructure user, profile, and loading from the authentication context
  const { user, profile, loading, isAdmin } = useAuth(); // Access user details and profile from authentication context.
  const [notification, setNotification] = useState<string | null>(null); // State for site notification

  // Fetch the current site notification on component mount
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const { data, errors } = await client.models.SiteNotification.list({});
        if (errors) {
          console.error("Failed to fetch notification", errors);
          return;
        }
        // Assume there's only one notification for simplicity
        const currentNotification = data[0] as SiteNotification | undefined;
        setNotification(currentNotification?.message || null);
      } catch (err) {
        console.error("Error fetching notification:", err);
      }
    };

    fetchNotification();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center py-8 mx-2 sm:mx-1 md:mx-2">
      <div className="w-full max-w-5xl">
        {/* Display the site notification */}
        {notification && (
          <div className="section-container pb-4 sm:p-4">
            <div className="heading">Notifications</div>
            <div className="bg-black bg-opacity-70 p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              {notification}
            </div>
          </div>
        )}
      </div>
      <div className="w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row  md:space-x-8 ">
          {/* Render the Profile component */}
          <div className="section-container sm:mr-1 md:mr-0 pb-4 sm:p-4 h-min">
            <h2 className="heading">Profile</h2>
            {loading ? (
              <p className="text-center text-gray-700">Loading profile...</p>
            ) : profile ? (
              <div className="bg-black bg-opacity-70 p-4 rounded-lg">
                <div className="">
                  <p className="mb-2">
                    <strong>Username:</strong> {profile.username}
                  </p>
                  <p className="mb-2">
                    <strong>Name:</strong> {profile.firstName}{" "}
                    {profile.lastName}
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
                No profile information available.
              </p>
            )}
          </div>
          {/* Render the Poll component */}
          <Poll />
        </div>
      </div>
    </main>
  );
}
