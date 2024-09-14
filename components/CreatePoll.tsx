/**
 * File Path: components/CreatePoll.tsx
 * 
 * Create Poll Component
 * ---------------------
 * This file defines the CreatePoll component, which allows users to create a new poll by specifying a title
 * and multiple options. The component integrates with AWS Amplify to store the poll data and provides feedback
 * through toast notifications.
 */

"use client";

import React, { useState, useContext } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// This type alias could be used for typing the Poll-related state or parameters if needed in the future.
// For example: const [poll, setPoll] = useState<Poll | null>(null);
// or: const handlePollUpdate = (updatedPoll: Poll) => { ... };
// Currently, it's not being used, so it's commented out to avoid TypeScript warnings.
// type Poll = Schema["Poll"]["type"];

// Generate a client instance for interacting with the data schema.
const client = generateClient<Schema>();

/**
 * CreatePoll Component
 * --------------------
 * Renders a form for creating a new poll. Allows users to add multiple options and submit the poll.
 * Provides feedback through toast notifications.
 * 
 * @component
 * @returns {JSX.Element} The rendered CreatePoll component.
 */
export default function CreatePoll(): JSX.Element {
  const [title, setTitle] = useState<string>(""); // State to store the poll title.
  const [options, setOptions] = useState<string[]>([""]); // State to store the poll options.

  const { addToast } = useContext<ToastContextType>(ToastContext); // Access the addToast function from ToastContext.

  /**
   * addOption Function
   * ------------------
   * Adds a new option input field if the limit of 10 options has not been reached.
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
   * Updates the value of a specific option based on user input.
   * 
   * @param {number} index - The index of the option being updated.
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
   * Removes a specific option from the list.
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
   * Submits the new poll to the backend and provides feedback through toast notifications.
   * Validates that all fields are filled before submission.
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
        status: "draft", // Default status is draft.
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
        setOptions([""]);
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
    <div className="w-full pb-4 sm:p-4 backdrop-blur-md bg-white bg-opacity-35 rounded-lg">
      <h1 className="p-3 font-extralight text-2xl text-left">Create a New Poll</h1>
      <div className="bg-black bg-opacity-70 p-4 rounded-lg w-full">
        <div className="mb-4 w-full">
          <label className="block text-white text-xs text-left">Poll Title</label>
          <input
            className="p-2 my-2 text-black w-full rounded border border-blue-600"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block text-white text-xs text-left">Poll Options</label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                className="p-2 my-2 text-black w-full rounded border border-blue-600"
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <button
                className="ml-2 p-2 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700 border border-red-500"
                type="button"
                onClick={() => handleOptionRemove(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          {options.length < 10 && (
            <button
              className="p-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 border border-green-500"
              type="button"
              onClick={addOption}
            >
              Add Option
            </button>
          )}
          <button
            className="p-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 border border-blue-500"
            type="button"
            onClick={handleSubmit}
          >
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
}
