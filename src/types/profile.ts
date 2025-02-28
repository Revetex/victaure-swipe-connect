
export type UserRole = 'professional' | 'business' | 'admin';

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
  certifications?: any[];
  education?: any[];
  experiences?: any[];
  preferences?: {
    notifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
    language?: string;
  };
  online_status?: boolean;
  last_seen?: string | null;
}
