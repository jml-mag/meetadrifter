/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBoard = /* GraphQL */ `
  mutation CreateBoard(
    $input: CreateBoardInput!
    $condition: ModelBoardConditionInput
  ) {
    createBoard(input: $input, condition: $condition) {
      id
      name
      messages {
        items {
          id
          text
          replyTo
          createdAt
          updatedAt
          boardMessagesId
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateBoard = /* GraphQL */ `
  mutation UpdateBoard(
    $input: UpdateBoardInput!
    $condition: ModelBoardConditionInput
  ) {
    updateBoard(input: $input, condition: $condition) {
      id
      name
      messages {
        items {
          id
          text
          replyTo
          createdAt
          updatedAt
          boardMessagesId
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteBoard = /* GraphQL */ `
  mutation DeleteBoard(
    $input: DeleteBoardInput!
    $condition: ModelBoardConditionInput
  ) {
    deleteBoard(input: $input, condition: $condition) {
      id
      name
      messages {
        items {
          id
          text
          replyTo
          createdAt
          updatedAt
          boardMessagesId
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      id
      text
      board {
        id
        name
        messages {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      replyTo
      createdAt
      updatedAt
      boardMessagesId
      owner
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
      id
      text
      board {
        id
        name
        messages {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      replyTo
      createdAt
      updatedAt
      boardMessagesId
      owner
    }
  }
`;
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
      id
      text
      board {
        id
        name
        messages {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      replyTo
      createdAt
      updatedAt
      boardMessagesId
      owner
    }
  }
`;
