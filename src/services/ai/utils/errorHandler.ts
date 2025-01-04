import { toast } from "sonner";

export class ChatError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'ChatError';
  }
}

export function handleChatError(error: unknown): never {
  console.error("Chat error:", error);
  
  if (error instanceof ChatError) {
    toast.error(error.message);
  } else {
    toast.error("Une erreur est survenue lors de la communication avec l'assistant");
  }
  
  throw error;
}