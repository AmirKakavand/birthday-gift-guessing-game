"use client";

import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const ModelViewer = dynamic(() => import("../components/ModelViewer"), {
  ssr: false,
});

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey there! 🎁 I've got a surprise for you, but you'll have to guess what it is! Ask me questions and make guesses :)",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [revealed, setRevealed] = useState(false); // Track if 3D model should be revealed

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const systemMessage: Message = {
        role: "system",
        content:
          "You're a playful assistant helping someone named Roya guess her birthday gift: a JBL Go4 Bluetooth speaker. Keep your answers short and only give clever hints. Do not reveal the gift directly unless the user guesses something like 'speaker', 'bluetooth speaker', or 'JBL'. If the guess is correct, respond with a short celebratory message including '[GIFT_REVEAL]' at the end.",
      };

      const res = await axios.post("/api/guess", {
        messages: [systemMessage, ...newMessages],
      });

      const reply = res.data.content;
      setMessages([...newMessages, { role: "assistant", content: reply }]);

      // If the assistant detected the correct guess, reveal the model
      if (reply.includes("[GIFT_REVEAL]")) {
        setTimeout(() => setRevealed(true), 1000);
      }
    } catch (error: unknown) {
      console.log(error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Oops! Something went wrong 😢" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-0 m-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {
          <>
            <>
              {/* Conditionally render the Chat UI only when revealed is false */}
              {!revealed && (
                <motion.div
                  initial={false}
                  animate={{ opacity: revealed ? 0 : 1, y: revealed ? -50 : 0 }}
                  transition={{ duration: 0.8 }}
                  className={`w-full max-w-xl transition-opacity duration-800 ${
                    revealed ? "pointer-events-none" : "pointer-events-auto"
                  }`}
                >
                  {/* Your existing Chat UI */}
                  <h1 className="text-2xl font-bold mb-4 text-center">
                    🎉 Guess Your Birthday Gift
                  </h1>
                  <div className="bg-gray-800 p-4 rounded-lg space-y-3 h-[60vh] overflow-y-auto">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`text-sm ${
                          msg.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        <span
                          className={`inline-block px-3 py-2 rounded-md ${
                            msg.role === "user" ? "bg-blue-600" : "bg-gray-700"
                          }`}
                        >
                          {msg.content.replace("[GIFT_REVEAL]", "").trim()}
                        </span>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="text-left text-sm text-gray-400 animate-pulse">
                        Assistant is typing...
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 px-4 py-2 rounded-md bg-gray-700 text-white outline-none"
                      placeholder="Make a guess..."
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                    >
                      Send
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Conditionally render the 3D model */}
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 100 }}
                  transition={{ type: "spring", stiffness: 60, damping: 14 }}
                  className="absolute top-0 left-0 w-full h-full transition-opacity duration-800"
                >
                  <ModelViewer /> {/* The 3D model will show here */}
                </motion.div>
              )}
            </>
          </>
        }
      </AnimatePresence>
    </main>
  );
}
