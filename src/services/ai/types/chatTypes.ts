export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
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