import { ApiConfig } from "@/types/ai/chat";

export const API_CONFIG: ApiConfig = {
  endpoint: "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
  defaultHeaders: {
    "Content-Type": "application/json",
  }
};