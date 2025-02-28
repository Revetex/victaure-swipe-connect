
import { UserRole } from '@/types/profile';

// Étendre l'interface Receiver pour qu'elle soit compatible avec le code existant dans ConversationView.tsx
export interface Receiver {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string | null;
  online_status: boolean;
  last_seen?: string | null;
  // Propriétés supplémentaires qui pourraient être utilisées ailleurs
  latitude?: number;
  longitude?: number;
  bio?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  role?: UserRole;
  skills?: string[];
  certifications?: any[];
  education?: any[];
  experiences?: any[];
  friends?: any[];
}

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
  message_type?: 'text' | 'image' | 'file';
  metadata?: any;
  sender?: any;
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
  online_status: boolean | string;
  last_seen?: string | null;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  participant: string | any;
  last_message?: string;
  last_message_time?: string;
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
