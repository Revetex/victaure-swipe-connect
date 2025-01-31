export interface ApiResponse {
  generated_text: string;
}

export interface AIConfig {
  model: string;
  maxTokens: number;
}