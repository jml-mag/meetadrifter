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
 * Interface for the manage-users function arguments.
 * Defines optional fields based on the type of operation.
 */
interface ManageUsersArguments {
  username?: string;
  groupName?: string;
}

/**
 * Interface for a user with their associated groups.
 */
interface UserWithGroups {
  user: UserType & { Username: string };
  groups: GroupType[];
}

/**
 * Custom event type to match the actual event structure.
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
 * Handler for the manage-users function.
 *
 * This function handles user management tasks, including:
 * - Listing users and their groups
 * - Adding a user to a group
 * - Removing a user from a group
 *
 * The function distinguishes actions based on the `event.fieldName`.
 *
 * @param event - The event data from AppSync.
 * @returns The result of the requested action.
 */
export const handler = async (event: CustomAppSyncResolverEvent<ManageUsersArguments>) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const cognitoClient = new CognitoIdentityProviderClient({});

  const fieldName = event.fieldName;

  if (!fieldName) {
    throw new Error('Cannot determine the field name from the event.');
  }

  try {
    switch (fieldName) {
      case 'listUsersAndGroups':
        // List all users
        const listUsersCommand = new ListUsersCommand({
          UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
        });
        const usersResponse = await cognitoClient.send(listUsersCommand);
        const users: UserType[] = usersResponse.Users || [];

        // Filter out users without a Username
        const validUsers: (UserType & { Username: string })[] = users.filter(
          (user): user is UserType & { Username: string } => !!user.Username
        );

        // Get groups for each user
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

        // Return the users with groups directly
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
    throw error; // Let Amplify handle the error appropriately
  }
};
