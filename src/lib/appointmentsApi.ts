import axiosInstance from "./axiosInstance";
import {
  Appointment,
  AppointmentSummary,
  AppointmentFormData,
  AppointmentUpdateData,
} from "@/types/appointments";

/**
 * Fetch all appointments for current tenant
 * GET /appointments
 */
export async function getAppointments(): Promise<Appointment[]> {
  const response = await axiosInstance.get("/appointments");

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
 * GET /appointments/summary?days=30
 */
export async function getAppointmentSummary(
  days: number = 30
): Promise<AppointmentSummary | null> {
  try {
    const response = await axiosInstance.get<AppointmentSummary>(
      `/appointments/summary?days=${days}`
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
 * POST /appointments
 */
export async function createAppointment(
  data: AppointmentFormData
): Promise<Appointment> {
  const response = await axiosInstance.post<Appointment>("/appointments", data);
  return response.data;
}

/**
 * Update an existing appointment
 * PUT /appointments/{id}
 */
export async function updateAppointment(
  id: string,
  data: AppointmentUpdateData
): Promise<Appointment> {
  const response = await axiosInstance.put<Appointment>(
    `/appointments/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete an appointment (optional endpoint)
 * DELETE /appointments/{id}
 */
export async function deleteAppointment(id: string): Promise<void> {
  await axiosInstance.delete(`/appointments/${id}`);
}

/**
 * Appointment API endpoints
 */
export const APPOINTMENTS_API = {
  LIST: "/appointments",
  SUMMARY: "/appointments/summary",
  CREATE: "/appointments",
  UPDATE: (id: string) => `/appointments/${id}`,
  DELETE: (id: string) => `/appointments/${id}`,
} as const;

