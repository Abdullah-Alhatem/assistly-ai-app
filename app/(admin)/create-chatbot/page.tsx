"use client";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREATE_CHATBOT } from "@/graphql/mutations/mutations";
import { InsertChatbotResponse } from "@/types/types";
import { ApolloClient } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function CreateChatbot() {
  const [name, setName] = useState("");
  const router = useRouter();
  const { user } = useUser();
  const [createChatbot, { data, loading, error }] =
    useMutation<InsertChatbotResponse>(CREATE_CHATBOT, {
      variables: {
        clerk_user_id: user?.id,
        created_at: new Date().toISOString(),
        name,
      },
    });

  const handelSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await createChatbot();
      setName("");
      router.push(`/edit-chatbot/${data?.data?.data?.insertChatbots.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white p-10 m-10 rounded-md">
      <Avatar seed="create-chatbot" />
      <div>
        <h1 className="text-xl lg:text-3xl font-semibold">Create</h1>
        <h2 className="font-light">
          Create a new chatbot to assist you in your conversations with your
          customers.
        </h2>
        <form
          onSubmit={handelSubmit}
          className="flex flex-col md:flex-row gap-2 mt-5"
        >
          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Chatbot Name..."
            className="max-w-lg"
            required
          />
          <Button type="submit" disabled={loading || !name}>
            {loading ? "Creating Chatbot..." : "Create Chatbot"}
          </Button>
        </form>
        <p className="text-gray-300 mt-5">Example: Customer Support Chatbot</p>
      </div>
    </div>
  );
}
export default CreateChatbot;
