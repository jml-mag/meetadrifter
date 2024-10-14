"use client";

/**
 * File Path: app/members/contact/RecentContacts.tsx
 * 
 * RecentContacts Component
 * ------------------------
 * This component fetches and displays recent contact messages for administrators. 
 * Admins can view message details and delete messages individually.
 */

import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Initialize the Amplify client for data interactions
const client = generateClient<Schema>();

// Define the structure for the ContactMessage object
type ContactMessage = Schema["ContactMessage"]["type"];

/**
 * AccordionProps
 * --------------
 * Defines the properties for the Accordion component.
 * 
 * @interface AccordionProps
 * @property {ContactMessage} message - The contact message to display.
 * @property {string | null} expanded - The ID of the currently expanded message, or null if none.
 * @property {React.Dispatch<React.SetStateAction<string | null>>} setExpanded - Function to expand or collapse a message.
 * @property {(messageId: string) => Promise<void>} handleDeleteMessage - Function to handle message deletion.
 */
interface AccordionProps {
  message: ContactMessage;
  expanded: string | null;
  setExpanded: React.Dispatch<React.SetStateAction<string | null>>;
  handleDeleteMessage: (messageId: string) => Promise<void>;
}

/**
 * Accordion Component
 * -------------------
 * Displays an individual contact message with expandable details.
 * 
 * @param {AccordionProps} props - The props for the Accordion component.
 * @returns {JSX.Element} The rendered accordion component.
 */
const Accordion: React.FC<AccordionProps> = ({
  message,
  expanded,
  setExpanded,
  handleDeleteMessage,
}) => {
  const isOpen = message.id === expanded;

  return (
    <article className="text-xs mb-2 bg-black bg-opacity-70 pb-2 shadow-lg rounded-lg overflow-hidden">
      <motion.header
        className="cursor-pointer p-4 flex items-center justify-between"
        initial={false}
        onClick={() => setExpanded(isOpen ? null : message.id)}
        role="button"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col flex-grow">
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {message.firstName} {message.lastName}
                </span>
                <div className="flex space-x-4">
                  <time dateTime={new Date(message.createdAt).toISOString()}>
                    {new Date(message.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-300">
                {message.emailAddress}
              </div>
            </div>
            <button
              className="p-2 px-4 bg-red-600 text-white rounded ml-4"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteMessage(message.id);
              }}
              aria-label={`Delete message from ${message.firstName} ${message.lastName}`}
            >
              Delete
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="p-4 text-left">
              <p className="mb-2">
                <strong>Message:</strong>
              </p>
              <p className="bg-gray-800 p-2 rounded">{message.message}</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </article>
  );
};

/**
 * RecentContacts Component
 * ------------------------
 * Fetches and displays recent contact messages.
 * 
 * @returns {JSX.Element} The rendered RecentContacts component.
 */
export default function RecentContacts(): JSX.Element {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { addToast } = React.useContext<ToastContextType>(ToastContext);

  useEffect(() => {
    /**
     * Fetches contact messages from the backend and sorts them by creation date.
     */
    const fetchMessages = async (): Promise<void> => {
      try {
        const { data: messageList, errors } = await client.models.ContactMessage.list();
        if (errors) {
          setError("Failed to fetch contact messages");
          console.error("Errors:", errors);
        } else {
          const sortedMessages = messageList.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setMessages(sortedMessages);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new contact messages
    const subscription = client.models.ContactMessage.onCreate().subscribe({
      next: (newMessage) => {
        setMessages((prevMessages) => {
          const updatedMessages = [newMessage, ...prevMessages];
          return updatedMessages.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      },
      error: (error) => console.error("Error in subscription:", error),
    });

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Deletes a specific contact message and updates the state.
   * 
   * @param {string} messageId - The ID of the contact message to delete.
   */
  const handleDeleteMessage = async (messageId: string): Promise<void> => {
    try {
      await client.models.ContactMessage.delete({ id: messageId });
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId)
      );
      addToast({
        messageType: "success",
        message: "Message deleted successfully.",
      });
    } catch (err) {
      console.error("Failed to delete message:", err);
      addToast({
        messageType: "error",
        message: "Failed to delete message.",
      });
    }
  };

  if (loading) {
    return <div>Loading contact messages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="section-container p-2">
      <h1 className="heading">Recent Contacts</h1>
      {messages.length === 0 ? (
        <p>No contact messages found.</p>
      ) : (
        messages.map((message) => (
          <Accordion
            key={message.id}
            message={message}
            expanded={expanded}
            setExpanded={setExpanded}
            handleDeleteMessage={handleDeleteMessage}
          />
        ))
      )}
    </section>
  );
}
