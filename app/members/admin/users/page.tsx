"use client";

/**
 * File Path: @/app/members/admin/users/page.tsx
 *
 * Users Page Component
 * --------------------
 * This component provides an interface for administrators to view and manage users,
 * including their group memberships. Administrators can add or remove users from groups,
 * and the layout adapts for both mobile and desktop screens.
 */

import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

// Define TypeScript interfaces for the expected data structures

/**
 * Interface for individual user attributes such as email and verification status.
 */
interface UserAttribute {
  Name: string;
  Value: string;
}

/**
 * Interface for Cognito user data with associated attributes.
 */
interface CognitoUser {
  Username: string;
  Attributes: UserAttribute[];
}

/**
 * Interface for Cognito groups that a user is associated with.
 */
interface CognitoGroup {
  GroupName: string;
}

/**
 * Interface for a user with their associated groups.
 */
interface UserWithGroups {
  user: CognitoUser;
  groups: CognitoGroup[];
}

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

/**
 * AdminUserPage Component
 * -----------------------
 * Renders a page for administrators to view and manage users and their group memberships.
 * Administrators can add or remove users from groups, and the component handles fetching and
 * updating user data from the backend.
 * 
 * @returns {JSX.Element} The rendered AdminUserPage component for user management.
 */
export default function AdminUserPage(): JSX.Element {
  const [users, setUsers] = useState<UserWithGroups[]>([]); // State for storing the list of users with their groups
  const [error, setError] = useState<string | null>(null); // State for handling errors

  /**
   * Fetches the list of users and their groups from the backend and updates the state.
   */
  const fetchUsers = async (): Promise<void> => {
    try {
      const response = await client.queries.listUsersAndGroups({});
      let responseData = response.data;

      // Handle potential stringified response
      if (typeof responseData === "string") {
        responseData = JSON.parse(responseData);
      }

      if (Array.isArray(responseData)) {
        setUsers(responseData as UserWithGroups[]);
      } else {
        console.error("Invalid response structure:", responseData);
        setError("Failed to load users.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users.");
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Adds a user to the specified group and refreshes the user list.
   * 
   * @param {string} username - The username of the user.
   * @param {string} groupName - The name of the group to add the user to.
   */
  const handleAddUserToGroup = async (username: string, groupName: string): Promise<void> => {
    try {
      await client.mutations.addUserToGroup({ username, groupName });
      await fetchUsers(); // Refresh the user list after adding
    } catch (err) {
      console.error("Error adding user to group:", err);
    }
  };

  /**
   * Removes a user from the specified group and refreshes the user list.
   * 
   * @param {string} username - The username of the user.
   * @param {string} groupName - The name of the group to remove the user from.
   */
  const handleRemoveUserFromGroup = async (username: string, groupName: string): Promise<void> => {
    try {
      await client.mutations.removeUserFromGroup({ username, groupName });
      await fetchUsers(); // Refresh the user list after removing
    } catch (err) {
      console.error("Error removing user from group:", err);
    }
  };

  /**
   * Checks if a given user belongs to the "admin" group.
   * 
   * @param {CognitoGroup[]} groups - The groups the user belongs to.
   * @returns {boolean} True if the user is in the "admin" group.
   */
  const isUserAdmin = (groups: CognitoGroup[]): boolean => {
    return groups.some((group) => group.GroupName === "admin");
  };

  return (
    <main className="w-full section-container">
      <div className="text-xs shadow-lg rounded-lg overflow-hidden">
        <div className="px-5 text-white pt-5 heading">
          Users
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="p-4 flex flex-col space-y-4">
          {users.length === 0 && !error ? (
            <p className="text-center text-white">No users found.</p>
          ) : (
            users.map((userWithGroups) => {
              const isAdmin = isUserAdmin(userWithGroups.groups);

              return (
                <div
                  key={userWithGroups.user.Username}
                  className="bg-black bg-opacity-70 p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0"
                >
                  {/* Left aligned user info */}
                  <div className="flex flex-col text-left text-xs sm:text-sm space-y-2 w-full sm:w-auto">
                    <div>
                      <span className="font-bold">Username: </span>
                      {userWithGroups.user.Username}
                    </div>
                    <div>
                      <span className="font-bold">Email: </span>
                      {userWithGroups.user.Attributes.find(
                        (attr) => attr.Name === "email"
                      )?.Value || "N/A"}
                    </div>
                    <div>
                      <span className="font-bold">Groups: </span>
                      {userWithGroups.groups.length > 0
                        ? userWithGroups.groups.map((group) => group.GroupName).join(", ")
                        : "No groups assigned"}
                    </div>
                  </div>

                  {/* Conditionally render action buttons based on admin status */}
                  <div className="flex flex-row justify-center w-full sm:w-auto space-x-4">
                    {!isAdmin && (
                      <button
                        onClick={() =>
                          handleAddUserToGroup(userWithGroups.user.Username, "admin")
                        }
                        className="btn btn-primary"
                      >
                        Add to Admin Group
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() =>
                          handleRemoveUserFromGroup(userWithGroups.user.Username, "admin")
                        }
                        className="btn btn-secondary"
                      >
                        Remove from Admin Group
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
