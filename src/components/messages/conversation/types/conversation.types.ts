
import { UserProfile } from "@/types/profile";

export interface Conversation {
  id: string;
  last_message?: string;
  last_message_time?: string;
  participant1_id: string;
  participant2_id: string;
  participant?: ConversationParticipant;
  unread?: boolean;
  // Add compatibility fields to match the structure in messages.ts
  created_at: string;
  updated_at: string;
}

export interface ConversationParticipant {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string | null;
  online_status?: boolean;
  last_seen?: string | null;
  role?: string;
}

export interface CreateConversationParams {
  participant_id: string;
}

export interface ConversationWithParticipant extends Conversation {
  participant: ConversationParticipant;
}
