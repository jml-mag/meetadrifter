/**
 * File Path: contexts/AuthContext.tsx
 * 
 * AuthContext
 * -----------
 * This file provides a React context for managing authentication throughout the application.
 * It uses AWS Amplify for authentication functionalities and allows components to access
 * authentication status, user information, and admin privileges. It also handles user sign-out.
 */

"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { AuthUser, fetchAuthSession } from "@aws-amplify/auth"; // Import types and functions for authentication from AWS Amplify.

/**
 * AuthContextProps Interface
 * --------------------------
 * Defines the shape of the authentication context value, providing access to user info,
 * sign-out functionality, and admin status.
 * 
 * @interface AuthContextProps
 * @property {AuthUser | null | undefined} user - The currently authenticated user, null if not authenticated.
 * @property {() => void} signOut - Function to handle user sign-out.
 * @property {boolean} isAdmin - Indicates if the authenticated user belongs to the "admin" group.
 * @property {boolean} loading - Indicates if the process of determining admin status is ongoing.
 */
export interface AuthContextProps {
  user: AuthUser | null | undefined;
  signOut: () => void;
  isAdmin: boolean;
  loading: boolean;
}

// Creating the AuthContext with an initial default value to avoid null checks and ensure type safety.
const AuthContext = createContext<AuthContextProps | null>(null);

/**
 * useAuth Hook
 * ------------
 * Custom hook to provide easy access to the authentication context.
 * It throws an error if used outside of an `AuthProvider`, ensuring proper usage.
 * 
 * @returns {AuthContextProps} The authentication context properties, including user info, admin status, and sign-out function.
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
 * Wraps all child components that require access to authentication context.
 * Provides context values such as the authenticated user, sign-out function, and admin status.
 * 
 * @component
 * @param {AuthProviderProps} props - The component props.
 * @returns {JSX.Element} The rendered AuthProvider component, making authentication context accessible to all children.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children, user, signOut }) => {
  // State to track if the authenticated user has admin privileges.
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // State to track if the process of determining admin status is still loading.
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    /**
     * checkAdminStatus Function
     * -------------------------
     * Checks if the authenticated user belongs to the "admin" group by fetching their session
     * and examining the token payload. Sets `isAdmin` and `loading` states accordingly.
     */
    async function checkAdminStatus() {
      if (user) {
        try {
          const session = await fetchAuthSession();
          // Fetch user attributes and session tokens to determine groups.
          const attributes = await fetchAuthSession();
          console.log("User attributes:", attributes);
          const groups = session.tokens?.idToken?.payload["cognito:groups"];
          setIsAdmin(Array.isArray(groups) && groups.includes("admin"));
        } catch (error) {
          console.error("Failed to fetch user session:", error);
        } finally {
          setLoading(false); // Set loading to false when admin check is complete.
        }
      } else {
        setLoading(false); // If no user is authenticated, no admin check is required.
      }
    }

    checkAdminStatus();
  }, [user]);

  // Return the context provider wrapping all child components that need authentication context.
  return (
    <AuthContext.Provider value={{ user, signOut, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
