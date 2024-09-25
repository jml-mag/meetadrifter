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

import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook to access authentication context.
import Poll from "@/components/Poll"; // Import Poll component for rendering active polls.
import Profile from "@/components/Profile"; // Import Profile component to display user information.

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
  const { user } = useAuth(); // Access user details and signOut function from authentication context.

  return (
    <main className="flex min-h-screen flex-col items-center py-8">
      <div className="w-full mt-12 pb-4 sm:p-4 backdrop-blur-md bg-white bg-opacity-35 rounded-lg">
        {/* Flex adjustments for md screen size */}
        <div className="flex flex-col items-center justify-center mt-12 text-lg bg-amber-400">
            <div>User ID: {user?.username}</div>
          </div>
        <div className="flex flex-col sm:flex-row justify-between md:space-x-8">
          {/* Display user-specific details */}
          

          {/* Render the Profile component */}
          <div className="flex flex-col items-center justify-center bg-teal-300">
            <Profile />
          </div>

          {/* Render the Poll component */}
          <div className="flex flex-col items-center justify-center bg-purple-300">
            <Poll />
          </div>
        </div>
      </div>
    </main>
  );
}
