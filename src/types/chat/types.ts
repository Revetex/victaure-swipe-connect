export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  thinking?: boolean;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  deletedMessages: Message[];
}

export interface ChatActions {
  setMessages: (messages: Message[]) => void;
  setInputMessage: (message: string) => void;
  handleSendMessage: (message: string, profile?: any) => Promise<void>;
  handleVoiceInput: () => void;
  clearChat: () => Promise<void>;
  restoreChat: () => Promise<void>;
}

export interface ApiResponse {
  generated_text?: string;
  error?: string;
}