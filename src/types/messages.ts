
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  status?: 'sent' | 'delivered' | 'read';
  reaction?: string;
  deleted?: boolean;
  message_type?: 'user' | 'assistant' | 'system' | 'text' | 'image' | 'file';
  metadata?: any;
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email?: string | null;
    role?: string;
    certifications?: any[];
    education?: any[];
    experiences?: any[];
    friends?: any[];
  };
}

export interface MessageDelivery {
  id: string;
  message_id: string;
  recipient_id: string;
  status: 'sent' | 'delivered' | 'read';
  delivered_at: string;
  read_at?: string;
}

export interface ConversationParticipant {
  id: string;
  full_name: string | null;
  avatar_url?: string | null;
  online_status: boolean;
  last_seen?: string | null;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  participant: string | {
    full_name: string | null;
    [key: string]: any;
  };
  last_message?: string;
  last_message_time?: string;
  created_at: string;
  updated_at: string;
  unread?: number;
  isPinned?: boolean;
  isMuted?: boolean;
  online?: boolean;
  avatar_url?: string | null;
}

export interface Receiver {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  online_status: boolean; 
  last_seen?: string | null;
  [key: string]: any;
}

export interface ConversationHeaderProps {
  name: string;
  avatar: string | null;
  isOnline: boolean;
  receiver?: Receiver;
  onBack?: () => void;
}

export type { UserRole } from '@/types/profile';
