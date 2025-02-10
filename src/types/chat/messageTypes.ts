import { MessageSender } from "../messages";

export interface Message {
  id: string;
  content: string;
  sender: string | MessageSender;
  thinking?: boolean;
  timestamp: string;
  created_at: string;
  updated_at?: string;
  sender_id: string;
  receiver_id: string;
  read: boolean;
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