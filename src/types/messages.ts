
import { Json } from "./database/auth";

export interface MessageSender {
  id: string;
  full_name: string;
  avatar_url: string | null;
  online_status: boolean;
  last_seen: string;
}

export type Receiver = MessageSender;

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  updated_at: string;
  read: boolean;
  sender: MessageSender;
  receiver: Receiver;
  timestamp: string;
  thinking?: boolean;
  message_type: 'system' | 'user' | 'assistant';
  status: 'sent' | 'delivered' | 'read';
  metadata: Record<string, Json>;
  reaction: string | null;
  is_assistant: boolean;
}

export interface DatabaseMessage {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  updated_at: string | null;
  read: boolean;
  message_type: string;
  status: string;
  metadata: Json;
  reaction: string | null;
  is_assistant: boolean;
  sender: MessageSender;
  receiver: Receiver;
}

export const transformDatabaseMessage = (msg: DatabaseMessage): Message => ({
  ...msg,
  updated_at: msg.updated_at || msg.created_at,
  timestamp: msg.created_at,
  message_type: (msg.message_type === 'system' || msg.message_type === 'user' || msg.message_type === 'assistant' 
    ? msg.message_type 
    : msg.is_assistant ? 'assistant' : 'user') as Message['message_type'],
  status: (msg.status === 'sent' || msg.status === 'delivered' || msg.status === 'read' 
    ? msg.status 
    : 'sent') as Message['status'],
  metadata: (typeof msg.metadata === 'object' && msg.metadata !== null 
    ? msg.metadata as Record<string, Json>
    : {}) as Record<string, Json>,
  thinking: false
});
