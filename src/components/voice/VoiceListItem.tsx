"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoiceCall } from "@/types/voice";

interface VoiceListItemProps {
  call: VoiceCall;
  onViewDetails: (id: string) => void;
}

export function VoiceListItem({ call, onViewDetails }: VoiceListItemProps) {
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
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4 font-medium">{call.from_contact}</td>
      <td className="p-4">
        <div className="max-w-xs truncate">
          {call.transcription.substring(0, 50)}
          {call.transcription.length > 50 ? "..." : ""}
        </div>
      </td>
      <td className="p-4">
        <Badge variant={getConfidenceVariant(call.confidence_score)}>
          {getConfidenceLabel(call.confidence_score)} ({Math.round(call.confidence_score * 100)}%)
        </Badge>
      </td>
      <td className="p-4">{formatDateTime(call.created_at)}</td>
      <td className="p-4">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(call.id)}>
          View Details
        </Button>
      </td>
    </tr>
  );
}