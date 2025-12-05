"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { ApptHeader } from "@/components/appointments/ApptHeader";
import { ApptStats } from "@/components/appointments/ApptStats";
import { ApptCalendar } from "@/components/appointments/ApptCalendar";
import { ApptChart } from "@/components/appointments/ApptChart";
import { ApptList } from "@/components/appointments/ApptList";
import { ApptDetailModal, ApptCreateModal } from "@/components/appointments/ApptModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Appointment, AppointmentUpdateData, AppointmentFormData } from "@/types/appointments";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AppointmentsPage() {
  const [mounted, setMounted] = useState(false);
  const [rangeDays, setRangeDays] = useState(30);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const {
    appointments,
    stats,
    loading,
    error,
    refresh,
    updateAppointment,
    createAppointment,
  } = useAppointments(rangeDays);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle appointment click
  const handleApptClick = useCallback((appt: Appointment) => {
    setSelectedAppt(appt);
    setDetailModalOpen(true);
  }, []);

  // Handle save
  const handleSave = useCallback(
    async (id: string, data: AppointmentUpdateData) => {
      await updateAppointment(id, data);
    },
    [updateAppointment]
  );

  // Handle create
  const handleCreate = useCallback(
    async (data: AppointmentFormData) => {
      await createAppointment(data);
    },
    [createAppointment]
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <ApptHeader
        selectedRange={rangeDays}
        onRangeChange={setRangeDays}
        onCreateClick={() => setCreateModalOpen(true)}
        onRefresh={refresh}
        isRefreshing={loading}
      />

      {/* Auto-refresh indicator */}
      <Card className="bg-muted/50">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-muted-foreground">
              Auto-refreshing every 10 seconds
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={refresh}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Row */}
      <ApptStats stats={stats} loading={loading} />

      {/* Main Content: Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Column: Calendar + Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <ApptCalendar
            appointments={appointments}
            loading={loading}
            selectedDate={selectedDate}
            onDayClick={setSelectedDate}
          />
          <ApptChart data={stats.byDay} loading={loading} />
        </motion.div>

        {/* Right Column: Appointments List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ApptList
            appointments={appointments}
            loading={loading}
            selectedDate={selectedDate}
            onAppointmentClick={handleApptClick}
          />
        </motion.div>
      </div>

      {/* Detail Modal */}
      <ApptDetailModal
        appointment={selectedAppt}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedAppt(null);
        }}
        onSave={handleSave}
      />

      {/* Create Modal */}
      <ApptCreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
