
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
  updated_at?: string;
  read: boolean;
  sender: MessageSender;
  receiver: Receiver;
  timestamp: string;
  thinking?: boolean;
  message_type: 'system' | 'user' | 'assistant';
  status: 'sent' | 'delivered' | 'read';
  metadata?: Record<string, any>;
  reaction?: string | null;
  is_assistant?: boolean;
}
