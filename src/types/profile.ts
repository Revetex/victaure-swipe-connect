
export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'professional' | 'business' | 'admin';
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string;
  skills: string[];
  latitude: number | null;
  longitude: number | null;
  online_status: boolean;
  last_seen: string;
  certifications: any[];
  education: any[];
  experiences: any[];
  friends: string[];
}
