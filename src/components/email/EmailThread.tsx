"use client";

import { useEffect, useRef } from "react";
import { EmailMessageBubble } from "@/components/email/EmailMessageBubble";
import { EmailComposer } from "@/components/email/EmailComposer";
import { EmailThreadResponse } from "@/types/email";

interface EmailThreadProps {
  thread: EmailThreadResponse;
  onSendEmail: (data: { to: string; subject: string; body: string }) => void;
  isSending: boolean;
}

export function EmailThread({ thread, onSendEmail, isSending }: EmailThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages]);

  // Get the first message to determine recipient and subject for replies
  const firstMessage = thread.messages[0];
  const toAddress = firstMessage?.from_address || "";
  const subject = firstMessage?.subject.startsWith("Re: ") 
    ? firstMessage.subject 
    : `Re: ${firstMessage?.subject || ""}`;

  return (
    <div className="flex flex-col h-full">
      {/* Thread Header */}
      <div className="p-4 border-b bg-white rounded-t-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{firstMessage?.subject || "Email Thread"}</h2>
            <p className="text-gray-600">{toAddress}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              thread.status === "open" 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {thread.status}
            </span>
            {thread.escalated && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Escalated to human
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {thread.messages.map((message) => (
          <EmailMessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <EmailComposer
        threadId={thread.id}
        toAddress={toAddress}
        initialSubject={subject}
        onSubmit={onSendEmail}
        isSending={isSending}
      />
    </div>
  );
}