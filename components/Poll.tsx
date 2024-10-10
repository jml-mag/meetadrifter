/**
 * File Path: components/Poll.tsx
 *
 * Poll Component
 * --------------
 * This component is responsible for rendering the current active poll, 
 * allowing users to vote, and displaying real-time results.
 * It integrates with AWS Amplify to fetch poll data and handle real-time updates.
 */

"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useAuth } from "@/contexts/AuthContext";

// Generate a client instance for interacting with the data schema.
const client = generateClient<Schema>();

/**
 * Poll Component
 * --------------
 * Renders the current active poll, allows users to vote, and displays real-time results.
 * The component fetches data from AWS Amplify and handles state updates when users vote.
 *
 * @component
 * @returns {JSX.Element} The rendered Poll component.
 */
export default function Poll(): JSX.Element {
  const { user } = useAuth(); // Access user details from authentication context.
  const [poll, setPoll] = useState<Schema["Poll"]["type"] | null>(null); // State to store the current poll.
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({}); // State to store vote counts for each option.
  const [hasVoted, setHasVoted] = useState<boolean>(false); // State to track if the user has already voted.
  const [loading, setLoading] = useState<boolean>(true); // State to track data loading status.
  const [error, setError] = useState<string | null>(null); // State to store error messages.

  useEffect(() => {
    /**
     * fetchPollData
     * -------------
     * Fetches the active poll and its associated votes from the backend.
     * If an active poll is found, it sets the poll state and vote counts.
     * 
     * Handles user vote detection and initializes vote counts for each poll option.
     */
    const fetchPollData = async (): Promise<void> => {
      try {
        const { data: pollList, errors } = await client.models.Poll.list({
          filter: { status: { eq: "active" } },
        });

        if (errors || !pollList || pollList.length === 0) {
          setError("Error fetching poll data.");
          return;
        }

        const activePoll = pollList[0];
        setPoll(activePoll);

        if (!activePoll) return;

        // Fetch all votes for the active poll
        const { data: voteData } = await client.models.Vote.list({
          filter: { pollId: { eq: activePoll.id } },
        });

        // Check if the user has already voted
        const userVote = voteData.find(
          (vote) => vote.userId === user?.username
        );
        if (userVote) {
          setHasVoted(true);
        }

        // Initialize and count votes
        const initialVoteCounts: Record<string, number> = {};
        activePoll.options.forEach((option) => {
          if (option !== null) {
            initialVoteCounts[option] = 0;
          }
        });

        voteData.forEach((vote) => {
          if (vote.option && vote.option in initialVoteCounts) {
            initialVoteCounts[vote.option]++;
          }
        });

        setVoteCounts(initialVoteCounts);
      } catch (error) {
        setError("Error fetching poll data.");
        console.error("Error fetching poll data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, [user]);

  useEffect(() => {
    /**
     * Subscribe to real-time poll updates once the user has voted.
     * 
     * Subscribes to new votes for the current poll, updating the vote counts in real-time.
     */
    if (poll && hasVoted) {
      const subscription = client.models.Vote.onCreate({
        filter: { pollId: { eq: poll.id } },
      }).subscribe({
        next: (data) => {
          const updatedVoteCounts = { ...voteCounts };
          if (data.option && data.option in updatedVoteCounts) {
            updatedVoteCounts[data.option] += 1;
            setVoteCounts(updatedVoteCounts);
          }
        },
        error: (error) => console.error("Error in subscription:", error),
      });

      return () => subscription.unsubscribe();
    }
  }, [poll, hasVoted, voteCounts]);

  /**
   * handleVote
   * ----------
   * Handles the user's vote submission and updates the vote counts optimistically.
   * 
   * @param {string} option - The option the user selects to vote for.
   */
  const handleVote = async (option: string): Promise<void> => {
    if (!hasVoted && option) {
      try {
        await client.models.Vote.create({
          userId: user?.username || "",
          pollId: poll!.id,
          option,
        });

        setHasVoted(true);

        // Optimistically update vote counts
        setVoteCounts((prev) => ({
          ...prev,
          [option]: (prev[option] || 0) + 1,
        }));
      } catch (error) {
        setError("Error casting vote.");
        console.error("Error casting vote:", error);
      }
    }
  };

  if (loading) return <div>Loading active poll...</div>;
  if (error || !poll)
    return <div>{error || "There is no active poll currently"}</div>;

  return (
    <section className="section-container sm:ml-1 md:ml-0 pb-4 sm:p-4 h-min">
      <header className="heading">Current Poll</header>
      <article className="bg-black bg-opacity-70 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{poll.title}</h2>
        {hasVoted ? (
          <div className="max-w-md mx-auto">
            <h3 className="text-lg mb-2 text-center">Current Results</h3>
            <ul className="space-y-2 w-full">
              {Object.entries(voteCounts).map(([option, count]) => (
                <li key={option} className="text-sm">
                  <div className="grid grid-cols-3 gap-4">
                    <span className="col-span-2 text-left">{option}</span>
                    <span className="text-left">
                      {count} vote{`${count !== 1 ? "s" : ""}`}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-4">
            {poll.options.map((option) => (
              <button
                key={option}
                className="btn btn-primary block w-full"
                onClick={() => handleVote(option as string)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
