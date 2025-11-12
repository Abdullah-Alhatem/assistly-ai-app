import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { serverClient } from "@/lib/server/serverClient";
import {
  GetChatbotByIdResponse2,
  MessagesByChatSessionIdResponse2,
  MessagesByChatSessionIdVariables,
} from "@/types/types";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";

const openai = new OpenAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(req: NextRequest) {
  const { name, chat_session_id, chatbot_id, content } = await req.json();

  try {
    // 1. Fetch chatbot characteristics
    const { data } = await serverClient.query<GetChatbotByIdResponse2>({
      query: GET_CHATBOT_BY_ID,
      variables: { id: chatbot_id },
    });

    const chatbot = data?.chatbots;

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    // 2. Fetch previous messages
    const { data: messagesData } = await serverClient.query<
      MessagesByChatSessionIdResponse2,
      MessagesByChatSessionIdVariables
    >({
      query: GET_MESSAGES_BY_CHAT_SESSION_ID,
      variables: { chat_session_id: chat_session_id },
      fetchPolicy: "no-cache",
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const previousMessages = messagesData?.chat_sessions.messages!;
    const formattedPreviousMessages: ChatCompletionMessageParam[] =
      previousMessages.map(msg => ({
        role: msg.sender === "ai" ? "assistant" : "user",
        name: msg.sender === "ai" ? undefined : name,
        content: msg.content,
      }));

    // Combine characteristics into a system prompt
    const systemPrompt = chatbot.chatbot_characteristics
      .map(c => c.content)
      .join(" + ");

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        // name: "system",
        content: `You are a helpful assistant talking to ${name}. If a generic question is asked which is not relevant or in the same scope or domain as the points in mentioned in the key information section, kindly inform the user they're only allowed to search for the specified content (Do not tell the user that you cannot answer general questions unless they ask a general question.) . Your communication style: Speak naturally and spontaneously, like a friend helping another friend and Don't use bullet points or lists unless the user explicitly requests them and Be friendly and respectful. Speak to the user in the same language he uses, whether Arabic or English, etc. Use Emoji's where possible. Here is some key information that you need to be aware of, these are elements you may be asked about: ${systemPrompt}`,
      },
      ...formattedPreviousMessages,
      {
        role: "user",
        name: name,
        content: content,
      },
    ];

    // 3. Send the massages to gemini's completion API.
    const openaiResponse = await openai.chat.completions.create({
      messages: messages,
      model: "gemini-2.5-pro",
    });

    const aiResponse = openaiResponse?.choices?.[0]?.message?.content?.trim();
    if (!aiResponse) {
      return NextResponse.json(
        { error: "Failed to generate AI response" },
        { status: 500 }
      );
    }

    // 4. Save the user's massage in the database
    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        created_at: new Date().toISOString(),
        content,
        sender: "user",
      },
    });

    // 5. Save the AI's response in the database
    const aiMessageResult = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        created_at: new Date().toISOString(),
        content: aiResponse,
        sender: "ai",
      },
    });

    // 6. Return the AI's response to the client
    return NextResponse.json({
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      id: aiMessageResult?.data?.insertMessages?.id!,
      content: aiResponse,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
