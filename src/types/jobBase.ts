export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  budget: number;
  created_at: string;
  contract_type: string;
  source?: string;
  url?: string;
  employer_id: string;
  status: string;
  experience_level: string;
  salary?: string;
  skills?: string[];
  required_skills?: string[];
}