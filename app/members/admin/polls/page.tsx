/**
 * File Path: @/app/members/admin/polls/page.tsx
 * 
 * Polls Page Component
 * --------------------
 * This component defines the admin page for managing polls. It provides sections for displaying the list
 * of existing polls and creating new polls. The layout is responsive and ensures that components are displayed
 * in a flexible layout that adapts to various screen sizes.
 */

import CreatePoll from "@/components/CreatePoll"; // Component for creating new polls.
import ListPolls from "@/components/ListPolls"; // Component for listing existing polls.

/**
 * AdminPollPage Component
 * 
 * @remarks
 * This component renders the admin dashboard for managing polls. It includes two main sections: one for listing
 * all existing polls and another for creating new polls. The layout is responsive, flexing between columns or
 * rows depending on screen size. The components take full width on smaller screens and share space on larger screens.
 * 
 * @returns {JSX.Element} The rendered AdminPollPage component for managing polls.
 */
export default function AdminPollPage(): JSX.Element {
  return (
    <main className="w-full">
      <div className="">
        <div className="flex flex-col md:flex-row justify-center md:space-x-6 w-full">
          {/* Section for listing existing polls */}
          <div className="w-full md:w-1/2">
            <ListPolls /> {/* Render the ListPolls component */}
          </div>
          {/* Section for creating new polls */}
          <div className="w-full md:w-1/2">
            <CreatePoll /> {/* Render the CreatePoll component */}
          </div>
        </div>
      </div>
    </main>
  );
}
