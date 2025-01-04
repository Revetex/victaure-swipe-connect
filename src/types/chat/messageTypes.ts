export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  thinking?: boolean;
  timestamp: Date;
  created_at?: string;
}

export interface ChatContext {
  message: string;
  profile?: {
    full_name?: string;
    role?: string;
  };
}

export interface ApiResponse {
  generated_text?: string;
  error?: string;
}

export interface ChatState {
  messages: Message[];
  deletedMessages: Message[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
}

export interface ChatActions {
  setMessages: (messages: Message[]) => void;
  setInputMessage: (message: string) => void;
  handleSendMessage: (message: string, profile?: any) => Promise<void>;
  handleVoiceInput: () => void;
  clearChat: () => Promise<void>;
  restoreChat: () => Promise<void>;
}