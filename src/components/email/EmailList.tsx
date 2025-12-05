"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Mail, Bot } from "lucide-react";
import { EmailMessage } from "@/types/email";

interface EmailListProps {
  emails: EmailMessage[];
  selectedId?: string;
  onEmailSelect: (email: EmailMessage) => void;
}

export function EmailList({
  emails,
  selectedId,
  onEmailSelect,
}: EmailListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return "";
    }
  };

  // Filter emails based on search term
  const filteredEmails = emails.filter(email =>
    email.from_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.message_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700"
          />
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-neutral-800">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedId === email.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500"
                    : "hover:bg-gray-50 dark:hover:bg-neutral-800"
                }`}
                onClick={() => onEmailSelect(email)}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                    {email.from_email?.charAt(0).toUpperCase() || "?"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                        {email.from_email}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          email.direction === "incoming"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        }`}
                      >
                        {email.direction === "incoming" ? "Incoming" : "Sent"}
                      </Badge>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                      {email.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {email.message_text?.substring(0, 80)}...
                    </p>
                    {email.ai_response && (
                      <Badge
                        variant="secondary"
                        className="text-xs mt-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      >
                        <Bot className="w-3 h-3 mr-1" />
                        AI Response
                      </Badge>
                    )}
                  </div>

                  {/* Time */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
                    {formatRelativeTime(email.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No emails found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Try adjusting your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}