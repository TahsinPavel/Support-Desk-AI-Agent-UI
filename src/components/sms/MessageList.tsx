"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ConversationSummary } from "@/types/sms";

interface MessageListProps {
  conversations: ConversationSummary[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export function MessageList({ conversations, selectedConversationId, onSelectConversation }: MessageListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(conversation =>
    conversation.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Input
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
              selectedConversationId === conversation.id
                ? "bg-muted border-l-4 border-blue-500"
                : "hover:bg-muted"
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium truncate">{conversation.contact}</h3>
              <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {conversation.lastMessage}
            </p>
            {conversation.unread && (
              <div className="mt-2 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}