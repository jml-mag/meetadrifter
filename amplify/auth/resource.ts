/**
 * File Path: amplify/auth/resource.ts
 * 
 * Authentication Resource Configuration
 * -------------------------------------
 * This file defines the authentication resource for the application using Gen 2 AWS Amplify.
 * It configures the login method via email and customizes the verification email content.
 */

import { defineAuth } from '@aws-amplify/backend'; // Import the defineAuth function from AWS Amplify.

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
});
