import { gql } from "@apollo/client";

export const CREATE_CHATBOT = gql`
  mutation CreateChatbot($clerk_user_id: String!, $created_at: DateTime!, $name: String!) {
    insertChatbots(clerk_user_id: $clerk_user_id, created_at: $created_at, name: $name) {
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
  mutation AddCharacteristic($chatbotId: Int!, $created_at: DateTime!, $content: String!) {
    insertChatbot_characteristics(chatbot_id: $chatbotId, created_at: $created_at, content: $content) {
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
