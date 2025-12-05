"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageList } from "@/components/sms/MessageList";
import { MessageThread } from "@/components/sms/MessageThread";
import { NewMessageInput } from "@/components/sms/NewMessageInput";
import axiosInstance from "@/lib/axiosInstance";
import { ConversationSummary, SMSMessage } from "@/types/sms";

// Locale-agnostic timestamp formatting function to prevent hydration errors
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  // For older dates, use ISO format to ensure consistency
  return date.toISOString().split('T')[0];
};

// Use fixed timestamps to prevent hydration errors
const FIXED_TIMESTAMP = "2023-01-01T12:00:00.000Z";

// Mock data for initial display with consistent timestamps
const mockConversations: ConversationSummary[] = [
  {
    id: "1",
    contact: "John Doe",
    lastMessage: "Hi, I need help with my order #12345",
    timestamp: "5m ago",
    unread: true,
  },
  {
    id: "2",
    contact: "Jane Smith",
    lastMessage: "Thanks for your assistance!",
    timestamp: "2h ago",
    unread: false,
  },
  {
    id: "3",
    contact: "+1 (555) 123-4567",
    lastMessage: "When will my order be delivered?",
    timestamp: "Yesterday",
    unread: false,
  },
];

const mockMessages: Record<string, SMSMessage[]> = {
  "1": [
    {
      id: "1-1",
      from: "+15551234567",
      to: "+15559876543",
      text: "Hi, I need help with my order #12345",
      timestamp: FIXED_TIMESTAMP,
      direction: "incoming",
    },
    {
      id: "1-2",
      from: "+15559876543",
      to: "+15551234567",
      text: "Sure, I can help you with that. Can you please provide more details about your order?",
      timestamp: FIXED_TIMESTAMP,
      direction: "outgoing",
    },
  ],
  "2": [
    {
      id: "2-1",
      from: "+15559876541",
      to: "+15551234567",
      text: "Thanks for your assistance!",
      timestamp: FIXED_TIMESTAMP,
      direction: "incoming",
    },
  ],
  "3": [
    {
      id: "3-1",
      from: "+15551234568",
      to: "+15559876543",
      text: "When will my order be delivered?",
      timestamp: FIXED_TIMESTAMP,
      direction: "incoming",
    },
    {
      id: "3-2",
      from: "+15559876543",
      to: "+15551234568",
      text: "Your order will be delivered by Friday.",
      timestamp: FIXED_TIMESTAMP,
      direction: "outgoing",
    },
  ],
};

export default function SMSInboxPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>("1");
  const [messages, setMessages] = useState<SMSMessage[]>(mockMessages["1"] || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get tenant_id and channel_id from context or props
  const tenantId = "tenant_123"; // Replace with actual tenant ID
  const channelId = "channel_sms"; // Replace with actual channel ID

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      // Uncomment when backend is ready
      // const response = await axiosInstance.get(`/sms/messages`, {
      //   params: {
      //     tenant_id: tenantId,
      //     channel_id: channelId,
      //     page: 1,
      //     limit: 50,
      //   },
      // });
      // setConversations(response.data);
    } catch (err) {
      setError("Failed to fetch conversations");
      console.error(err);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      // Uncomment when backend is ready
      // const response = await axiosInstance.get(`/sms/messages/${conversationId}`);
      // setMessages(response.data.messages);
      setMessages(mockMessages[conversationId] || []);
    } catch (err) {
      setError("Failed to fetch messages");
      console.error(err);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    fetchMessages(conversationId);
  };

  // Handle sending a new message
  const handleSendMessage = async (messageText: string) => {
    if (!selectedConversationId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get the contact phone number from the selected conversation
      const selectedConversation = conversations.find(c => c.id === selectedConversationId);
      const toPhoneNumber = selectedConversation?.contact || "";

      // Uncomment when backend is ready
      // const response = await axiosInstance.post(`/sms/send`, {
      //   tenant_id: tenantId,
      //   channel_id: channelId,
      //   to: toPhoneNumber,
      //   message: messageText,
      // });

      // Add the new message to the UI immediately
      const newMessage: SMSMessage = {
        id: `msg-${Date.now()}`,
        from: "+15559876543", // Agent phone number
        to: toPhoneNumber,
        text: messageText,
        timestamp: FIXED_TIMESTAMP, // Use fixed timestamp to prevent hydration errors
        direction: "outgoing",
      };

      setMessages(prev => [...prev, newMessage]);

      // Update the conversation list with the new last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversationId
            ? { 
                ...conv, 
                lastMessage: messageText, 
                timestamp: formatRelativeTime(new Date()),
                unread: false
              }
            : conv
        )
      );
    } catch (err) {
      setError("Failed to send message");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedConversationId) {
        fetchMessages(selectedConversationId);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedConversationId]);

  // Load initial data
  useEffect(() => {
    fetchConversations();
    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
    }
  }, []);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">SMS Inbox</h1>
        <p className="text-gray-500">Manage your SMS conversations</p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="p-0 flex-1 flex h-[calc(100vh-200px)]">
          {/* Left Sidebar - Message List */}
          <div className="w-1/3 border-r">
            <MessageList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
            />
          </div>

          {/* Right Panel - Conversation Window */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <MessageThread
                  messages={messages}
                  contactName={selectedConversation.contact}
                />
                <NewMessageInput
                  onSend={handleSendMessage}
                  isLoading={isLoading}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}