/**
 * File Path: components/AuthenticatedNavBar.tsx
 * 
 * AuthenticatedNavBar Component
 * -----------------------------
 * Renders a navigation bar based on the user's role and the current URL path.
 * This component dynamically displays either the Members Menu or the Admin Menu 
 * depending on the pathname.
 * 
 * The component ensures proper accessibility and SEO by using semantic HTML elements.
 * The styling changes dynamically based on the active link.
 */

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Interface representing the structure of a navigation link.
 */
interface NavLink {
  href: string;  // URL the link points to
  label: string; // Display label for the link
}

// Define navigation links for both members and admin.
const membersNavLinks: NavLink[] = [
  { href: "/members", label: "Members Home" },
  { href: "/members/code", label: "Code" },
  { href: "/members/contact", label: "Contact" },
];

const adminNavLinks: NavLink[] = [
  { href: "/members/admin", label: "Admin Home" },
  { href: "/members/admin/users", label: "Manage Users" },
  { href: "/members/admin/polls", label: "Manage Polls" },
  { href: "/members/admin/code", label: "Manage Content" },
  { href: "/members/admin/messaging", label: "Messaging" },
];

/**
 * AuthenticatedNavBar Component
 * -----------------------------
 * Renders the appropriate navigation bar based on the URL path.
 * It dynamically selects either the Members or Admin navigation menu depending 
 * on the URL, and highlights the active link for visual feedback.
 *
 * @returns {JSX.Element} - The rendered navigation bar component.
 */
export default function AuthenticatedNavBar(): JSX.Element {
  const pathname = usePathname();

  // Determine the correct set of navigation links based on the URL path.
  const navLinks = pathname.startsWith("/members/admin")
    ? adminNavLinks
    : membersNavLinks;

  return (
    <nav 
      aria-label="Authenticated Navigation Bar" 
      className="text-xs lg:text-sm xl:text-base lg:font-extralight lg:space-x-2 xl:space-x-2 mx-1 flex space-around items-center justify-center"
    >
      {navLinks.map((link) => {
        // Check if the current link is active
        const isActive =
          pathname === link.href ||
          (link.href === "/members/code" && pathname.startsWith("/members/code/"));

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined} // Accessibility: Indicate current page
            className={`p-2 border rounded ${
              isActive
                ? "text-white border-white" // Active link styles
                : "text-yellow-400 border-0" // Inactive link styles
            } transition-colors duration-200`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
