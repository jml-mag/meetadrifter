"use client";

/**
 * File Path: @/app/members/admin/messaging/page.tsx
 * 
 * Messaging Page Component
 * ------------------------
 * This component allows administrators to create, update, or delete a site-wide notification message.
 * The page includes a textarea for managing the message content and integrates with toast notifications 
 * to provide feedback to the user. The layout is responsive and adapts to various screen sizes.
 */

import React, { useState, useEffect, useContext } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext"; // Toast notifications context

/**
 * Interface representing the site notification object.
 */
interface SiteNotification {
  id: string;
  message: string;
}

// Generate an Amplify client instance with the defined schema
const client = generateClient<Schema>();

/**
 * AdminMessagingPage Component
 * 
 * @remarks
 * This component allows administrators to manage a site-wide notification. The notification can be created,
 * updated, or deleted, and the component provides feedback via toast notifications. Error handling is included
 * for all operations, and the current notification is fetched when the component is first rendered.
 * 
 * @returns {JSX.Element} The rendered AdminMessagingPage component for managing the site notification.
 */
export default function AdminMessagingPage(): JSX.Element {
  const [notification, setNotification] = useState<SiteNotification | null>(null); // State to store current notification
  const [message, setMessage] = useState<string>(""); // State to store the textarea message content
  const [error, setError] = useState<string | null>(null); // State for handling errors
  const { addToast } = useContext<ToastContextType>(ToastContext); // Access toast notifications from ToastContext

  // Fetch the current site notification when the component is mounted
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
        // Assume there is only one notification for simplicity
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

  /**
   * Handles saving or updating the notification.
   * If a notification exists, it updates it; otherwise, it creates a new one.
   */
  const handleSave = async (): Promise<void> => {
    try {
      if (notification) {
        // Update the existing notification
        const { errors } = await client.models.SiteNotification.update({
          id: notification.id,
          message,
        });
        if (errors) throw new Error("Failed to update notification");
      } else {
        // Create a new notification
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

  /**
   * Handles deleting the notification if one exists.
   */
  const handleDelete = async (): Promise<void> => {
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
    <main className="w-full lg:w-3/4 xl:w-2/3 m-auto flex justify-center">
      <div className="w-full p-2 backdrop-blur-md bg-white bg-opacity-35 rounded-lg">
        <h2 className="p-3 font-extralight text-2xl text-left">Manage Site Notification</h2>
        <div className="bg-black bg-opacity-70 p-4 rounded-lg w-full">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4 w-full">
            <label className="block text-white text-xs text-left">Notification Message</label>
            <textarea
              className="form-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter the site-wide notification message..."
              rows={10}
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
