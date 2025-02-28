
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
  full_name: string;
  avatar_url: string | null;
  email: string;
  role: UserRole;
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  skills: string[];
  experiences?: Experience[];
  education?: Education[];
  certifications?: Certification[];
  social_links?: SocialLinks;
  online_status: OnlineStatus | string | boolean;
  last_seen: string | null;
  cover_image?: string;
  job_title?: string;
  created_at: string;
  updated_at?: string;
  latitude?: number;
  longitude?: number;
}

// Full user data including connections
export interface User extends Omit<Profile, 'experiences' | 'education' | 'certifications' | 'social_links' | 'updated_at'> {
  connections?: UserConnection[];
  friends: User[];
}

// Simplified receiver interface for messaging
export interface Receiver {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email?: string;
  online_status?: OnlineStatus | string | boolean;
  last_seen?: string | null;
  latitude?: number;
  longitude?: number;
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
