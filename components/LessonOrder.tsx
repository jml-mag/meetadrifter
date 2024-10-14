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
  const [initialOrderedItems, setInitialOrderedItems] = useState<LessonItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
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
          setInitialOrderedItems(ordered);
        }
      } catch (err) {
        console.error("Error fetching lesson items:", err);
        addToast({ messageType: "error", message: "Failed to fetch lesson items." });
      }
    };

    fetchItems();
  }, [addToast]);

  /**
   * Compare the current orderedItems with the initialOrderedItems to detect changes.
   */
  useEffect(() => {
    if (orderedItems.length !== initialOrderedItems.length) {
      setHasChanges(true);
    } else {
      const isSameOrder = orderedItems.every((item, index) => item.id === initialOrderedItems[index].id);
      setHasChanges(!isSameOrder);
    }
  }, [orderedItems, initialOrderedItems]);

  /**
   * Handle saving the updated lesson order to the backend.
   */
  const handleSaveOrder = async (): Promise<void> => {
    try {
      const sortedItems = orderedItems.map((item, index) => ({
        ...item,
        orderIndex: index,
        isOrdered: true,
      }));

      await Promise.all(
        sortedItems.map((item) =>
          client.models.LessonContent.update({
            id: item.id,
            isOrdered: true,
            orderIndex: item.orderIndex,
          })
        )
      );

      addToast({ messageType: "success", message: "Lesson order saved successfully!" });
      // Update initialOrderedItems to the new order after saving
      setInitialOrderedItems(sortedItems);
      setHasChanges(false);
    } catch (err) {
      console.error("Error saving lesson order:", err);
      addToast({ messageType: "error", message: "Failed to save lesson order." });
    }
  };

  return (
    <section className="bg-black bg-opacity-70 p-4 rounded-lg w-full h-full flex flex-col">
      <div className="flex-grow flex flex-col md:flex-row md:justify-between gap-8">
        {/* Unordered Lessons Section */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Unordered Lessons</h2>
          <ul className="text-sm space-y-2 flex-grow overflow-y-auto" role="list">
            {unorderedItems.map(item => (
              <li
                key={item.id}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded cursor-pointer"
                onClick={() => {
                  setOrderedItems([...orderedItems, item]);
                  setUnorderedItems(unorderedItems.filter(unorderedItem => unorderedItem.id !== item.id));
                  setHasChanges(true);
                }}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Ordered Lessons Section */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Ordered Lessons</h2>
          <Reorder.Group
            as="ul"
            axis="y"
            values={orderedItems}
            onReorder={(newOrder) => {
              setOrderedItems(newOrder);
              setHasChanges(true);
            }}
            className="text-sm space-y-2 flex-grow overflow-y-auto max-h-[calc(100vh-16rem)]"
            role="list"
          >
            {orderedItems.map(item => (
              <Reorder.Item
                key={item.id}
                value={item}
                className="bg-blue-800 hover:bg-blue-700 text-white p-2 rounded cursor-move"
              >
                {item.title}
              </Reorder.Item>
            ))}
          </Reorder.Group>
          {hasChanges && (
            <button
              className="m-4 btn bg-green-600 hover:bg-green-700 border border-green-500 text-white"
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
