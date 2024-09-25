/**
 * File Path: components/Profile.tsx
 *
 * Profile Component
 * -----------------
 * This file defines the Profile component, which displays user profile details and allows users 
 * to edit certain fields (first name, last name, location). It interacts with Amplify Data for 
 * fetching and updating user profile information and provides feedback through toast notifications.
 */

import { useAuth } from "@/contexts/AuthContext"; // Import authentication context
import { useContext, useState } from "react";
import { generateClient } from "aws-amplify/data"; // Amplify Data Client
import type { Schema } from "@/amplify/data/resource"; // Data schema type
import { ToastContext, ToastContextType } from "@/contexts/ToastContext"; // Toast notifications context
import { UserProfile } from "@/contexts/AuthContext"; // User profile type from AuthContext

// Initialize a client for interacting with the User model in Amplify Data
const client = generateClient<Schema>();

/**
 * formatDate
 * ----------
 * Utility function to format a date string into "Month Year" format.
 *
 * @param {string} dateString - ISO date string to be formatted.
 * @returns {string} Formatted date in "Month Year" format.
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long" };
  return date.toLocaleDateString(undefined, options);
};

/**
 * Profile Component
 * -----------------
 * Renders the user profile and allows editing of fields like first name, last name, and location.
 * It handles input changes, saves the data to the backend, and provides feedback via toast messages.
 *
 * @component
 * @returns {JSX.Element} The Profile component.
 */
export default function Profile(): JSX.Element {
  const { profile, setProfile } = useAuth(); // Access user profile and setter from AuthContext
  const { addToast } = useContext<ToastContextType>(ToastContext); // Access toast notifications from ToastContext
  const [editing, setEditing] = useState(false); // Track if editing mode is active

  // Store original form data for reverting changes
  const initialFormData = {
    screenName: profile?.screenName || "",
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    location: profile?.location || "",
  };

  // Manage form data for user profile fields
  const [formData, setFormData] = useState(initialFormData);

  /**
   * handleInputChange
   * -----------------
   * Updates the form data state when a user types in an input field.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input event.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleSave
   * ----------
   * Saves the updated profile data to the backend, handles errors, and updates the AuthContext.
   */
  const handleSave = async () => {
    try {
      // Backend call to update the user profile
      const response = await client.models.User.update({
        id: profile?.id || "", // Ensure the user ID is used for updating the correct record
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location,
      });

      if (response.errors) {
        addToast({
          messageType: "error",
          message: "Failed to update profile. Please try again.",
        });
        return;
      }

      // Update the AuthContext with the new profile data
      setProfile((prevProfile: UserProfile | null) => {
        if (!prevProfile) return prevProfile;
        return {
          ...prevProfile,
          firstName: formData.firstName,
          lastName: formData.lastName,
          location: formData.location,
        };
      });

      // Display a success toast message
      addToast({
        messageType: "success",
        message: "Profile updated successfully!",
      });

      // Exit editing mode
      setEditing(false);
    } catch (error) {
      addToast({
        messageType: "error",
        message: "An error occurred while updating the profile.",
      });
      console.error("Error updating profile:", error);
    }
  };

  /**
   * handleCancel
   * ------------
   * Resets the form data to its original state and exits editing mode.
   */
  const handleCancel = () => {
    setFormData(initialFormData); // Reset the form data
    setEditing(false); // Exit editing mode
  };

  return (
    <div className="w-full pb-4 sm:p-4 backdrop-blur-md bg-white bg-opacity-35 rounded-lg">
      <h1 className="p-3 font-extralight text-lg text-left">Your Profile</h1>
      <div className="bg-black bg-opacity-70 p-4 rounded-lg w-full">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="font-semibold text-left">Screen Name</div>
          <div>{profile?.screenName || "N/A"}</div>

          <div className="font-semibold text-left">First Name</div>
          <div>
            {editing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="text-black p-2 rounded border"
              />
            ) : (
              profile?.firstName || "N/A"
            )}
          </div>

          <div className="font-semibold text-left">Last Name</div>
          <div>
            {editing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="text-black p-2 rounded border"
              />
            ) : (
              profile?.lastName || "N/A"
            )}
          </div>

          <div className="font-semibold text-left">Location</div>
          <div>
            {editing ? (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="text-black p-2 rounded border"
              />
            ) : (
              profile?.location || "N/A"
            )}
          </div>

          <div className="font-semibold text-left">Member Since</div>
          <div>{profile?.memberSince ? formatDate(profile.memberSince) : "N/A"}</div>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="p-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 border border-red-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="p-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 border border-blue-500"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="p-2 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-700 border border-gray-500"
            >
              Update Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
