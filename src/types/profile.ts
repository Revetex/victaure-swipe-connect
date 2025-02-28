
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role?: string;
  bio?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  skills?: string[];
  online_status?: boolean;
  last_seen?: string;
  certifications: Certification[];
  education: Education[];
  experiences: Experience[];
  friends: Friend[];
  website?: string;
  company_name?: string;
  privacy_enabled?: boolean;
  created_at?: string;
  sections_order?: string[];
  verified?: boolean;
}

export interface Friend {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  online_status: boolean;
  last_seen: string;
}

export interface Experience {
  id: string;
  profile_id: string;
  position: string;
  company: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id: string;
  profile_id: string;
  school_name: string;
  degree: string;
  field_of_study: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}

export interface Certification {
  id: string;
  profile_id: string;
  title: string;
  issuer: string;
  year?: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url?: string;
  description?: string;
}

export interface PendingRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at?: string;
  type: 'incoming' | 'outgoing';
  sender: UserProfile;
  receiver: UserProfile;
}

interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
  blocked?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function createEmptyProfile(id: string, email: string): UserProfile {
  return {
    id,
    email,
    full_name: "",
    avatar_url: null,
    role: 'professional',
    bio: null,
    phone: null,
    city: null,
    state: null,
    country: 'Canada',
    skills: [],
    latitude: null,
    longitude: null,
    online_status: false,
    last_seen: new Date().toISOString(),
    certifications: [],
    education: [],
    experiences: [],
    friends: [],
    privacy_enabled: false,
    created_at: new Date().toISOString()
  };
}

// Définissons les fonctions de transformation sans les exporter directement
const _transformDatabaseProfile = (data: any): UserProfile => {
  return {
    ...createEmptyProfile(data.id, data.email),
    ...data,
    role: data.role || 'professional',
    country: data.country || 'Canada',
    skills: data.skills || [],
    online_status: data.online_status || false,
    last_seen: data.last_seen || new Date().toISOString(),
    friends: Array.isArray(data.friends) ? data.friends : []
  };
};

const _transformEducation = (data: any): Education => {
  return {
    id: data.id,
    profile_id: data.profile_id,
    school_name: data.school_name || data.school || '',
    degree: data.degree || '',
    field_of_study: data.field_of_study || data.field || '',
    start_date: data.start_date,
    end_date: data.end_date,
    description: data.description
  };
};

const _transformCertification = (data: any): Certification => {
  return {
    id: data.id,
    profile_id: data.profile_id,
    title: data.title || data.name || '',
    issuer: data.issuer || data.institution || '',
    year: data.year,
    issue_date: data.issue_date,
    expiry_date: data.expiry_date,
    credential_id: data.credential_id,
    credential_url: data.credential_url,
    description: data.description
  };
};

const _transformExperience = (data: any): Experience => {
  return {
    id: data.id,
    profile_id: data.profile_id,
    position: data.position,
    company: data.company,
    start_date: data.start_date,
    end_date: data.end_date,
    description: data.description,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Exportons-les sous leur nom original
export const transformDatabaseProfile = _transformDatabaseProfile;
export const transformEducation = _transformEducation;
export const transformCertification = _transformCertification;
export const transformExperience = _transformExperience;
export type { BlockedUser };
