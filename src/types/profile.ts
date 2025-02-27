
import { Certification, Education, Experience } from "./profile";

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
}

export interface Education {
  id: string;
  school_name: string;
  degree: string;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
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
