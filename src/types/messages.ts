
import type { UserProfile } from './profile';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  metadata?: Record<string, any>;
  sender: UserProfile;
}

export interface Receiver extends UserProfile {
  online_status?: 'online' | 'offline';
  last_seen?: string;
}
