"use client";

/**
 * File Path: components/MembersMenu.tsx
 *
 * MembersMenu Component
 * ---------------------
 * This component renders a navigation menu for authenticated members.
 * It provides links to various sections based on user status, includes a slider for controlling the background opacity,
 * and offers account management options such as signing out.
 * The menu can be toggled open or closed and will automatically close when a user clicks outside the menu area.
 */

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";

/**
 * Interface for the MembersMenu component's props.
 *
 * @interface MembersMenuProps
 * @property {number} bgOpacity - The current opacity level of the background image.
 * @property {(event: React.ChangeEvent<HTMLInputElement>) => void} handleOpacityChange - Callback to handle changes in the background opacity.
 * @property {() => void} toggleMenu - Function to toggle the menu's open/close state.
 * @property {boolean} isMenuOpen - Boolean indicating whether the menu is currently open or closed.
 */
interface MembersMenuProps {
  bgOpacity: number;
  handleOpacityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

/**
 * MembersMenu Component
 * ---------------------
 * Renders the navigation menu for authenticated members.
 * It displays links, controls background opacity, and offers account management options like signing out.
 * The menu closes automatically when clicking outside of it.
 *
 * @param {MembersMenuProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered MembersMenu component.
 */
export default function MembersMenu({
  bgOpacity,
  handleOpacityChange,
  toggleMenu,
  isMenuOpen,
}: MembersMenuProps): JSX.Element {
  const { user, signOut, isAdmin } = useAuth(); // Access user, signOut function, and admin status from the AuthContext.
  const router = useRouter(); // Get Next.js router for programmatic navigation.
  const menuRef = useRef<HTMLDivElement>(null); // Create a reference to the menu to detect clicks outside it.

  // Define the list of links based on user and admin status.
  const Links = [
    { href: "/", text: "Home" },
    ...(user ? [{ href: "/members/", text: "Members Home" }] : []),
    ...(isAdmin ? [{ href: "/members/admin", text: "Admin" }] : []),
  ];

  /**
   * Handles the user sign-out action, redirects to the home page, and closes the menu.
   */
  const handleSignout = (): void => {
    signOut();
    router.push("/"); // Navigate to home after signing out.
    toggleMenu(); // Close the menu.
  };

  useEffect(() => {
    /**
     * Handles clicks outside the menu. Closes the menu if a click occurs outside of the menu container.
     *
     * @param {MouseEvent} event - The click event.
     */
    const handleClickOutside = (event: MouseEvent): void => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        toggleMenu(); // Close the menu if the click is outside.
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, toggleMenu]);

  return (
    <div
      ref={menuRef}
      className="z-50 text-left bg-gradient-to-br from-black to-gray-800 via-black fixed top-0 w-full p-6 pt-16 shadow-md"
    >
      {/* Close Menu Button */}
      <button
        className="fixed top-5 right-2 text-white px-4 rounded-lg"
        onClick={toggleMenu}
        aria-label="Close menu"
      >
        <XCircleIcon className="size-7 text-white" />
      </button>

      {/* Navigation Links */}
      <div className="mb-6">
        <nav className="mt-2" aria-label="Members navigation">
          {Links.map((link) => (
            <div key={link.href} className="py-2">
              <Link
                href={link.href}
                className="text-white hover:text-blue-500 mb-2"
                onClick={toggleMenu}
              >
                {link.text}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* Background Opacity Control */}
      <div className="mb-6">
        <label htmlFor="bg-opacity-slider" className="text-white text-xs">
          Background Opacity
        </label>
        <div className="mt-2 max-w-sm">
          <input
            id="bg-opacity-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={bgOpacity}
            onChange={handleOpacityChange}
            className="form-input w-full"
            aria-label="Adjust background opacity"
          />
        </div>
      </div>

      {/* Account Management */}
      <div>
        <button
          className="member-btn bg-red-600 hover:bg-red-500"
          onClick={handleSignout}
          aria-label="Sign out"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
