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
  certifications?: Certification[];
  education?: Education[];
  experiences?: Experience[];
  website?: string | null;
  company_name?: string | null;
  company_size?: string | null;
  industry?: string | null;
  style_id?: string;
  custom_font?: string | null;
  custom_background?: string | null;
  custom_text_color?: string | null;
  sections_order?: string[] | null;
  privacy_enabled?: boolean;
  friends?: Friend[];
  online_status?: boolean;
  last_seen?: string;
}

export interface Certification {
  id: string;
  profile_id: string;
  title: string;
  issuer: string;
  issue_date?: string | null;
  expiry_date?: string | null;
  credential_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  description?: string | null;
  skills?: string[];
  // These are computed fields that we'll derive from the database fields
  institution: string;
  year: string;
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

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date?: string | null;
  description?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface Friend {
  id: string;
  full_name: string;
  avatar_url?: string;
  online_status?: boolean;
  last_seen?: string;
}

export type FriendPreview = UserProfile & {
  online_status: boolean;
  last_seen: string;
};

export type PendingRequest = {
  id: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  receiver: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  type: 'incoming' | 'outgoing';
};

