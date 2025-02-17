
export interface Friend {
  id: string;
  full_name: string;
  avatar_url?: string;
  online_status?: boolean;
  last_seen?: string;
  status?: string;
}

export interface FriendPreview extends Friend {
  email?: string;
}

export interface PendingRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  type: 'incoming' | 'outgoing';
  sender: Friend;
  receiver: Friend;
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
  company_name?: string;
  company_size?: string;
  industry?: string;
  created_at?: string;
  updated_at?: string;
  account_locked?: boolean;
  auto_update_enabled?: boolean;
  availability_date?: string;
  career_objectives?: string;
  certificates?: string[];
  chess_elo?: number;
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
  description?: string;
}

export interface Experience {
  id: string;
  profile_id: string;
  position: string;
  company: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id: string;
  profile_id?: string;
  school_name: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Ajout d'un type utilitaire pour les données brutes de Supabase
export type DatabaseProfile = Omit<UserProfile, 'friends' | 'certifications' | 'education' | 'experiences'> & {
  friends?: string[];
};

// Helper function pour transformer les données de la base en UserProfile
export function transformDatabaseProfile(data: any): UserProfile {
  return {
    ...data,
    friends: [],
    certifications: [],
    education: [],
    experiences: [],
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    online_status: data.online_status || false,
    last_seen: data.last_seen || new Date().toISOString(),
    role: data.role || 'professional',
    skills: data.skills || [],
    country: data.country || 'Canada',
  };
}
