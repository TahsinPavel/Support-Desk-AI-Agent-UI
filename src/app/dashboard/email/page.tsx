"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { getEmails, sendEmail } from "@/lib/emailApi";
import { EmailMessage } from "@/types/email";

// ShadCN UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Icons
import {
  Mail,
  MailOpen,
  Send,
  Search,
  RefreshCw,
  AlertCircle,
  User,
  Bot,
  Clock,
  ArrowLeft,
  Inbox,
  ChevronRight,
} from "lucide-react";

export default function EmailInboxPage() {
  const router = useRouter();

  // State
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "incoming" | "outgoing">("all");

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Check auth on mount
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/signin");
    }
  }, [router]);

  // Get tenant ID from localStorage
  const getTenantId = useCallback((): string => {
    if (typeof window === "undefined") return "";
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return user.tenant_id || user.tenantId || "";
      }
    } catch {
      console.error("Failed to parse user data");
    }
    return "";
  }, []);

  // Fetch emails
  const fetchEmails = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const data = await getEmails();
      setEmails(data);

      // Update selected email if it exists in new data
      if (selectedEmail) {
        const updated = data.find((e) => e.id === selectedEmail.id);
        if (updated) {
          setSelectedEmail(updated);
        }
      }
    } catch (err: unknown) {
      console.error("Failed to fetch emails:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load emails. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedEmail]);

  // Initial load and polling
  useEffect(() => {
    if (mounted) {
      fetchEmails();

      // Auto-refresh every 5 seconds
      pollingRef.current = setInterval(() => {
        fetchEmails(false);
      }, 5000);

      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    }
  }, [mounted, fetchEmails]);

  // Scroll to bottom when viewing thread
  useEffect(() => {
    if (selectedEmail) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedEmail]);

  // Filter emails
  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          email.subject?.toLowerCase().includes(query) ||
          email.from_email?.toLowerCase().includes(query) ||
          email.message_text?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Direction filter
      if (filter !== "all" && email.direction !== filter) {
        return false;
      }

      return true;
    });
  }, [emails, searchQuery, filter]);

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    if (!mounted) return "";
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
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return timestamp;
    }
  };

  // Format full date
  const formatFullDate = (timestamp: string): string => {
    if (!mounted) return "";
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

  // Get preview text
  const getPreviewText = (text: string, maxLength = 80): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  // Handle send reply
  const handleSendReply = async () => {
    if (!selectedEmail || !replyText.trim()) return;

    const tenantId = getTenantId();
    if (!tenantId) {
      setSendError("Tenant ID not found. Please log in again.");
      return;
    }

    setIsSending(true);
    setSendError(null);

    try {
      await sendEmail({
        tenant_id: tenantId,
        to_email: selectedEmail.from_email,
        subject: selectedEmail.subject.startsWith("Re: ")
          ? selectedEmail.subject
          : `Re: ${selectedEmail.subject}`,
        message: replyText,
      });

      setReplyText("");
      // Refresh emails to show the sent reply
      await fetchEmails(false);
    } catch (err: unknown) {
      console.error("Failed to send email:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send email. Please try again.";
      setSendError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  // Loading skeleton
  if (loading && emails.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100vh-7rem)] gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Inbox</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your email conversations
          </p>
        </div>
        <Card className="flex-1 rounded-xl border border-gray-200 dark:border-neutral-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Inbox</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your email conversations
          </p>
        </div>
        <Button
          onClick={() => fetchEmails()}
          variant="outline"
          className="w-fit"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-red-200 dark:border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content - Split View */}
      <Card className="flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800">
        <div className="flex h-full">
          {/* Left Panel - Email List */}
          <div
            className={`${
              selectedEmail ? "hidden md:flex" : "flex"
            } flex-col w-full md:w-96 lg:w-[420px] border-r border-gray-200 dark:border-neutral-800`}
          >
            {/* Search & Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700"
                />
              </div>
              <div className="flex gap-2">
                {(["all", "incoming", "outgoing"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filter === f
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                        : "bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Email List */}
            <ScrollArea className="flex-1">
              {filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                    <Inbox className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    No emails found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-8">
                    {searchQuery || filter !== "all"
                      ? "Try adjusting your search or filters"
                      : "Your inbox is empty"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedEmail?.id === email.id
                          ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500"
                          : "hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                          {email.from_email?.charAt(0).toUpperCase() || "?"}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white truncate text-sm">
                              {email.from_email}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                              {mounted && formatTimestamp(email.created_at)}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {email.subject}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {getPreviewText(email.message_text)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
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
                            {email.ai_response && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                              >
                                <Bot className="w-3 h-3 mr-1" />
                                AI Response
                              </Badge>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Stats Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {filteredEmails.length} email{filteredEmails.length !== 1 ? "s" : ""} •
                Auto-refreshing every 5s
              </p>
            </div>
          </div>

          {/* Right Panel - Email Thread */}
          <div
            className={`${
              selectedEmail ? "flex" : "hidden md:flex"
            } flex-1 flex-col bg-gray-50 dark:bg-neutral-900/50`}
          >
            {selectedEmail ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <div className="flex items-start gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedEmail(null)}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {selectedEmail.subject}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          From: {selectedEmail.from_email}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          To: {selectedEmail.to_email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        {mounted && formatFullDate(selectedEmail.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <ScrollArea className="flex-1 p-4">
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
                              {selectedEmail.from_email}
                            </CardTitle>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Customer Message
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {selectedEmail.message_text}
                        </p>
                      </CardContent>
                    </Card>

                    {/* AI Response */}
                    {selectedEmail.ai_response && (
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
                            {selectedEmail.ai_response}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Reply Box */}
                <div className="p-4 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  {sendError && (
                    <Alert variant="destructive" className="mb-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{sendError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex flex-col gap-3">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[100px] bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Press Ctrl+Enter to send
                      </p>
                      <Button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || isSending}
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
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                  <MailOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Select an email
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                  Choose an email from the list to view its content and reply
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}