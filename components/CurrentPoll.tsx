/**
 * File Path: components/CurrentPoll.tsx
 * 
 * Current Poll Component
 * ----------------------
 * This file defines the CurrentPoll component, which displays the currently active poll
 * along with the vote counts for each option.
 */

"use client";

import React, { useState, useEffect } from "react";
//import { motion, AnimatePresence } from "framer-motion";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

type Poll = Schema["Poll"]["type"];
//type Vote = Schema["Vote"]["type"];

// Generate a client instance for interacting with the data schema.
const client = generateClient<Schema>();

/**
 * CurrentPoll Component
 * ---------------------
 * Renders the currently active poll along with vote counts for each option.
 * It handles real-time updates via subscriptions.
 * 
 * @component
 * @returns {JSX.Element} The rendered CurrentPoll component.
 */
export default function CurrentPoll(): JSX.Element {
  const [poll, setPoll] = useState<Poll | null>(null); // State to store the active poll.
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({}); // State to store the vote counts.
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status.
  const [error, setError] = useState<string | null>(null); // State to store any error messages.

  useEffect(() => {
    /**
     * fetchActivePoll Function
     * ------------------------
     * Fetches the currently active poll from the backend.
     */
    const fetchActivePoll = async (): Promise<void> => {
      try {
        const { data: polls, errors } = await client.models.Poll.list({
          filter: { status: { eq: "active" } },
        });

        if (errors || !polls || polls.length === 0) {
          setError("No active poll found.");
          console.error("Errors:", errors);
        } else {
          setPoll(polls[0]);
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching the active poll.");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePoll();
  }, []);

  useEffect(() => {
    /**
     * fetchVoteCounts Function
     * ------------------------
     * Fetches the vote counts for the current poll and sets up a subscription for real-time updates.
     */
    const fetchVoteCounts = async (): Promise<void> => {
      if (!poll) return;

      try {
        const { data: votes, errors } = await client.models.Vote.list({
          filter: { pollId: { eq: poll.id } },
        });

        if (errors) {
          setError("Failed to fetch votes.");
          console.error("Errors:", errors);
        } else {
          const counts: Record<string, number> = {};
          poll.options.forEach((option) => {
            if (option) {
              counts[option] = votes.filter((vote) => vote.option === option).length;
            }
          });
          setVoteCounts(counts);
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching votes.");
        console.error("Unexpected error:", err);
      }
    };

    fetchVoteCounts();

    // Subscribe to real-time vote updates
    let subscription: { unsubscribe: () => void };
    if (poll) {
      subscription = client.models.Vote.onCreate({
        filter: { pollId: { eq: poll.id } },
      }).subscribe({
        next: (newVote) => {
          setVoteCounts((prevCounts) => ({
            ...prevCounts,
            [newVote.option]: (prevCounts[newVote.option] || 0) + 1,
          }));
        },
        error: (error) => console.error("Error in vote subscription:", error),
      });
    }

    // Cleanup subscription on component unmount
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [poll]);

  if (loading) {
    return <div>Loading current poll...</div>;
  }

  if (error || !poll) {
    return <div>Error: {error || "No active poll available."}</div>;
  }

  return (
    <div className="w-full pb-4 sm:p-4 backdrop-blur-md bg-white bg-opacity-35 rounded-lg">
      <div className="p-3 font-extralight text-2xl text-left">
        Current Poll
      </div>
      <div className="text-xs mb-2 bg-black bg-opacity-70 pb-2 shadow-lg rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="text-lg font-semibold pb-2">{poll.title}</div>
          <table className="w-full text-left table-auto">
            <thead>
              <tr>
                <th className="p-2">Option</th>
                <th className="p-2">Votes</th>
              </tr>
            </thead>
            <tbody>
              {poll.options.map((option, index) => (
                <tr key={index}>
                  <td className="p-2">{option}</td>
                  <td className="p-2">
                    {voteCounts[option as string] || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
