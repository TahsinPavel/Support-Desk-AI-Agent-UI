"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoiceCall } from "@/types/voice";
import { Phone, Eye } from "lucide-react";

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

  // Get confidence badge styling based on score
  const getConfidenceStyle = (score: number) => {
    if (score >= 0.8) return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
    if (score >= 0.6) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
    return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
  };

  // Get confidence label based on score
  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return "High";
    if (score >= 0.6) return "Medium";
    return "Low";
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white flex-shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{call.from_contact}</span>
        </div>
      </td>
      <td className="p-4">
        <div className="max-w-xs text-gray-600 dark:text-gray-400 truncate">
          {call.transcription.substring(0, 50)}
          {call.transcription.length > 50 ? "..." : ""}
        </div>
      </td>
      <td className="p-4">
        <Badge className={`${getConfidenceStyle(call.confidence_score)} border-0`}>
          {getConfidenceLabel(call.confidence_score)} ({Math.round(call.confidence_score * 100)}%)
        </Badge>
      </td>
      <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">{formatDateTime(call.created_at)}</td>
      <td className="p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(call.id)}
          className="gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </Button>
      </td>
    </tr>
  );
}