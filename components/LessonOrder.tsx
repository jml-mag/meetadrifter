"use client";

import React, { useState, useEffect, useContext } from "react";
import { Reorder } from "framer-motion";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { ToastContext, ToastContextType } from "@/contexts/ToastContext";

// Generate the Amplify client
const client = generateClient<Schema>();

/**
 * LessonItem Interface
 * --------------------
 * Defines the structure of a lesson item, including its unique ID, title, slug, and ordering status.
 */
interface LessonItem {
  id: string;
  title: string;
  slug: string;
  isOrdered: boolean;
}

/**
 * LessonOrder Component
 * ---------------------
 * This component allows administrators to manage the order of lessons.
 * It fetches lessons from the `LessonContent` model, displays unordered lessons,
 * and allows users to reorder lessons using drag-and-drop functionality.
 * Changes are saved back to the `LessonContent` model in the database.
 * 
 * @component
 * @returns {JSX.Element} The rendered LessonOrder component.
 */
export default function LessonOrder(): JSX.Element {
  const [unorderedItems, setUnorderedItems] = useState<LessonItem[]>([]);
  const [orderedItems, setOrderedItems] = useState<LessonItem[]>([]);
  const { addToast } = useContext<ToastContextType>(ToastContext);

  /**
   * Fetch lesson items from the `LessonContent` model, separating ordered and unordered items.
   */
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data: lessons } = await client.models.LessonContent.list();
  
        if (lessons) {
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

  /**
   * Handle saving the updated lesson order to the backend.
   */
  const handleSaveOrder = async (): Promise<void> => {
    try {
      const sortedItems = [...orderedItems].sort((a, b) => {
        return orderedItems.indexOf(a) - orderedItems.indexOf(b);
      });
  
      const results = await Promise.all(
        sortedItems.map((item, index) =>
          client.models.LessonContent.update({
            id: item.id,
            isOrdered: true,
            orderIndex: index,
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
    <section className="bg-black bg-opacity-70 p-4 rounded-lg w-full mb-4">
      <div className="flex flex-col md:flex-row md:justify-between gap-8">
        {/* Unordered Lessons Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Unordered Lessons</h2>
          <ul className="text-sm space-y-2 overflow-scroll max-h-[50vh]" role="list">
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

        {/* Ordered Lessons Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Ordered Lessons</h2>
          <Reorder.Group
            as="ul"
            axis="y"
            values={orderedItems}
            onReorder={setOrderedItems}
            className="text-sm space-y-2 overflow-scroll max-h-[50vh]"
            role="list"
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
    </section>
  );
}
