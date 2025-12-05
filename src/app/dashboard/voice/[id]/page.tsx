"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VoiceDetail } from "@/components/voice/VoiceDetail";
import { fetchVoiceDetail } from "@/lib/voiceApi";
import { VoiceDetailResponse } from "@/types/voice";
import { useRouter, useParams } from "next/navigation";

export default function VoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const callId = params.id as string;
  
  const [call, setCall] = useState<VoiceDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch call detail data
  const loadCallDetail = async () => {
    try {
      setLoading(true);
      const data = await fetchVoiceDetail(callId);
      setCall(data);
    } catch (err) {
      setError("Failed to load call details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Load call detail on mount
  useEffect(() => {
    if (callId) {
      loadCallDetail();
    }
  }, [callId]);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Call Details</h1>
          <p className="text-gray-500">Voice call transcription and AI response</p>
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
          <h1 className="text-3xl font-bold">Call Details</h1>
          <p className="text-gray-500">Voice call transcription and AI response</p>
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

  if (!call) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Call Details</h1>
          <p className="text-gray-500">Voice call transcription and AI response</p>
        </div>

        <Card className="flex-1 flex flex-col">
          <CardContent className="p-0 flex-1 flex h-[calc(100vh-200px)]">
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-gray-500">Call not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Call Details</h1>
        <p className="text-gray-500">Voice call transcription and AI response</p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="p-0 flex-1 flex h-[calc(100vh-200px)]">
          <VoiceDetail call={call} onBack={handleBack} />
        </CardContent>
      </Card>
    </div>
  );
}