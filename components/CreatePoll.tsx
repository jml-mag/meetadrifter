"use client";

/**
 * File Path: components/CreatePoll.tsx
 *
 * CreatePoll Component
 * --------------------
 * This component provides a form interface for creating a new poll. Users can specify a poll title
 * and up to 10 options. The component integrates with AWS Amplify to store poll data and provides
 * feedback through toast notifications for both successful and unsuccessful operations.
 */

import React, { useState, useContext } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate a client instance for interacting with Amplify data schema.
const client = generateClient<Schema>();

/**
 * CreatePoll Component
 * --------------------
 * Renders a form that allows users to create a new poll with a title and multiple options.
 * Users can add up to 10 options, and the component provides real-time feedback using toast notifications.
 *
 * @component
 * @returns {JSX.Element} - The rendered CreatePoll component.
 */
export default function CreatePoll(): JSX.Element {
  const [title, setTitle] = useState<string>(""); // State to store the poll title.
  const [options, setOptions] = useState<string[]>([""]); // State to store the poll options.

  const { addToast } = useContext<ToastContextType>(ToastContext); // Access toast notifications from context.

  /**
   * addOption Function
   * ------------------
   * Adds a new option input field if there are fewer than 10 options.
   */
  const addOption = (): void => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    } else {
      addToast({
        messageType: "error",
        message: "You can only add up to 10 options.",
      });
    }
  };

  /**
   * handleOptionChange Function
   * ---------------------------
   * Updates the value of a specific poll option based on user input.
   *
   * @param {number} index - The index of the option being modified.
   * @param {string} value - The new value for the option.
   */
  const handleOptionChange = (index: number, value: string): void => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  /**
   * handleOptionRemove Function
   * ---------------------------
   * Removes a poll option based on the index provided.
   *
   * @param {number} index - The index of the option to be removed.
   */
  const handleOptionRemove = (index: number): void => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  /**
   * handleSubmit Function
   * ---------------------
   * Validates the poll form fields and submits the poll to the backend.
   * Displays feedback via toast notifications on success or failure.
   */
  const handleSubmit = async (): Promise<void> => {
    if (!title || options.some((option) => !option)) {
      addToast({
        messageType: "error",
        message: "Please fill in all fields.",
      });
      return;
    }

    try {
      const { errors } = await client.models.Poll.create({
        title,
        options,
        createdAt: new Date().toISOString(),
        status: "draft", // The initial status of a newly created poll is "draft".
      });

      if (errors) {
        addToast({
          messageType: "error",
          message: "Failed to create poll.",
        });
        console.error("Errors:", errors);
      } else {
        addToast({
          messageType: "success",
          message: "Poll created successfully.",
        });
        setTitle("");
        setOptions([""]); // Reset form fields after successful creation.
      }
    } catch (err) {
      addToast({
        messageType: "error",
        message: "An unexpected error occurred.",
      });
      console.error("Unexpected error:", err);
    }
  };

  return (
    <section className="section-container p-2">
      <header>
        <h1 className="heading">Create a New Poll</h1>
      </header>
      <div className="bg-black bg-opacity-70 p-4 rounded-lg w-full">
        <div className="mb-4 w-full">
          <label htmlFor="poll-title" className="block text-white text-xs text-left">
            Poll Title
          </label>
          <input
            id="poll-title"
            className="form-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter poll title"
            aria-label="Poll Title"
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block text-white text-xs text-left">Poll Options</label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                className="form-input"
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                aria-label={`Poll Option ${index + 1}`}
              />
              <button
                className="btn btn-secondary ml-2"
                type="button"
                onClick={() => handleOptionRemove(index)}
                aria-label={`Remove Option ${index + 1}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          {options.length < 10 && (
            <button
              className="btn bg-green-600 hover:bg-green-700 border border-green-500 text-white"
              type="button"
              onClick={addOption}
              aria-label="Add Poll Option"
            >
              Add Option
            </button>
          )}
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleSubmit}
            aria-label="Create Poll"
          >
            Create Poll
          </button>
        </div>
      </div>
    </section>
  );
}
