"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Paperclip, Smile } from "lucide-react";

interface NewMessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function NewMessageInput({
  onSend,
  isLoading,
  placeholder = "Type your message..."
}: NewMessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of 120px
      textarea.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  // Handle Enter key (send) and Shift+Enter (new line)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSend(message.trim());
        setMessage("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    }
  };

  const charCount = message.length;
  const maxChars = 1600; // SMS limit hint
  const isNearLimit = charCount > maxChars * 0.9;

  return (
    <div className="flex-shrink-0 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <form onSubmit={handleSubmit} className="p-4">
        {/* Character count warning */}
        {charCount > 0 && (
          <div className={`text-xs mb-2 text-right ${
            isNearLimit ? "text-amber-500" : "text-gray-400"
          }`}>
            {charCount} / {maxChars} characters
          </div>
        )}

        <div className="flex items-end gap-3">
          {/* Message Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full resize-none bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 rounded-xl pr-10 min-h-[44px] max-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              rows={1}
              disabled={isLoading}
            />

            {/* Emoji button (placeholder) */}
            <button
              type="button"
              className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Add emoji"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Attachment button (placeholder) */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            {/* Send button */}
            <Button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="h-11 px-5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Help text */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded text-gray-500 font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded text-gray-500 font-mono text-[10px]">Shift + Enter</kbd> for new line
        </p>
      </form>
    </div>
  );
}