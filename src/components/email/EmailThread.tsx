"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailMessage } from "@/types/email";
import { User, Bot, Clock } from "lucide-react";

interface EmailThreadProps {
  email: EmailMessage;
}

export function EmailThread({ email }: EmailThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [email]);

  // Format timestamp
  const formatFullDate = (timestamp: string): string => {
    try {
      return new Date(timestamp).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Thread Header */}
      <div className="p-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {email.subject}
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            From: {email.from_email}
          </span>
          <span className="text-gray-400">→</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            To: {email.to_email}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          {formatFullDate(email.created_at)}
        </div>
      </div>

      {/* Message Content */}
      <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-neutral-900/50">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Original Message */}
          <Card className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">
                    {email.from_email}
                  </CardTitle>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Customer Message
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {email.message_text}
              </p>
            </CardContent>
          </Card>

          {/* AI Response */}
          {email.ai_response && (
            <Card className="rounded-xl border border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-900/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      AI Assistant
                    </CardTitle>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      Automated Response
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-purple-800 dark:text-purple-200 whitespace-pre-wrap">
                  {email.ai_response}
                </p>
              </CardContent>
            </Card>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}