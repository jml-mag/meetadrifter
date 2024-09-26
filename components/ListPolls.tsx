/**
 * File Path: components/ListPolls.tsx
 * 
 * List Polls Component
 * --------------------
 * This file defines the ListPolls component, which is responsible for displaying a list of polls,
 * allowing users to view poll details, activate polls, and delete polls. The component integrates
 * with AWS Amplify for data fetching, real-time updates, and state management.
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

type Poll = Schema["Poll"]["type"];

// Generate a client instance for interacting with the data schema.
const client = generateClient<Schema>();

/**
 * AccordionProps Interface
 * ------------------------
 * Defines the props for the Accordion component.
 */
interface AccordionProps {
  poll: Poll; // The poll object for this accordion section.
  expanded: string | null; // The ID of the currently expanded poll (if any).
  setExpanded: React.Dispatch<React.SetStateAction<string | null>>; // Function to set the expanded poll ID.
  handleActivatePoll: (pollId: string) => Promise<void>; // Function to handle poll activation.
  handleDeletePoll: (pollId: string) => Promise<void>; // Function to handle poll deletion.
}

interface Subscription {
  unsubscribe: () => void;
}


/**
 * Accordion Component
 * -------------------
 * Renders an accordion section for a single poll, including poll details, vote counts, and actions.
 * 
 * @component
 * @param {AccordionProps} props - The props for the component.
 * @returns {JSX.Element} The rendered Accordion component.
 */
const Accordion: React.FC<AccordionProps> = ({
  poll,
  expanded,
  setExpanded,
  handleActivatePoll,
  handleDeletePoll,
}) => {
  const isOpen = poll.id === expanded; // Check if this accordion is open.
  const isActive = poll.status === "active"; // Check if this poll is active.

  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({}); // State to store the vote counts for each option.

  useEffect(() => {
    /**
     * fetchVotes Function
     * -------------------
     * Fetches the votes for this poll and updates the vote counts state.
     */
    const fetchVotes = async () => {
      const { data: votes, errors } = await client.models.Vote.list({
        filter: { pollId: { eq: poll.id } },
      });

      if (!errors) {
        const counts: Record<string, number> = {};
        poll.options.forEach((option) => {
          if (option) {
            counts[option] = votes.filter(
              (vote) => vote.option === option
            ).length;
          }
        });
        setVoteCounts(counts);
      } else {
        console.error("Failed to fetch votes:", errors);
      }
    };

    if (isOpen) {
      fetchVotes();
    }

    // Subscribe to real-time vote updates
    let subscription: Subscription;
    if (isOpen || isActive) {
      subscription = client.models.Vote.onCreate({
        filter: { pollId: { eq: poll.id } },
      }).subscribe({
        next: (newVote) => {
          setVoteCounts((prevCounts) => ({
            ...prevCounts,
            [newVote.option]: (prevCounts[newVote.option] || 0) + 1,
          }));
        },
        error: (error) => console.error("Error in subscription:", error),
      });
    }

    // Cleanup the subscription on component unmount
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [isOpen, isActive, poll.id, poll.options]);

  return (
    <div className="text-xs mb-2 bg-black bg-opacity-70 pb-2 shadow-lg rounded-lg overflow-hidden">
      <motion.header
        className="cursor-pointer p-4 flex items-center justify-between"
        initial={false}
        onClick={() => setExpanded(isOpen ? null : poll.id)}
      >
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <button
              className={`w-14 h-14 p-2 rounded-lg ${
                isActive
                  ? "bg-blue-400 text-blue-50 border border-blue-200"
                  : "bg-blue-800 text-blue-700 border border-blue-600"
              } bg-opacity-75 `}
              onClick={(e) => {
                e.stopPropagation();
                handleActivatePoll(poll.id);
              }}
            >
              Active
            </button>
            <div className="flex flex-col flex-grow pl-4">
              <div className="flex items-center justify-between">
                <span>{poll.title}</span>
                <div className="flex space-x-4">
                  <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex mt-2 space-x-2">
                <button
                  className="p-2 px-4 bg-red-600 text-white rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePoll(poll.id);
                  }}
                >
                  Delete
                </button>
                <button
                  className="p-2 px-4 bg-blue-600 text-white rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(isOpen ? null : poll.id);
                  }}
                >
                  {isOpen ? "Show Less" : "Show More"}
                </button>
              </div>
            </div>
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
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="w-full">
              <div className="text-lg font-semibold pb-2">Poll Details</div>
              <div className="grid grid-cols-2 gap-2 text-left pb-3">
                <div className="font-bold text-center">Title</div>
                <div>{poll.title}</div>

                <div className="font-bold text-center">Status</div>
                <div>{poll.status}</div>

                <div className="font-bold text-center">Created</div>
                <div>{new Date(poll.createdAt).toLocaleString()}</div>
              </div>
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
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * ListPolls Component
 * -------------------
 * Renders a list of polls with the ability to expand each poll for more details, 
 * activate polls, and delete polls. Also handles real-time updates via subscriptions.
 * 
 * @component
 * @returns {JSX.Element} The rendered ListPolls component.
 */
export default function ListPolls(): JSX.Element {
  const [polls, setPolls] = useState<Poll[]>([]); // State to store the list of polls.
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status.
  const [error, setError] = useState<string | null>(null); // State to store any error messages.
  const [expanded, setExpanded] = useState<string | null>(null); // State to track the expanded accordion section.

  useEffect(() => {
    /**
     * fetchPolls Function
     * -------------------
     * Fetches the list of polls from the backend and sorts them by status and creation date.
     */
    const fetchPolls = async (): Promise<void> => {
      try {
        const { data: pollList, errors } = await client.models.Poll.list();

        if (errors) {
          setError("Failed to fetch polls");
          console.error("Errors:", errors);
        } else {
          const sortedPolls = pollList.sort((a, b) => {
            if (a.status === "active") return -1;
            if (b.status === "active") return 1;
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          setPolls(sortedPolls);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();

    // Subscribe to new poll creations
    const subscription = client.models.Poll.onCreate().subscribe({
      next: (newPoll) => {
        setPolls((prevPolls) => {
          const updatedPolls = [newPoll, ...prevPolls];
          return updatedPolls.sort((a, b) => {
            if (a.status === "active") return -1;
            if (b.status === "active") return 1;
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        });
      },
      error: (error) => console.error("Error in subscription:", error),
    });

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Find the active poll and subscribe to it
    const activePoll = polls.find((poll) => poll.status === "active");

    if (activePoll) {
      const subscription = client.models.Vote.onCreate({
        filter: { pollId: { eq: activePoll.id } },
      }).subscribe({
        next: () => {
          setPolls((prevPolls) =>
            prevPolls.map((poll) => {
              if (poll.id === activePoll.id) {
                return {
                  ...poll,
                  // voteCounts is not on the poll type, so handle it in the Accordion
                };
              }
              return poll;
            })
          );
        },
        error: (error) => console.error("Error in vote subscription:", error),
      });

      return () => subscription.unsubscribe();
    }
  }, [polls]);

  /**
   * handleActivatePoll Function
   * ---------------------------
   * Activates a specific poll and deactivates all others.
   * 
   * @param {string} pollId - The ID of the poll to activate.
   */
  const handleActivatePoll = async (pollId: string): Promise<void> => {
    try {
      // Step 1: Set all polls to inactive
      const { data: polls, errors } = await client.models.Poll.list();
      if (errors) {
        console.error("Failed to fetch polls for deactivation:", errors);
        return;
      }
      await Promise.all(
        polls.map(async (poll) => {
          if (poll.id !== pollId && poll.status === "active") {
            await client.models.Poll.update({
              id: poll.id,
              status: "inactive",
            });
          }
        })
      );

      // Step 2: Set the selected poll to active
      await client.models.Poll.update({ id: pollId, status: "active" });

      // Step 3: Update state
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll.id === pollId
            ? { ...poll, status: "active" }
            : { ...poll, status: "inactive" }
        )
      );
    } catch (err) {
      console.error("Failed to activate poll:", err);
    }
  };

  /**
   * handleDeletePoll Function
   * -------------------------
   * Deletes a specific poll and its associated votes.
   * 
   * @param {string} pollId - The ID of the poll to delete.
   */
  const handleDeletePoll = async (pollId: string): Promise<void> => {
    try {
      // Fetch all votes associated with the poll
      const { data: votes, errors } = await client.models.Vote.list({
        filter: { pollId: { eq: pollId } },
      });

      if (errors) {
        console.error("Failed to fetch associated votes:", errors);
        return;
      }

      // Delete each vote individually
      if (votes) {
        await Promise.all(
          votes.map(async (vote) => {
            await client.models.Vote.delete({ id: vote.id });
          })
        );
      }

      // Delete the poll
      await client.models.Poll.delete({ id: pollId });

      // Remove the poll from the state
      setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
    } catch (err) {
      console.error("Failed to delete poll:", err);
    }
  };

  if (loading) {
    return <div>Loading polls...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="section-container p-2">
      <div className="heading">Current Polls</div>
      {polls.map((poll) => (
        <Accordion
          key={poll.id}
          poll={poll}
          expanded={expanded}
          setExpanded={setExpanded}
          handleActivatePoll={handleActivatePoll}
          handleDeletePoll={handleDeletePoll}
        />
      ))}
    </div>
  );

}
