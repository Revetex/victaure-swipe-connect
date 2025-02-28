
export type UserRole = 'professional' | 'business' | 'admin' | 'freelancer' | 'student';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string | null;
  role?: UserRole;
  bio?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  skills?: string[];
  certifications?: Certification[];
  education?: Education[];
  experiences?: Experience[];
  preferences?: {
    notifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
    language?: string;
  };
  online_status?: boolean;
  last_seen?: string | null;
  privacy_enabled?: boolean;
  website?: string | null;
  company_name?: string | null;
  created_at?: string;
  friends?: Friend[];
  sections_order?: string[];
  latitude?: number;
  longitude?: number;
  job_title?: string;
}

export interface Certification {
  id: string;
  profile_id: string;
  title: string;
  issuer: string;
  issue_date?: string | Date | null;
  expiry_date?: string | Date | null;
  credential_url?: string | null;
  description?: string | null;
  skills?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id: string;
  profile_id?: string;
  school_name: string;
  degree: string;
  field_of_study?: string | null;
  start_date?: string | Date | null;
  end_date?: string | Date | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: string;
  profile_id: string;
  company: string;
  position: string;
  start_date?: string | Date | null;
  end_date?: string | Date | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Friend extends UserProfile {
  friendship_id?: string;
  status?: string;
  connection_strength?: number;
  last_interaction_at?: string;
}

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

export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
  blocked_user?: UserProfile;
}

export interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role?: UserRole;
}

/**
 * Converts a string or boolean online status to boolean
 */
export function convertOnlineStatusToBoolean(status: any): boolean {
  if (typeof status === 'boolean') return status;
  if (typeof status === 'string') {
    return status === 'online' || status === 'true';
  }
  return !!status;
}

/**
 * Creates an empty profile with default values
 */
export function createEmptyProfile(id: string, email?: string): UserProfile {
  return {
    id,
    full_name: '',
    avatar_url: null,
    email: email || null,
    role: 'professional',
    bio: null,
    phone: null,
    city: null,
    state: null,
    country: null,
    skills: [],
    certifications: [],
    education: [],
    experiences: [],
    online_status: false,
    last_seen: null,
    privacy_enabled: false,
    website: null,
    company_name: null,
    friends: []
  };
}

/**
 * Transforms a connection record to a Friend object
 */
export function transformConnection(connection: any, userId: string): Friend {
  const isUserSender = connection.sender_id === userId;
  const friendId = isUserSender ? connection.receiver_id : connection.sender_id;
  const friendName = isUserSender ? connection.receiver_name : connection.sender_name;
  const friendAvatar = isUserSender ? connection.receiver_avatar : connection.sender_avatar;

  return {
    id: friendId,
    full_name: friendName,
    avatar_url: friendAvatar,
    online_status: false,
    friendship_id: connection.id,
    status: connection.status
  } as Friend;
}

/**
 * Utility function to convert a Friend to UserProfile
 */
export function friendToUserProfile(friend: Friend): UserProfile {
  return {
    id: friend.id,
    full_name: friend.full_name,
    avatar_url: friend.avatar_url,
    email: friend.email,
    role: friend.role,
    bio: friend.bio,
    phone: friend.phone,
    city: friend.city,
    state: friend.state,
    country: friend.country,
    skills: friend.skills,
    online_status: friend.online_status,
    last_seen: friend.last_seen
  };
}
