
import { Message } from '@/types/messages';
import { UserProfile } from '@/types/profile';

export interface ConversationContext {
  messageCount: number;
  acceptedJobs: string[];
  rejectedJobs: string[];
  hasGreeted?: boolean;
}

export interface AIResponse {
  response: string;
  context?: {
    intent: string;
    lastQuery: string;
  };
}

export interface ChatState {
  messages: Message[];
  isThinking: boolean;
  inputMessage: string;
  conversationContext: ConversationContext;
}
