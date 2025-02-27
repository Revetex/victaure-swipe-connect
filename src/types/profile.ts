
// Supprimons la ligne d'import qui crée un conflit
// import { Certification, Education, Experience } from "./profile";

export type UserRole = "professional" | "business" | "admin";

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string | null;
  role: UserRole;
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  skills: string[];
  online_status: boolean;
  last_seen: string | null;
  latitude?: number | null;
  longitude?: number | null;
  website?: string | null;
  privacy_enabled?: boolean;
  verified?: boolean;
  certifications?: Certification[];
  education?: Education[];
  experiences?: Experience[];
  friends?: UserProfile[];
  company_name?: string | null;
  created_at?: string;
  sections_order?: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string | null;
  expiry_date?: string | null;
  credential_url?: string | null;
  description?: string | null;
  skills?: string[];
  year?: string | null;
  profile_id?: string;
}

export interface Education {
  id: string;
  school_name: string;
  degree: string;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  profile_id?: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  profile_id?: string;
}

export interface BlockedUser {
  id: string;
  blocked_user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface PendingRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
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
  type: "incoming" | "outgoing";
}

// Ajoutons les fonctions utilitaires dans le même fichier
export const createEmptyProfile = (id: string, email: string | null): UserProfile => ({
  id,
  full_name: null,
  avatar_url: null,
  email,
  role: 'professional',
  bio: null,
  phone: null,
  city: null,
  state: null,
  country: null,
  skills: [],
  online_status: false,
  last_seen: null,
  certifications: [],
  education: [],
  experiences: [],
  friends: []
});

export const transformDatabaseProfile = (data: any): UserProfile => ({
  id: data.id,
  full_name: data.full_name,
  avatar_url: data.avatar_url,
  email: data.email,
  role: data.role || 'professional',
  bio: data.bio,
  phone: data.phone,
  city: data.city,
  state: data.state,
  country: data.country,
  skills: data.skills || [],
  online_status: data.online_status || false,
  last_seen: data.last_seen,
  company_name: data.company_name,
  created_at: data.created_at,
  sections_order: data.sections_order
});

export const transformEducation = (data: any): Education => ({
  id: data.id,
  school_name: data.school_name,
  degree: data.degree,
  field_of_study: data.field_of_study,
  start_date: data.start_date,
  end_date: data.end_date,
  description: data.description,
  profile_id: data.profile_id
});

export const transformCertification = (data: any): Certification => ({
  id: data.id,
  title: data.title,
  issuer: data.issuer,
  issue_date: data.issue_date,
  expiry_date: data.expiry_date,
  credential_url: data.credential_url,
  description: data.description,
  skills: data.skills,
  year: data.year,
  profile_id: data.profile_id
});

export const transformExperience = (data: any): Experience => ({
  id: data.id,
  position: data.position,
  company: data.company,
  start_date: data.start_date,
  end_date: data.end_date,
  description: data.description,
  profile_id: data.profile_id
});

// Type pour les amis
export interface Friend extends UserProfile {
  status?: string;
  friendship_id?: string;
}
