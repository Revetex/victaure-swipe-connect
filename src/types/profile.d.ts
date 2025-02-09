
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  online_status: boolean;
  last_seen: string;
}

export interface UserProfile extends Profile {
  skills?: string[];
  certifications?: Certification[];
  education?: Education[];
  experiences?: Experience[];
  website?: string;
  company_name?: string;
  company_size?: string;
  industry?: string;
}
