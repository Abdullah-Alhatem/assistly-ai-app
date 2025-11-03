import ChatBotSessions from "@/components/ChatBotSessions";
import { GET_USER_CHATBOTS } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  Chatbot,
  GetChatbotsByUserData,
  GetUserChatbotsVariables,
} from "@/types/types";
import { auth } from "@clerk/nextjs/server";

async function ReviewSessions() {
  const { userId } = await auth();
  if (!userId) return;

  const { data, error } = await serverClient.query<
    GetChatbotsByUserData,
    GetUserChatbotsVariables
  >({
    query: GET_USER_CHATBOTS,
    variables: { userId: userId },
  });

  const userChatbots = (data?.chatbotsList || []).filter(
    (chatbot: any) => chatbot.clerk_user_id === userId
  );
  console.log("UserData@@@@@@@@@@@", userChatbots); // Array of Filtered chatbots for the authenticated user

  const sortedChatbotsByUser: Chatbot[] = userChatbots.map(chatbot => {
    return {
      ...chatbot,
      chat_sessions: [...chatbot.chat_sessions].sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }),
    };
  });
  console.log("Sorted User Chatbots###########", sortedChatbotsByUser);

  return (
    <div className="flex-1 px-10">
      <h1 className="text-xl lg:text-3xl font-semibold mt-10">Chat Sessions</h1>
      <h2 className="mb-5">
        Review the chat sessions the chat bots have had with your customers.
      </h2>
      <ChatBotSessions chatbots={sortedChatbotsByUser} />
    </div>
  );
}
export default ReviewSessions;
