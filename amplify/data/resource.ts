/**
 * File Path: amplify/data/resource.ts
 * 
 * Data Resource Configuration
 * ---------------------------
 * This file defines the data model for the application using Gen 2 AWS Amplify.
 * It sets up the schema for the `Poll`, `Vote`, `SiteNotification`, `CodeAndDocs`,
 * `SetupAndPrereqs`, and `LessonOrder` models, including their fields, relationships, and authorization rules.
 * 
 * Additionally, it includes custom queries and mutations for user management tasks:
 * - Listing users and their groups
 * - Adding users to groups
 * - Removing users from groups
 */

import { type ClientSchema, a, defineData } from '@aws-amplify/backend'; // Import necessary types and functions from AWS Amplify.
import { manageUsers } from '../functions/manage-users/resource'; // Import the manageUsers function

/**
 * Schema Definition
 * -----------------
 * Defines the data models and their respective fields and authorization rules.
 */
const schema = a.schema({
  // Poll model
  Poll: a.model({
    title: a.string().required(),
    options: a.string().array().required(),
    createdAt: a.datetime().required(),
    status: a.string().required(),
  }).authorization((allow) => [
    allow.group('admin').to(['create', 'update', 'delete']),
    allow.authenticated('userPools').to(['read']),
  ]),
  
  // Vote model
  Vote: a.model({
    pollId: a.id().required(),
    userId: a.string().required(),
    option: a.string().required(),
  }).authorization((allow) => [
    allow.authenticated('userPools').to(['create', 'read']),
  ]),

  // SiteNotification model
  SiteNotification: a.model({
    message: a.string().required(),
  }).authorization((allow) => [
    allow.authenticated('userPools').to(['read']),
    allow.group('admin').to(['create', 'update', 'delete', 'read']),
  ]),

  LessonContent: a.model({
    type: a.string().required(), // Can be "code", "setup", or "prereq" to distinguish content type
    title: a.string().required(), // Title of the content (replaces filepath in `CodeAndDocs`).
    slug: a.string().required(), // Unique slug for dynamic routing.
    code: a.string(), // Optional field for code content (if applicable).
    docs: a.string().required(), // Documentation content, required for all content types.
    moreInfoUrl: a.string(), // Optional field for any additional links (from `SetupAndPrereqs`).
    isOrdered: a.boolean().required().default(false), // Track if the item is part of an ordered lesson.
    orderIndex: a.integer(), // Position in the lesson order (if applicable).
  }).authorization((allow) => [
    allow.authenticated('userPools').to(['read']),
    allow.group('admin').to(['create', 'update', 'delete', 'read']), // Full access for admins.
  ]),
  

  // Custom Queries and Mutations for User Management
  listUsersAndGroups: a
    .query()
    .authorization((allow) => [allow.group('admin')])
    .handler(a.handler.function(manageUsers))
    .returns(a.json()),

  addUserToGroup: a
    .mutation()
    .arguments({
      username: a.string().required(),
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group('admin')])
    .handler(a.handler.function(manageUsers))
    .returns(a.string()),

  removeUserFromGroup: a
    .mutation()
    .arguments({
      username: a.string().required(),
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group('admin')])
    .handler(a.handler.function(manageUsers))
    .returns(a.string()),
});

/**
 * Schema Type Definition
 * ----------------------
 * Exports the schema type for use in other parts of the application.
 */
export type Schema = ClientSchema<typeof schema>;

/**
 * Data Configuration
 * ------------------
 * Defines the data configuration using the defined schema.
 */
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
