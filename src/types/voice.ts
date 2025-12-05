export interface VoiceCall {
  id: string;
  from_contact: string;
  transcription: string;
  ai_response: string;
  confidence_score: number;
  created_at: string; // ISO date string
}

export interface VoiceHistoryResponse {
  items: VoiceCall[];
  total: number;
}

export interface VoiceDetailResponse extends VoiceCall {
  // Additional details can be added here if needed
}