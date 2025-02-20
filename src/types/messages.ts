
import type { UserProfile } from './profile';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  metadata?: Record<string, any>;
  sender: UserProfile;
  conversation_id?: string;
  deleted_at?: string;
  deleted_by?: Record<string, any>;
  edited_at?: string;
  encrypted?: boolean;
  encryption_key?: string;
  has_attachment?: boolean;
  is_assistant?: boolean;
  is_deleted?: boolean;
  is_system_sender?: boolean;
  message_hash?: string;
  message_state?: string;
  message_type?: string;
  page_cursor?: string;
  reaction?: string;
  status?: string;
  system_message?: boolean;
  timestamp?: string;
}

export interface Receiver {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email: string | null;
  role: 'professional' | 'business' | 'admin';
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  skills: string[];
  latitude: number | null;
  longitude: number | null;
  online_status: 'online' | 'offline';
  last_seen: string | null;
  certifications: any[];
  education: any[];
  experiences: any[];
  friends: string[];
}
