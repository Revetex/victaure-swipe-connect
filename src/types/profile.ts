
export type UserRole = 'professional' | 'business' | 'admin' | 'freelancer' | 'student';
export type OnlineStatus = boolean;

// Interface de base pour les profils
interface BaseProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  website?: string | null;
  skills?: string[];
  online_status: boolean;
  last_seen?: string | null;
  created_at: string;
  updated_at?: string;
  certifications?: Certification[];
  education?: Education[];
  experiences?: Experience[];
  friends?: Friend[];
}

// Interface pour l'éducation
export interface Education {
  id: string;
  school_name: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string | null;
  description?: string;
  logo_url?: string;
  profile_id?: string;
}

// Interface pour l'expérience
export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string | null;
  description?: string;
  skills?: string[];
  logo_url?: string;
  profile_id?: string;
}

// Interface pour la certification
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string | null;
  credential_url?: string;
  credential_id?: string;
  logo_url?: string;
  description?: string;
  year?: string;
  profile_id?: string;
}

// Interface UserProfile
export interface UserProfile extends BaseProfile {
  company_name?: string | null;
  privacy_enabled?: boolean;
  verified?: boolean;
  sections_order?: string[];
  latitude?: number;
  longitude?: number;
  cover_image?: string;
}

// Interface User - Doit inclure tous les champs de UserProfile
export interface User extends UserProfile {
  friends: Friend[]; // La seule différence est que friends est requis ici
}

// Interface Friend
export interface Friend extends BaseProfile {
  friendship_id?: string;
  status?: string;
}

// Interface pour une connexion utilisateur
export interface UserConnection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: string;
  connection_type: string;
  visibility: string;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
  connected_user?: UserProfile;
}

// Interface pour une demande d'ami en attente
export interface PendingRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
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
  type: 'incoming' | 'outgoing';
}

// Interface pour un utilisateur bloqué
export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
  blocked_user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

// Helper function pour convertir le statut en ligne en booléen
export function convertOnlineStatusToBoolean(status: any): boolean {
  if (typeof status === 'boolean') return status;
  if (typeof status === 'string') return status === 'online' || status === 'true';
  return false;
}

// Helper function pour créer un profil vide
export function createEmptyProfile(id: string, email: string): UserProfile {
  return {
    id,
    email,
    full_name: null,
    avatar_url: null,
    role: 'professional',
    online_status: false,
    created_at: new Date().toISOString(),
    certifications: [],
    education: [],
    experiences: [],
    friends: []
  };
}

// Helper function pour transformer une connexion
export function transformConnection(connection: any, currentUserId: string): Friend {
  const isSender = connection.sender_id === currentUserId;
  
  return {
    id: isSender ? connection.receiver_id : connection.sender_id,
    email: null,
    full_name: isSender ? connection.receiver_name : connection.sender_name,
    avatar_url: isSender ? connection.receiver_avatar : connection.sender_avatar,
    role: 'professional',
    online_status: convertOnlineStatusToBoolean(
      isSender ? connection.receiver_online_status : connection.sender_online_status
    ),
    last_seen: isSender ? connection.receiver_last_seen : connection.sender_last_seen,
    created_at: connection.created_at,
    friendship_id: connection.id,
    status: connection.status
  };
}

// Helper function pour convertir un ami en profil utilisateur
export function friendToUserProfile(friend: Friend): UserProfile {
  return {
    ...friend,
    friends: [], // Optionnel pour UserProfile
    certifications: [],
    education: [],
    experiences: []
  };
}
