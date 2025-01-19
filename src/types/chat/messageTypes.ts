export interface Message {
  id: string;
  content: string;
  sender: string;
  thinking?: boolean;
  timestamp?: Date;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  read?: boolean;
  sender_id?: string;
  receiver_id?: string;
}

export interface ChatState {
  messages: Message[];
  deletedMessages: Message[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  selectedModel: string;
}

export interface ChatActions {
  setMessages: (messages: Message[]) => void;
  setInputMessage: (message: string) => void;
  setSelectedModel: (model: string) => void;
  handleSendMessage: (message: string) => Promise<void>;
  handleVoiceInput: () => void;
  clearChat: () => Promise<void>;
  restoreChat: () => Promise<void>;
}