/**
 * File Path: app/members/layout.tsx
 * 
 * Member Layout Component
 * -----------------------
 * This file defines the Layout component specifically for member areas. It incorporates authentication,
 * dynamic styling elements like background image opacity control, and a toggleable menu.
 */

"use client";

import { useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { motion } from "framer-motion";
import outputs from "@/amplify_outputs.json";
import Image from "next/image";
import bg from "@/public/nacho-champion.png";
import "@aws-amplify/ui-react/styles.css";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import MembersMenu from "@/components/MembersMenu";
import { Bars3Icon, XCircleIcon } from "@heroicons/react/24/solid";
import { climate_crisis } from "@/app/fonts";

// Configure AWS Amplify
Amplify.configure(outputs);

/**
 * Layout Component
 * ----------------
 * This component serves as the layout wrapper for member-specific areas of the application.
 * It handles authentication, manages background opacity, and controls the visibility of the navigation menu.
 * 
 * @component
 * @param {Readonly<{ children: React.ReactNode }>} props - The component props.
 * @returns {JSX.Element} The rendered Layout component.
 */
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  const [bgOpacity, setBgOpacity] = useState<number>(0.75); // State to manage the background opacity level.
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // State to track menu open/close status.

  /**
   * handleOpacityChange Function
   * ----------------------------
   * Updates the background opacity state based on user input.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBgOpacity(parseFloat(event.target.value));
  };

  /**
   * toggleMenu Function
   * -------------------
   * Toggles the menu's open/close state.
   */
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <Authenticator variation="modal" hideSignUp={false}>
      {({ signOut, user }) => (
        <AuthProvider user={user || null} signOut={signOut || (() => {})}>
          <LayoutContent
            bgOpacity={bgOpacity}
            handleOpacityChange={handleOpacityChange}
            menuOpen={menuOpen}
            toggleMenu={toggleMenu}
          >
            {children}
          </LayoutContent>
        </AuthProvider>
      )}
    </Authenticator>
  );
}

/**
 * LayoutContent Component
 * -----------------------
 * This component handles the rendering of the main layout content, including background image,
 * menu control, and member-specific child components.
 * 
 * @component
 * @param {number} bgOpacity - The current opacity level of the background image.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} handleOpacityChange - Function to handle changes in background opacity.
 * @param {boolean} menuOpen - State indicating whether the menu is open or closed.
 * @param {() => void} toggleMenu - Function to toggle the menu open/close state.
 * @param {React.ReactNode} children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The rendered LayoutContent component.
 */
function LayoutContent({
  bgOpacity,
  handleOpacityChange,
  menuOpen,
  toggleMenu,
  children,
}: {
  bgOpacity: number;
  handleOpacityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  menuOpen: boolean;
  toggleMenu: () => void;
  children: React.ReactNode;
}): JSX.Element {
  const { loading } = useAuth(); // Access authentication context to determine if the user is an admin and if the status is still loading.

  if (loading) {
    return <div>Loading...</div>; // Render a loading state while determining admin status.
  }

  return (
    <div>
      <div
        className="w-full h-screen fixed top-0 left-0 -z-50"
        style={{ opacity: bgOpacity }}
      >
        <Image
          src={bg}
          alt="Nacho Champion - The greatest moment of one man's life."
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <div
            className={`${climate_crisis.className} fixed top-3 left-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl lg:left-4 text-white`}
     
          >
            Meet A Drifter
          </div>
      <div className="fixed top-0 w-full h-12 z-50 backdrop:blur-3xl">
        {/* Menu Button */}
        <button
          className="fixed top-4 right-4 text-white px-4 rounded-lg"
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <XCircleIcon className="size-6 text-white" />
          ) : (
            <Bars3Icon className="size-6 text-white" />
          )}
        </button>
      </div>
      {/* Members Menu */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: menuOpen ? 0 : "-100%" }}
        exit={{ y: "-100%" }}
        transition={{ type: "spring", stiffness: 50 }}
        className="fixed top-0 w-full z-40"
        style={{ height: "100vh" }} // Ensures the menu takes up the full screen height.
      >
        <MembersMenu
          bgOpacity={bgOpacity}
          handleOpacityChange={handleOpacityChange}
          toggleMenu={toggleMenu}
          isMenuOpen={menuOpen} // Pass the menuOpen state as a prop.
        />
      </motion.div>

      {children}
    </div>
  );
}
