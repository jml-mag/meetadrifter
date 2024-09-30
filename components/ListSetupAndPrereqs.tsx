/**
 * File Path: @/components/ListSetupAndPrereqs.tsx
 * 
 * ListSetupAndPrereqs Component
 * -----------------------------
 * Renders a searchable list of setup and prerequisite items, which can be filtered 
 * by their title, type, or slug. Allows selection of an item for viewing or editing.
 * 
 * This component interacts with Amplify to fetch data and uses the toast notification system
 * for handling messages during data operations.
 */

"use client";

import React, { useState, useEffect, useContext } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

/**
 * SetupAndPrereqData Interface
 * ----------------------------
 * Defines the shape of the data structure for a setup or prerequisite item.
 * 
 * @interface SetupAndPrereqData
 * @property {string} id - Unique identifier of the item.
 * @property {string} type - The type/category of the item.
 * @property {string} title - The title of the item.
 * @property {string} docs - Documentation or description of the item.
 * @property {string | null} code - Optional code associated with the item, can be null.
 * @property {string} slug - A URL-friendly identifier for the item.
 */
interface SetupAndPrereqData {
  id: string;
  type: string;
  title: string;
  docs: string;
  code: string | null; // Allow code to be either string or null.
  slug: string;
}

/**
 * ListSetupAndPrereqsProps Interface
 * ----------------------------------
 * Defines the props expected by the `ListSetupAndPrereqs` component.
 * 
 * @interface ListSetupAndPrereqsProps
 * @property {(id: string | null) => void} onSelectItem - Callback function to handle selection of an item for viewing or editing.
 */
interface ListSetupAndPrereqsProps {
  onSelectItem: (id: string | null) => void;
}

/**
 * ListSetupAndPrereqs Component
 * -----------------------------
 * Displays a list of setup and prerequisite items retrieved from the Amplify datastore. 
 * Provides a search functionality for filtering items by title, type, or slug.
 * 
 * @component
 * @param {ListSetupAndPrereqsProps} props - The component props.
 * @returns {JSX.Element} The rendered `ListSetupAndPrereqs` component.
 */
const ListSetupAndPrereqs: React.FC<ListSetupAndPrereqsProps> = ({ onSelectItem }) => {
  // State variables for managing the list and search functionality
  const [itemsList, setItemsList] = useState<SetupAndPrereqData[]>([]); // Complete list of items fetched from the datastore.
  const [filteredItems, setFilteredItems] = useState<SetupAndPrereqData[]>([]); // Filtered list based on search term.
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for managing the search term input.
  const { addToast } = useContext<ToastContextType>(ToastContext); // Access toast context for displaying notifications.

  /**
   * useEffect Hook - Fetch Items
   * ----------------------------
   * Fetches the list of setup and prerequisite items from Amplify on component mount.
   * Displays a toast error notification if the fetching process fails.
   */
  useEffect(() => {
    const fetchItems = async () => {
      const { data, errors } = await client.models.SetupAndPrereqs.list();

      if (errors && errors.length > 0) {
        addToast({ messageType: "error", message: "Failed to fetch items." });
        console.error("Fetch errors:", errors);
      } else {
        // Update state with fetched data
        setItemsList(data || []);
        setFilteredItems(data || []);
      }
    };

    fetchItems();
  }, [addToast]);

  /**
   * handleSearch Function
   * ---------------------
   * Updates the filtered item list based on the search term input.
   * Filters items where the title, type, or slug includes the search term (case-insensitive).
   * Resets to the full list if the search term is shorter than 3 characters.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input event for the search term.
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Perform filtering only if search term length is at least 3 characters
    if (term.length >= 3) {
      setFilteredItems(
        itemsList.filter((item) =>
          item.title.toLowerCase().includes(term) ||
          item.type.toLowerCase().includes(term) ||
          item.slug.toLowerCase().includes(term)
        )
      );
    } else {
      // Reset to the full list if search term is less than 3 characters
      setFilteredItems(itemsList);
    }
  };

  // Render the list of items and search functionality
  return (
    <div className="bg-black bg-opacity-70 p-2 rounded-lg w-full mb-4">
      {/* Header and search box container */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="heading text-lg mb-2 md:mb-0">Setup & Prerequisites</h2>
        {/* Search box */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search items..."
          className="form-input max-w-3xl mt-2 md:mt-0 md:ml-4 p-2 rounded"
        />
      </div>
      <div className="h-48 overflow-scroll">
        {/* Render the filtered list of items */}
        <ul className="text-sm mt-4 ml-6">
          {filteredItems.map((item) => (
            <li
              key={item.id}
              className="my-1 py-1 cursor-pointer text-blue-100 hover:text-blue-50"
              onClick={() => onSelectItem(item.id)}
            >
              {item.slug}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListSetupAndPrereqs;
