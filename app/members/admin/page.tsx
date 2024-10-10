/**
 * File Path: @/app/members/admin/page.tsx
 * 
 * Admin Page Component
 * --------------------
 * This component defines the admin page for managing polls. It provides sections for listing existing
 * polls and creating new ones. The layout is responsive, ensuring the user interface adapts to various
 * screen sizes, particularly for larger viewports.
 */

import CurrentPoll from "@/components/CurrentPoll";

/**
 * AdminPage Component
 * 
 * @remarks
 * This component renders the main admin dashboard, focused on poll management. It displays existing polls
 * via the `CurrentPoll` component and ensures that the layout is responsive for an optimal user experience
 * across different screen sizes.
 * 
 * @returns {JSX.Element} The rendered AdminPage component with sections for managing polls.
 */
export default function AdminPage(): JSX.Element {
  return (
    <main className="w-full justify-center">
      <div className="">
        <div className="md:flex md:justify-around">
          {/* Section for listing existing polls */}
          <div className="md:w-full">
            <CurrentPoll />
          </div>
        </div>
      </div>
    </main>
  );
}
