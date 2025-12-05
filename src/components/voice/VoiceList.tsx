"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VoiceListItem } from "@/components/voice/VoiceListItem";
import { VoiceHistoryResponse } from "@/types/voice";
import { Search, ChevronLeft, ChevronRight, Phone } from "lucide-react";

interface VoiceListProps {
  history: VoiceHistoryResponse;
  currentPage: number;
  totalPages: number;
  filter: string;
  onCallSelect: (callId: string) => void;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: string) => void;
}

export function VoiceList({
  history,
  currentPage,
  totalPages,
  filter,
  onCallSelect,
  onPageChange,
  onFilterChange,
}: VoiceListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter calls based on search term
  const filteredCalls = history.items.filter(call =>
    call.from_contact.includes(searchTerm) ||
    call.transcription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter options
  const filterOptions = [
    { value: "all", label: "All" },
    { value: "missed", label: "Missed" },
    { value: "completed", label: "Completed" },
    { value: "low", label: "Low Confidence" },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search calls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === option.value
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calls Table */}
      <div className="flex-1 overflow-hidden">
        {filteredCalls.length > 0 ? (
          <div className="overflow-y-auto h-full">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-800 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Caller</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Summary</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confidence</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date/Time</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                {filteredCalls.map((call) => (
                  <VoiceListItem
                    key={call.id}
                    call={call}
                    onViewDetails={onCallSelect}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <Phone className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No calls found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-900">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}