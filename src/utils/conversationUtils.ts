import { Conversation, Message, Receiver } from "@/types/messages";
import { format, formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Format a timestamp for display in conversation lists
 */
export function formatConversationTime(timestamp: string | null): string {
  if (!timestamp) return "";
  
  const date = new Date(timestamp);
  const now = new Date();
  
  // If today, just show time
  if (date.toDateString() === now.toDateString()) {
    return format(date, "HH:mm");
  }
  
  // If this week, show day name
  const diffDays = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return format(date, "EEEE", { locale: fr });
  }
  
  // Otherwise show date
  return format(date, "dd/MM/yyyy");
}

/**
 * Create a conversation object from a receiver
 */
export function createConversationFromReceiver(
  receiver: Receiver,
  lastMessage?: string,
  timestamp?: string
): Conversation {
  return {
    id: `conv-${receiver.id}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sender_id: "user",
    receiver_id: receiver.id,
    last_message: lastMessage,
    timestamp: timestamp,
    full_name: receiver.full_name || "",
    avatar_url: receiver.avatar_url || "",
    participant: receiver,
    unread: false,
    // Don't add isPinned as it's not in Conversation type
  };
}

/**
 * Format the relative time (like "5 minutes ago")
 */
export function formatRelativeTime(timestamp: string | null): string {
  if (!timestamp) return "";
  
  try {
    return formatDistance(new Date(timestamp), new Date(), {
      addSuffix: true,
      locale: fr
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "";
  }
}

/**
 * Get last message preview text
 */
export function getMessagePreview(message: string, maxLength: number = 30): string {
  if (!message) return "";
  
  if (message.length <= maxLength) return message;
  
  return `${message.substring(0, maxLength)}...`;
}

/**
 * Sort conversations by timestamp
 */
export function sortConversationsByTime(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort((a, b) => {
    const timeA = a.timestamp || a.updated_at;
    const timeB = b.timestamp || b.updated_at;
    
    if (!timeA) return 1;
    if (!timeB) return -1;
    
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });
}
