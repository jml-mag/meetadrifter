"use client";

/**
 * File Path: @/components/LessonOrder.tsx
 * 
 * LessonOrder Component
 * ---------------------
 * This component allows an admin to manage the ordering of lessons.
 * It fetches all lessons from the `LessonContent` model that are unordered, then allows the user to drag and drop
 * to set the order. Changes are saved to the `LessonContent` model in the database.
 */

import React, { useState, useEffect, useContext } from "react";
import { Reorder } from "framer-motion";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client
const client = generateClient<Schema>();

interface LessonItem {
  id: string;
  title: string;
  slug: string;
  isOrdered: boolean;
}

export default function LessonOrder() {
  const [unorderedItems, setUnorderedItems] = useState<LessonItem[]>([]);
  const [orderedItems, setOrderedItems] = useState<LessonItem[]>([]);
  const { addToast } = useContext<ToastContextType>(ToastContext);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch all items from the `LessonContent` model
        const { data: lessons } = await client.models.LessonContent.list();
  
        if (lessons) {
          // Separate ordered and unordered items
          const unordered = lessons
            .filter(item => !item.isOrdered)
            .map(item => ({
              id: item.id,
              title: item.title,
              slug: item.slug,
              isOrdered: item.isOrdered,
            }));
  
          const ordered = lessons
            .filter(item => item.isOrdered)
            .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
            .map(item => ({
              id: item.id,
              title: item.title,
              slug: item.slug,
              isOrdered: item.isOrdered,
            }));
  
          // Update state with ordered and unordered items
          setUnorderedItems(unordered);
          setOrderedItems(ordered);
        }
      } catch (err) {
        console.error("Error fetching lesson items:", err);
        addToast({ messageType: "error", message: "Failed to fetch lesson items." });
      }
    };
  
    fetchItems();
  }, [addToast]);
  

  const handleSaveOrder = async () => {
    try {
      // Ensure orderedItems are sorted before assigning orderIndex
      const sortedItems = [...orderedItems].sort((a, b) => {
        return orderedItems.indexOf(a) - orderedItems.indexOf(b);
      });
  
      // Save each ordered item with its new order index
      const results = await Promise.all(
        sortedItems.map((item, index) =>
          client.models.LessonContent.update({
            id: item.id,
            isOrdered: true,
            orderIndex: index, // Set the correct order index
          })
        )
      );
  
      console.log("Saved order:", results);
      addToast({ messageType: "success", message: "Lesson order saved successfully!" });
    } catch (err) {
      console.error("Error saving lesson order:", err);
      addToast({ messageType: "error", message: "Failed to save lesson order." });
    }
  };
  

  return (
    <div className="bg-black bg-opacity-70 p-2 rounded-lg w-full mb-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        {/* Section 1: Unordered Items */}
        <div className="w-full md:w-1/2">
          <h2 className="heading text-lg mb-2 md:mb-0">Unordered Lessons</h2>
          <ul className="text-sm space-y-2 overflow-scroll max-h-[50vh]">
            {unorderedItems.map(item => (
              <li
                key={item.id}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded cursor-pointer"
                onClick={() => {
                  setOrderedItems([...orderedItems, item]);
                  setUnorderedItems(unorderedItems.filter(unorderedItem => unorderedItem.id !== item.id));
                }}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2: Ordered Items */}
        <div className="w-full md:w-1/2">
          <h2 className="heading text-lg mb-2 md:mb-0">Ordered Lessons</h2>
          <Reorder.Group
            as="ul"
            axis="y"
            values={orderedItems}
            onReorder={setOrderedItems}
            className="text-sm space-y-2 overflow-scroll max-h-[50vh]"
          >
            {orderedItems.map(item => (
              <Reorder.Item
                key={item.id}
                value={item}
                className="bg-green-800 hover:bg-green-700 text-white p-2 rounded cursor-move"
              >
                {item.title}
              </Reorder.Item>
            ))}
          </Reorder.Group>
          {orderedItems.length > 0 && (
            <button
              className="btn btn-primary mt-4 w-full"
              onClick={handleSaveOrder}
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
