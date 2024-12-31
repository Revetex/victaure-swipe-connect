export interface Certification {
  id: string;
  profile_id: string;
  title: string;
  institution: string;
  year: string;
  created_at?: string | null;
  updated_at?: string | null;
  credential_url?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  issuer: string;
  description?: string | null;
}

export interface Education {
  id: string;
  school_name: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date?: string | null;
  description?: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string;
  skills: string[] | null;
  latitude: number | null;
  longitude: number | null;
  certifications?: Certification[];
  education?: Education[];
  experiences?: Experience[];
  website?: string | null;
  company_name?: string | null;
  company_size?: string | null;
  industry?: string | null;
}