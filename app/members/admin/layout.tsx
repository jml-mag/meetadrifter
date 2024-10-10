/**
 * File Path: @/app/members/admin/layout.tsx
 * 
 * Admin Layout Component
 * ----------------------
 * This component defines the layout for all admin-specific pages within the application. It ensures that
 * only users with admin privileges can access these pages. If a non-admin user attempts to access the 
 * admin area, they are automatically redirected to the members' homepage. Additionally, the component
 * integrates with the `ToastContext` to display notifications and manages loading states during admin 
 * status verification.
 */

"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Hook for accessing authentication context.
import { useRouter } from "next/navigation"; // Import the Next.js useRouter for navigation handling.
import type { ReactNode } from "react";

/**
 * AdminLayout Component
 * 
 * @remarks
 * This component serves as the layout wrapper for all admin pages. It checks the user's admin status and 
 * redirects non-admin users to the members' homepage. While checking admin status, it can display a loading
 * state to avoid rendering content prematurely.
 * 
 * @param {Readonly<{ children: ReactNode }>} props - The component's props, specifically the child elements to render within the layout.
 * 
 * @returns {JSX.Element} The rendered AdminLayout component for admin-specific pages.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  const { isAdmin, loading } = useAuth(); // Destructure isAdmin and loading state from authentication context.
  const router = useRouter(); // Router for redirecting users.

  useEffect(() => {
    /**
     * Admin Status Check
     * 
     * Monitors the admin status and redirects the user to the members' homepage if they are not an admin.
     * It waits for the loading state to complete before making this decision.
     */
    if (!loading) {
      if (!isAdmin) {
        console.log("User is not an admin, redirecting...");
        router.push("/members");
      }
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading state while checking admin status.
  }

  return (
    <main className="flex flex-col w-full min-h-screen py-12 items-center">
      {/* Main content area */}
      <div className="flex-grow w-full px-4">
        {children}
      </div>
    </main>
  );
}
