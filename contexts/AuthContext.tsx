/**
 * File Path: contexts/AuthContext.tsx
 * 
 * Authentication Context
 * ----------------------
 * This file provides a React context for managing authentication throughout the application.
 * It handles user state, provides functions for signing out, and checks if the current user has admin status.
 */

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { AuthUser, fetchAuthSession } from "@aws-amplify/auth"; // Import types and functions for authentication from AWS Amplify.

/**
 * AuthContextProps Interface
 * --------------------------
 * Defines the structure of the authentication context properties.
 * 
 * @interface AuthContextProps
 * @property {AuthUser | null | undefined} user - The authenticated user.
 * @property {() => void} signOut - Function to handle user sign-out.
 * @property {boolean} isAdmin - Indicates if the current user belongs to the admin group.
 * @property {boolean} loading - Indicates if the admin status is still being determined.
 */
export interface AuthContextProps {
  user: AuthUser | null | undefined;
  signOut: () => void;
  isAdmin: boolean;
  loading: boolean;
}

// Creating the AuthContext with a default value to ensure type safety and avoid the need for null checks.
const AuthContext = createContext<AuthContextProps | null>(null);

/**
 * useAuth Hook
 * ------------
 * Custom hook to provide easy access to the AuthContext.
 * Throws an error if it is used outside of an AuthProvider, ensuring proper usage.
 * 
 * @returns {AuthContextProps} The authentication context properties.
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider to access the user and authentication functions.");
  }
  return context;
};

/**
 * AuthProviderProps Interface
 * ---------------------------
 * Defines the structure for the props passed to the AuthProvider component.
 * 
 * @interface AuthProviderProps
 * @property {ReactNode} children - Any valid React child components that may consume authentication context.
 * @property {AuthUser | null} user - The authenticated user object.
 * @property {() => void} signOut - Function to sign out the user.
 */
interface AuthProviderProps {
  children: ReactNode;
  user: AuthUser | null;
  signOut: () => void;
}

/**
 * AuthProvider Component
 * ----------------------
 * Wraps child components that need access to the authentication context.
 * It accepts the authenticated user and a signOut function as props.
 * 
 * @component
 * @param {AuthProviderProps} props - The component props.
 * @returns {JSX.Element} The rendered AuthProvider component.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children, user, signOut }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // State to track admin status.
  const [loading, setLoading] = useState<boolean>(true); // State to track the loading status.

  useEffect(() => {
    async function checkAdminStatus() {
      if (user) {
        try {
          const session = await fetchAuthSession();
          const groups = session.tokens?.idToken?.payload["cognito:groups"];
          if (Array.isArray(groups) && groups.includes("admin")) {
            console.log("User is an admin");
            setIsAdmin(true);
          } else {
            console.log("User is not an admin");
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Failed to fetch user session:", error);
        } finally {
          setLoading(false); // Admin status check is complete.
        }
      } else {
        setLoading(false); // No user, so no admin check needed.
      }
    }

    checkAdminStatus();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, signOut, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
