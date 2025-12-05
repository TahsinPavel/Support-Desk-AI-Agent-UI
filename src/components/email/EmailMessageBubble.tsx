"use client";

import { EmailMessage } from "@/types/email";

interface EmailMessageBubbleProps {
  message: EmailMessage;
}

export function EmailMessageBubble({ message }: EmailMessageBubbleProps) {
  // Format the timestamp to a readable format
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
  };

  // Determine bubble styling based on message direction
  const getBubbleClasses = () => {
    switch (message.direction) {
      case "incoming":
        return "bg-white border border-gray-200 text-gray-800";
      case "outgoing":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={`rounded-2xl p-4 max-w-3xl ${message.direction === "incoming" ? "self-start" : "self-end"}`}>
      <div className={`${getBubbleClasses()} rounded-2xl p-4 shadow-sm`}>
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium">
            {message.direction === "incoming" ? message.from_address : "You"}
          </span>
          <span className="text-xs opacity-70">
            {formatTime(message.created_at)}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{message.body}</p>
      </div>
    </div>
  );
}