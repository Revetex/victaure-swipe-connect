export interface HuggingFaceResponse {
  generated_text?: string;
}

export interface ApiError {
  error?: string;
  message?: string;
}

export interface ApiConfig {
  endpoint: string;
  defaultHeaders: {
    "Content-Type": string;
  };
}

export interface ChatPrompt {
  context?: string;
  message: string;
}