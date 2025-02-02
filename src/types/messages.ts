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
  read: boolean;
  created_at: string;
  sender?: MessageSender;
  thinking?: boolean;
  timestamp?: string;
}

export interface Receiver {
  id: string;
  full_name?: string;
  avatar_url?: string;
  online_status?: boolean;
  last_seen?: string;
}

export interface FormattedMessage extends Omit<Message, 'sender'> {
  sender: string | MessageSender;
}