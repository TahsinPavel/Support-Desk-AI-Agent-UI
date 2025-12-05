// Backend API response format
export interface SMSMessage {
  id: string;
  customer_contact: string;
  message_text: string;
  ai_response?: string;
  direction: "incoming" | "outgoing";
  created_at: string;
  // Optional fields for display
  from?: string;
  to?: string;
}

// Grouped conversation for display
export interface Conversation {
  contact: string;
  messages: SMSMessage[];
  lastMessage: SMSMessage;
  unreadCount: number;
}

// Summary for conversation list
export interface ConversationSummary {
  id: string;
  contact: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

// API Response types
export interface SMSListResponse {
  items: SMSMessage[];
  total: number;
  page: number;
  limit: number;
}

export interface SendSMSRequest {
  tenant_id: string;
  channel_id: string;
  to: string;
  message_text: string;
}

export interface SendSMSResponse {
  id: string;
  status: string;
  message?: string;
}