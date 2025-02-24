
export interface UserProfile {
  id: string;
  full_name?: string;
  role?: string;
  bio?: string;
  skills?: string[];
  city?: string;
  country?: string;
  experiences?: {
    position: string;
    company: string;
    start_date: string;
    end_date?: string;
    description: string;
  }[];
  education?: {
    school_name: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date?: string;
  }[];
  certifications?: {
    title: string;
    institution: string;
    year: string;
  }[];
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface SafeContext {
  hasProfile: boolean;
  userRole?: string;
  hasExperience: boolean;
  hasEducation: boolean;
  hasCertifications: boolean;
  hasSkills: boolean;
  country?: string;
}
