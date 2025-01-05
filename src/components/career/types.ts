export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'advisor';
  timestamp: Date;
}

export interface ChatProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export interface ChatHeaderProps {
  isLoading: boolean;
}

export interface ChatInputProps {
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export interface QuickSuggestionsProps {
  onSelect: (suggestion: string) => void;
}

export interface ProfileUpdatePayload {
  bio?: string;
  role?: string;
  skills?: string[];
  experiences?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
}