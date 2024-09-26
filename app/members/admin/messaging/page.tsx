/**
 * File Path: @/app/members/admin/messaging/page.tsx
 *
 * Messaging Page Component
 * ------------------------
 * This file defines the Admin Messaging Page component, allowing administrators
 * to create, update, and delete a site-wide notification message.
 */

"use client";

import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useContext } from "react";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext"; // Import the toast notifications context

// Define TypeScript interface for notification
interface SiteNotification {
  id: string;
  message: string;
}

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

/**
 * AdminMessagingPage Component
 * ----------------------------
 * This component renders a textarea allowing admins to manage the site notification message.
 * It includes functionality for creating, updating, and deleting the notification.
 *
 * @component
 * @returns {JSX.Element} The rendered AdminMessagingPage component.
 */
export default function AdminMessagingPage(): JSX.Element {
  const [notification, setNotification] = useState<SiteNotification | null>(null); // State to store current notification
  const [message, setMessage] = useState<string>(""); // State to store textarea message
  const [error, setError] = useState<string | null>(null); // Error handling state
  const { addToast } = useContext<ToastContextType>(ToastContext); // Access toast notifications from ToastContext

  // Fetch the current site notification on component mount
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const { data, errors } = await client.models.SiteNotification.list({});
        if (errors) {
          setError("Failed to fetch notification");
          addToast({
            messageType: "error",
            message: "Failed to fetch site notification.",
          });
          return;
        }
        // Assume there's only one notification for simplicity
        const currentNotification = data[0] as SiteNotification | undefined;
        setNotification(currentNotification || null);
        setMessage(currentNotification?.message || "");
      } catch (err) {
        console.error("Error fetching notification:", err);
        setError("Failed to fetch notification");
        addToast({
          messageType: "error",
          message: "An error occurred while fetching the notification.",
        });
      }
    };

    fetchNotification();
  }, [addToast]);

  // Handle save/update of the notification
  const handleSave = async () => {
    try {
      if (notification) {
        // Update existing notification
        const { errors } = await client.models.SiteNotification.update({
          id: notification.id,
          message,
        });
        if (errors) throw new Error("Failed to update notification");
      } else {
        // Create new notification
        const { errors } = await client.models.SiteNotification.create({
          message,
        });
        if (errors) throw new Error("Failed to create notification");
      }
      addToast({
        messageType: "success",
        message: "Notification saved successfully!",
      });
    } catch (err) {
      console.error("Error saving notification:", err);
      setError("Failed to save notification");
      addToast({
        messageType: "error",
        message: "An error occurred while saving the notification.",
      });
    }
  };

  // Handle delete of the notification
  const handleDelete = async () => {
    try {
      if (!notification) return;
      const { errors } = await client.models.SiteNotification.delete({ id: notification.id });
      if (errors) throw new Error("Failed to delete notification");
      setNotification(null);
      setMessage("");
      addToast({
        messageType: "success",
        message: "Notification deleted successfully!",
      });
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Failed to delete notification");
      addToast({
        messageType: "error",
        message: "An error occurred while deleting the notification.",
      });
    }
  };

  return (
    <main className="w-full flex justify-center">
      <div className="w-full p-2 backdrop-blur-md bg-white bg-opacity-35 rounded-lg mt-16">
        <h2 className="p-3 font-extralight text-2xl text-left">Manage Site Notification</h2>
        <div className="bg-black bg-opacity-70 p-4 rounded-lg w-full">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4 w-full">
            <label className="block text-white text-xs text-left">Notification Message</label>
            <textarea
              className="p-2 my-2 text-black w-full h-40 rounded border border-blue-600"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter the site-wide notification message..."
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handleSave}
              className="p-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 border border-blue-500"
            >
              Save Notification
            </button>
            {notification && (
              <button
                onClick={handleDelete}
                className="p-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 border border-red-500"
              >
                Delete Notification
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
