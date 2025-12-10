"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EmailThread } from "@/components/email/EmailThread";
import { 
  fetchThread,
  sendEmail
} from "@/lib/emailApi";
import { EmailThreadResponse } from "@/types/email";
import { useParams } from "next/navigation";

export default function EmailThreadPage() {
  const params = useParams();
  const threadId = params.threadId as string;
  
  const [thread, setThread] = useState<EmailThreadResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);

  // Tenant and channel IDs (would come from context in a real app)
  const tenantId = "tenant_123";
  const channelId = "channel_email";

  // Fetch thread data
  const loadThread = async () => {
    try {
      setLoading(true);
      const data = await fetchThread(threadId);
      setThread(data);
    } catch (err) {
      setError("Failed to load email thread");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending email
  const handleSendEmail = async (data: { to: string; subject: string; body: string }) => {
    try {
      setIsSending(true);
      await sendEmail({
        tenant_id: tenantId,
        to_email: data.to,
        subject: data.subject,
        message: data.body,
      });
      
      // Reload thread to show new message
      await loadThread();
    } catch (err) {
      setError("Failed to send email");
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  // Load thread on mount
  useEffect(() => {
    if (threadId) {
      loadThread();
    }
  }, [threadId]);

  // Auto-refresh thread every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (threadId) {
        loadThread();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [threadId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Email thread not found</p>
      </div>
    );
  }

  // For now, just display the first message in the thread
  // A proper implementation would display all messages in the thread
  const firstMessage = thread.messages[0];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Email Thread</h1>
        <p className="text-gray-500">Conversation with {firstMessage?.from_email}</p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="p-0 flex-1 flex h-[calc(100vh-200px)]">
          {firstMessage && (
            <EmailThread email={firstMessage} />
          )}
        </CardContent>
      </Card>

      {/* AI Typing Indicator */}
      {isAITyping && (
        <div className="fixed bottom-20 right-6 bg-white border rounded-lg shadow-lg p-3">
          <div className="flex items-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <span className="ml-2 text-sm text-gray-600">AI is typing...</span>
          </div>
        </div>
      )}
    </div>
  );
}