"use client";
import TypeIt from "typeit-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  // 4:21:15
  return (
    <main className="m-10 p-10 bg-white rounded-md w-full">
      <h1 className="text-4xl font-light">
        Welcome to{" "}
        <span className="font-semibold text-[#64b5f5]">Assistly</span>
      </h1>

      <h2 className="mt-4 mb-10 text-gray-700 min-h-12">
        <TypeIt
          options={{
            
            strings: [
              "Your customizable AI chat agent that helps you manage your customer conversations.",
            ],
            speed: 45,
            waitUntilVisible: true,
            cursor: true,
            loop: false,
            lifeLike: true,
          }}
        />
      </h2>

      <Link href="/create-chatbot">
        <Button className="bg-[#64b5f5] hover:bg-cyan-950 text-white drop-shadow-md">
          Lets get started by creating your first chatbot
        </Button>
      </Link>
    </main>
  );
}
