"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Appointment, AppointmentStatus } from "@/types/appointments";
import { Search, Filter, User, Phone, Mail, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ApptListProps {
  appointments: Appointment[];
  loading: boolean;
  selectedDate: Date | null;
  onAppointmentClick: (appointment: Appointment) => void;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" },
  { value: "no_show", label: "No Show" },
];

export function ApptList({
  appointments,
  loading,
  selectedDate,
  onAppointmentClick,
}: ApptListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter appointments
  const filtered = useMemo(() => {
    let result = [...appointments];

    // Filter by selected date
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      result = result.filter((a) => {
        try {
          return format(parseISO(a.requested_time), "yyyy-MM-dd") === dateStr;
        } catch {
          return false;
        }
      });
    }

    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.customer_name.toLowerCase().includes(q) ||
          a.service.toLowerCase().includes(q) ||
          a.customer_email?.toLowerCase().includes(q) ||
          a.customer_phone?.includes(q)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    // Sort by requested time (newest first)
    result.sort((a, b) => 
      new Date(b.requested_time).getTime() - new Date(a.requested_time).getTime()
    );

    return result;
  }, [appointments, selectedDate, search, statusFilter]);

  if (loading) {
    return <ApptListSkeleton />;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Appointments
          {selectedDate && (
            <Badge variant="secondary">
              {format(selectedDate, "MMM d")}
            </Badge>
          )}
        </CardTitle>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customer, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[400px] px-4 pb-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mb-4 opacity-50" />
              <p>No appointments found</p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-2">
                {filtered.map((appt, i) => (
                  <AppointmentRow
                    key={appt.id}
                    appointment={appt}
                    index={i}
                    onClick={() => onAppointmentClick(appt)}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface AppointmentRowProps {
  appointment: Appointment;
  index: number;
  onClick: () => void;
}

function AppointmentRow({ appointment, index, onClick }: AppointmentRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ delay: index * 0.03 }}
    >
      <Button
        variant="ghost"
        className="w-full h-auto p-3 justify-start hover:bg-muted"
        onClick={onClick}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full text-left">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="font-medium truncate">{appointment.customer_name}</span>
              <StatusBadge status={appointment.status} />
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {appointment.service}
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDateTime(appointment.requested_time)}
            </div>
            {appointment.customer_phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {appointment.customer_phone}
              </div>
            )}
          </div>
        </div>
      </Button>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const variants: Record<AppointmentStatus, { class: string; label: string }> = {
    pending: { class: "bg-amber-500/20 text-amber-700 dark:text-amber-400", label: "Pending" },
    confirmed: { class: "bg-green-500/20 text-green-700 dark:text-green-400", label: "Confirmed" },
    completed: { class: "bg-purple-500/20 text-purple-700 dark:text-purple-400", label: "Completed" },
    canceled: { class: "bg-red-500/20 text-red-700 dark:text-red-400", label: "Canceled" },
    no_show: { class: "bg-gray-500/20 text-gray-700 dark:text-gray-400", label: "No Show" },
  };
  const v = variants[status] || variants.pending;
  return <Badge className={`${v.class} text-[10px] px-1.5 py-0`}>{v.label}</Badge>;
}

function formatDateTime(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, h:mm a");
  } catch {
    return iso;
  }
}

function ApptListSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
