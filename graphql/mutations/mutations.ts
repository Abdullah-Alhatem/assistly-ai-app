import { gql } from "@apollo/client";

export const CREATE_CHATBOT = gql`
  mutation CreateChatbot(
    $clerk_user_id: String!
    $created_at: DateTime!
    $name: String!
  ) {
    insertChatbots(
      clerk_user_id: $clerk_user_id
      created_at: $created_at
      name: $name
    ) {
      id
      created_at
      name
    }
  }
`;

export const REMOVE_CHARACTERISTIC = gql`
  mutation RemoveCharacteristic($characteristicId: Int!) {
    deleteChatbot_characteristics(id: $characteristicId) {
      id
      # Add other fields you might want to return after remove
    }
  }
`;

export const DELETE_CHATBOT = gql`
  mutation DeleteChatbot($id: Int!) {
    deleteChatbots(id: $id) {
      id
    }
  }
`;

export const ADD_CHARACTERISTIC = gql`
  mutation AddCharacteristic(
    $chatbotId: Int!
    $created_at: DateTime!
    $content: String!
  ) {
    insertChatbot_characteristics(
      chatbot_id: $chatbotId
      created_at: $created_at
      content: $content
    ) {
      id
      content
      created_at
    }
  }
`;

export const UPDATE_CHATBOT = gql`
  mutation UpdateChatbot($id: Int!, $created_at: DateTime!, $name: String!) {
    updateChatbots(id: $id, created_at: $created_at, name: $name) {
      id
      name
      created_at
    }
  }
`;

export const INSERT_MESSAGE = gql`
  mutation InsertMessage(
    $chat_session_id: Int!
    $content: String!
    $created_at: DateTime!
    $sender: String!
  ) {
    insertMessages(
      chat_session_id: $chat_session_id
      content: $content
      created_at: $created_at
      sender: $sender
    ) {
      id
      content
      created_at
      sender
    }
  }
`;

export const INSERT_GUEST = gql`
  mutation insertGuest(
    $name: String!
    $email: String!
    $created_at: DateTime!
  ) {
    insertGuests(name: $name, email: $email, created_at: $created_at) {
      id
      created_at
    }
  }
`;

export const INSERT_CHAT_SESSION = gql`
  mutation insertChatSession(
    $chatbot_id: Int!
    $guest_id: Int!
    $created_at: DateTime!
  ) {
    insertChat_sessions(
      chatbot_id: $chatbot_id
      guest_id: $guest_id
      created_at: $created_at
    ) {
      id
      created_at
    }
  }
`;
