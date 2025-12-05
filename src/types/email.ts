export interface EmailMessage {
  id: string;
  subject: string;
  from_email: string;
  to_email: string;
  message_text: string;
  ai_response?: string;
  direction: 'incoming' | 'outgoing';
  created_at: string; // ISO date string
}

export interface EmailInboxResponse {
  items: EmailMessage[];
  total: number;
}

export interface EmailThreadResponse {
  id: string;
  messages: EmailMessage[];
  status: 'open' | 'closed';
  escalated: boolean;
}

export interface SendEmailRequest {
  tenant_id: string;
  to_email: string;
  subject: string;
  message: string;
}