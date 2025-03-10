
import { UserProfile } from "./profile";

export interface Message {
  id: string;
  content: string;
  sender_id: string | null;
  receiver_id: string;
  created_at: string;
  updated_at?: string;
  read?: boolean;
  sender?: Sender | null;
  message_type?: string;
  reaction?: string;
  is_deleted?: boolean;
  timestamp?: string;
}

export interface Sender {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  online_status?: boolean;
  username?: string;
}

export interface Receiver {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  online_status?: boolean | string;
  role?: string;
  email?: string;
  bio?: string;
  username?: string;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message?: string;
  last_message_time?: string;
  created_at: string;
  updated_at: string;
  participant1?: UserProfile;
  participant2?: UserProfile;
  unread_count?: number;
}

export interface ConversationHeaderProps {
  name: string;
  avatar: string;
  isOnline: boolean;
  receiver: Receiver;
  onBack?: () => void;
  onClose?: () => void;
}
