/**
 * File Path: amplify/data/resource.ts
 * 
 * Data Resource Configuration
 * ---------------------------
 * This file defines the data model for the application using Gen 2 AWS Amplify.
 * It sets up the schema for the `Poll`, `Vote`, and `SiteNotification` models, 
 * including their fields, relationships, and authorization rules.
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
 * 
 * - `Poll`: Represents a poll with a title, options, creation date, and status.
 * - `Vote`: Represents a vote with references to the poll and user, along with the selected option.
 * - `SiteNotification`: Represents a site-wide notification message that can be created, updated, and deleted by an admin.
 * 
 * Custom Queries and Mutations:
 * - `listUsersAndGroups`: Lists all users and their associated groups.
 * - `addUserToGroup`: Adds a user to a specified group.
 * - `removeUserFromGroup`: Removes a user from a specified group.
 */
const schema = a.schema({
  // Existing models
  Poll: a.model({
    title: a.string().required(), // The title of the poll, a required string.
    options: a.string().array().required(), // An array of possible options for the poll, required.
    createdAt: a.datetime().required(), // The date and time the poll was created, required.
    status: a.string().required(), // The status of the poll (e.g., 'active', 'inactive'), required.
  }).authorization((allow) => [
    allow.group('admin').to(['create', 'update', 'delete']), // Admins can create, update, and delete polls.
    allow.authenticated('userPools').to(['read']), // Authenticated users can read polls.
  ]),
  
  Vote: a.model({
    pollId: a.id().required(), // The ID of the associated poll, required.
    userId: a.string().required(), // The ID of the user who voted, required.
    option: a.string().required(), // The selected option for the vote, required.
  }).authorization((allow) => [
    allow.authenticated('userPools').to(['create', 'read']), // Authenticated users can create and read votes.
  ]),

  SiteNotification: a.model({
    message: a.string().required(), // The content of the notification message, required.
  }).authorization((allow) => [
    allow.authenticated('userPools').to(['read']),
    allow.group('admin').to(['create', 'update', 'delete', 'read']), // Admins can create, update, delete, and read notifications.
  ]),

  CodeAndDocs: a.model({
    filepath: a.string().required(), // We will save setup and prereqs data as '/setup/step1' or 'prereqs/aws, etc.
    code: a.string().required(),
    docs: a.string().required(),
    slug: a.string().required(),
    lesson_order: a.integer().required(),
  }).authorization((allow) => [
    allow.authenticated('userPools').to(['read']),
    allow.group('admin').to(['create', 'update', 'delete', 'read']),
  ]),

  SetupAndPrereqs: a.model({
    type: a.string().required(), // 'setup' or 'prereq'
    title: a.string().required(),
    moreInfoUrl: a.string(),
    code: a.string(),
    docs: a.string().required(),
    slug: a.string().required(),
    lesson_order: a.integer().required(),
  }).authorization((allow) => [
    allow.authenticated('userPools').to(['read']),
    allow.group('admin').to(['create', 'update', 'delete', 'read']),
  ]),

  // Custom Queries and Mutations for User Management
  /**
   * Query: listUsersAndGroups
   *
   * Lists all users in the Cognito User Pool along with their associated groups.
   * Only accessible by users in the "admin" group.
   */
  listUsersAndGroups: a
    .query()
    .authorization((allow) => [allow.group('admin')])
    .handler(a.handler.function(manageUsers))
    .returns(a.json()),

  /**
   * Mutation: addUserToGroup
   *
   * Adds a specified user to a specified group.
   * Only accessible by users in the "admin" group.
   *
   * @param username - The username of the user to add.
   * @param groupName - The name of the group to add the user to.
   */
  addUserToGroup: a
    .mutation()
    .arguments({
      username: a.string().required(),
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group('admin')])
    .handler(a.handler.function(manageUsers))
    .returns(a.string()),

  /**
   * Mutation: removeUserFromGroup
   *
   * Removes a specified user from a specified group.
   * Only accessible by users in the "admin" group.
   *
   * @param username - The username of the user to remove.
   * @param groupName - The name of the group to remove the user from.
   */
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
 * 
 * @type {ClientSchema<typeof schema>}
 */
export type Schema = ClientSchema<typeof schema>;

/**
 * Data Configuration
 * ------------------
 * Defines the data configuration using the defined schema.
 * 
 * @constant
 * @type {ReturnType<typeof defineData>}
 */
export const data = defineData({
  schema,
  /**
   * Authorization Modes
   * -------------------
   * Defines the default authorization mode for the API.
   */
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  },
});
