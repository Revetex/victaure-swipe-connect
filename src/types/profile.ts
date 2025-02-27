
// Type for the roles users can have
export type UserRole = 'user' | 'admin' | 'business' | 'freelancer' | 'student' | 'professional';
export type OnlineStatus = 'online' | 'offline' | 'away' | 'busy';
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

// Links to social media profiles
export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
  website?: string;
  [key: string]: string | undefined;
}

// Professional experience
export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string;
  location?: string;
  skills?: string[];
  logo_url?: string;
  current?: boolean;
  profile_id?: string; // Added for database compatibility
}

// Educational background
export interface Education {
  id: string;
  school_name: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string | null;
  description?: string;
  logo_url?: string;
  current?: boolean;
  institution?: string; // For backward compatibility
  profile_id?: string; // Added for database compatibility
}

// Professional certifications
export interface Certification {
  id: string;
  title?: string;
  name?: string; // Alternative field name
  issuer: string;
  issue_date?: string;
  expiry_date?: string | null;
  credential_url?: string;
  credential_id?: string;
  logo_url?: string;
  description?: string; // Added for compatibility
  year?: string; // Added for compatibility
  profile_id?: string; // Added for database compatibility
}

// Blocked user
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

// Connection between users
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

// User profile information
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  role: UserRole;
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  skills: string[];
  social_links?: SocialLinks;
  online_status: OnlineStatus | string | boolean;
  last_seen: string | null;
  cover_image?: string;
  job_title?: string;
  created_at: string;
  updated_at?: string;
  latitude?: number;
  longitude?: number;
  website?: string | null;
  privacy_enabled?: boolean;
  verified?: boolean;
  company_name?: string | null;
  sections_order?: string[];
  certifications?: Certification[];
  education?: Education[];
  experiences?: Experience[];
  friends?: UserProfile[];
}

// Simplified user profile for UI components
export interface UserProfile extends Profile {
  // Extra fields or overrides specific to UserProfile
}

// Full user data including connections
export interface User extends Omit<Profile, 'updated_at'> {
  connections?: UserConnection[];
  friends: User[];
}

// Simplified friend interface
export interface Friend {
  id: string;
  full_name: string | null;
  avatar_url?: string | null;
  online_status?: OnlineStatus | string | boolean;
  last_seen?: string | null;
  role?: UserRole;
  bio?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  job_title?: string;
  friendship_id?: string;
  status?: string;
  skills?: string[]; // Added for compatibility
  created_at?: string; // Added for compatibility with UserProfile
  email?: string; // Added for compatibility with UserProfile
}

// Interface for pending connection requests
export interface PendingRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: ConnectionStatus | string;
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

// Utility functions
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
  created_at: new Date().toISOString(), // Add created_at for compatibility
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
  created_at: data.created_at || new Date().toISOString(),
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
  year: data.year,
  profile_id: data.profile_id,
  credential_id: data.credential_id
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
