"use client";

import { EmailMessage } from "@/types/email";
import { User, Bot } from "lucide-react";

interface EmailMessageBubbleProps {
  message: EmailMessage;
  isAiResponse?: boolean;
}

export function EmailMessageBubble({ message, isAiResponse = false }: EmailMessageBubbleProps) {
  // Format the timestamp to a readable format
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // Determine bubble styling based on message direction
  const getBubbleClasses = () => {
    if (isAiResponse) {
      return "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 text-purple-800 dark:text-purple-200";
    }
    switch (message.direction) {
      case "incoming":
        return "bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-gray-200";
      case "outgoing":
        return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white";
      default:
        return "bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getAvatarClasses = () => {
    if (isAiResponse) {
      return "bg-gradient-to-br from-purple-500 to-pink-600";
    }
    return message.direction === "incoming"
      ? "bg-gradient-to-br from-blue-500 to-indigo-600"
      : "bg-gradient-to-br from-green-500 to-emerald-600";
  };

  return (
    <div className={`flex gap-3 ${message.direction === "outgoing" ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getAvatarClasses()} flex items-center justify-center text-white`}>
        {isAiResponse ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-xl ${getBubbleClasses()} rounded-2xl p-4 shadow-sm`}>
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium text-sm">
            {isAiResponse ? "AI Assistant" : message.direction === "incoming" ? message.from_email : "You"}
          </span>
          <span className="text-xs opacity-70 ml-4">
            {formatTime(message.created_at)}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-sm">{message.message_text}</p>
      </div>
    </div>
  );
}