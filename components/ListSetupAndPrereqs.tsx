"use client";

import React, { useState, useEffect, useContext } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client with the schema
const client = generateClient<Schema>();

interface SetupAndPrereqData {
  id: string;
  type: string;
  title: string;
  docs: string;
  code: string | null; // Allow code to be either string or null.
  slug: string;
}

interface ListSetupAndPrereqsProps {
  onSelectItem: (id: string | null) => void;
}

/**
 * ListSetupAndPrereqs Component
 * -----------------------------
 * Displays a list of setup and prerequisites, provides a search box for filtering, 
 * and allows selection for updating.
 */
const ListSetupAndPrereqs: React.FC<ListSetupAndPrereqsProps> = ({ onSelectItem }) => {
  const [itemsList, setItemsList] = useState<SetupAndPrereqData[]>([]);
  const [filteredItems, setFilteredItems] = useState<SetupAndPrereqData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { addToast } = useContext<ToastContextType>(ToastContext);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, errors } = await client.models.SetupAndPrereqs.list();

      if (errors && errors.length > 0) {
        addToast({ messageType: "error", message: "Failed to fetch items." });
        console.error("Fetch errors:", errors);
      } else {
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
   * Filters items where the title, type, or slug includes the search term (case insensitive).
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
      <div className="overflow-scroll">
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
