/**
 * File Path: @/app/members/admin/polls/page.tsx
 * 
 * Polls Page Component
 * --------------------
 * This file defines the AdminPollPage component that displays the list of polls and the poll creation form.
 */

import CreatePoll from "@/components/CreatePoll"; // Import the CreatePoll component to handle poll creation.
import ListPolls from "@/components/ListPolls"; // Import the ListPolls component to display existing polls.

/**
 * AdminPollPage Component
 * -----------------------
 * Renders the admin dashboard with sections for listing and creating polls.
 * Ensures that components are responsive and take full width or flex to share space evenly.
 * 
 * @component
 * @returns {JSX.Element} The rendered AdminPollPage component.
 */
export default function AdminPollPage(): JSX.Element {
  return (
    <main className="w-full">
      <div className="">
        <div className="flex flex-col md:flex-row justify-center md:space-x-6 w-full">
          {/* Section for listing existing polls */}
          <div className="w-full md:w-1/2">
            <ListPolls />
          </div>
          {/* Section for creating new polls */}
          <div className="w-full md:w-1/2">
            <CreatePoll />
          </div>
        </div>
      </div>
    </main>
  );
}
