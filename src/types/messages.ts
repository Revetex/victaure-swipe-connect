
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
  message_type?: 'user' | 'assistant' | 'system';
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

// Étendre l'interface String pour inclure toLowerCase()
declare global {
  interface ConversationParticipant {
    toString(): string;
  }
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  participant: string;
  last_message?: string;
  last_message_time?: string;
  participant1_last_read?: string;
  participant2_last_read?: string;
  created_at: string;
  updated_at: string;
  status?: string;
  unread?: number;
  isPinned?: boolean;
  isMuted?: boolean;
  online?: boolean;
  avatar_url?: string | null;
  participant_id?: string;
}

export interface Receiver {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string | null;
  online_status: boolean; 
  last_seen?: string | null;
  latitude?: number;
  longitude?: number;
  role?: string;
  bio?: string | null;
}

export type { UserRole } from '@/types/profile';
