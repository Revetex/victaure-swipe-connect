export interface MessageSender {
  id: string;
  full_name: string;
  avatar_url?: string;
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
  timestamp?: string | Date;
}

export interface Receiver {
  id: string;
  full_name?: string;
  avatar_url?: string;
}

export interface FormattedMessage extends Omit<Message, 'sender'> {
  sender: string | MessageSender;
}