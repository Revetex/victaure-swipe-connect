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
}