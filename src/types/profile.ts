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

export type DatabaseProfile = Omit<UserProfile, 'friends' | 'certifications' | 'education' | 'experiences'> & {
  friends?: string[];
};

export function transformDatabaseProfile(data: any): UserProfile {
  return {
    id: data.id || '',
    email: data.email || '',
    full_name: data.full_name || null,
    avatar_url: data.avatar_url || null,
    role: (data.role as 'professional' | 'business' | 'admin') || 'professional',
    bio: data.bio || null,
    phone: data.phone || null,
    city: data.city || null,
    state: data.state || null,
    country: data.country || 'Canada',
    skills: data.skills || [],
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    online_status: data.online_status || false,
    last_seen: data.last_seen || new Date().toISOString(),
    certifications: data.certifications || [],
    education: data.education || [],
    experiences: data.experiences || [],
    friends: data.friends || [],
    company_name: data.company_name || undefined,
    company_size: data.company_size || undefined,
    industry: data.industry || undefined,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    account_locked: data.account_locked || false,
    auto_update_enabled: data.auto_update_enabled || true,
    availability_date: data.availability_date || undefined,
    career_objectives: data.career_objectives || undefined,
    certificates: data.certificates || [],
    chess_elo: data.chess_elo || 1200,
    custom_font: data.custom_font || null,
    custom_background: data.custom_background || null,
    custom_text_color: data.custom_text_color || null,
    sections_order: data.sections_order || [],
    style_id: data.style_id || undefined,
    tools_order: data.tools_order || [],
    push_notifications_enabled: data.push_notifications_enabled || true,
    push_token: data.push_token || undefined,
    location_enabled: data.location_enabled || false,
    search_enabled: data.search_enabled || true,
    privacy_enabled: data.privacy_enabled || false,
    website: data.website || undefined
  };
}

export function createEmptyProfile(id: string, email: string): UserProfile {
  return {
    id,
    email,
    full_name: null,
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
    friends: []
  };
}

export function transformExperience(data: any): Experience {
  return {
    id: data.id || crypto.randomUUID(),
    profile_id: data.profile_id || '',
    position: data.position || '',
    company: data.company || '',
    start_date: data.start_date ? new Date(data.start_date).toISOString() : undefined,
    end_date: data.end_date ? new Date(data.end_date).toISOString() : undefined,
    description: data.description || undefined,
    created_at: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString(),
    updated_at: data.updated_at ? new Date(data.updated_at).toISOString() : new Date().toISOString()
  };
}

export function transformEducation(data: any): Education {
  return {
    id: data.id || crypto.randomUUID(),
    profile_id: data.profile_id || undefined,
    school_name: data.school_name || '',
    degree: data.degree || '',
    field_of_study: data.field_of_study || undefined,
    start_date: data.start_date ? new Date(data.start_date).toISOString() : undefined,
    end_date: data.end_date ? new Date(data.end_date).toISOString() : undefined,
    description: data.description || undefined,
    created_at: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString(),
    updated_at: data.updated_at ? new Date(data.updated_at).toISOString() : new Date().toISOString()
  };
}

export function transformCertification(data: any): Certification {
  return {
    id: data.id || crypto.randomUUID(),
    profile_id: data.profile_id || '',
    title: data.title || '',
    institution: data.institution || '',
    year: data.year || new Date().getFullYear().toString(),
    issuer: data.issuer || '',
    credential_url: data.credential_url || undefined,
    issue_date: data.issue_date || undefined,
    expiry_date: data.expiry_date || undefined,
    description: data.description || undefined,
    created_at: data.created_at ? new Date(data.created_at).toISOString() : new Date().toISOString(),
    updated_at: data.updated_at ? new Date(data.updated_at).toISOString() : new Date().toISOString()
  };
}
