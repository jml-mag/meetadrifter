'use client';

/**
 * File Path: contexts/ToastContext.tsx
 * 
 * ToastContext
 * ------------
 * This file provides a React context for managing toast notifications throughout the application.
 * Components can trigger toast messages for success and error notifications, with support for 
 * automatic timeout and removal of toasts.
 */

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Toast Interface
 * ---------------
 * Defines the structure of a toast notification object.
 * 
 * @interface Toast
 * @property {string} [id] - Optional unique identifier. If not provided, one will be generated.
 * @property {'success' | 'error'} messageType - Type of message, either 'success' or 'error'.
 * @property {string} message - The text content of the toast message.
 * @property {number} [duration] - Optional duration in milliseconds after which the toast will automatically disappear.
 */
interface Toast {
  id?: string;
  messageType: 'success' | 'error';
  message: string;
  duration?: number;
}

/**
 * ToastContextType Interface
 * --------------------------
 * Defines the shape of the context's value, specifying what can be accessed or performed.
 * 
 * @interface ToastContextType
 * @property {Toast[]} toasts - Array of current toast messages being displayed.
 * @property {(toast: Toast) => void} addToast - Function to add a new toast to the display queue.
 * @property {(id: string) => void} removeToast - Function to remove a specific toast by ID.
 */
export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
}

// Initializing the context with default empty implementations to prevent null checks.
const defaultContextValue: ToastContextType = {
  toasts: [],
  addToast: () => {}, // Empty function placeholder.
  removeToast: () => {} // Empty function placeholder.
};

// Creating the ToastContext with the default value.
export const ToastContext = createContext<ToastContextType>(defaultContextValue);

/**
 * ToastProviderProps Interface
 * ----------------------------
 * Defines the structure for the props passed to the ToastProvider component.
 * 
 * @interface ToastProviderProps
 * @property {ReactNode} children - Accepts any valid React children.
 */
interface ToastProviderProps {
  children: ReactNode;
}

/**
 * ToastProvider Component
 * -----------------------
 * Provides the ToastContext to all children components, allowing them to trigger
 * and manage toast notifications.
 * 
 * @component
 * @param {ToastProviderProps} props - The component props.
 * @returns {JSX.Element} The rendered ToastProvider component.
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]); // State to track the current toasts.

  /**
   * removeToast Function
   * --------------------
   * Removes a toast notification from the list based on its ID.
   * 
   * @param {string} id - The ID of the toast to be removed.
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  /**
   * addToast Function
   * -----------------
   * Adds a new toast to the array of toasts and schedules its automatic removal.
   * 
   * @param {Toast} toast - The toast object to add.
   */
  const addToast = useCallback((toast: Toast) => {
    const toastWithDefaultId = { ...toast, id: toast.id || uuidv4() }; // Assign a default ID if not provided.
    setToasts((prevToasts) => [...prevToasts, toastWithDefaultId]); // Append the new toast to the array.

    const duration = toast.duration || 3000; // Default to 3000ms if no duration is provided.
    setTimeout(() => {
      removeToast(toastWithDefaultId.id!); // Remove toast after duration.
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
