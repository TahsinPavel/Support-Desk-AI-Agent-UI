"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VoiceList } from "@/components/voice/VoiceList";
import { fetchVoiceHistory } from "@/lib/voiceApi";
import { VoiceHistoryResponse } from "@/types/voice";
import { useRouter } from "next/navigation";

export default function VoiceHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<VoiceHistoryResponse>({ items: [], total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;
  const totalPages = Math.ceil(history.total / pageSize);

  // Tenant and channel IDs (would come from context in a real app)
  const tenantId = "tenant_123";
  const channelId = "channel_voice";

  // Fetch voice history data
  const loadVoiceHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchVoiceHistory(tenantId, channelId, currentPage, pageSize);
      setHistory(data);
    } catch (err) {
      setError("Failed to load voice calls");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle call selection
  const handleCallSelect = (callId: string) => {
    router.push(`/dashboard/voice/${callId}`);
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

  // Load history on mount and when dependencies change
  useEffect(() => {
    loadVoiceHistory();
  }, [currentPage, filter]);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Voice Call History</h1>
          <p className="text-gray-500">Manage your voice call records</p>
        </div>

        <Card className="flex-1 flex flex-col">
          <CardContent className="p-0 flex-1 flex h-[calc(100vh-200px)]">
            <div className="flex items-center justify-center w-full h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Voice Call History</h1>
          <p className="text-gray-500">Manage your voice call records</p>
        </div>

        <Card className="flex-1 flex flex-col">
          <CardContent className="p-0 flex-1 flex h-[calc(100vh-200px)]">
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-red-500">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Voice Call History</h1>
        <p className="text-gray-500">Manage your voice call records</p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="p-0 flex-1 flex h-[calc(100vh-200px)]">
          <VoiceList
            history={history}
            currentPage={currentPage}
            totalPages={totalPages}
            filter={filter}
            onCallSelect={handleCallSelect}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}