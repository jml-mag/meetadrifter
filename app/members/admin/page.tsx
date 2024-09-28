/**
 * File Path: @/app/members/admin/page.tsx
 * 
 * Admin Page Component
 * --------------------
 * This file defines the AdminPage component, which serves as the main page for admin functionalities.
 * It includes components for listing existing polls and creating new polls. The page layout is responsive,
 * ensuring a consistent user experience across different screen sizes.
 */

import CurrentPoll from "@/components/CurrentPoll";

/**
 * AdminPage Component
 * -------------------
 * Renders the admin dashboard with sections for listing and creating polls.
 * 
 * @component
 * @returns {JSX.Element} The rendered AdminPage component.
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
