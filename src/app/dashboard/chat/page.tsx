"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Circle } from "lucide-react";

// Mock data for chat conversations
const conversations = [
  {
    id: 1,
    name: "Alice Johnson",
    status: "online",
    lastMessage: "Hello, I have a question about my subscription",
    timestamp: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    status: "offline",
    lastMessage: "Thanks for resolving my issue!",
    timestamp: "1 hour ago",
    unread: false,
  },
  {
    id: 3,
    name: "Charlie Brown",
    status: "online",
    lastMessage: "When will the new feature be released?",
    timestamp: "3 hours ago",
    unread: false,
  },
  {
    id: 4,
    name: "Diana Miller",
    status: "offline",
    lastMessage: "Can you help me with the setup process?",
    timestamp: "1 day ago",
    unread: false,
  },
];

// Mock data for messages in the selected conversation
const messages = [
  {
    id: 1,
    text: "Hello, I have a question about my subscription",
    sender: "customer",
    timestamp: "10:30 AM",
    avatar: "AJ",
  },
  {
    id: 2,
    text: "Sure, I'd be happy to help! What would you like to know about your subscription?",
    sender: "agent",
    timestamp: "10:32 AM",
    avatar: "SD",
  },
  {
    id: 3,
    text: "I'm wondering if I can upgrade to the premium plan",
    sender: "customer",
    timestamp: "10:33 AM",
    avatar: "AJ",
  },
  {
    id: 4,
    text: "Absolutely! I can help you with that. The premium plan offers additional features like...",
    sender: "agent",
    timestamp: "10:35 AM",
    avatar: "SD",
  },
  {
    id: 5,
    text: "That sounds great! How much does it cost?",
    sender: "customer",
    timestamp: "10:36 AM",
    avatar: "AJ",
  },
];

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Support</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Real-time conversations with your customers</p>
      </div>

      {/* Main Content */}
      <Card className="flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
        <CardContent className="p-0 h-full flex">
          {/* Conversations List */}
          <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-neutral-800 flex-shrink-0 flex flex-col">
            <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
              <Input placeholder="Search conversations..." className="bg-gray-50 dark:bg-neutral-800" />
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-gray-100 dark:border-neutral-800 cursor-pointer transition-colors ${
                    selectedConversation.id === conversation.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500"
                      : "hover:bg-gray-50 dark:hover:bg-neutral-800"
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-10 h-10 flex items-center justify-center text-white text-sm font-medium">
                          {conversation.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 ${
                          conversation.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`} />
                      </div>
                      <div className="ml-3 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{conversation.name}</h3>
                        <p className={`text-sm truncate ${conversation.unread ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{conversation.timestamp}</span>
                      {conversation.unread && (
                        <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="hidden md:flex flex-1 flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-10 h-10 flex items-center justify-center text-white text-sm font-medium">
                  {selectedConversation.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 ${
                  selectedConversation.status === "online" ? "bg-green-500" : "bg-gray-400"
                }`} />
              </div>
              <div className="ml-3">
                <h2 className="font-medium text-gray-900 dark:text-white">{selectedConversation.name}</h2>
                <p className={`text-sm ${selectedConversation.status === "online" ? "text-green-500" : "text-gray-500"}`}>
                  {selectedConversation.status === "online" ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-neutral-950">
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "customer" && (
                      <div className="mr-2 flex-shrink-0">
                        <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-medium">
                          {message.avatar}
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                        message.sender === "agent"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-md"
                          : "bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === "agent" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                        {message.timestamp}
                      </p>
                    </div>
                    {message.sender === "agent" && (
                      <div className="ml-2 flex-shrink-0">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-medium">
                          AI
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="mr-2 flex-shrink-0">
                      <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-medium">
                        {selectedConversation.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex gap-3 max-w-3xl mx-auto">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  className="bg-gray-50 dark:bg-neutral-800"
                />
                <Button onClick={handleSendMessage} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}