/**
 * File Path: app/members/page.tsx
 * 
 * Member Home Component
 * ---------------------
 * This file defines the Home component for member areas. It features personalized user information,
 * actions like sign-out, and demonstrates the integration of authentication context and toast notifications
 * to enhance user experience.
 */

'use client';

import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook to access authentication context.
import Poll from "@/components/Poll"; // Import Poll component for rendering active polls.
import { josefin_slab } from "@/app/fonts"; // Import Josefin Slab font for text styling.

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

  // Render the component with user-specific content and actions.
  return (
    <main className="flex min-h-screen flex-col text-center items-center justify-between py-12">
      <div>
        {/* Display the welcoming message with user-specific details. */}
        <div className={`${josefin_slab.className} text-2xl`}>
          Welcome to meet a drifter
        </div>
        <div className="mt-2 text-lg">User ID: {user?.username}</div>
      </div>
      {/* Render the Poll component */}
      <Poll />
    </main>
  );
}
