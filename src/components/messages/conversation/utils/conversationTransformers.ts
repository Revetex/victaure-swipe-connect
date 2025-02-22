
import { UserRole, ConversationParticipant, Conversation } from '../types/conversation.types';

interface RawParticipant {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email: string | null;
  role: string;
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  skills: string[];
  online_status: boolean;
  last_seen: string | null;
}

interface RawConversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message: string;
  last_message_time: string;
  participant: RawParticipant;
}

export const transformParticipant = (rawParticipant: RawParticipant): ConversationParticipant => {
  let role: UserRole = 'professional';
  if (rawParticipant.role === 'business' || rawParticipant.role === 'admin') {
    role = rawParticipant.role as UserRole;
  }

  return {
    id: rawParticipant.id,
    full_name: rawParticipant.full_name || '',
    avatar_url: rawParticipant.avatar_url,
    email: rawParticipant.email,
    role: role,
    bio: rawParticipant.bio,
    phone: rawParticipant.phone,
    city: rawParticipant.city,
    state: rawParticipant.state,
    country: rawParticipant.country,
    skills: rawParticipant.skills || [],
    online_status: rawParticipant.online_status,
    last_seen: rawParticipant.last_seen
  };
};

export const transformConversation = (conv: RawConversation): Conversation | null => {
  if (!conv.participant) return null;

  const transformedParticipant = transformParticipant(conv.participant);

  return {
    id: conv.id,
    participant1_id: conv.participant1_id,
    participant2_id: conv.participant2_id,
    last_message: conv.last_message || '',
    last_message_time: conv.last_message_time || new Date().toISOString(),
    participant: transformedParticipant
  };
};
