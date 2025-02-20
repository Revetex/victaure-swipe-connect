
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

export interface Receiver {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email: string | null;
  role: string;
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  skills: string[];
  latitude: number | null;
  longitude: number | null;
  online_status: 'online' | 'offline';
  last_seen: string | null;
  certifications: any[];
  education: any[];
  experiences: any[];
  friends: string[];
}
