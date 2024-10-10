/**
 * File Path: app/members/layout.tsx
 * 
 * Member Layout Component
 * -----------------------
 * This component defines the layout specifically for member areas of the application. It incorporates
 * AWS Amplify authentication, dynamic background opacity control, and conditionally renders
 * member or admin menus based on the application's pathname. Additionally, it provides a configurable
 * background and navigation bar with animations.
 */

"use client";

import { useState } from "react";
import { Authenticator, View } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { motion } from "framer-motion";
import outputs from "@/amplify_outputs.json";
import Image from "next/image";
import bg from "@/public/nacho-champion.png";
import "@aws-amplify/ui-react/styles.css";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AuthenticatedNavBar from "@/components/AuthenticatedNavBar"; // Import for authenticated navigation bar
import MembersMenu from "@/components/MembersMenu";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { climate_crisis } from "@/app/fonts";

// Configure AWS Amplify using the generated outputs
Amplify.configure(outputs);

// Custom sign-up form fields for Amplify's Authenticator
const formFields = {
  signUp: {
    email: {
      order: 1,
      label: "Email",
      placeholder: "Enter your email address",
    },
    password: {
      order: 2,
      label: "Password",
      placeholder: "Enter your password",
    },
    confirm_password: {
      order: 3,
      label: "Confirm Password",
      placeholder: "Confirm your password",
    },
    preferred_username: {
      order: 4,
      label: "Username",
      placeholder: "Enter your unique username",
    },
    given_name: {
      order: 5,
      label: "First Name",
      placeholder: "Enter your first name",
    },
    family_name: {
      order: 6,
      label: "Last Name",
      placeholder: "Enter your last name",
    },
  },
};

// Custom header component for Amplify's Authenticator
const components = {
  Header() {
    return (
      <View
        as="div"
        fontFamily={climate_crisis.style.fontFamily}
        textAlign="center"
        margin="16px 0"
        fontSize="2rem"
        color="var(--amplify-colors-white)"
      >
        Meet A Drifter
      </View>
    );
  },
};

/**
 * Layout Component
 * 
 * @remarks
 * The root layout component for member-specific sections of the application. It handles background
 * image opacity adjustments, menu toggle controls, and manages authenticated navigation for users.
 * AWS Amplify is used to manage authentication flows.
 * 
 * @param {Readonly<{ children: React.ReactNode }>} props - The children components to be rendered within the layout.
 * 
 * @returns {JSX.Element} The layout component that wraps all member-specific pages.
 */
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  const [bgOpacity, setBgOpacity] = useState<number>(0.65); // Background opacity state
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // Menu open/close state

  /**
   * Updates the background opacity state based on user input.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event from the background opacity slider.
   */
  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBgOpacity(parseFloat(event.target.value));
  };

  /**
   * Toggles the state of the navigation menu between open and closed.
   */
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <Authenticator
      formFields={formFields}
      components={components}
      variation="modal"
      hideSignUp={false}
    >
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
 * 
 * @remarks
 * This component renders the core layout content including the background image, animated menu,
 * and child components. It provides controls for background opacity and the member's navigation menu.
 * 
 * @param {number} bgOpacity - The opacity level of the background image.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} handleOpacityChange - Function to handle background opacity adjustments.
 * @param {boolean} menuOpen - The state indicating whether the menu is open or closed.
 * @param {() => void} toggleMenu - Function to toggle the menu open/close state.
 * @param {React.ReactNode} children - The content to be rendered within the layout.
 * 
 * @returns {JSX.Element} The rendered layout content component.
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
  const { loading } = useAuth(); // Authentication context to determine if user status is loading

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while authentication is being checked
  }

  return (
    <div className="w-full text-center">
      <div
        className="w-full h-screen fixed top-0 left-0 -z-50"
        style={{ opacity: bgOpacity }}
      >
        <Image
          src={bg}
          alt="Nacho Champion - The greatest moment of one man's life."
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="fixed top-0 left-0 right-0 z-20">
        <div className={`${climate_crisis.className} fixed top-6 left-4 text-white lg:text-xl`}>
          Meet A Drifter
        </div>
        <div className="mt-16 md:mt-5 md:-mr-32">
          {/* Render the navigation bar */}
          <AuthenticatedNavBar />
        </div>
        <div className="z-20">
          {/* Menu Button */}
          {!menuOpen && (
            <button className="fixed top-0 right-6 text-white pt-6" onClick={toggleMenu}>
              <Bars3Icon className="size-7 text-white" />
            </button>
          )}
        </div>
      </div>
      <div className="z-40">
        {/* Members Menu */}
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: menuOpen ? 0 : "-100%" }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 50 }}
          className="fixed top-0 w-full z-40"
          style={{ height: "100vh" }}
        >
          <MembersMenu
            bgOpacity={bgOpacity}
            handleOpacityChange={handleOpacityChange}
            toggleMenu={toggleMenu}
            isMenuOpen={menuOpen}
          />
        </motion.div>
      </div>

      <div className="fixed top-0 h-32 md:h-20 w-full backdrop-blur-lg z-10"></div>
      <div className="mt-24">{children}</div>
    </div>
  );
}
