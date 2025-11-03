"use client";

import { Message } from "@/types/types";

function Messages({
  messages,
  chatbotName,
}: {
  messages: Message[];
  chatbotName: string;
}) {
  return <div>Hi Messages</div>;
}
export default Messages;
