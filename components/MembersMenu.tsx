/**
 * File Path: components/MembersMenu.tsx
 *
 * Members Menu Component
 * ----------------------
 * This file defines the MembersMenu component, which is responsible for rendering the navigation
 * menu within the member areas of the application. It includes links, background opacity control,
 * and account management features such as sign-out.
 */

"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook to access authentication context.
import { useRouter } from "next/navigation"; // Import useRouter for programmatic navigation.
import { useEffect, useRef } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";

/**
 * MembersMenuProps Interface
 * --------------------------
 * Defines the structure of the props passed to the MembersMenu component.
 *
 * @interface MembersMenuProps
 * @property {number} bgOpacity - The current opacity level of the background image.
 * @property {(event: React.ChangeEvent<HTMLInputElement>) => void} handleOpacityChange - Function to handle changes in background opacity.
 * @property {() => void} toggleMenu - Function to toggle the menu open/close state.
 * @property {boolean} isMenuOpen - State indicating whether the menu is open or closed.
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
 * This component renders the navigation menu for member areas, including links, background opacity control,
 * and account management options like sign-out. The menu can be toggled open and closed, and it closes automatically
 * when clicking outside of it.
 *
 * @component
 * @param {MembersMenuProps} props - The component props.
 * @returns {JSX.Element} The rendered MembersMenu component.
 */
export default function MembersMenu({
  bgOpacity,
  handleOpacityChange,
  toggleMenu,
  isMenuOpen,
}: MembersMenuProps): JSX.Element {
  const { user, signOut, isAdmin } = useAuth(); // Access user details, signOut function, and admin status from authentication context.
  const router = useRouter(); // Access useRouter to handle navigation.
  const menuRef = useRef<HTMLDivElement>(null); // Create a ref for the menu to detect outside clicks.

  // Define the list of links based on user authentication and admin status.
  const Links = [
    { href: "/", text: "Home" },
    ...(user ? [{ href: "/members/", text: "Members Home" }] : []),
    ...(isAdmin ? [{ href: "/members/admin", text: "Admin" }] : []),
  ];

  /**
   * handleSignout Function
   * ----------------------
   * Signs out the user and redirects to the homepage. Also closes the menu.
   */
  const handleSignout = (): void => {
    signOut();
    router.push("/");
    toggleMenu(); // Close the menu after signing out.
  };

  useEffect(() => {
    /**
     * handleClickOutside Function
     * ---------------------------
     * Closes the menu if the user clicks outside of it and the menu is open.
     *
     * @param {MouseEvent} event - The mouse event triggered by the user's click.
     */
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        toggleMenu(); // Close the menu if the click was outside.
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
      className="bg-gradient-to-br from-black to-gray-800 via-black fixed top-0 w-full p-6 shadow-md"
    >
      {/* Links Section */}
      <button
        className="fixed top-4 right-4 text-white px-4 rounded-lg"
        onClick={toggleMenu}
      >
        <XCircleIcon className="size-6 text-white" />
      </button>
      <div className="mb-6">
        <nav className="mt-2">
          {Links.map((link) => (
            <div key={link.href} className="py-2">
              <Link
                href={link.href}
                className="text-white hover:text-blue-500 mb-2"
                onClick={toggleMenu} // Close the menu when a link is clicked.
              >
                {link.text}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* Background Section */}
      <div className="mb-6">
        <span className="text-white text-xs">Background Opacity</span>
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
          />
        </div>
      </div>

      {/* Account Section */}
      <div>
        <div className="mt-2">
          <button
            className="member-btn bg-red-600 hover:bg-red-500"
            onClick={handleSignout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

}
