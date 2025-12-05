"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  getAppointments,
  getAppointmentSummary,
  updateAppointment,
  createAppointment,
} from "@/lib/appointmentsApi";
import {
  Appointment,
  AppointmentSummary,
  AppointmentUpdateData,
  AppointmentFormData,
  ComputedAppointmentStats,
  DayCount,
} from "@/types/appointments";
import { format, parseISO, isWithinInterval, subDays, startOfDay } from "date-fns";

const REFRESH_INTERVAL = 10000; // 10 seconds

export function useAppointments(rangeDays: number = 30) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [summary, setSummary] = useState<AppointmentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch appointments and summary
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    try {
      setError(null);
      const [appts, sum] = await Promise.all([
        getAppointments(),
        getAppointmentSummary(rangeDays),
      ]);
      setAppointments(appts);
      setSummary(sum);
      setLoading(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch appointments";
      setError(message);
      setLoading(false);
    }
  }, [router, rangeDays]);

  // Compute stats from appointments if summary not available
  const computedStats = useMemo((): ComputedAppointmentStats => {
    const now = new Date();
    const rangeStart = startOfDay(subDays(now, rangeDays));
    
    const filtered = appointments.filter((a) => {
      try {
        const date = parseISO(a.requested_time);
        return isWithinInterval(date, { start: rangeStart, end: now });
      } catch {
        return false;
      }
    });

    const byDayMap = new Map<string, number>();
    filtered.forEach((a) => {
      const dateStr = format(parseISO(a.requested_time), "yyyy-MM-dd");
      byDayMap.set(dateStr, (byDayMap.get(dateStr) || 0) + 1);
    });

    const byDay: DayCount[] = Array.from(byDayMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      total: filtered.length,
      confirmed: filtered.filter((a) => a.status === "confirmed").length,
      pending: filtered.filter((a) => a.status === "pending").length,
      completed: filtered.filter((a) => a.status === "completed").length,
      canceled: filtered.filter((a) => a.status === "canceled").length,
      noShow: filtered.filter((a) => a.status === "no_show").length,
      byDay,
    };
  }, [appointments, rangeDays]);

  // Use summary if available, otherwise use computed stats
  const stats = useMemo(() => {
    if (summary) {
      return {
        total: summary.total,
        confirmed: summary.confirmed,
        pending: summary.pending,
        completed: summary.completed,
        canceled: summary.canceled,
        noShow: summary.no_show,
        byDay: summary.by_day,
      };
    }
    return computedStats;
  }, [summary, computedStats]);

  // Update appointment
  const update = useCallback(async (id: string, data: AppointmentUpdateData) => {
    // Optimistic update
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
    try {
      await updateAppointment(id, data);
      await fetchData(); // Revalidate
    } catch (err) {
      await fetchData(); // Revert on error
      throw err;
    }
  }, [fetchData]);

  // Create appointment
  const create = useCallback(async (data: AppointmentFormData) => {
    const newAppt = await createAppointment(data);
    setAppointments((prev) => [newAppt, ...prev]);
    await fetchData(); // Revalidate
    return newAppt;
  }, [fetchData]);

  // Setup polling
  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  return {
    appointments,
    stats,
    loading,
    error,
    refresh: fetchData,
    updateAppointment: update,
    createAppointment: create,
  };
}

