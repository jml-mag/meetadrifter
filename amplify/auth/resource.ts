/**
 * File Path: amplify/auth/resource.ts
 * 
 * Authentication Resource Configuration
 * -------------------------------------
 * This file defines the authentication resource for the application using Gen 2 AWS Amplify.
 * It configures the login method via email and customizes the verification email content.
 */

import { defineAuth } from '@aws-amplify/backend'; // Import the defineAuth function from AWS Amplify.
import { manageUsers } from '../functions/manage-users/resource'; // Import the manageUsers function

/**
 * Auth Configuration
 * ------------------
 * Defines the authentication setup for the application.
 * Configures email-based login with a verification code and custom email content.
 * 
 * @constant
 * @type {ReturnType<typeof defineAuth>}
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE", // Specifies the style of the verification email (e.g., code or link).
      verificationEmailSubject: "Welcome to Meet A Drifter", // Subject line for the verification email.
      verificationEmailBody: (createCode: () => string) => 
        `Use this code to confirm your Meet A Drifter account: ${createCode()}`, // Custom body of the verification email.
    },
  },

  /**
   * User Groups Configuration
   * -------------------------
   * Defines user groups for authorization purposes.
   */
  groups: ['admin'], // Create new group

  /**
   * Access Permissions
   * ------------------
   * Grants the `manage-users` function the necessary permissions to interact with Cognito.
   */
  access: (allow) => [
    allow.resource(manageUsers).to([
      "listUsers",
      "listGroupsForUser",
      "addUserToGroup",          // Corrected action name
      "removeUserFromGroup",     // Corrected action name
    ]),
  ],
});
