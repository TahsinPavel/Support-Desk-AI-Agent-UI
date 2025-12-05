"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EmailList } from "@/components/email/EmailList";
import { 
  fetchInbox 
} from "@/lib/emailApi";
import { EmailInboxResponse } from "@/types/email";
import { useRouter } from "next/navigation";

export default function EmailInboxPage() {
  const router = useRouter();
  const [inbox, setInbox] = useState<EmailInboxResponse>({ items: [], total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;
  const totalPages = Math.ceil(inbox.total / pageSize);

  // Tenant and channel IDs (would come from context in a real app)
  const tenantId = "tenant_123";
  const channelId = "channel_email";

  // Fetch inbox data
  const loadInbox = async () => {
    try {
      setLoading(true);
      const data = await fetchInbox(tenantId, channelId, currentPage, pageSize);
      setInbox(data);
    } catch (err) {
      setError("Failed to load emails");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle email selection
  const handleEmailSelect = (emailId: string) => {
    router.push(`/dashboard/email/${emailId}`);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Load inbox on mount and when dependencies change
  useEffect(() => {
    loadInbox();
  }, [currentPage, filter]);

  // Auto-refresh inbox every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadInbox();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Email Inbox</h1>
        <p className="text-gray-500">Manage your email conversations</p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="p-0 flex-1 flex h-[calc(100vh-200px)]">
          {loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <EmailList
              inbox={inbox}
              currentPage={currentPage}
              totalPages={totalPages}
              filter={filter}
              onEmailSelect={handleEmailSelect}
              onPageChange={handlePageChange}
              onFilterChange={handleFilterChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}