/** @/amplify/auth/resource.ts
 * Authentication Resource Configuration
 * -------------------------------------
 * This module configures the authentication resource for the application using AWS Amplify Gen 2.
 * It enables email-based login with customizable verification emails and specifies required 
 * user attributes for registration. The module also defines user groups and access permissions 
 * for managing users within the application.
 */

import { defineAuth } from '@aws-amplify/backend'; // AWS Amplify backend utility for authentication
import { manageUsers } from '../functions/manage-users/resource'; // User management function

/**
 * Configures the authentication setup, including email-based login, user attributes, user groups,
 * and access permissions for user management operations.
 * 
 * @remarks
 * This configuration uses email as the login method and customizes the verification email sent to users.
 * It also defines required user attributes and creates an admin group for authorization purposes.
 * The `manage-users` function is granted permissions to interact with the user pool.
 * 
 * @constant
 * @type {ReturnType<typeof defineAuth>}
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE", // Specifies verification method as a code.
      verificationEmailSubject: "Welcome to Meet A Drifter", // Custom subject for the verification email.
      /**
       * Generates a custom body for the verification email.
       * 
       * @param createCode - A function that generates a unique verification code.
       * @returns {string} The complete verification email content with the generated code.
       */
      verificationEmailBody: (createCode: () => string) =>
        `Use this code to confirm your Meet A Drifter account: ${createCode()}`,
    },
  },
  userAttributes: {
    familyName: {
      required: true, // Family name (lastName) is a required field for user registration.
    },
    givenName: {
      required: true, // Given name (firstName) is a required field for user registration.
    },
    preferredUsername: {
      required: true, // Preferred username is required for user registration.
    },
  },
  groups: ['admin'], // Defines the 'admin' user group for authorization purposes.

  /**
   * Grants permissions for the `manage-users` function to perform actions on Cognito.
   * 
   * @param allow - A utility to specify allowed actions on the `manageUsers` function.
   * @returns {Array} The list of allowed actions for managing users and user groups.
   */
  access: (allow) => [
    allow.resource(manageUsers).to([
      "listUsers", // Permission to list all users.
      "listGroupsForUser", // Permission to list groups for a specific user.
      "addUserToGroup", // Permission to add a user to a group.
      "removeUserFromGroup", // Permission to remove a user from a group.
    ]),
  ],
});
