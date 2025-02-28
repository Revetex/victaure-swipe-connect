
import { Conversation, ConversationHeaderProps, Receiver } from "@/types/messages";

/**
 * Convertit une valeur de statut en ligne au format booléen
 */
export function ensureBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || 
           value === '1' || 
           value === 'yes' || 
           value === 'online' || 
           value === 'on';
  }
  if (typeof value === 'number') return value !== 0;
  return !!value;
}

/**
 * Assure que la conversation a tous les champs requis et au bon format
 */
export function ensureConversationTypes(conversation: any): Conversation {
  return {
    id: conversation.id || '',
    participant1_id: conversation.participant1_id || '',
    participant2_id: conversation.participant2_id || '',
    participant: conversation.participant || '',
    last_message: conversation.last_message || '',
    last_message_time: conversation.last_message_time || new Date().toISOString(),
    created_at: conversation.created_at || new Date().toISOString(),
    updated_at: conversation.updated_at || new Date().toISOString(),
    unread: conversation.unread || 0,
    isPinned: ensureBoolean(conversation.isPinned),
    isMuted: ensureBoolean(conversation.isMuted),
    online: ensureBoolean(conversation.online),
    avatar_url: conversation.avatar_url || null
  };
}

/**
 * Crée des props pour l'en-tête de conversation à partir du récepteur
 */
export function createConversationHeaderProps(receiver: Receiver): ConversationHeaderProps {
  return {
    name: receiver.full_name || 'Inconnu',
    avatar: receiver.avatar_url,
    isOnline: ensureBoolean(receiver.online_status),
    receiver: receiver,
    onBack: () => window.history.back()
  };
}

/**
 * Extrait le nom du participant d'une conversation
 */
export function extractParticipantName(participant: any): string {
  if (typeof participant === 'string') {
    return participant;
  }
  
  if (participant && typeof participant === 'object') {
    return participant.full_name || 'Contact';
  }
  
  return 'Contact';
}

/**
 * Extrait et normalise les données de participant
 */
export function normalizeParticipantData(data: any): any {
  if (!data) return { full_name: 'Inconnu', avatar_url: null };
  
  // Si le participant est une chaîne, le convertir en objet
  if (typeof data === 'string') {
    return { full_name: data, avatar_url: null };
  }
  
  // Si c'est un objet, assurer qu'il a les propriétés requises
  if (typeof data === 'object') {
    return {
      ...data,
      full_name: data.full_name || 'Contact',
      avatar_url: data.avatar_url || null
    };
  }
  
  return { full_name: 'Inconnu', avatar_url: null };
}
