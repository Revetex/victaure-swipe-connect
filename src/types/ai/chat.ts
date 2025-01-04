export interface ChatPrompt {
  context?: string;
  message: string;
}

export interface ChatResponse {
  generated_text?: string;
}

export interface ChatError {
  error: string;
  details?: string;
}