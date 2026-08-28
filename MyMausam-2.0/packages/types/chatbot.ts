export interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: string;
  language?: string;
  audio_url?: string;
  suggestions?: string[];
}

export interface ChatQueryRequest {
  query: string;
  location?: string;
  language?: string;
  persona?: string;
}

export interface ChatQueryResponse {
  answer: string;
  voice_summary: string;
  action_links?: { title: string; route: string }[];
  context_used?: {
    location: string;
    temperature: number;
    condition: string;
  };
}
