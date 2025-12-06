import axiosInstance from "./axiosInstance";
import {
  Appointment,
  AppointmentSummary,
  AppointmentFormData,
  AppointmentUpdateData,
} from "@/types/appointments";
import { APPOINTMENTS_ENDPOINTS } from "@/lib/api";

/**
 * Fetch all appointments for current tenant
 * GET /api/appointments
 */
export async function getAppointments(): Promise<Appointment[]> {
  const response = await axiosInstance.get(APPOINTMENTS_ENDPOINTS.LIST);

  // Handle different response formats
  const data = response.data;

  // If response is an array, return it directly
  if (Array.isArray(data)) {
    return data;
  }

  // If response has a data/appointments/items property that's an array
  if (data && typeof data === "object") {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.appointments)) return data.appointments;
    if (Array.isArray(data.items)) return data.items;
  }

  // Return empty array as fallback
  return [];
}

/**
 * Fetch appointment summary stats
 * GET /api/appointments/summary?days=30
 */
export async function getAppointmentSummary(
  days: number = 30
): Promise<AppointmentSummary | null> {
  try {
    const response = await axiosInstance.get<AppointmentSummary>(
      `${APPOINTMENTS_ENDPOINTS.SUMMARY}?days=${days}`
    );
    return response.data;
  } catch (error) {
    // Return null if endpoint doesn't exist - will compute from appointments
    console.warn("Appointments summary endpoint not available, computing locally");
    return null;
  }
}

/**
 * Create a new appointment
 * POST /api/appointments
 */
export async function createAppointment(
  data: AppointmentFormData
): Promise<Appointment> {
  const response = await axiosInstance.post(APPOINTMENTS_ENDPOINTS.CREATE, data);
  return response.data;
}

/**
 * Update an existing appointment
 * PUT /api/appointments/{id}
 */
export async function updateAppointment(
  id: string,
  data: AppointmentUpdateData
): Promise<Appointment> {
  const response = await axiosInstance.put(APPOINTMENTS_ENDPOINTS.UPDATE(id), data);
  return response.data;
}

/**
 * Delete an appointment
 * DELETE /api/appointments/{id}
 */
export async function deleteAppointment(id: string): Promise<void> {
  await axiosInstance.delete(APPOINTMENTS_ENDPOINTS.DELETE(id));
}