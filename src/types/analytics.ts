// SMS Types
export interface SMSSummary {
  totalMessages: number;
  incomingCount: number;
  outgoingCount: number;
  changePercentage: number;
}

export interface SMSDaily {
  date: string;
  count: number;
}

export interface SMSType {
  type: string;
  count: number;
}

// Email Types
export interface EmailSummary {
  totalEmails: number;
  sent: number;
  received: number;
  changePercentage: number;
}

export interface EmailDaily {
  date: string;
  count: number;
}

export interface EmailType {
  type: string;
  count: number;
}

// Voice Types
export interface VoiceSummary {
  totalCalls: number;
  missed: number;
  completed: number;
  changePercentage: number;
}

export interface VoiceDaily {
  date: string;
  count: number;
}

export interface VoiceType {
  type: string;
  count: number;
}

// Chat Types
export interface ChatSummary {
  totalChats: number;
  resolved: number;
  pending: number;
  changePercentage: number;
}

export interface ChatDaily {
  date: string;
  count: number;
}

export interface ChatType {
  type: string;
  count: number;
}

// Unified Types
export interface DailyActivity {
  date: string;
  sms: number;
  email: number;
  voice: number;
  chat: number;
}

export interface MessageTypeDistribution {
  type: string;
  count: number;
  percentage: number;
  [key: string]: any; // Add index signature for Recharts compatibility
}

export interface RecentActivity {
  id: string;
  type: 'sms' | 'email' | 'voice' | 'chat';
  contact: string;
  summary: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'pending';
}

export interface AssistantPerformance {
  completionRate: number;
  successfulResolutions: number;
  avgHandleTime: string;
  efficiencyScore: number;
  changePercentage: number;
}

// Basic Analytics Types (from /analytics/basic endpoint)
export interface MessageOverTime {
  date: string;
  count: number;
}

export interface BasicAnalyticsData {
  total_messages: number;
  ai_resolved: number;
  escalated: number;
  sms_count: number;
  email_count: number;
  chat_count: number;
  voice_count: number;
  messages_over_time: MessageOverTime[];
}

export interface AnalyticsState {
  data: BasicAnalyticsData | null;
  loading: boolean;
  error: string | null;
}

// Computed metrics
export interface ComputedMetrics {
  resolutionRate: number;
  totalChannelMessages: number;
}