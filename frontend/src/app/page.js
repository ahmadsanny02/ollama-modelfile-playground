"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/chat?prompt=${encodeURIComponent(userMessage.content)}`,
      );

      // --- KODE YANG SALAH ---
      // const data = await res.json();
      // const aiMessage = {
      //   role: "model",
      //   content: data.response.content,
      // };

      // --- KODE YANG SUDAH DIPERBAIKI ---
      const data = await res.json();
      const aiMessage = {
        role: "model",
        content: data.response,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage = {
        role: "model",
        content: error,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans dark:bg-black">
      <main className="flex flex-1 flex-col w-full max-w-2xl py-8 px-4">
        <h1 className="text-2xl font-semibold text-center mb-4 text-black dark:text-white">
          SANS AI
        </h1>

        <div className="flex flex-col flex-1 gap-3 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div
              key={`message-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${message.role === "user" ? "bg-gray-200 text-black dark:text-gray-200 dark:bg-blue-800" : "bg-gray-200 text-black dark:text-gray-200 dark:bg-gray-800"} `}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-black dark:text-gray-200 dark:bg-gray-800">
                Loading...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 dark:bg-gray-900 dark:text-white"
            placeholder="Write message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="rounded-full bg-blue-500 text-white px-6 py-2 hover:bg-blue-600"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
