
export interface Conversation {
  id: string;
  sender_id?: string;
  receiver_id?: string;
  last_message?: string;
  timestamp?: string;
  created_at: string;
  updated_at: string;
  unread?: boolean;
  avatar_url?: string;
  full_name?: string;
  participant?: Receiver;
  last_message_time?: string;
  participant1_id?: string;
  participant2_id?: string;
}

export interface ConversationHeaderProps {
  name: string;
  avatar: string | null;
  isOnline: boolean;
  partner?: any;
  receiver?: Receiver;
  onBack?: () => void;
  onClose?: () => void;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  conversation_id?: string;
  created_at: string;
  read?: boolean;
  sender?: Receiver;
  timestamp?: string;
  metadata?: any;
}

export interface Receiver {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string | null;
  online_status?: boolean;
  last_seen?: string | null;
}
