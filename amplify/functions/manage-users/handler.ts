/**
 * File: amplify/functions/manage-users/handler.ts
 * 
 * Description:
 * -------------
 * This file defines the `manage-users` function that handles user management tasks
 * in the application, such as listing users and their groups, adding users to groups,
 * and removing users from groups. It uses AWS Cognito to interact with the user pool
 * and execute these actions.
 * 
 * The function is invoked through AppSync and operates based on the event's `fieldName`.
 */

import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminListGroupsForUserCommand,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  UserType,
  GroupType,
} from '@aws-sdk/client-cognito-identity-provider';
import { env } from '$amplify/env/manage-users';
import { AppSyncIdentityIAM, AppSyncIdentityCognito, AppSyncIdentityOIDC } from 'aws-lambda';

/**
 * Interface for the arguments passed to the manage-users function.
 * These arguments define the username and groupName, both of which are optional and vary 
 * depending on the operation (e.g., adding/removing users from groups).
 */
interface ManageUsersArguments {
  username?: string;
  groupName?: string;
}

/**
 * Interface representing a user along with their associated groups.
 * Extends the `UserType` from Cognito with a mandatory `Username` field and includes 
 * an array of groups.
 */
interface UserWithGroups {
  user: UserType & { Username: string };
  groups: GroupType[];
}

/**
 * Custom AppSync event structure.
 * Defines the structure of the event passed to the function when triggered via AppSync.
 * 
 * @template T - The type of the arguments passed in the event.
 */
interface CustomAppSyncResolverEvent<T> {
  fieldName: string;
  arguments: T;
  identity?: AppSyncIdentityIAM | AppSyncIdentityCognito | AppSyncIdentityOIDC;
  request?: {
    headers: Record<string, string>;
    domainName: string | null;
  };
  source?: Record<string, unknown> | null;
}

/**
 * Handler function for managing users.
 * 
 * @remarks
 * This function processes user management operations such as listing users and their associated
 * groups, adding users to specific groups, and removing users from groups in AWS Cognito.
 * The specific action is determined by the `fieldName` provided in the event.
 * 
 * @param event - The AppSync event, including the operation field and the necessary arguments.
 * 
 * @returns {Promise<UserWithGroups[] | string>} The result of the user management operation, 
 * either a list of users with their groups or a success message.
 * 
 * @throws {Error} If the `fieldName` is missing or invalid, or if an error occurs during the operation.
 */
export const handler = async (event: CustomAppSyncResolverEvent<ManageUsersArguments>): Promise<UserWithGroups[] | string> => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Initialize the Cognito client
  const cognitoClient = new CognitoIdentityProviderClient({});
  const fieldName = event.fieldName;

  if (!fieldName) {
    throw new Error('Cannot determine the field name from the event.');
  }

  try {
    switch (fieldName) {
      case 'listUsersAndGroups':
        // List all users in the user pool
        const listUsersCommand = new ListUsersCommand({
          UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
        });
        const usersResponse = await cognitoClient.send(listUsersCommand);
        const users: UserType[] = usersResponse.Users || [];

        // Filter users with valid usernames
        const validUsers: (UserType & { Username: string })[] = users.filter(
          (user): user is UserType & { Username: string } => !!user.Username
        );

        // Retrieve groups for each user
        const usersWithGroups: UserWithGroups[] = await Promise.all(
          validUsers.map(async (user) => {
            const listGroupsCommand = new AdminListGroupsForUserCommand({
              UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
              Username: user.Username,
            });
            const groupsResponse = await cognitoClient.send(listGroupsCommand);
            const groups: GroupType[] = groupsResponse.Groups
              ? groupsResponse.Groups.filter(
                  (group): group is GroupType & { GroupName: string } => !!group.GroupName
                )
              : [];
            return {
              user,
              groups,
            };
          })
        );

        // Return users with their groups
        return usersWithGroups;

      case 'addUserToGroup':
        const { username: addUsername, groupName: addGroupName } = event.arguments;

        if (!addUsername || !addGroupName) {
          throw new Error("Missing 'username' or 'groupName' parameter");
        }

        const addCommand = new AdminAddUserToGroupCommand({
          UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
          Username: addUsername,
          GroupName: addGroupName,
        });
        await cognitoClient.send(addCommand);

        return `User ${addUsername} added to group ${addGroupName}`;

      case 'removeUserFromGroup':
        const { username: removeUsername, groupName: removeGroupName } = event.arguments;

        if (!removeUsername || !removeGroupName) {
          throw new Error("Missing 'username' or 'groupName' parameter");
        }

        const removeCommand = new AdminRemoveUserFromGroupCommand({
          UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
          Username: removeUsername,
          GroupName: removeGroupName,
        });
        await cognitoClient.send(removeCommand);

        return `User ${removeUsername} removed from group ${removeGroupName}`;

      default:
        throw new Error('Invalid action parameter');
    }
  } catch (error) {
    console.error('Error in manage-users function:', error);
    throw error;
  }
};
