// amplify/functions/manage-users/resource.ts

import { defineFunction } from "@aws-amplify/backend";

/**
 * Amplify Function Resource: manage-users
 *
 * This function is responsible for user management tasks, including:
 * - Listing users
 * - Retrieving groups for each user
 * - Adding users to groups
 * - Removing users from groups
 *
 * The function leverages AWS Cognito Identity Provider APIs to interact with the user pool.
 */
export const manageUsers = defineFunction({
  /**
   * The name of the function. This will be used in the generated AWS resources
   * and should be unique within your Amplify project.
   */
  name: "manage-users",

  /**
   * Entry point for the function handler.
   * By default, it looks for 'handler.ts' in the same directory.
   * You can specify a different path if needed.
   */
  entry: "./handler.ts",

  /**
   * Optional configuration settings can be added here, such as environment variables,
   * timeout settings, memory allocation, etc.
   * Example:
   * timeoutSeconds: 30,
   * memoryMB: 512,
   */
});
