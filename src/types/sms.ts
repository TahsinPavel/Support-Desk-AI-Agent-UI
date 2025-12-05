export interface SMSMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: string;
  direction: "incoming" | "outgoing";
}

export interface Conversation {
  contact: string;
  messages: SMSMessage[];
}

export interface ConversationSummary {
  id: string;
  contact: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}