"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, Bot, User } from "lucide-react";
import { SMSMessage } from "@/types/sms";

interface MessageThreadProps {
  messages: SMSMessage[];
  contactName: string;
}

// Format phone number for display
const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1,4)}) ${cleaned.slice(4,7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

export function MessageThread({ messages, contactName }: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Only format time on client to prevent hydration mismatch
  const formatTime = (timestamp: string): string => {
    if (!mounted) return "";
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "";
    }
  };

  const formatDate = (timestamp: string): string => {
    if (!mounted) return "";
    try {
      const date = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return "Today";
      }
      if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return "";
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = message.created_at?.split('T')[0] || 'unknown';
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, SMSMessage[]>);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
            {contactName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 dark:text-white truncate">
              {formatPhoneNumber(contactName)}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Phone className="w-3.5 h-3.5" />
              <span>SMS Conversation</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span>{messages.length} messages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 bg-gray-50 dark:bg-neutral-950">
        <div className="p-4 space-y-6 min-h-full">
          <div className="max-w-2xl mx-auto space-y-6">
            {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
              <div key={dateKey}>
                {/* Date Separator */}
                {mounted && (
                  <div className="flex items-center justify-center mb-4">
                    <span className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-neutral-800 rounded-full">
                      {formatDate(dateMessages[0]?.created_at || '')}
                    </span>
                  </div>
                )}

                {/* Messages for this date */}
                <div className="space-y-3">
                  {dateMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-end gap-2 ${
                        message.direction === "outgoing" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Incoming message avatar */}
                      {message.direction === "incoming" && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}

                      <div className="flex flex-col max-w-xs lg:max-w-md">
                        <div
                          className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                            message.direction === "outgoing"
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-sm"
                              : "bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-bl-sm border border-gray-100 dark:border-neutral-700"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.message_text}
                          </p>
                        </div>

                        {/* AI Response indicator */}
                        {message.ai_response && (
                          <div className="mt-1.5 flex items-start gap-2">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              <Bot className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 max-w-xs lg:max-w-md">
                              <p className="text-sm text-purple-900 dark:text-purple-100 whitespace-pre-wrap">
                                {message.ai_response}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Timestamp */}
                        {mounted && (
                          <p
                            className={`text-xs mt-1 ${
                              message.direction === "outgoing"
                                ? "text-right text-gray-400 dark:text-gray-500"
                                : "text-left text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            {formatTime(message.created_at)}
                          </p>
                        )}
                      </div>

                      {/* Outgoing message avatar */}
                      {message.direction === "outgoing" && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}