
// Type pour les rôles utilisateur
export type UserRole = 'user' | 'admin' | 'business' | 'freelancer' | 'student';
export type OnlineStatus = 'online' | 'offline' | 'away' | 'busy';
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

// Liens sociaux
export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
  website?: string;
  [key: string]: string | undefined;
}

// Type pour les expériences professionnelles
export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
  location: string;
  skills: string[];
  logo_url?: string;
}

// Type pour les formations
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
  logo_url?: string;
}

// Type pour les certifications
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id?: string;
  credential_url?: string;
  logo_url?: string;
}

// Type pour une connexion/relation entre utilisateurs
export interface UserConnection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
  user?: Profile;
  connected_user?: Profile;
}

// Type pour un profil utilisateur complet
export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
  role: UserRole;
  bio: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  skills: string[];
  experiences?: Experience[];
  education?: Education[];
  certifications?: Certification[];
  social_links?: SocialLinks;
  online_status: OnlineStatus | string;
  last_seen: string;
  cover_image?: string;
  job_title?: string;
  created_at: string;
  updated_at?: string;
}

// Type pour un utilisateur (peut inclure des informations supplémentaires par rapport au profil)
export interface User extends Omit<Profile, 'experiences' | 'education' | 'certifications' | 'social_links' | 'updated_at'> {
  latitude: number;
  longitude: number;
  connections?: UserConnection[];
  friends: User[];
}

// Type pour un destinataire de message (interface simplifiée)
export interface Receiver {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
  online_status: OnlineStatus | string;
  last_seen: string;
  latitude: number;
  longitude: number;
}

// Type pour un ami (interface simplifiée)
export interface Friend {
  id: string;
  full_name: string;
  avatar_url: string;
  online_status: OnlineStatus | string;
  last_seen: string;
  role: UserRole;
  bio: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  job_title?: string;
}
