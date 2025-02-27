
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  status?: string;
  reaction?: string;
  deleted?: boolean;
  message_type?: 'user' | 'assistant' | 'system';
  metadata?: any;
}

export interface MessageDelivery {
  id: string;
  message_id: string;
  recipient_id: string;
  status: 'sent' | 'delivered' | 'read';
  delivered_at: string;
  read_at?: string;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message?: string;
  last_message_time?: string;
  participant1_last_read?: string;
  participant2_last_read?: string;
  created_at: string;
  updated_at: string;
  status?: string;
}
