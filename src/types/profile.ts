
export interface Friend {
  id: string;
  full_name: string;
  avatar_url?: string;
  online_status?: boolean;
  last_seen?: string;
  status?: string;
}

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
  friends?: Friend[];
  certifications: Certification[];
  education: Education[];
  experiences: Experience[];
  website?: string;
  custom_font?: string | null;
  custom_background?: string | null;
  custom_text_color?: string | null;
  sections_order?: string[];
  style_id?: string;
  tools_order?: string[];
  push_notifications_enabled?: boolean;
  push_token?: string;
  location_enabled?: boolean;
  search_enabled?: boolean;
  privacy_enabled?: boolean;
}

export interface Certification {
  id: string;
  profile_id: string;
  title: string;
  institution: string;
  year: string;
  created_at?: string;
  updated_at?: string;
  credential_url?: string;
  issue_date?: string;
  expiry_date?: string;
  issuer: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  profile_id: string;
}

export interface Education {
  id: string;
  school_name: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}
