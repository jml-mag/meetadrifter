/**
 * File Path: @/app/members/admin/polls/page.tsx
 * 
 * Admin Page Component
 * --------------------
 * This file defines the AdminPage component, which serves as the main page for admin functionalities.
 * It includes components for listing existing polls and creating new polls. The page layout is responsive,
 * ensuring a consistent user experience across different screen sizes.
 */

import CreatePoll from "@/components/CreatePoll"; // Import the CreatePoll component to handle poll creation.
import ListPolls from "@/components/ListPolls"; // Import the ListPolls component to display existing polls.

/**
 * AdminPage Component
 * -------------------
 * Renders the admin dashboard with sections for listing and creating polls.
 * 
 * @component
 * @returns {JSX.Element} The rendered AdminPage component.
 */
export default function AdminPollPage(): JSX.Element {
  return (
    <main className="w-full justify-center">
      <div className="mt-16">
        <div className="md:flex md:justify-around sm:p-4">
          {/* Section for listing existing polls */}
          <div className="mt-3 md:w-full md:m-2">
            <ListPolls />
          </div>
          {/* Section for creating new polls */}
          <div className="mt-3 md:w-full md:m-2">
            <CreatePoll />
          </div>
        </div>
      </div>
    </main>
  );
}
