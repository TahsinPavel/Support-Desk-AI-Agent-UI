"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, RefreshCw } from "lucide-react";

interface EmailReplyBoxProps {
  toEmail: string;
  subject: string;
  onSend: (message: string) => Promise<void>;
  isSending: boolean;
}

export function EmailReplyBox({
  toEmail,
  subject,
  onSend,
  isSending,
}: EmailReplyBoxProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      await onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>To: {toEmail}</span>
          <span className="text-gray-400">•</span>
          <span>Subject: {subject}</span>
        </div>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reply..."
          rows={4}
          className="min-h-[100px] bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press Ctrl+Enter to send
          </p>
          <Button
            type="submit"
            disabled={!message.trim() || isSending}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            {isSending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Reply
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Keep EmailComposer for backwards compatibility
interface EmailComposerProps {
  threadId?: string;
  toAddress?: string;
  initialSubject?: string;
  onSubmit: (data: { to: string; subject: string; body: string }) => void;
  isSending: boolean;
}

export function EmailComposer({
  threadId,
  toAddress = "",
  initialSubject = "",
  onSubmit,
  isSending,
}: EmailComposerProps) {
  const [to, setTo] = useState(toAddress);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (to && subject && body) {
      onSubmit({ to, subject, body });
      setBody("");
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!threadId && (
          <>
            <div>
              <Label htmlFor="to" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                To
              </Label>
              <Input
                id="to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="mt-1 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700"
                required
              />
            </div>
            <div>
              <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="mt-1 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700"
                required
              />
            </div>
          </>
        )}
        <div>
          <Label htmlFor="body" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Message
          </Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message here..."
            rows={4}
            className="mt-1 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700"
            required
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSending || !to || !subject || !body}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            {isSending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}