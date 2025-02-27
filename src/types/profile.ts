
// Définition des types pour les profils utilisateurs et structures associées

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email: string | null;
  role: "professional" | "business" | "admin";
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  skills: string[];
  online_status: boolean;
  last_seen: string | null;
  created_at?: string;
  updated_at?: string;
  
  // Propriétés additionnelles
  website?: string | null;
  company_name?: string | null;
  privacy_enabled?: boolean;
  verified?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  experiences?: Experience[];
  education?: Education[];
  certifications?: Certification[];
  friends?: Friend[];
  sections_order?: string[];
}

export interface Experience {
  id: string;
  profile_id: string;
  company: string;
  position: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id: string;
  profile_id: string;
  school_name: string;
  degree: string;
  field_of_study?: string | null;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Certification {
  id: string;
  profile_id: string;
  title: string;
  issuer: string;
  credential_url?: string | null;
  description?: string | null;
  year?: string;
  issue_date?: string | null;
  expiry_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Friend {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  online_status?: boolean;
  last_seen?: string | null;
}

export interface PendingRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  type: "incoming" | "outgoing";
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

export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
  blocked_user?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

// Fonction utilitaire pour créer un profil utilisateur vide
export const createEmptyProfile = (userId: string, email: string | null = null): UserProfile => {
  return {
    id: userId,
    full_name: '',
    avatar_url: null,
    email: email,
    role: 'professional',
    bio: null,
    phone: null,
    city: null,
    state: null,
    country: 'Canada',
    skills: [],
    online_status: false,
    last_seen: null,
    experiences: [],
    education: [],
    certifications: [],
    friends: [],
    privacy_enabled: false,
    website: null,
    company_name: null,
    verified: false,
    sections_order: ['header', 'bio', 'contact', 'skills', 'education', 'experience']
  };
};

// Fonctions de transformation pour la conversion des données de la base de données
export const transformDatabaseProfile = (profile: any): UserProfile => {
  return {
    ...createEmptyProfile(profile.id, profile.email),
    ...profile,
    role: profile.role || 'professional'
  };
};

export const transformEducation = (education: any): Education => {
  return {
    id: education.id,
    profile_id: education.profile_id,
    school_name: education.school_name || '',
    degree: education.degree || '',
    field_of_study: education.field_of_study,
    description: education.description,
    start_date: education.start_date,
    end_date: education.end_date,
    created_at: education.created_at,
    updated_at: education.updated_at
  };
};

export const transformCertification = (certification: any): Certification => {
  return {
    id: certification.id,
    profile_id: certification.profile_id,
    title: certification.title || '',
    issuer: certification.issuer || '',
    credential_url: certification.credential_url,
    description: certification.description,
    year: certification.year,
    issue_date: certification.issue_date,
    expiry_date: certification.expiry_date,
    created_at: certification.created_at,
    updated_at: certification.updated_at
  };
};

export const transformExperience = (experience: any): Experience => {
  return {
    id: experience.id,
    profile_id: experience.profile_id,
    company: experience.company || '',
    position: experience.position || '',
    description: experience.description,
    start_date: experience.start_date,
    end_date: experience.end_date,
    created_at: experience.created_at,
    updated_at: experience.updated_at
  };
};
