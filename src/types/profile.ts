
export type UserRole = 'professional' | 'business' | 'admin';
export type OnlineStatus = boolean;

// Base profile interface with common properties
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
  skills?: string[];
  online_status: boolean;
  last_seen?: string | null;
  created_at: string;
}

// Main UserProfile interface
export interface UserProfile extends BaseProfile {
  friends?: Friend[];
  certifications?: any[];
  education?: any[];
  experiences?: any[];
  company_name?: string | null;
  privacy_enabled?: boolean;
  verified?: boolean;
  sections_order?: string[];
  social_links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    [key: string]: string | undefined;
  };
}

// User interface with required friends
export interface User extends BaseProfile {
  friends: Friend[];
}

// Friend interface
export interface Friend extends BaseProfile {
  friendship_id?: string;
  status?: string;
}

// Helper function to convert online status to boolean
export function convertOnlineStatusToBoolean(status: any): boolean {
  if (typeof status === 'boolean') {
    return status;
  }
  if (typeof status === 'string') {
    return status === 'online' || status === 'true';
  }
  return false;
}

// Helper function to create an empty profile
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

// Helper function to transform database connection to Friend object
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
