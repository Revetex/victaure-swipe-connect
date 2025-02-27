
export interface UserProfile {
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
  online_status: boolean;
  last_seen: string | null;
  created_at?: string;
  updated_at?: string;
}
