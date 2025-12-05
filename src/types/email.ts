export interface EmailMessage {
  id: string;
  from_address: string;
  to_address: string;
  subject: string;
  body: string;
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
  channel_id: string;
  to: string;
  subject: string;
  body: string;
}