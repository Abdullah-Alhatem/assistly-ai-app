import client from "@/graphql/apolloClient";
import {
  INSERT_CHAT_SESSION,
  INSERT_GUEST,
  INSERT_MESSAGE,
} from "@/graphql/mutations/mutations";
import { gql } from "@apollo/client";

async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
  try {
    // 1. Crate a new guest entry
    const guestResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: {
        name: guestName,
        created_at: new Date().toISOString(),
        email: guestEmail,
      },
    });
    const guestId = guestResult.data?.data?.insertGuests?.id;

    // Initialize a new chat session
    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: {
        chatbot_id: chatbotId,
        created_at: new Date().toISOString(),
        guest_id: guestId,
      },
    });
    const chatSessionId = chatSessionResult.data?.data?.insertChat_sessions?.id;

    // Insert initial message
    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        created_at: new Date().toISOString(),
        sender: "ai",
        // TODO: Change this if you want
        content: `Welcome ${guestName}!\n How can I assist you today? 😊`,
      },
    });

    console.log("New chat session started successfully");
    return chatSessionId;
  } catch (error) {
    console.error("Error staring new chat session:", error);
  }
}

export default startNewChat;
