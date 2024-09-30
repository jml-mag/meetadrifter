/**
 * File Path: components/AuthenticatedNavBar.tsx
 *
 * AuthenticatedNavBar Component
 * ----------------------------
 * Renders the navigation bar based on the user's role and the current URL path.
 * Displays either the Members Menu or the Admin Menu depending on the pathname.
 */

import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Interface for navigation links.
 */
interface NavLink {
  href: string;
  label: string;
}

// Define navigation links for both members and admin.
const membersNavLinks: NavLink[] = [
  { href: "/members", label: "Members Home" },
  { href: "/members/code", label: "Code" },
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
 * Renders the appropriate navigation bar based on the pathname.
 *
 * @returns {JSX.Element} The rendered navigation bar.
 */
export default function AuthenticatedNavBar(): JSX.Element {
  const pathname = usePathname();

  // Determine whether to display the members or admin nav based on the URL path.
  const navLinks = pathname.startsWith("/members/admin")
    ? adminNavLinks
    : membersNavLinks;

  return (
    <div className="fixed z-40 text-xs lg:text-sm text-center w-auto mx-auto top-16 px-2 m-1  rounded-lg flex justify-center space-x-1 sm:space-x-4 md:space-x-8 lg:space-x-16">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`p-2 sm:p-4 border-1 rounded ${
            pathname === link.href
              ? "text-white border white"
              : "text-yellow-400 border-0"
          } `}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
