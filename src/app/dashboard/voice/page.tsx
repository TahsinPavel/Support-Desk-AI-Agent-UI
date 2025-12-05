"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { VoiceCall } from "@/types/voice";

// ShadCN UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import {
  Phone,
  PhoneIncoming,
  Bot,
  User,
  Calendar,
  Search,
  RefreshCw,
  AlertCircle,
  Mic,
  Clock,
  TrendingUp,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function VoiceLogsPage() {
  const router = useRouter();

  // State
  const [logs, setLogs] = useState<VoiceCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "7days" | "30days">("all");
  const [confidenceFilter, setConfidenceFilter] = useState<"all" | "high" | "medium" | "low">("all");

  // Expanded rows for viewing full transcription
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Check auth and redirect if no token
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/signin");
    }
  }, [router]);

  // Fetch voice logs from API
  const fetchVoiceLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get("/voice/logs");

      // Handle different response formats
      let data: VoiceCall[] = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.items) {
        data = response.data.items;
      } else if (response.data?.data) {
        data = response.data.data;
      }

      setLogs(data);
    } catch (err: unknown) {
      console.error("Failed to fetch voice logs:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load voice call logs. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load logs on mount
  useEffect(() => {
    if (mounted) {
      fetchVoiceLogs();
    }
  }, [mounted, fetchVoiceLogs]);

  // Filter logs based on criteria
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          log.from_contact?.toLowerCase().includes(query) ||
          log.transcription?.toLowerCase().includes(query) ||
          log.ai_response?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Date filter
      if (dateFilter !== "all") {
        const logDate = new Date(log.created_at);
        const now = new Date();
        const daysAgo = dateFilter === "7days" ? 7 : 30;
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        if (logDate < cutoffDate) return false;
      }

      // Confidence filter
      if (confidenceFilter !== "all") {
        const confidence = log.confidence_score ?? 0;
        if (confidenceFilter === "high" && confidence < 0.8) return false;
        if (confidenceFilter === "medium" && (confidence < 0.5 || confidence >= 0.8)) return false;
        if (confidenceFilter === "low" && confidence >= 0.5) return false;
      }

      return true;
    });
  }, [logs, searchQuery, dateFilter, confidenceFilter]);

  // Format phone number
  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return "Unknown";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned[0] === "1") {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    if (!mounted) return "";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString(undefined, {
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

  // Get confidence badge color
  const getConfidenceBadge = (score: number) => {
    const percentage = Math.round(score * 100);
    if (score >= 0.8) {
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">
          <TrendingUp className="w-3 h-3 mr-1" />
          {percentage}% High
        </Badge>
      );
    }
    if (score >= 0.5) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100">
          {percentage}% Medium
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100">
        {percentage}% Low
      </Badge>
    );
  };

  // Toggle row expansion
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number = 100): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Stats
  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const highConfidence = filteredLogs.filter((l) => l.confidence_score >= 0.8).length;
    const avgConfidence = total > 0
      ? filteredLogs.reduce((sum, l) => sum + (l.confidence_score || 0), 0) / total
      : 0;
    return { total, highConfidence, avgConfidence };
  }, [filteredLogs]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-7rem)]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Voice Call Logs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and analyze your voice call transcriptions</p>
        </div>
        <Card className="flex-1 flex items-center justify-center rounded-xl border border-gray-200 dark:border-neutral-800">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 animate-pulse" />
              <Mic className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading voice call logs...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Voice Call Logs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View and analyze your voice call transcriptions
          </p>
        </div>
        <Button
          onClick={fetchVoiceLogs}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-xl border border-gray-200 dark:border-neutral-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Calls</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-gray-200 dark:border-neutral-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highConfidence}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">High Confidence</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-gray-200 dark:border-neutral-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(stats.avgConfidence * 100)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Confidence</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-xl border border-gray-200 dark:border-neutral-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search calls, transcriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700"
              />
            </div>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as typeof dateFilter)}>
              <SelectTrigger className="w-full sm:w-[160px] bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>

            {/* Confidence Filter */}
            <Select value={confidenceFilter} onValueChange={(v) => setConfidenceFilter(v as typeof confidenceFilter)}>
              <SelectTrigger className="w-full sm:w-[160px] bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence</SelectItem>
                <SelectItem value="high">High (≥80%)</SelectItem>
                <SelectItem value="medium">Medium (50-79%)</SelectItem>
                <SelectItem value="low">Low (&lt;50%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Call Logs Table/List */}
      <Card className="flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800">
        <CardHeader className="border-b border-gray-200 dark:border-neutral-800 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <PhoneIncoming className="w-5 h-5 text-green-500" />
            Call Logs
          </CardTitle>
          <CardDescription>
            {filteredLogs.length} {filteredLogs.length === 1 ? "call" : "calls"} found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                No voice calls found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                {searchQuery || dateFilter !== "all" || confidenceFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Voice call logs will appear here once calls are received."}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-32rem)]">
              <div className="divide-y divide-gray-200 dark:divide-neutral-800">
                {filteredLogs.map((log) => {
                  const isExpanded = expandedRows.has(log.id);
                  return (
                    <div
                      key={log.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      {/* Main Row */}
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Caller Info */}
                        <div className="flex items-center gap-3 lg:w-48 flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatPhoneNumber(log.from_contact)}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              {mounted && formatTimestamp(log.created_at)}
                            </div>
                          </div>
                        </div>

                        {/* Transcription & AI Response */}
                        <div className="flex-1 space-y-3">
                          {/* Transcription */}
                          <div className="flex gap-2">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-0.5">
                                Caller
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {isExpanded
                                  ? log.transcription
                                  : truncateText(log.transcription, 120)}
                              </p>
                            </div>
                          </div>

                          {/* AI Response */}
                          {log.ai_response && (
                            <div className="flex gap-2">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Bot className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-0.5">
                                  AI Response
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {isExpanded
                                    ? log.ai_response
                                    : truncateText(log.ai_response, 120)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Confidence & Actions */}
                        <div className="flex items-center gap-3 lg:flex-col lg:items-end lg:w-32 flex-shrink-0">
                          {getConfidenceBadge(log.confidence_score)}
                          {(log.transcription?.length > 120 || log.ai_response?.length > 120) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRow(log.id)}
                              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-3 h-3 mr-1" />
                                  Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3 mr-1" />
                                  More
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}