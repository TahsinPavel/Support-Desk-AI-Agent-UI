"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VoiceDetailResponse } from "@/types/voice";

interface VoiceDetailProps {
  call: VoiceDetailResponse;
  onBack: () => void;
}

export function VoiceDetail({ call, onBack }: VoiceDetailProps) {
  // Format the timestamp to a readable format
  const formatDateTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return "";
    }
  };

  // Get confidence badge variant based on score
  const getConfidenceVariant = (score: number) => {
    if (score >= 0.8) return "default"; // green
    if (score >= 0.6) return "secondary"; // yellow
    return "destructive"; // red
  };

  // Get confidence label based on score
  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return "High";
    if (score >= 0.6) return "Medium";
    return "Low";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Call Details</h1>
            <p className="text-gray-600 mt-1">{call.from_contact}</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            Back to List
          </Button>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-500">Date/Time</p>
            <p className="font-medium">{formatDateTime(call.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Confidence</p>
            <Badge variant={getConfidenceVariant(call.confidence_score)}>
              {getConfidenceLabel(call.confidence_score)} ({Math.round(call.confidence_score * 100)}%)
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Transcription Panel */}
          <div className="border rounded-xl p-4 flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-3">Transcription</h2>
            <ScrollArea className="flex-1">
              <div className="pr-4">
                <p className="whitespace-pre-wrap">{call.transcription}</p>
              </div>
            </ScrollArea>
          </div>

          {/* AI Response Panel */}
          <div className="border rounded-xl p-4 flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-3">AI Response</h2>
            <ScrollArea className="flex-1">
              <div className="pr-4">
                <p className="whitespace-pre-wrap">{call.ai_response}</p>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Play Button Placeholder */}
        <div className="mt-6 p-4 border rounded-xl text-center">
          <p className="text-gray-500 mb-3">Audio playback will be available in a future update</p>
          <Button variant="outline" disabled>
            Play Audio
          </Button>
        </div>
      </div>
    </div>
  );
}