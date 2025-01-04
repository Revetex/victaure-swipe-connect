export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  thinking?: boolean;
  timestamp: Date;
  created_at?: string;
}

export interface ApiResponse {
  generated_text?: string;
  error?: string;
}

export interface ChatContext {
  profile?: {
    full_name?: string;
    role?: string;
  };
  message: string;
}