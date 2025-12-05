"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VoiceListItem } from "@/components/voice/VoiceListItem";
import { VoiceHistoryResponse } from "@/types/voice";

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
    <div className="flex flex-col h-full">
      {/* Search and Filters */}
      <div className="p-4 border-b">
        <Input
          placeholder="Search calls..."
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

      {/* Calls Table */}
      <div className="flex-1 overflow-hidden">
        {filteredCalls.length > 0 ? (
          <div className="overflow-y-auto h-full">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="p-4 text-left font-medium text-gray-500">Caller</th>
                  <th className="p-4 text-left font-medium text-gray-500">Summary</th>
                  <th className="p-4 text-left font-medium text-gray-500">Confidence</th>
                  <th className="p-4 text-left font-medium text-gray-500">Date/Time</th>
                  <th className="p-4 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
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
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No calls found</p>
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