
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
  // Profile customization
  style_id?: string;
  sections_order?: string[];
  privacy_enabled?: boolean;
  custom_font?: string | null;
  custom_background?: string | null;
  custom_text_color?: string | null;
  // Additional fields
  website?: string | null;
  company_name?: string | null;
  company_size?: string | null;
  industry?: string | null;
  created_at?: string;
  // Related data
  education?: Education[];
  experiences?: Experience[];
  certifications?: Certification[];
}

export interface Experience {
  id: string;
  profile_id?: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date?: string | null;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface Education {
  id: string;
  profile_id?: string;
  school_name: string;
  degree: string;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Certification {
  id: string;
  profile_id?: string;
  title: string;
  institution: string;
  year: string;
  credential_url?: string | null;
  description?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  issuer?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FriendPreview extends Pick<UserProfile, 'id' | 'full_name' | 'avatar_url' | 'online_status' | 'last_seen'> {}

export interface PendingRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  type?: 'incoming' | 'outgoing';
  sender: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  receiver: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}
