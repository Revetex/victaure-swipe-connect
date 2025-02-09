
export interface MessageSender {
  id: string;
  full_name: string;
  avatar_url: string;
  online_status: boolean;
  last_seen: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string | null;
  receiver_id: string;
  created_at: string;
  updated_at: string;
  read: boolean;
  sender?: MessageSender;
  receiver?: MessageSender;
  timestamp: string;
  thinking?: boolean;
  message_type: 'user' | 'ai' | 'system';
  status: 'sent' | 'delivered' | 'read';
  metadata: Record<string, any>;
  reaction?: string;
}

export interface Receiver {
  id: string;
  full_name: string;
  avatar_url: string;
  online_status: boolean;
  last_seen: string;
}

export interface MessageDelivery {
  id: string;
  message_id: string;
  recipient_id: string;
  status: 'pending' | 'delivered' | 'read';
  delivered_at?: string;
  read_at?: string;
  created_at: string;
}
