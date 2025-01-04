export interface ApiResponse {
  generated_text?: string;
  error?: string;
}

export interface ChatContext {
  message: string;
  profile?: {
    full_name?: string;
    role?: string;
  };
}

export class AIError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'AIError';
  }
}