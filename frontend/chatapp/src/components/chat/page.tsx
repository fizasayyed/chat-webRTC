"use client"
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Hi, how can I help you today?", user: "agent" },
    { text: "Hey, I'm having trouble with my account.", user: "me" },
    { text: "What seems to be the problem?", user: "agent" },
    { text: "I can't log in.", user: "me" },
  ]);
  const [input, setInput] = useState("");
  // let socket;

  // useEffect(() => {
  //   socket = new WebSocket("ws://localhost:8080");

  //   socket.onmessage = (event) => {
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { text: event.data, user: "agent" },
  //     ]);
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  // const sendMessage = () => {
  //   if (input.trim()) {
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { text: input, user: "me" },
  //     ]);
  //     socket.send(input);
  //     setInput("");
  //   }
  // };

  return (
    <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex items-center p-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/avatar.png" alt="User" />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h4 className="text-sm font-medium text-gray-900">Sofia Davis</h4>
          <p className="text-sm text-gray-500">m@example.com</p>
        </div>
        <Button className="ml-auto" variant="ghost">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </Button>
      </div>
      <div
        className="p-4 border-t border-gray-200 overflow-y-auto"
        style={{ height: "300px" }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-2 ${message.user === "me" ? "justify-end" : ""
              }`}
          >
            <div
              className={`rounded-lg p-2 max-w-xs ${message.user === "me"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-900"
                }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center p-4 border-t border-gray-200">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              // sendMessage();
            }
          }}
          className="flex-1"
          placeholder="Type your message..."
        />
        <Button className="ml-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Chat;
