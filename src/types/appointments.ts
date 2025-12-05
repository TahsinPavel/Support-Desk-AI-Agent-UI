// Appointment Types

export type AppointmentStatus = 
  | "pending" 
  | "confirmed" 
  | "completed" 
  | "canceled" 
  | "no_show";

export interface Appointment {
  id: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  service: string;
  requested_time: string; // ISO datetime
  confirmed_time?: string; // ISO datetime
  status: AppointmentStatus;
  notes?: string;
  ai_conversation?: ConversationMessage[];
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AppointmentSummary {
  total: number;
  confirmed: number;
  pending: number;
  completed: number;
  canceled: number;
  no_show: number;
  by_day: DayCount[];
}

export interface DayCount {
  date: string;
  count: number;
}

export interface AppointmentFormData {
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  service: string;
  requested_time: string;
  confirmed_time?: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface AppointmentUpdateData {
  status?: AppointmentStatus;
  confirmed_time?: string;
  notes?: string;
}

export interface DateRange {
  label: string;
  days: number;
}

export const DATE_RANGES: DateRange[] = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

// Computed stats from appointments
export interface ComputedAppointmentStats {
  total: number;
  confirmed: number;
  pending: number;
  completed: number;
  canceled: number;
  noShow: number;
  byDay: DayCount[];
}

