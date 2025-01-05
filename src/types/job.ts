export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  employer_id: string;
  status: 'open' | 'closed' | 'in-progress';
  category: string;
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
  // Virtual fields for display
  company?: string;
  salary?: string;
  skills?: string[];
  is_scraped?: boolean;
}

export * from './jobCategories';