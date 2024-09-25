/**
 * File Path: @/app/members/admin/users/page.tsx
 *
 * Users Page Component
 * --------------------
 * This file defines the Admin User Page component, allowing administrators
 * to view all users, see their group memberships, and add or remove users from groups.
 * It is optimized for both mobile and desktop screens, ensuring a flexible, usable layout on smaller screens.
 */

"use client";

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
 * This component renders a page where administrators can view and manage users
 * and their associated groups, with the ability to add or remove users from groups.
 *
 * @component
 * @returns {JSX.Element} The rendered AdminUserPage component.
 */
export default function AdminUserPage(): JSX.Element {
  const [users, setUsers] = useState<UserWithGroups[]>([]); // State for storing the list of users with groups
  const [error, setError] = useState<string | null>(null); // State for handling errors

  /**
   * fetchUsers
   * ----------
   * Asynchronously fetches users and their groups from the backend API
   * and updates the component's state.
   */
  const fetchUsers = async () => {
    try {
      // Fetch the users and groups data
      const response = await client.queries.listUsersAndGroups({});
      let responseData = response.data;

      // If the response data is a string, attempt to parse it as JSON
      if (typeof responseData === "string") {
        responseData = JSON.parse(responseData);
      }

      // Check if the response data is an array and update the state
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
   * handleAddUserToGroup
   * --------------------
   * Adds a user to a specified group and refetches the user list.
   *
   * @param {string} username - The username of the user.
   * @param {string} groupName - The name of the group to add the user to.
   */
  const handleAddUserToGroup = async (username: string, groupName: string) => {
    try {
      await client.mutations.addUserToGroup({ username, groupName });
      await fetchUsers(); // Refresh the user list after adding
    } catch (err) {
      console.error("Error adding user to group:", err);
    }
  };

  /**
   * handleRemoveUserFromGroup
   * -------------------------
   * Removes a user from a specified group and refetches the user list.
   *
   * @param {string} username - The username of the user.
   * @param {string} groupName - The name of the group to remove the user from.
   */
  const handleRemoveUserFromGroup = async (username: string, groupName: string) => {
    try {
      await client.mutations.removeUserFromGroup({ username, groupName });
      await fetchUsers(); // Refresh the user list after removing
    } catch (err) {
      console.error("Error removing user from group:", err);
    }
  };

  return (
    <main className="w-full mt-16 backdrop-blur-md bg-white bg-opacity-35 rounded-lg">
      <div className="text-xs mb-2 bg-white bg-opacity-10 pb-2 shadow-lg rounded-lg overflow-hidden">
        <div className="px-5 text-white pt-5 font-extralight text-2xl text-left">
          Users
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="p-4 flex flex-col space-y-4">
          {users.length === 0 && !error ? (
            <p className="text-center text-white">No users found.</p>
          ) : (
            users.map((userWithGroups) => (
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

                {/* Centered action buttons */}
                <div className="flex flex-row justify-center w-full sm:w-auto space-x-4">
                  <button
                    onClick={() =>
                      handleAddUserToGroup(
                        userWithGroups.user.Username,
                        "YourGroupName"
                      )
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded text-xs"
                  >
                    Add to Group
                  </button>
                  <button
                    onClick={() =>
                      handleRemoveUserFromGroup(
                        userWithGroups.user.Username,
                        "YourGroupName"
                      )
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded text-xs"
                  >
                    Remove from Group
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
