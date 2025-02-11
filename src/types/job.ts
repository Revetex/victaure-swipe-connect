
import { ValidCategory } from './jobCategories';

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  employer_id: string;
  status: 'open' | 'closed' | 'in-progress';
  category: ValidCategory;
  contract_type: string;
  experience_level: string;
  subcategory?: string;
  duration?: string;
  images?: string[];
  required_skills?: string[];
  preferred_skills?: string[];
  latitude?: number;
  longitude?: number;
  remote_type?: string;
  application_deadline?: string;
  created_at?: string;
  updated_at?: string;
  company_name?: string;
  company_website?: string;
  company_description?: string;
  education_level?: string;
  years_of_experience?: number;
  company?: string;
  salary?: string;
  skills?: string[];
  source?: "internal" | "external";
  url?: string;
  employer?: {
    full_name?: string;
    company_name?: string;
    avatar_url?: string;
  };
  // New fields based on the database schema
  company_size?: string;
  company_culture?: string[];
  perks?: string[];
  workplace_type?: string;
  interview_process?: any[];
  application_steps?: any[];
  salary_benefits?: Record<string, any>;
  languages?: string[];
  qualifications?: string[];
  responsibilities?: string[];
  tools_and_technologies?: string[];
  certifications_required?: string[];
  payment_schedule?: string;
  is_urgent?: boolean;
  department?: string;
  industry?: string;
  benefits?: string[];
  work_schedule?: string[];
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_period?: string;
}

export * from './jobCategories';

