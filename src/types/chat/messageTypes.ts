export interface Message {
  id: string;
  content: string;
  sender: string;
  thinking?: boolean;
  timestamp: Date;
  created_at?: string;
}

export interface ChatState {
  messages: Message[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
}