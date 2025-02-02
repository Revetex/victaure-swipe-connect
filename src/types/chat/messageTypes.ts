export interface Message {
  id: string;
  content: string;
  sender: string;
  sender_id?: string;
  receiver_id?: string;
  thinking?: boolean;
  timestamp: Date;
  created_at?: string;
  updated_at?: string;
  read?: boolean;
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
  handleSendMessage: (message: string) => Promise<void>;
  handleVoiceInput: () => void;
  clearChat: () => Promise<void>;
  restoreChat: () => Promise<void>;
}