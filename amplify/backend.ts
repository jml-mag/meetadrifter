// @/ampify/backend.ts
/**
 * Backend Configuration
 * ---------------------
 * This module defines and configures the backend for the application using AWS Amplify.
 * It integrates authentication, data resources, and user management functions into the backend.
 */

import { defineBackend } from '@aws-amplify/backend'; // Amplify backend configuration utility
import { auth } from './auth/resource'; // Authentication configuration module
import { data } from './data/resource'; // Data resource configuration module
import { manageUsers } from './functions/manage-users/resource'; // User management function module

/**
 * Sets up the backend by integrating the authentication, data, and user management functions.
 * 
 * @remarks
 * This function call initializes the backend for the application with the necessary resources
 * for authentication, data management, and user administration.
 * 
 * @returns {void} This function does not return a value.
 */
/*
defineBackend({
  auth, // Auth resource setup
  data, // Data resource setup
  manageUsers, // User management functionality
});
*/

/**
 * (Optional) Backend Setup with AWS SES Email Configuration
 * ---------------------------------------------------------
 * This commented section includes optional setup to integrate AWS SES for production email 
 * using an Email Identity. Uncomment and configure as needed.
 */

import { Stack } from "aws-cdk-lib/core"; // AWS CDK core library
import { EmailIdentity } from "aws-cdk-lib/aws-ses"; // AWS SES Email Identity utility

// Define the backend configuration, including email identity for SES
const backend = defineBackend({
  auth,
  data,
  manageUsers,
});

// Configure the SES email identity for the user pool
const { cfnUserPool } = backend.auth.resources.cfnResources;
const authStack = Stack.of(cfnUserPool);

// Retrieve the email identity from SES based on environment variables or fallback
const email = EmailIdentity.fromEmailIdentityName(
  authStack,
  "EmailIdentity",
  "no-reply@meetadrifter.com" // Email address to be used for SES
);

// Set the email configuration for the Cognito user pool
cfnUserPool.emailConfiguration = {
  emailSendingAccount: "DEVELOPER",
  sourceArn: email.emailIdentityArn, // ARN for the SES Email Identity
};
