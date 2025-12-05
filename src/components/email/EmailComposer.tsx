"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
      // Only reset body after sending, keep to and subject for replies
      setBody("");
    }
  };

  return (
    <div className="border-t p-4 bg-white rounded-b-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!threadId && (
          <>
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <Input
                id="to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                required
              />
            </div>
          </>
        )}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message here..."
            rows={4}
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSending || !to || !subject || !body}>
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </div>
      </form>
    </div>
  );
}