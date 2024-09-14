/**
 * File Path: contexts/ToastContext.tsx
 * 
 * ToastContext
 * ------------
 * This file provides a React context for managing toast notifications throughout the application.
 * Components can trigger toast messages for success and error notifications, with support for 
 * automatic timeout and removal of toasts.
 */

'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID to generate unique identifiers for each toast.

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
 * Encapsulates all children components that need access to toast functionalities.
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
   * Removes a toast based on its ID. Uses useCallback to memoize the function.
   * 
   * @function
   * @param {string} id - The ID of the toast to remove.
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  /**
   * addToast Function
   * -----------------
   * Adds a new toast to the state. It also sets a timer to automatically remove the toast.
   * 
   * @function
   * @param {Toast} toast - The toast object to add.
   */
  const addToast = useCallback((toast: Toast) => {
    const toastWithDefaultId = { ...toast, id: toast.id || uuidv4() }; // Assign a default ID if not provided.
    setToasts((prevToasts) => [...prevToasts, toastWithDefaultId]); // Append the new toast to the existing array.

    const duration = toast.duration || 3000; // Use provided duration or default to 3000ms.
    setTimeout(() => { // Set a timeout to remove the toast after the specified duration.
      removeToast(toastWithDefaultId.id!);
    }, duration);
  }, [removeToast]);

  // Providing the context value to all child components.
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
