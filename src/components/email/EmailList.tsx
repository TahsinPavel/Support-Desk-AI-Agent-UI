"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmailInboxResponse } from "@/types/email";

interface EmailListProps {
  inbox: EmailInboxResponse;
  currentPage: number;
  totalPages: number;
  filter: string;
  onEmailSelect: (emailId: string) => void;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: string) => void;
}

export function EmailList({
  inbox,
  currentPage,
  totalPages,
  filter,
  onEmailSelect,
  onPageChange,
  onFilterChange,
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
    } catch (e) {
      return "";
    }
  };

  // Filter emails based on search term
  const filteredEmails = inbox.items.filter(email =>
    email.from_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter options
  const filterOptions = [
    { value: "all", label: "All" },
    { value: "incoming", label: "Incoming" },
    { value: "sent", label: "Sent" },
    { value: "ai", label: "AI Responded" },
    { value: "human", label: "Human Escalated" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filters */}
      <div className="p-4 border-b">
        <Input
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === option.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.length > 0 ? (
          <div className="divide-y">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => onEmailSelect(email.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{email.from_address}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {email.direction === "incoming" ? "Incoming" : "Sent"}
                      </Badge>
                    </div>
                    <p className="font-medium truncate">{email.subject}</p>
                    <p className="text-sm text-gray-600 truncate">{email.body.substring(0, 100)}...</p>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap ml-2">
                    {formatRelativeTime(email.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No emails found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t flex justify-between items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}