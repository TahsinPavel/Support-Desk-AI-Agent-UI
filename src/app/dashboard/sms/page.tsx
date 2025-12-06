"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageList } from "@/components/sms/MessageList";
import { MessageThread } from "@/components/sms/MessageThread";
import { NewMessageInput } from "@/components/sms/NewMessageInput";
import { Loader2, AlertCircle, MessageSquare } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { ConversationSummary, SMSMessage, Conversation } from "@/types/sms";
import { SMS_ENDPOINTS } from "@/lib/api";

// Locale-agnostic timestamp formatting function to prevent hydration errors
const formatRelativeTime = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toISOString().split('T')[0];
  } catch {
    return "";
  }
};

// Group messages by customer contact into conversations
const groupMessagesIntoConversations = (messages: SMSMessage[]): Map<string, SMSMessage[]> => {
  const grouped = new Map<string, SMSMessage[]>();

  messages.forEach(msg => {
    const contact = msg.customer_contact;
    if (!grouped.has(contact)) {
      grouped.set(contact, []);
    }
    grouped.get(contact)!.push(msg);
  });

  // Sort messages within each conversation by created_at
  grouped.forEach((msgs, contact) => {
    msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  });

  return grouped;
};

// Convert grouped messages to ConversationSummary for the list
const createConversationSummaries = (grouped: Map<string, SMSMessage[]>): ConversationSummary[] => {
  const summaries: ConversationSummary[] = [];

  grouped.forEach((messages, contact) => {
    const lastMessage = messages[messages.length - 1];
    summaries.push({
      id: contact, // Use contact as unique ID
      contact: contact,
      lastMessage: lastMessage?.message_text || "",
      timestamp: lastMessage?.created_at || "",
      unread: messages.some(m => m.direction === "incoming" && !m.ai_response),
    });
  });

  // Sort by most recent message first
  summaries.sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime() || 0;
    const dateB = new Date(b.timestamp).getTime() || 0;
    return dateB - dateA;
  });

  return summaries;
};

export default function SMSInboxPage() {
  const [allMessages, setAllMessages] = useState<SMSMessage[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<SMSMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  // Get tenant_id and channel_id from localStorage user data
  const getTenantInfo = useCallback(() => {
    if (typeof window === "undefined") return { tenantId: "", channelId: "" };
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return {
          tenantId: user.tenant_id || user.tenantId || "",
          channelId: user.channel_id || "sms_channel",
        };
      }
    } catch (e) {
      console.error("Failed to parse user data:", e);
    }
    return { tenantId: "", channelId: "sms_channel" };
  }, []);

  // Fetch all SMS messages from backend
  const fetchMessages = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(SMS_ENDPOINTS.LIST);

      // Handle different response formats
      let messages: SMSMessage[] = [];
      if (Array.isArray(response.data)) {
        messages = response.data;
      } else if (response.data?.items && Array.isArray(response.data.items)) {
        messages = response.data.items;
      } else if (response.data?.messages && Array.isArray(response.data.messages)) {
        messages = response.data.messages;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        messages = response.data.data;
      }

      setAllMessages(messages);

      // Group into conversations
      const grouped = groupMessagesIntoConversations(messages);
      const summaries = createConversationSummaries(grouped);
      setConversations(summaries);

      // Update current conversation messages if one is selected
      if (selectedContact && grouped.has(selectedContact)) {
        setCurrentMessages(grouped.get(selectedContact) || []);
      }

      // Auto-select first conversation if none selected
      if (!selectedContact && summaries.length > 0) {
        const firstContact = summaries[0].id;
        setSelectedContact(firstContact);
        if (grouped.has(firstContact)) {
          setCurrentMessages(grouped.get(firstContact) || []);
        }
      }
    } catch (err: unknown) {
      console.error("Failed to fetch messages:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch messages";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedContact]);

  // Mark conversation as read
  const markAsRead = useCallback((conversationId: string) => {
    // In a real app, this would make an API call to mark messages as read
    console.log(`Marking conversation ${conversationId} as read`);

    // Mark as read (update local state)
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId ? { ...conv, unread: false } : conv
      )
    );
  }, [allMessages]);

  // Handle selecting a conversation
  const handleSelectConversation = useCallback((conversationId: string) => {
    setSelectedContact(conversationId);

    // Get messages for this contact from allMessages
    const grouped = groupMessagesIntoConversations(allMessages);
    setCurrentMessages(grouped.get(conversationId) || []);

    // Mark as read
    markAsRead(conversationId);
  }, [allMessages, markAsRead]);

  // Handle sending a new message
  const handleSendMessage = async (messageText: string) => {
    if (!selectedContact || !messageText.trim()) return;

    setIsSending(true);
    setError(null);

    const { tenantId, channelId } = getTenantInfo();

    // Create optimistic message for immediate UI update
    const optimisticMessage: SMSMessage = {
      id: `temp-${Date.now()}`,
      customer_contact: selectedContact,
      message_text: messageText,
      direction: "outgoing",
      created_at: new Date().toISOString(),
    };

    // Optimistically add to UI
    setCurrentMessages(prev => [...prev, optimisticMessage]);
    setAllMessages(prev => [...prev, optimisticMessage]);

    // Update conversation list
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedContact
          ? { ...conv, lastMessage: messageText, timestamp: new Date().toISOString() }
          : conv
      )
    );

    try {
      const response = await axiosInstance.post(SMS_ENDPOINTS.SEND, {
        tenant_id: tenantId,
        channel_id: channelId,
        to: selectedContact,
        message_text: messageText,
      });

      // Replace optimistic message with real one if backend returns it
      if (response.data?.id) {
        const realMessage: SMSMessage = {
          ...optimisticMessage,
          id: response.data.id,
        };
        setCurrentMessages(prev =>
          prev.map(m => (m.id === optimisticMessage.id ? realMessage : m))
        );
        setAllMessages(prev =>
          prev.map(m => (m.id === optimisticMessage.id ? realMessage : m))
        );
      }
    } catch (err: unknown) {
      console.error("Failed to send message:", err);

      // Remove optimistic message on failure
      setCurrentMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      setAllMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));

      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  // Initial load and polling setup
  useEffect(() => {
    setMounted(true);
    fetchMessages(true);

    // Set up polling every 3 seconds
    pollingRef.current = setInterval(() => {
      fetchMessages(false);
    }, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [fetchMessages]);

  // Update current messages when selected contact changes
  useEffect(() => {
    if (selectedContact) {
      const grouped = groupMessagesIntoConversations(allMessages);
      setCurrentMessages(grouped.get(selectedContact) || []);
    }
  }, [selectedContact, allMessages]);

  const selectedConversation = conversations.find(c => c.id === selectedContact);

  // Prevent hydration mismatch by not rendering time-dependent content until mounted
  if (!mounted) {
    return (
      <div className="flex flex-col h-[calc(100vh-7rem)]">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SMS Inbox</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your SMS conversations</p>
        </div>
        <Card className="flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
          <CardContent className="p-0 h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SMS Inbox</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your SMS conversations</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2 text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <Card className="flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
        <CardContent className="p-0 h-full flex">
          {isLoading ? (
            // Loading State
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
              </div>
            </div>
          ) : conversations.length === 0 ? (
            // Empty State
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No messages yet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  When you receive SMS messages, they will appear here.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Left Sidebar - Conversation List */}
              <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-neutral-800 flex-shrink-0">
                <MessageList
                  conversations={conversations}
                  selectedConversationId={selectedContact}
                  onSelectConversation={handleSelectConversation}
                  formatRelativeTime={formatRelativeTime}
                />
              </div>

              {/* Right Panel - Conversation Thread */}
              <div className="hidden md:flex flex-1 flex-col bg-gray-50 dark:bg-neutral-900">
                {selectedConversation ? (
                  <>
                    <MessageThread
                      messages={currentMessages}
                      contactName={selectedConversation.contact}
                    />
                    <NewMessageInput
                      onSend={handleSendMessage}
                      isLoading={isSending}
                    />
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}