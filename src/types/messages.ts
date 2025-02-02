export interface MessageSender {
  id: string;
  full_name: string;
  avatar_url?: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  read: boolean;
  created_at: string;
  sender?: MessageSender;
  timestamp?: Date; // Added for compatibility with chat messages
  thinking?: boolean; // Added for compatibility with chat messages
}

export interface Receiver {
  id: string;
  full_name?: string;
  avatar_url?: string;
}