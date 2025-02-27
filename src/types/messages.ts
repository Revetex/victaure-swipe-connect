
import { Certification, Education, Experience, UserRole as ProfileUserRole } from "./profile";

// Types pour la messagerie
export type UserRole = "professional" | "business" | "admin" | "user" | "freelancer" | "student" | string;
export type OnlineStatus = "online" | "offline" | "away" | "busy" | string | boolean;

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  conversation_id?: string;
  created_at: string;
  updated_at?: string;
  read?: boolean;
  status: "sent" | "delivered" | "read";
  message_type?: string;
  metadata?: any;
  encrypted?: boolean;
  encryption_key?: string;
  has_attachment?: boolean;
  message_hash?: string;
  message_state?: string;
  deleted_at?: string;
  edited_at?: string;
  is_deleted?: boolean;
  deleted_by?: any;
  reaction?: string;
  sender?: any;
  receiver?: any;
}

export interface Receiver {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email?: string | null;
  role?: UserRole;
  bio?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  skills?: string[];
  online_status?: OnlineStatus;
  last_seen?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  certifications?: Certification[];
  education?: Education[];
  experiences?: Experience[];
  friends?: string[];
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message?: string;
  last_message_time?: string;
  created_at?: string;
  updated_at?: string;
  participant1_last_read?: string;
  participant2_last_read?: string;
  participants?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  }[];
}
