/**
 * File Path: @/members/admin/layout.tsx
 *
 * Admin Layout Component
 * ----------------------
 * This file defines the AdminLayout component, which serves as the layout wrapper for all admin-specific pages.
 * It ensures that only users with admin privileges can access these pages. If a non-admin user attempts to access
 * the admin area, they are redirected to the members' homepage. The component also integrates with ToastContext
 * for displaying notifications and handles loading states during admin status checks.
 */

"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook to access authentication context.
import { useRouter, usePathname } from "next/navigation"; // Import useRouter and usePathname from Next.js.
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * AdminLayout Component
 * ---------------------
 * Renders the layout for admin pages, handling user authentication and admin status checks.
 * It highlights the active navigation link based on the current pathname.
 *
 * @component
 * @param {Readonly<{ children: ReactNode }>} props - The children elements to render within the layout.
 * @returns {JSX.Element} The rendered AdminLayout component.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  const { isAdmin, loading } = useAuth(); // Access user details, admin status, and loading state from authentication context.
  const router = useRouter(); // Access useRouter to handle navigation.
  const pathname = usePathname(); // Get the current pathname.

  useEffect(() => {
    /**
     * Admin Status Check
     * ------------------
     * Monitors the loading state and admin status. If loading is complete and the user is not an admin,
     * the user is redirected to the members' homepage.
     */
    if (!loading) {
      if (!isAdmin) {
        console.log("User is not an admin, redirecting...");
        router.push("/members");
      }
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return <div>Loading...</div>; // Optionally render a loading state while checking admin status.
  }

  // Define the navigation links for the admin area.
  const navLinks = [
    { href: "/members/admin", label: "Admin Home" },
    { href: "/members/admin/users", label: "Manage Users" },
    { href: "/members/admin/polls", label: "Manage Polls" },
    { href: "/members/admin/messaging", label: "Messaging" },
    { href: "/members/admin/code", label: "Code" },
  ];

  // Render the component with user-specific content and actions.
  return (
    <main className="flex flex-col w-full min-h-screen py-12 items-center">
      {/* Navigation links */}
      <div className="fixed text-xs w-auto mx-auto p-3 sm:p-5 sm:px-6 top-16 m-1 bg-blue-950 bg-opacity-50 rounded-lg shadow flex justify-center space-x-2 sm:space-x-8 md:space-x-16">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`p-1 text-xs sm:text-sm ${
              pathname === link.href
                ? "underline decoration-solid decoration-2 underline-offset-4"
                : ""
            } hover:underline`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div className="flex-grow w-full mt-20 px-4">
        {children}
      </div>
    </main>
  );
}
