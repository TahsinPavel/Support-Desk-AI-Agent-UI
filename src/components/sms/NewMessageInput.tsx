"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface NewMessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function NewMessageInput({ onSend, isLoading }: NewMessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 resize-none"
        rows={1}
        disabled={isLoading}
      />
      <Button type="submit" disabled={!message.trim() || isLoading}>
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}