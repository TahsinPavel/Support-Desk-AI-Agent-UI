"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Appointment } from "@/types/appointments";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
  getDay,
} from "date-fns";

interface ApptCalendarProps {
  appointments: Appointment[];
  loading: boolean;
  onDayClick: (date: Date) => void;
  selectedDate: Date | null;
}

export function ApptCalendar({
  appointments,
  loading,
  onDayClick,
  selectedDate,
}: ApptCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Group appointments by day
  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointments.forEach((appt) => {
      try {
        const dateKey = format(parseISO(appt.requested_time), "yyyy-MM-dd");
        const existing = map.get(dateKey) || [];
        map.set(dateKey, [...existing, appt]);
      } catch {
        // Skip invalid dates
      }
    });
    return map;
  }, [appointments]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Add padding for week start (Sunday = 0)
    const startPadding = getDay(start);
    const paddedDays: (Date | null)[] = [
      ...Array(startPadding).fill(null),
      ...days,
    ];
    
    return paddedDays;
  }, [currentMonth]);

  if (loading) {
    return <ApptCalendarSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {format(currentMonth, "MMMM yyyy")}
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          <AnimatePresence mode="wait">
            {calendarDays.map((day, idx) => (
              <CalendarDay
                key={day ? day.toISOString() : `pad-${idx}`}
                day={day}
                currentMonth={currentMonth}
                appointments={
                  day ? appointmentsByDay.get(format(day, "yyyy-MM-dd")) || [] : []
                }
                isSelected={day && selectedDate ? isSameDay(day, selectedDate) : false}
                onClick={onDayClick}
              />
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

interface CalendarDayProps {
  day: Date | null;
  currentMonth: Date;
  appointments: Appointment[];
  isSelected: boolean;
  onClick: (date: Date) => void;
}

function CalendarDay({
  day,
  currentMonth,
  appointments,
  isSelected,
  onClick,
}: CalendarDayProps) {
  if (!day) {
    return <div className="h-12" />;
  }

  const inMonth = isSameMonth(day, currentMonth);
  const today = isToday(day);
  const hasAppointments = appointments.length > 0;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => onClick(day)}
      className={`
        h-12 flex flex-col items-center justify-center rounded-lg
        transition-colors relative
        ${!inMonth ? "text-muted-foreground/50" : ""}
        ${today ? "bg-primary/10 font-bold" : ""}
        ${isSelected ? "ring-2 ring-primary bg-primary/20" : "hover:bg-muted"}
      `}
    >
      <span className={today ? "text-primary" : ""}>{format(day, "d")}</span>
      {hasAppointments && (
        <div className="flex gap-0.5 mt-0.5">
          {appointments.length <= 3 ? (
            appointments.slice(0, 3).map((a, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${getStatusColor(a.status)}`}
              />
            ))
          ) : (
            <Badge variant="secondary" className="text-[10px] h-4 px-1">
              {appointments.length}
            </Badge>
          )}
        </div>
      )}
    </motion.button>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case "confirmed": return "bg-green-500";
    case "pending": return "bg-amber-500";
    case "completed": return "bg-purple-500";
    case "canceled": return "bg-red-500";
    case "no_show": return "bg-gray-500";
    default: return "bg-blue-500";
  }
}

function ApptCalendarSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {[...Array(35)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

