"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DATE_RANGES } from "@/types/appointments";
import { Calendar, Plus, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface ApptHeaderProps {
  selectedRange: number;
  onRangeChange: (days: number) => void;
  onCreateClick: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function ApptHeader({
  selectedRange,
  onRangeChange,
  onCreateClick,
  onRefresh,
  isRefreshing,
}: ApptHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground text-sm">
            Manage and track customer appointments
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Date Range Selector */}
        <Select
          value={selectedRange.toString()}
          onValueChange={(v) => onRangeChange(parseInt(v))}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGES.map((range) => (
              <SelectItem key={range.days} value={range.days.toString()}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>

        {/* Create Button */}
        <Button onClick={onCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Appointment</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>
    </motion.div>
  );
}

