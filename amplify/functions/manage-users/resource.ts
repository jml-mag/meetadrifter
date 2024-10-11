// @/amplify/functions/manage-users/resource.ts
import { defineFunction } from "@aws-amplify/backend";

/**
 * Amplify Function: manage-users
 * ------------------------------
 * This function handles user management tasks within the application, utilizing AWS Cognito APIs
 * to interact with the user pool for various operations, such as listing users, managing groups, 
 * and updating user information.
 * 
 * @remarks
 * This function can be extended with additional capabilities like custom authentication flows
 * or more complex group management if needed.
 * 
 * @constant
 * @type {ReturnType<typeof defineFunction>}
 */
export const manageUsers = defineFunction({
  /**
   * Unique name for the function.
   * 
   * @remarks
   * This name will be used for AWS resource generation and must be unique within the Amplify project.
   * 
   * @type {string}
   */
  name: "manage-users",

  /**
   * Entry point for the function handler.
   * 
   * @remarks
   * The default entry is 'handler.ts' in the same directory as this file, but can be customized 
   * to point to a different handler if required.
   * 
   * @type {string}
   */
  entry: "./handler.ts",

  /**
   * Optional configuration for the function.
   * 
   * @remarks
   * You can specify function-specific settings, such as memory allocation, timeout limits,
   * and environment variables. Adjust these settings based on the expected usage and 
   * requirements of the function.
   * 
   * @example
   * {
   *   timeoutSeconds: 30, // Sets the function timeout to 30 seconds.
   *   memoryMB: 512, // Allocates 512MB of memory for the function.
   * }
   * 
   * @type {object}
   * @property {number} [timeoutSeconds] - Optional timeout in seconds for the function execution.
   * @property {number} [memoryMB] - Optional memory allocation in megabytes.
   */
  // Add configuration options here if needed, such as:
  // timeoutSeconds: 30,
  // memoryMB: 512,
});
