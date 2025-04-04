
export type UserRole = 'professional' | 'business' | 'admin';

export interface ConversationParticipant {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  email?: string | null;
  role: UserRole;
  bio?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  skills?: string[];
  online_status?: boolean;
  last_seen?: string | null;
}

export interface Conversation {
  id: string;
  participant: ConversationParticipant;
  last_message: string;
  last_message_time: string;
  participant1_id: string;
  participant2_id: string;
}
