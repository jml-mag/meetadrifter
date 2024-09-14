/**
 * File Path: amplify/data/resource.ts
 * 
 * Data Resource Configuration
 * ---------------------------
 * This file defines the data model for the application using Gen 2 AWS Amplify.
 * It sets up the schema for the `Poll` and `Vote` models, including their fields,
 * relationships, and authorization rules.
 */

import { type ClientSchema, a, defineData } from '@aws-amplify/backend'; // Import necessary types and functions from AWS Amplify.

/**
 * Schema Definition
 * -----------------
 * Defines the data models and their respective fields and authorization rules.
 * 
 * - `Poll`: Represents a poll with a title, options, creation date, and status.
 * - `Vote`: Represents a vote with references to the poll and user, along with the selected option.
 */
const schema = a.schema({
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
});
