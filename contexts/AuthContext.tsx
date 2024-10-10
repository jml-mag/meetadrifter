"use client";

/**
 * File Path: contexts/AuthContext.tsx
 * 
 * AuthContext
 * -----------
 * This file provides a React context for managing authentication throughout the application.
 * It uses AWS Amplify for authentication functionalities and allows components to access
 * authentication status, user information, admin privileges, and user profile details. It also handles user sign-out.
 */

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { AuthUser, fetchAuthSession } from "@aws-amplify/auth";

/**
 * UserProfile Interface
 * ---------------------
 * Defines the structure of the user profile object containing essential user information.
 * 
 * @interface UserProfile
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} emailAddress - The user's email address.
 * @property {string} username - The user's preferred username.
 */
interface UserProfile {
  firstName: string;
  lastName: string;
  emailAddress: string;
  username: string;
}

/**
 * AuthContextProps Interface
 * --------------------------
 * Defines the shape of the authentication context value, providing access to user info,
 * sign-out functionality, admin status, loading state, and user profile.
 * 
 * @interface AuthContextProps
 * @property {AuthUser | null | undefined} user - The currently authenticated user, null if not authenticated.
 * @property {() => void} signOut - Function to handle user sign-out.
 * @property {boolean} isAdmin - Indicates if the authenticated user belongs to the "admin" group.
 * @property {boolean} loading - Indicates if the process of determining admin status is ongoing.
 * @property {UserProfile | null} profile - The authenticated user's profile information.
 */
export interface AuthContextProps {
  user: AuthUser | null | undefined;
  signOut: () => void;
  isAdmin: boolean;
  loading: boolean;
  profile: UserProfile | null;
}

// Creating the AuthContext with an initial default value to avoid null checks and ensure type safety.
const AuthContext = createContext<AuthContextProps | null>(null);

/**
 * useAuth Hook
 * ------------
 * Custom hook to provide easy access to the authentication context.
 * Throws an error if used outside of an `AuthProvider`, ensuring proper usage.
 * 
 * @returns {AuthContextProps} The authentication context properties, including user info, admin status, sign-out function, and user profile.
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider to access authentication functionalities.");
  }
  return context;
};

/**
 * AuthProviderProps Interface
 * ---------------------------
 * Defines the props accepted by the `AuthProvider` component, which wraps its children 
 * with the authentication context and provides necessary authentication data and methods.
 * 
 * @interface AuthProviderProps
 * @property {ReactNode} children - The nested child components that consume authentication context.
 * @property {AuthUser | null} user - The currently authenticated user.
 * @property {() => void} signOut - Function to handle user sign-out.
 */
interface AuthProviderProps {
  children: ReactNode;
  user: AuthUser | null;
  signOut: () => void;
}

/**
 * AuthProvider Component
 * ----------------------
 * Wraps all child components that require access to the authentication context.
 * Provides context values such as the authenticated user, sign-out function, admin status, and user profile.
 * 
 * @component
 * @param {AuthProviderProps} props - The component props.
 * @returns {JSX.Element} The rendered AuthProvider component, making authentication context accessible to all children.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children, user, signOut }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // State to track admin privileges.
  const [loading, setLoading] = useState<boolean>(true); // State to track the loading status of admin checks.
  const [profile, setProfile] = useState<UserProfile | null>(null); // State to store the user's profile information.

  useEffect(() => {
    /**
     * checkAdminStatus Function
     * -------------------------
     * Checks if the authenticated user belongs to the "admin" group by fetching their session
     * and examining the token payload. Extracts and sets the user's profile information.
     */
    async function checkAdminStatus() {
      if (user) {
        try {
          const session = await fetchAuthSession();
          const idTokenPayload = session.tokens?.idToken?.payload;

          if (idTokenPayload) {
            const groupsRaw = idTokenPayload["cognito:groups"];
            let groups: string[] | undefined;

            if (Array.isArray(groupsRaw) && groupsRaw.every(item => typeof item === "string")) {
              groups = groupsRaw;
            }

            setIsAdmin(Array.isArray(groups) && groups.includes("admin"));

            const extractedProfile: UserProfile = {
              firstName: typeof idTokenPayload.given_name === "string" ? idTokenPayload.given_name : "",
              lastName: typeof idTokenPayload.family_name === "string" ? idTokenPayload.family_name : "",
              emailAddress: typeof idTokenPayload.email === "string" ? idTokenPayload.email : "",
              username: typeof idTokenPayload.preferred_username === "string" ? idTokenPayload.preferred_username : ""
            };

            setProfile(extractedProfile);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Failed to fetch user session:", error);
          setIsAdmin(false);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      } else {
        setIsAdmin(false);
        setProfile(null);
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, signOut, isAdmin, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
