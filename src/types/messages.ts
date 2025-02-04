export interface MessageSender {
  id: string;
  full_name: string;
  avatar_url?: string;
  online_status?: boolean;
  last_seen?: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  sender?: MessageSender;
  receiver?: MessageSender;
}