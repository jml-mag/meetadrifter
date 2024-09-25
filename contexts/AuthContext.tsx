import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { AuthUser, fetchAuthSession } from "@aws-amplify/auth"; // Import types and functions for authentication from AWS Amplify.
import { generateClient } from "aws-amplify/data"; // Import Amplify Data Client.
import type { Schema } from "@/amplify/data/resource"; // Import the data schema type.

// Generate a client instance for interacting with the User model.
const client = generateClient<Schema>();

/**
 * UserProfile Interface
 * ---------------------
 * Defines the structure of the user's profile data.
 * 
 * @interface UserProfile
 * @property {string} username - The unique username of the user.
 * @property {string} screenName - The user's chosen screen name.
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} location - The user's location.
 * @property {string} joinedDate - The date the user joined.
 */
export interface UserProfile {
  id: string;
  screenName: string;
  firstName: string;
  lastName: string;
  location: string;
  memberSince: string;
}

/**
 * AuthContextProps Interface
 * --------------------------
 * Defines the structure of the authentication context properties.
 * 
 * @interface AuthContextProps
 * @property {AuthUser | null | undefined} user - The authenticated user.
 * @property {UserProfile | null} profile - The user's profile information.
 * @property {React.Dispatch<React.SetStateAction<UserProfile | null>>} setProfile - Function to update the user profile.
 * @property {() => void} signOut - Function to handle user sign-out.
 * @property {boolean} isAdmin - Indicates if the current user belongs to the admin group.
 * @property {boolean} loading - Indicates if the profile and admin status are still being determined.
 */
export interface AuthContextProps {
  user: AuthUser | null | undefined;
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
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
  const [profile, setProfile] = useState<UserProfile | null>(null); // State to track user profile.
  const [loading, setLoading] = useState<boolean>(true); // State to track the loading status.

  useEffect(() => {
    async function checkAdminStatusAndFetchProfile() {
      if (user) {
        try {
          const session = await fetchAuthSession();
          const groups = session.tokens?.idToken?.payload["cognito:groups"];
          setIsAdmin(Array.isArray(groups) && groups.includes("admin"));

          // Fetch user profile
          const { data } = await client.models.User.get({ id: user.username });
          if (data) {
            setProfile({
              id: data.id,
              screenName: data.screenName,
              firstName: data.firstName,
              lastName: data.lastName || "",
              location: data.location || "",
              memberSince: data.createdAt || "",
            });
          }
        } catch (error) {
          console.error("Failed to fetch user session or profile:", error);
        } finally {
          setLoading(false); // Admin status and profile check are complete.
        }
      } else {
        setLoading(false); // No user, so no profile or admin check needed.
      }
    }

    checkAdminStatusAndFetchProfile();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, signOut, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
