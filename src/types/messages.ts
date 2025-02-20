
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  metadata?: Record<string, any>;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    online_status?: 'online' | 'offline';
    last_seen?: string;
  };
}

export interface Receiver {
  id: string;
  full_name: string;
  avatar_url: string | null;
  online_status?: 'online' | 'offline';
  last_seen?: string;
}
