
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string;
  skills: string[] | null;
  latitude: number | null;
  longitude: number | null;
  online_status: boolean;
  last_seen: string;
  // Optional fields
  website?: string | null;
  company_name?: string | null;
  company_size?: string | null;
  industry?: string | null;
  created_at?: string;
}
