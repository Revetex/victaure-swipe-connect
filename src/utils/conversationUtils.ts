
import { Message, Conversation, Sender, Receiver } from "@/types/messages";
import { UserProfile } from "@/types/profile";
import { convertToBoolean } from "./marketplace";
import { format } from "date-fns";

/**
 * Transforme un message brut en format utilisable par l'interface
 */
export function formatMessage(message: any): Message {
  if (!message) return {} as Message;
  
  return {
    id: message.id || generateRandomId(),
    content: message.content || "",
    sender_id: message.sender_id || null,
    receiver_id: message.receiver_id || "",
    created_at: message.created_at || new Date().toISOString(),
    read: message.read || false,
    sender: message.sender || null,
    message_type: message.message_type || "text",
  };
}

/**
 * Transforme un profil utilisateur en expéditeur de message
 */
export function userProfileToSender(profile: UserProfile | null): Sender | null {
  if (!profile) return null;
  
  return {
    id: profile.id || "",
    full_name: profile.full_name || "",
    avatar_url: profile.avatar_url || null,
    online_status: convertToBoolean(profile.online_status),
    username: profile.username || profile.full_name || ""
  };
}

/**
 * Normalise les données de conversation
 */
export function normalizeConversation(conversation: any): Conversation {
  return {
    id: conversation.id || "",
    participant1_id: conversation.participant1_id || "",
    participant2_id: conversation.participant2_id || "",
    last_message: conversation.last_message || "",
    last_message_time: conversation.last_message_time || conversation.updated_at || "",
    created_at: conversation.created_at || new Date().toISOString(),
    updated_at: conversation.updated_at || new Date().toISOString(),
    participant: conversation.participant || null,
    unread_count: conversation.unread_count || 0,
  };
}

/**
 * Génère un ID aléatoire pour les nouveaux messages
 */
export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Transforme un profil utilisateur en récepteur de message
 */
export function userProfileToReceiver(profile: UserProfile | null): Receiver | null {
  if (!profile) return null;
  
  return {
    id: profile.id || "",
    full_name: profile.full_name || "",
    avatar_url: profile.avatar_url || null,
    online_status: convertToBoolean(profile.online_status),
    role: profile.role || "professional",
    username: profile.username || profile.full_name || "",
    email: profile.email || "",
    last_seen: profile.last_seen || null,
  };
}

/**
 * Trie les conversations par date de dernier message
 */
export function sortConversationsByDate(a: Conversation, b: Conversation): number {
  const dateA = a.last_message_time || a.updated_at;
  const dateB = b.last_message_time || b.updated_at;
  
  if (!dateA) return 1;
  if (!dateB) return -1;
  
  return new Date(dateB).getTime() - new Date(dateA).getTime();
}

/**
 * Formate une date au format relatif (aujourd'hui, hier, etc.)
 */
export function getRelativeTime(dateString: string): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Aujourd'hui
    if (date.toDateString() === now.toDateString()) {
      return format(date, "HH:mm");
    }
    
    // Hier
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    }
    
    // Cette semaine
    const sixDaysAgo = new Date(now);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    if (date >= sixDaysAgo) {
      return format(date, "EEE"); // Jour de la semaine abrégé
    }
    
    // Cette année
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, "d MMM");
    }
    
    // Années précédentes
    return format(date, "dd/MM/yyyy");
  } catch (error) {
    console.error("Erreur de formatage de date:", error);
    return "";
  }
}
