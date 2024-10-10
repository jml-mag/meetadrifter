/**
 * File Path: amplify/data/resource.ts
 * 
 * Data Resource Configuration
 * ---------------------------
 * This file defines the data models and their configuration for the application using AWS Amplify Gen 2.
 * It sets up the schema for the following models: 
 * - `Poll`: Manages polls with options, status, and creation timestamp.
 * - `Vote`: Records votes linked to polls and users.
 * - `SiteNotification`: Stores notifications to be displayed to users.
 * - `LessonContent`: Stores content such as code, setup instructions, or prerequisites, with ordering capabilities.
 * 
 * Additionally, custom queries and mutations for user management tasks such as listing users, adding users to groups,
 * and removing users from groups are implemented with proper authorization.
 */

import { type ClientSchema, a, defineData } from '@aws-amplify/backend'; // AWS Amplify types and functions import
import { manageUsers } from '../functions/manage-users/resource'; // Import the manageUsers function for custom queries/mutations

/**
 * Schema Definition
 * -----------------
 * Defines the data models used in the application and their authorization rules.
 * These models define the structure for polls, votes, notifications, and lesson content.
 */
const schema = a.schema({
  // Custom Link type for use in lesson content
  Link: a.customType({
    text: a.string(), // Display text for the link
    url: a.string(),  // URL the link points to
  }),

  // Poll model definition
  Poll: a.model({
    title: a.string().required(),  // Poll title
    options: a.string().array().required(), // List of options for the poll
    createdAt: a.datetime().required(), // Poll creation timestamp
    status: a.string().required(), // Status of the poll (e.g., active, closed)
  }).authorization((allow) => [
    allow.group('admin').to(['create', 'update', 'delete']), // Admins can create, update, and delete
    allow.authenticated('userPools').to(['read']), // Authenticated users can read
  ]),

  // Vote model definition
  Vote: a.model({
    pollId: a.id().required(),  // ID of the poll being voted on
    userId: a.string().required(),  // ID of the user casting the vote
    option: a.string().required(),  // The selected poll option
  }).authorization((allow) => [
    allow.authenticated('userPools').to(['create', 'read']), // Authenticated users can create votes and read
  ]),

  // SiteNotification model definition
  SiteNotification: a.model({
    message: a.string().required(), // Notification message
  }).authorization((allow) => [
    allow.authenticated('userPools').to(['read']), // Authenticated users can read notifications
    allow.group('admin').to(['create', 'update', 'delete', 'read']), // Admins have full access
  ]),

  // LessonContent model definition for managing content
  LessonContent: a.model({
    type: a.string().required(), // Content type (e.g., "code", "setup", or "prereq")
    title: a.string().required(), // Title of the content
    slug: a.string().required(), // Unique slug for dynamic routing
    code: a.string(), // Optional code content (if applicable)
    docs: a.string().required(), // Documentation for the content
    links: a.ref('Link').array(), // Array of associated links
    isOrdered: a.boolean().required().default(false), // Flag indicating if this content is part of a lesson order
    orderIndex: a.integer(), // Position in the lesson order (if applicable)
  }).authorization((allow) => [
    allow.authenticated('userPools').to(['read']), // Authenticated users can read lesson content
    allow.group('admin').to(['create', 'update', 'delete', 'read']), // Admins have full access
  ]),

  // Custom Queries and Mutations for User Management
  listUsersAndGroups: a
    .query()
    .authorization((allow) => [allow.group('admin')]) // Only admins can list users and groups
    .handler(a.handler.function(manageUsers)) // Links to the manageUsers function
    .returns(a.json()), // Returns JSON data

  addUserToGroup: a
    .mutation()
    .arguments({
      username: a.string().required(),  // Username of the user to be added to the group
      groupName: a.string().required(), // Name of the group to which the user will be added
    })
    .authorization((allow) => [allow.group('admin')]) // Only admins can add users to groups
    .handler(a.handler.function(manageUsers)) // Links to the manageUsers function
    .returns(a.string()), // Returns a success message

  removeUserFromGroup: a
    .mutation()
    .arguments({
      username: a.string().required(),  // Username of the user to be removed from the group
      groupName: a.string().required(), // Name of the group from which the user will be removed
    })
    .authorization((allow) => [allow.group('admin')]) // Only admins can remove users from groups
    .handler(a.handler.function(manageUsers)) // Links to the manageUsers function
    .returns(a.string()), // Returns a success message
});

/**
 * Schema Type Definition
 * ----------------------
 * Defines the schema type for use across the application.
 * This type is inferred from the schema object, ensuring consistency in the data models.
 */
export type Schema = ClientSchema<typeof schema>;

/**
 * Data Configuration
 * ------------------
 * Configures the data layer for the application, including schema and authorization modes.
 * The default authorization mode is `userPool`, which ensures that authenticated users
 * from the user pool can interact with the data models based on the authorization rules.
 */
export const data = defineData({
  schema, // The defined schema
  authorizationModes: {
    defaultAuthorizationMode: 'userPool', // Default authorization mode
  },
});
