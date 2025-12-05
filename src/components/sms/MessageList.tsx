"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MessageSquare } from "lucide-react";
import { ConversationSummary } from "@/types/sms";

interface MessageListProps {
  conversations: ConversationSummary[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  formatRelativeTime?: (timestamp: string) => string;
}

// Default formatter if none provided
const defaultFormatTime = (timestamp: string): string => {
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toISOString().split('T')[0];
  } catch {
    return "";
  }
};

// Format phone number for display
const formatPhoneNumber = (phone: string): string => {
  // If it looks like a phone number, format it
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1,4)}) ${cleaned.slice(4,7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

export function MessageList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  formatRelativeTime = defaultFormatTime
}: MessageListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversations;
    const term = searchTerm.toLowerCase();
    return conversations.filter(conversation =>
      conversation.contact.toLowerCase().includes(term) ||
      conversation.lastMessage.toLowerCase().includes(term)
    );
  }, [conversations, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? "No conversations found" : "No messages yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                role="button"
                tabIndex={0}
                className={`p-4 cursor-pointer transition-all duration-150 ${
                  selectedConversationId === conversation.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-3 border-l-blue-500"
                    : "hover:bg-gray-50 dark:hover:bg-neutral-800/50 border-l-3 border-l-transparent"
                }`}
                onClick={() => onSelectConversation(conversation.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectConversation(conversation.id);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm ${
                    conversation.unread
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                      : "bg-gradient-to-br from-gray-400 to-gray-500"
                  }`}>
                    {conversation.contact.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className={`truncate text-gray-900 dark:text-white ${
                        conversation.unread ? "font-semibold" : "font-medium"
                      }`}>
                        {formatPhoneNumber(conversation.contact)}
                      </h3>
                      <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 whitespace-nowrap">
                        {formatRelativeTime(conversation.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm truncate mt-1 ${
                      conversation.unread
                        ? "text-gray-800 dark:text-gray-200 font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {conversation.lastMessage || "No messages"}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {conversation.unread && (
                    <div className="flex-shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 animate-pulse"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}