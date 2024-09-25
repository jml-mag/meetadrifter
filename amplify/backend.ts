// amplify/backend.ts

/**
 * File Path: amplify/backend.ts
 * 
 * Backend Definition
 * ------------------
 * This file defines the backend configuration for the application using AWS Amplify.
 * It imports and integrates the authentication and data resources into the backend setup.
 */

import { defineBackend } from '@aws-amplify/backend'; // Import the defineBackend function from AWS Amplify.
import { auth } from './auth/resource'; // Import the authentication resource configuration.
import { data } from './data/resource'; // Import the data resource configuration.
import { manageUsers } from './functions/manage-users/resource'; // Import the manageUsers function

/**
 * Backend Configuration
 * ---------------------
 * This function call sets up the backend by integrating the auth, data, and manageUsers configurations.
 */
defineBackend({
  auth,
  data,
  manageUsers,
});
