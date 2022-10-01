/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBoard = /* GraphQL */ `
  subscription OnCreateBoard($owner: String) {
    onCreateBoard(owner: $owner) {
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
export const onUpdateBoard = /* GraphQL */ `
  subscription OnUpdateBoard($owner: String) {
    onUpdateBoard(owner: $owner) {
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
export const onDeleteBoard = /* GraphQL */ `
  subscription OnDeleteBoard($owner: String) {
    onDeleteBoard(owner: $owner) {
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
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($owner: String) {
    onCreateMessage(owner: $owner) {
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
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage($owner: String) {
    onUpdateMessage(owner: $owner) {
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
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage($owner: String) {
    onDeleteMessage(owner: $owner) {
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
