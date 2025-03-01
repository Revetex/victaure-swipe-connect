
import { UserProfile } from "@/types/profile";
import { Conversation, ConversationParticipant } from "../types/conversation.types";

export function transformConversation(conversation: any): Conversation | null {
  if (!conversation) return null;

  const participant = conversation.participant;
  if (!participant) return null;

  return {
    id: conversation.id,
    last_message: conversation.last_message || '',
    last_message_time: conversation.last_message_time || new Date().toISOString(),
    participant1_id: conversation.participant1_id,
    participant2_id: conversation.participant2_id,
    created_at: conversation.created_at || new Date().toISOString(),
    updated_at: conversation.updated_at || new Date().toISOString(),
    participant: {
      id: participant.id,
      full_name: participant.full_name || '',
      avatar_url: participant.avatar_url,
      email: participant.email,
      online_status: participant.online_status === true || participant.online_status === 'online',
      last_seen: participant.last_seen,
      role: participant.role
    },
    unread: false // Default value
  };
}

export function conversationToMessageReceiver(conversation: Conversation): ConversationParticipant {
  if (!conversation.participant) {
    return {
      id: conversation.participant2_id,
      full_name: '',
      avatar_url: null
    };
  }
  
  return conversation.participant;
}
