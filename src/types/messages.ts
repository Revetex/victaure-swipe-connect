
import { UserProfile, UserRole } from "./profile";

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
  conversation_id?: string;
  status?: string;
  metadata?: any;
}

export interface Sender {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  online_status?: boolean;
  username?: string;
  email?: string;  // Ajout pour compatibilité
}

export interface Receiver {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  online_status?: boolean | string;
  role?: UserRole | string;
  email?: string;
  bio?: string;
  username?: string;
  last_seen?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  latitude?: number;    // Ajout pour compatibilité
  longitude?: number;   // Ajout pour compatibilité
  skills?: string[];    // Ajout pour compatibilité
  certifications?: any[]; // Ajout pour compatibilité
  education?: any[];    // Ajout pour compatibilité
  experiences?: any[];  // Ajout pour compatibilité
  friends?: any[];      // Ajout pour compatibilité
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
  participant?: Receiver;
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

// Fonction utilitaire pour convertir tout type de statut en ligne en booléen
export function convertToBoolean(status: any): boolean {
  if (typeof status === 'boolean') return status;
  if (typeof status === 'string') {
    return status === 'online' || status === 'true';
  }
  return !!status;
}

// Ré-exporter le type UserRole depuis profile
export type { UserRole } from "./profile";
